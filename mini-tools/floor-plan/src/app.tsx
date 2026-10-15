"use client";

import * as React from "react";
import { createRoot } from "react-dom/client";
import { Armchair, Check, ChevronDown, ChevronRight, ClipboardCheck, Hand, Home, Image as ImageIcon, Move, Plus, Redo2, RotateCw, Trash2, Undo2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardScrollArea } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { STANDARD_FURNITURE_CATALOG as catalog } from "@/lib/floor-plan/furniture-catalog";
import { addFurnitureInstance, changeFurnitureSpecification, deleteFurnitureInstance, moveFurnitureInstance, rotateFurnitureInstance } from "@/lib/floor-plan/furniture-operations";
import { floorPlanToPlacementScenario } from "@/lib/floor-plan/placement-scenario";
import { assessmentFromRuleResults, evaluatePlanRules } from "@/lib/floor-plan/rules";
import { getFloorPlanI18n } from "@/lib/floor-plan/i18n";
import { formatAssessmentFinding } from "@/lib/floor-plan/furniture-decision";
import { computeRoomPolygon, computePolygonArea, getVertexMap, getWallMap } from "@/lib/floor-plan/geometry";
import { isPointInPolygon } from "@/lib/floor-plan/rules/geometry";
import type { FloorPlan, FurnitureSpecification } from "@/lib/floor-plan/types";
import { FloorPlanThumbnail } from "@/components/floor-plan/floor-plan-thumbnail";
import type { SelectedEntity } from "@/components/floor-plan/types";
import { cn } from "@/lib/utils";
import { PlanCanvas } from "./canvas";
import { loadPlan, plans, readWorkspace, STORAGE_KEY } from "./storage";
import { createPlanImage, getBridge, savePlanImage } from "./export-image";

const i18n = getFloorPlanI18n("zh");
type Sheet = "plans" | "furniture" | "properties" | "checks" | "image" | null;
const statusLabels = { suitable: "摆放合适", "trade-off": "空间略紧", "must-adjust": "需要调整", unavailable: "无法评估" };
const statusTone = { suitable: "text-emerald-600", "trade-off": "text-amber-600", "must-adjust": "text-destructive", unavailable: "text-muted-foreground" };
const statusSurface = { suitable: "border-emerald-500/40 bg-emerald-500/10", "trade-off": "border-amber-500/40 bg-amber-500/10", "must-adjust": "border-destructive/40 bg-destructive/10", unavailable: "border-border bg-muted/50" };
const iconButton = "size-11";

function SheetDialog({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  const ref = React.useRef<HTMLDialogElement>(null);
  React.useEffect(() => { const dialog = ref.current!; dialog.showModal(); return () => dialog.close(); }, []);
  return <dialog ref={ref} className="sheet-dialog" aria-labelledby="sheet-title" onCancel={(e) => { e.preventDefault(); onClose(); }}
    onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
    <Card className="sheet-card gap-0 rounded-b-none p-0 md:rounded-b-2xl">
      <div className="mx-auto my-2 h-1 w-9 rounded-full bg-muted-foreground/30" aria-hidden="true" />
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-border px-4 pb-3">
        <h2 id="sheet-title" className="text-lg font-bold">{title}</h2>
        <Button variant="outline" className={iconButton} aria-label="关闭面板" onClick={onClose}><X /></Button>
      </div>
      <CardScrollArea className="p-4">{children}</CardScrollArea>
    </Card>
  </dialog>;
}

function SpecificationButtons({ specifications, value, onChange }: { specifications: FurnitureSpecification[]; value?: string; onChange: (id: string) => void }) {
  return <div className="flex flex-wrap gap-2">{specifications.map((spec) => <Button key={spec.id} className="min-h-11" variant={value === spec.id ? "default" : "outline"}
    aria-pressed={value === spec.id} onClick={() => onChange(spec.id)}>{spec.width} × {spec.depth} mm</Button>)}</div>;
}

function App() {
  const [initial] = React.useState(readWorkspace);
  const drafts = React.useRef(initial.drafts);
  const [plan, setPlan] = React.useState(() => loadPlan(initial.activePlanId, initial.drafts));
  const [selected, setSelected] = React.useState<SelectedEntity | null>(() => {
    const id = initial.drafts[initial.activePlanId]?.targetPlacementId;
    return id ? { type: "furniture", id } : null;
  });
  const [roomId, setRoomId] = React.useState<string | null>(null);
  const [sheet, setSheet] = React.useState<Sheet>(null);
  const [query, setQuery] = React.useState("");
  const [category, setCategory] = React.useState("all");
  const [furnitureCategory, setFurnitureCategory] = React.useState("all");
  const [panMode, setPanMode] = React.useState(false);
  const [clearance, setClearance] = React.useState(true);
  const [saved, setSaved] = React.useState(true);
  const [toast, setToast] = React.useState("");
  const toastTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const undoStack = React.useRef<FloorPlan[]>([]), redoStack = React.useRef<FloorPlan[]>([]);
  const [history, setHistory] = React.useState({ undo: 0, redo: 0 });
  const refreshHistory = () => setHistory({ undo: undoStack.current.length, redo: redoStack.current.length });
  const svgRef = React.useRef<SVGSVGElement>(null);
  const [image, setImage] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);
  const active = plans.find((p) => p.id === plan.meta.id)!;
  const furniture = selected?.type === "furniture" ? plan.furniture.find((f) => f.id === selected.id) : undefined;
  const definition = furniture ? catalog.definitions.find((d) => d.id === furniture.definitionId) : undefined;
  const selectedRoom = plan.rooms.find((r) => r.id === roomId);
  const roomName = selectedRoom?.name ?? (selectedRoom ? i18n.getRoomTypeLabel(selectedRoom.type) : "点击房间选择摆放区域");
  const rules = React.useMemo(() => evaluatePlanRules(plan), [plan]);
  const assessment = React.useMemo(() => assessmentFromRuleResults(plan, rules, furniture?.id), [plan, rules, furniture?.id]);
  const focusedRules = furniture ? rules.filter((rule) => (rule.affectedFurnitureIds ?? rule.relatedEntityIds).includes(furniture.id)) : rules;
  const furnitureStatus = React.useMemo(() => Object.fromEntries(plan.furniture.map((item) => [item.id, assessmentFromRuleResults(plan, rules, item.id).status])), [plan, rules]);
  const hasFurniture = plan.furniture.length > 0;
  const statusText = hasFurniture ? statusLabels[assessment.status] : "待摆放";
  const statusClass = hasFurniture ? statusTone[assessment.status] : "text-muted-foreground";

  const notify = (message: string) => {
    setToast(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 3200);
  };
  React.useEffect(() => {
    const viewport = window.visualViewport;
    const resize = () => document.documentElement.style.setProperty("--viewport-height", `${viewport?.height ?? window.innerHeight}px`);
    resize(); viewport?.addEventListener("resize", resize); window.addEventListener("resize", resize);
    return () => { viewport?.removeEventListener("resize", resize); window.removeEventListener("resize", resize); };
  }, []);
  React.useEffect(() => {
    const timer = setTimeout(() => {
      const draft = floorPlanToPlacementScenario(plan, furniture?.id);
      drafts.current[active.id] = draft;
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ activePlanId: active.id, drafts: drafts.current })); setSaved(true); }
      catch { setSaved(false); }
    }, 180);
    return () => clearTimeout(timer);
  }, [plan, active.id, furniture?.id]);

  const commit = (next: FloorPlan) => {
    if (next === plan) return;
    undoStack.current = [...undoStack.current.slice(-29), plan]; redoStack.current = [];
    drafts.current[active.id] = floorPlanToPlacementScenario(next, furniture?.id);
    setPlan(next); refreshHistory();
  };
  const moveFurniture = (id: string, x: number, y: number) => {
    const result = moveFurnitureInstance(plan, id, x, y);
    if (result.success) commit(result.plan);
  };
  const rotate = () => {
    if (!furniture) return;
    const result = rotateFurnitureInstance(plan, furniture.id, 90);
    if (result.success) commit(result.plan);
  };
  const remove = () => {
    if (!furniture) return;
    const result = deleteFurnitureInstance(plan, furniture.id);
    if (result.success) { commit(result.plan); setSelected(null); setSheet(null); notify("已移除家具，可撤销恢复"); }
  };
  const select = (entity: SelectedEntity | null) => {
    setSelected(entity);
    if (entity?.type === "room") setRoomId(entity.id);
    if (entity?.type === "furniture") {
      const item = plan.furniture.find((f) => f.id === entity.id);
      const containing = item && plan.rooms.find((r) => isPointInPolygon(item, computeRoomPolygon(r, getWallMap(plan), getVertexMap(plan))));
      if (containing) setRoomId(containing.id);
    }
  };
  const undo = (redo = false) => {
    const source = redo ? redoStack : undoStack, destination = redo ? undoStack : redoStack;
    const previous = source.current.pop();
    if (previous) {
      destination.current.push(plan); setPlan(previous);
      if (selected?.type === "furniture" && !previous.furniture.some((f) => f.id === selected.id)) setSelected(null);
      refreshHistory();
    }
  };
  const switchPlan = (id: string) => {
    drafts.current[active.id] = floorPlanToPlacementScenario(plan, furniture?.id);
    setPlan(loadPlan(id, drafts.current)); setSelected(null); setRoomId(null); setSheet(null);
    undoStack.current = []; redoStack.current = []; refreshHistory();
  };
  const changeSpec = (specificationId: string) => {
    if (!furniture) return;
    const result = changeFurnitureSpecification(plan, catalog, furniture.id, specificationId);
    if (result.success) commit(result.plan);
  };
  const add = (definitionId: string, specificationId: string) => {
    if (plan.furniture.length >= 100) { notify("单个户型最多摆放 100 件家具"); return; }
    const target = roomId ?? plan.rooms.find((r) => ["living_room", "master_bedroom", "bedroom"].includes(r.type))?.id ?? plan.rooms[0].id;
    const result = addFurnitureInstance(plan, catalog, definitionId, { specificationId, roomId: target });
    if (result.success) {
      commit(result.plan); setSelected({ type: "furniture", id: result.instance.id }); setRoomId(target); setPanMode(false); setSheet(null);
      notify("家具已放入房间，拖动调整位置");
    }
  };
  const previewImage = async () => {
    setBusy(true); setImage(null); setSheet("image");
    try { setImage(await createPlanImage(svgRef.current!, plan, active.name)); }
    catch (error) { notify(error instanceof Error ? error.message : "图片生成失败，请重试"); }
    finally { setBusy(false); }
  };

  const title = { plans: "选择户型", furniture: "添加家具", properties: "家具与尺寸", checks: "空间检查", image: "保存布局图" };
  const selectedLabel = furniture ? i18n.getFurnitureName(furniture.definitionId) : selected?.type === "room" ? roomName : selected?.type === "wall" ? "墙体尺寸" : selected?.type === "opening" ? "门窗尺寸" : "从一个房间开始";
  const selectedWall = selected?.type === "wall" ? plan.walls.find((w) => w.id === selected.id) : undefined;
  const selectedOpening = selected?.type === "opening" ? plan.openings.find((o) => o.id === selected.id) : undefined;
  const wallStart = plan.vertices.find((v) => v.id === selectedWall?.from), wallEnd = plan.vertices.find((v) => v.id === selectedWall?.to);
  const detail = furniture ? `${furniture.width} × ${furniture.depth} mm · ${furniture.rotation}°` : selectedWall && wallStart && wallEnd
    ? `长 ${Math.round(Math.hypot(wallEnd.x - wallStart.x, wallEnd.y - wallStart.y))} mm · 厚 ${selectedWall.thickness} mm`
    : selectedOpening ? `宽 ${selectedOpening.width} mm${selectedOpening.height ? ` · 高 ${selectedOpening.height} mm` : ""}`
    : selectedRoom ? `${computePolygonArea(computeRoomPolygon(selectedRoom, getWallMap(plan), getVertexMap(plan))).formattedAreaM2} · 点击添加家具` : "选户型 → 点房间 → 摆家具";

  return <main className="app-shell mx-auto flex max-w-7xl flex-col gap-3">
    <header className="flex shrink-0 items-center gap-2">
      <img src="./assets/icon.png" alt="" width={32} height={32} className="size-8 shrink-0 rounded-lg" />
      <h1 className="min-w-0 truncate text-lg font-bold tracking-tight">买多大家具</h1>
    </header>
    <Button variant="outline" className="plan-picker h-auto min-h-12 w-full justify-between gap-2 px-3 py-2 text-left" onClick={() => { setQuery(""); setSheet("plans"); }} aria-label="选择户型">
      <Home className="size-5 text-primary" /><span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold">{active.name}</span><span className="block truncate text-[11px] text-muted-foreground">{active.tags.join(" / ")} · {active.roomCount} 个功能区 · 模型面积 {active.formattedArea}</span></span><ChevronDown />
    </Button>
    <div className="canvas-toolbar flex shrink-0 items-center justify-between gap-2">
      <div className="flex gap-2">
        <Button variant={panMode ? "outline" : "default"} className="h-11 px-3" aria-pressed={!panMode} onClick={() => setPanMode(false)}><Move />摆放</Button>
        <Button variant={panMode ? "default" : "outline"} className="h-11 px-3" aria-pressed={panMode} onClick={() => setPanMode(true)}><Hand />浏览</Button>
      </div>
      <div className="flex gap-2"><Button variant="outline" className={iconButton} aria-label="撤销" disabled={!history.undo} onClick={() => undo()}><Undo2 /></Button><Button variant="outline" className={iconButton} aria-label="重做" disabled={!history.redo} onClick={() => undo(true)}><Redo2 /></Button></div>
    </div>
    <PlanCanvas key={active.id} plan={plan} selected={selected} roomId={roomId} panMode={panMode} showClearance={clearance}
      furnitureStatus={furnitureStatus} onSelect={select} onMove={moveFurniture} svgRef={svgRef} />
    <Card className="selection-card min-h-[108px] shrink-0 gap-2 p-3">
      <div className="flex items-start justify-between gap-2"><div className="min-w-0"><p className="truncate text-sm font-bold">{selectedLabel}</p><p className="selection-details truncate text-[11px] text-muted-foreground">{detail}</p></div>
        <Button variant="ghost" className={cn("h-8 px-2 text-[11px] font-semibold shadow-none", statusClass)} onClick={() => setSheet("checks")}>{statusText}<ChevronRight /></Button>
      </div>
      <div className="flex items-center gap-2">
        {furniture ? <><Button variant="outline" className="h-11 flex-1" onClick={() => setSheet("properties")}>尺寸 / 微调</Button><Button variant="outline" className={iconButton} aria-label="旋转家具 90 度" onClick={rotate}><RotateCw /></Button><Button variant="destructive" className={iconButton} aria-label="移除家具" onClick={remove}><Trash2 /></Button></>
          : <><span className="min-w-0 flex-1 truncate text-xs text-muted-foreground">{saved ? "布局自动保存在本机" : "保存失败，当前布局仅留在内存"}</span><Button variant="outline" className="h-11" onClick={() => { setQuery(""); setSheet("furniture"); }}><Plus />添加家具</Button></>}
      </div>
    </Card>
    <nav aria-label="工具操作" className="grid shrink-0 grid-cols-3 gap-2">
      <Button className="h-12 min-w-0 px-2" onClick={() => { setQuery(""); setSheet("furniture"); }}><Armchair />家具</Button>
      <Button variant="outline" className="h-12 min-w-0 px-2" onClick={() => setSheet("checks")}><ClipboardCheck />检查{rules.length > 0 && <span className="text-[10px]">{rules.length}</span>}</Button>
      <Button variant="outline" className="h-12 min-w-0 px-2" onClick={previewImage} disabled={busy}><ImageIcon />出图</Button>
    </nav>
    {toast && <div role="status" className="pointer-events-none fixed inset-x-4 top-1/3 z-50 mx-auto max-w-sm rounded-xl border border-border bg-foreground px-4 py-3 text-center text-sm text-background shadow-sm">{toast}</div>}
    {sheet && <SheetDialog title={title[sheet]} onClose={() => setSheet(null)}>
      {sheet === "plans" && <div className="space-y-4">
        <div className="flex gap-2">{[["all", "全部"], ["1br", "一室"], ["2br", "二室"], ["3br", "三室"]].map(([key, label]) => <Button className="min-h-11 flex-1" key={key} variant={category === key ? "default" : "outline"} aria-pressed={category === key} onClick={() => setCategory(key)}>{label}</Button>)}</div>
        <p className="text-xs text-muted-foreground">{plans.length} 套户型 · 切换后保留各自的家具布局</p>
        {plans.filter((p) => category === "all" || p.categoryKey === category).map((p) => <Button key={p.id} variant="outline" className="h-auto min-h-20 w-full justify-between gap-3 whitespace-normal p-2 text-left" onClick={() => switchPlan(p.id)}>
          <span className="block h-16 w-24 shrink-0 overflow-hidden rounded-lg border border-border bg-muted" aria-hidden="true"><FloorPlanThumbnail plan={p.plan} className="size-full" /></span>
          <span className="min-w-0 flex-1"><span className="block font-semibold">{p.name}</span><span className="block text-xs text-muted-foreground">{p.roomBreakdown} · 模型 {p.formattedArea}</span></span>{active.id === p.id ? <Check className="shrink-0 text-primary" /> : <ChevronRight className="shrink-0" />}
        </Button>)}
        {!plans.some((p) => category === "all" || p.categoryKey === category) && <p className="py-6 text-center text-muted-foreground">这个分类下没有户型。</p>}
      </div>}
      {sheet === "furniture" && <div className="space-y-4">
        <label className="block text-xs text-muted-foreground">摆放房间<select className="mt-2 h-12 w-full rounded-xl border border-border bg-background px-3 text-base text-foreground" value={roomId ?? plan.rooms.find((r) => ["living_room", "master_bedroom", "bedroom"].includes(r.type))?.id ?? plan.rooms[0].id} onChange={(e) => setRoomId(e.target.value)}>{plan.rooms.map((r) => <option value={r.id} key={r.id}>{r.name ?? i18n.getRoomTypeLabel(r.type)}</option>)}</select></label>
        <Input className="h-12 rounded-xl border-border" aria-label="搜索家具" placeholder="搜索床、沙发、衣柜…" value={query} onChange={(e) => setQuery(e.target.value)} />
        <div className="flex flex-wrap gap-2">{[["all", "全部"], ["bed", "床"], ["sofa", "沙发"], ["table", "桌椅"], ["storage", "收纳"], ["desk", "书桌"]].map(([key, label]) => <Button className="min-h-11" key={key} variant={furnitureCategory === key ? "default" : "outline"} aria-pressed={furnitureCategory === key} onClick={() => setFurnitureCategory(key)}>{label}</Button>)}</div>
        {catalog.definitions.filter((d) => (furnitureCategory === "all" || d.category === furnitureCategory || (furnitureCategory === "table" && d.category === "chair")) && i18n.getFurnitureName(d.id, d.name).includes(query)).map((d) => <Card key={d.id} className="gap-3 p-3"><p className="flex items-center gap-2 font-semibold"><Armchair className="size-4 text-primary" />{i18n.getFurnitureName(d.id, d.name)}</p><SpecificationButtons specifications={d.specifications} onChange={(id) => add(d.id, id)} /></Card>)}
        {!catalog.definitions.some((d) => (furnitureCategory === "all" || d.category === furnitureCategory || (furnitureCategory === "table" && d.category === "chair")) && i18n.getFurnitureName(d.id, d.name).includes(query)) && <p className="py-6 text-center text-muted-foreground">没有匹配的家具，试试其他分类。</p>}
      </div>}
      {sheet === "properties" && furniture && definition && <div className="space-y-5">
        <div><h3 className="mb-2 font-bold">{i18n.getFurnitureName(definition.id)} · 规格</h3><SpecificationButtons specifications={definition.specifications} value={furniture.specificationId} onChange={changeSpec} /><p className="mt-2 text-xs text-muted-foreground">切换规格保留中心位置与朝向。</p></div>
        <Button variant="outline" className="h-12 w-full" aria-pressed={clearance} onClick={() => setClearance(!clearance)}>{clearance ? "隐藏" : "显示"}使用空间参考区</Button>
        <Button className="h-12 w-full" onClick={() => setSheet("checks")}><ClipboardCheck />查看这件家具的空间检查</Button>
      </div>}
      {sheet === "checks" && <div className="space-y-4">
        <Card className={cn("gap-2 p-4", hasFurniture ? statusSurface[assessment.status] : statusSurface.unavailable)}><p className={cn("text-lg font-bold", statusClass)}>{statusText}</p><p className="text-xs text-muted-foreground">{hasFurniture ? furniture ? `正在检查：${i18n.getFurnitureName(furniture.definitionId)}` : "正在检查：全部家具" : "尚未摆放家具，添加后开始空间检查。"}</p></Card>
        {hasFurniture && assessment.findings.map((finding, index) => {
          const formatted = formatAssessmentFinding(finding, plan, "zh");
          const tone = finding.kind === "below-recommended-clearance" ? "border-amber-500/40" : "border-destructive/40";
          return <div key={`${finding.kind}-${finding.placementId}-${index}`} className={cn("space-y-1 rounded-xl border bg-background p-3 text-sm", tone)}><p className="font-semibold">{formatted.title}</p><p>{formatted.message}</p><p className="text-xs text-muted-foreground">{formatted.repairGuidance}</p></div>;
        })}
        {hasFurniture && focusedRules.filter((rule) => !rule.assessmentFinding).map((rule, index) => <div key={`${rule.ruleId}-${index}`} className={cn("rounded-xl border bg-background p-3", rule.severity === "error" ? "border-destructive/40" : "border-amber-500/40")}><p className="mb-1 text-sm font-semibold">{i18n.getRuleTitle(rule.ruleId, rule.title)}</p><p className="text-xs text-muted-foreground">{i18n.getRuleMessage(rule)}</p></div>)}
        {hasFurniture && focusedRules.length === 0 && <p className="text-sm text-muted-foreground">没有发现碰撞、净距不足或挡住门，可以继续尝试其他规格。</p>}
        <p className="text-xs text-muted-foreground">户型为简化模型，建筑面积与模型面积可能不同。布局仅供参考，购买前请核对实测尺寸。</p>
      </div>}
      {sheet === "image" && <div className="space-y-4">
        {busy && !image && <p role="status" className="py-8 text-center text-muted-foreground">正在生成布局图…</p>}
        {/* Offline data URI preview has no Next.js image server. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {image && <img src={image} alt="当前户型的家具布局图" className="max-h-[45dvh] w-full rounded-xl border border-border object-contain" />}
        {!busy && !image && <Button className="h-12 w-full" onClick={previewImage}>重新生成布局图</Button>}
        {image && <Button className="h-12 w-full" disabled={busy || !getBridge()?.saveImageToPhotosAlbum} onClick={async () => {
          setBusy(true);
          try { await savePlanImage(image); notify("布局图已保存到相册"); }
          catch (error) { notify(error instanceof Error ? error.message : "保存失败，请检查相册权限后重试"); }
          finally { setBusy(false); }
        }}>{busy ? "正在保存…" : "保存到相册"}</Button>}
        <p className="text-xs text-muted-foreground">{getBridge()?.saveImageToPhotosAlbum ? "保存时可能需要授权相册权限。" : "当前为浏览器预览。上传到小红书小工具后可保存到相册。"}</p>
      </div>}
    </SheetDialog>}
  </main>;
}

createRoot(document.getElementById("root")!).render(<App />);
