"use client";

import * as React from "react";
import { createRoot } from "react-dom/client";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Armchair, Check, ChevronDown, ChevronRight, CircleHelp, ClipboardCheck, Hand, Home, Image as ImageIcon, Moon, Move, Plus, Redo2, RotateCw, Sun, Trash2, Undo2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardScrollArea } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { STANDARD_FURNITURE_CATALOG as catalog } from "@/lib/floor-plan/furniture-catalog";
import { addFurnitureInstance, changeFurnitureSpecification, deleteFurnitureInstance, moveFurnitureInstance, rotateFurnitureInstance } from "@/lib/floor-plan/furniture-operations";
import { floorPlanToPlacementScenario } from "@/lib/floor-plan/placement-scenario";
import { assessPlacementScenario } from "@/lib/floor-plan/space-assessment";
import { evaluatePlanRules } from "@/lib/floor-plan/rules";
import { getFloorPlanI18n } from "@/lib/floor-plan/i18n";
import { formatAssessmentFinding } from "@/lib/floor-plan/furniture-decision";
import { computeRoomPolygon, computePolygonArea, getVertexMap, getWallMap } from "@/lib/floor-plan/geometry";
import { isPointInPolygon } from "@/lib/floor-plan/rules/geometry";
import type { FloorPlan, FurnitureSpecification } from "@/lib/floor-plan/types";
import type { SelectedEntity } from "@/components/floor-plan/types";
import { cn } from "@/lib/utils";
import { PlanCanvas } from "./canvas";
import { loadPlan, plans, readWorkspace, STORAGE_KEY } from "./storage";
import { createPlanImage, getBridge, savePlanImage } from "./export-image";

const i18n = getFloorPlanI18n("zh");
type Sheet = "plans" | "furniture" | "properties" | "checks" | "image" | "help" | "reset" | null;
const statusLabels = { suitable: "摆放合适", "trade-off": "空间略紧", "must-adjust": "需要调整", unavailable: "无法评估" };
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
  const [dark, setDark] = React.useState(() => window.matchMedia("(prefers-color-scheme: dark)").matches);
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
  const scenario = React.useMemo(() => floorPlanToPlacementScenario(plan, furniture?.id), [plan, furniture?.id]);
  const assessment = React.useMemo(() => assessPlacementScenario(plan, scenario, catalog,
    furniture ? { targetPlacementId: furniture.id } : { includeAllPlacements: true }), [plan, scenario, furniture]);
  const rules = React.useMemo(() => evaluatePlanRules(plan), [plan]);
  const problemIds = React.useMemo(() => new Set(rules.flatMap((r) => r.relatedEntityIds)), [rules]);
  const focusedRules = furniture ? rules.filter((r) => r.relatedEntityIds.includes(furniture.id)) : rules;

  const notify = (message: string) => {
    setToast(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 3200);
  };
  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);
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

  const title = { plans: "选择户型", furniture: "添加家具", properties: "家具与尺寸", checks: "空间检查", image: "保存布局图", help: "操作指南", reset: "重置当前布局" };
  const selectedLabel = furniture ? i18n.getFurnitureName(furniture.definitionId) : selected?.type === "room" ? roomName : selected?.type === "wall" ? "墙体尺寸" : selected?.type === "opening" ? "门窗尺寸" : "从一个房间开始";
  const selectedWall = selected?.type === "wall" ? plan.walls.find((w) => w.id === selected.id) : undefined;
  const selectedOpening = selected?.type === "opening" ? plan.openings.find((o) => o.id === selected.id) : undefined;
  const wallStart = plan.vertices.find((v) => v.id === selectedWall?.from), wallEnd = plan.vertices.find((v) => v.id === selectedWall?.to);
  const detail = furniture ? `${furniture.width} × ${furniture.depth} mm · ${furniture.rotation}°` : selectedWall && wallStart && wallEnd
    ? `长 ${Math.round(Math.hypot(wallEnd.x - wallStart.x, wallEnd.y - wallStart.y))} mm · 厚 ${selectedWall.thickness} mm`
    : selectedOpening ? `宽 ${selectedOpening.width} mm${selectedOpening.height ? ` · 高 ${selectedOpening.height} mm` : ""}`
    : selectedRoom ? `${computePolygonArea(computeRoomPolygon(selectedRoom, getWallMap(plan), getVertexMap(plan))).formattedAreaM2} · 点击添加家具` : "选户型 → 点房间 → 摆家具";

  return <main className="app-shell mx-auto flex max-w-7xl flex-col gap-3">
    <header className="flex shrink-0 items-center justify-between gap-2">
      <div className="min-w-0"><h1 className="text-lg font-bold tracking-tight">户型摆放实验室</h1><p className="intro-copy text-xs text-muted-foreground">先试着摆，再决定怎么买。</p></div>
      <div className="flex gap-2">
        <Button variant="outline" className={iconButton} aria-label={dark ? "切换浅色主题" : "切换深色主题"} onClick={() => setDark(!dark)}>{dark ? <Sun /> : <Moon />}</Button>
        <Button variant="outline" className={iconButton} aria-label="操作指南" onClick={() => setSheet("help")}><CircleHelp /></Button>
      </div>
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
      problemIds={problemIds} onSelect={select} onMove={moveFurniture} svgRef={svgRef} />
    <Card className="selection-card min-h-[108px] shrink-0 gap-2 p-3">
      <div className="flex items-start justify-between gap-2"><div className="min-w-0"><p className="truncate text-sm font-bold">{selectedLabel}</p><p className="selection-details truncate text-[11px] text-muted-foreground">{detail}</p></div>
        <Button variant="ghost" className="h-8 px-2 text-[11px] shadow-none" onClick={() => setSheet("checks")}>{statusLabels[assessment.status]}<ChevronRight /></Button>
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
        <Input className="h-12 rounded-xl border-border bg-background" placeholder="搜索城市、小区、面积" aria-label="搜索户型" value={query} onChange={(e) => setQuery(e.target.value)} />
        <div className="flex gap-2">{[["all", "全部"], ["1br", "一室"], ["2br", "二室"], ["3br", "三室"]].map(([key, label]) => <Button className="min-h-11 flex-1" key={key} variant={category === key ? "default" : "outline"} aria-pressed={category === key} onClick={() => setCategory(key)}>{label}</Button>)}</div>
        <p className="text-xs text-muted-foreground">{plans.length} 套户型 · 切换后保留各自的家具布局</p>
        {plans.filter((p) => (category === "all" || p.categoryKey === category) && `${p.name} ${p.description}`.toLowerCase().includes(query.toLowerCase())).map((p) => <Button key={p.id} variant="outline" className="h-auto min-h-16 w-full justify-between whitespace-normal p-3 text-left" onClick={() => switchPlan(p.id)}>
          <span className="min-w-0"><span className="block font-semibold">{p.name}</span><span className="block text-xs text-muted-foreground">{p.roomBreakdown} · 模型 {p.formattedArea}</span></span>{active.id === p.id ? <Check className="text-primary" /> : <ChevronRight />}
        </Button>)}
        {!plans.some((p) => (category === "all" || p.categoryKey === category) && `${p.name} ${p.description}`.toLowerCase().includes(query.toLowerCase())) && <p className="py-6 text-center text-muted-foreground">没有匹配的户型，试试其他关键词。</p>}
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
        <div className="flex items-center justify-between"><span className="text-sm">朝向 {furniture.rotation}°</span><Button className="h-11" variant="outline" onClick={rotate}><RotateCw />旋转 90°</Button></div>
        <div><h3 className="mb-3 font-bold">位置微调 <span className="text-xs font-normal text-muted-foreground">每次 100 mm</span></h3><div className="grid grid-cols-3 gap-2">
          <span /><Button className="h-12" variant="outline" aria-label="向上移动 100 mm" onClick={() => moveFurniture(furniture.id, furniture.x, furniture.y - 100)}><ArrowUp /></Button><span />
          <Button className="h-12" variant="outline" aria-label="向左移动 100 mm" onClick={() => moveFurniture(furniture.id, furniture.x - 100, furniture.y)}><ArrowLeft /></Button><Button className="h-12" variant="outline" aria-label="向下移动 100 mm" onClick={() => moveFurniture(furniture.id, furniture.x, furniture.y + 100)}><ArrowDown /></Button><Button className="h-12" variant="outline" aria-label="向右移动 100 mm" onClick={() => moveFurniture(furniture.id, furniture.x + 100, furniture.y)}><ArrowRight /></Button>
        </div><p className="mt-2 text-xs text-muted-foreground">中心位置 X {furniture.x} / Y {furniture.y} mm</p></div>
        <Button variant="outline" className="h-12 w-full" aria-pressed={clearance} onClick={() => setClearance(!clearance)}>{clearance ? "隐藏" : "显示"}使用空间参考区</Button>
        <Button className="h-12 w-full" onClick={() => setSheet("checks")}><ClipboardCheck />查看这件家具的空间检查</Button>
      </div>}
      {sheet === "checks" && <div className="space-y-4">
        <Card className="gap-2 p-4"><p className={cn("text-lg font-bold", assessment.status === "must-adjust" && "text-destructive")}>{statusLabels[assessment.status]}</p><p className="text-xs text-muted-foreground">{furniture ? `正在检查：${i18n.getFurnitureName(furniture.definitionId)}` : "正在检查：全部家具"} · 其他家具也会参与碰撞计算</p></Card>
        {assessment.findings.map((finding, index) => {
          const formatted = formatAssessmentFinding(finding, plan, "zh");
          return <div key={index} className="space-y-1 rounded-xl border border-border bg-background p-3 text-sm"><p className="font-semibold">{formatted.title}</p><p>{formatted.message}</p><p className="text-xs text-muted-foreground">{formatted.repairGuidance}</p></div>;
        })}
        {focusedRules.length > 0 && <h3 className="font-bold">门窗与通行提醒</h3>}
        {focusedRules.map((rule, index) => <div key={index} className="rounded-xl border border-border p-3"><p className="mb-1 text-sm font-semibold">{i18n.getRuleTitle(rule.ruleId, rule.title)}</p><p className="text-xs text-muted-foreground">{i18n.getRuleMessage(rule)}</p></div>)}
        {!assessment.findings.length && !focusedRules.length && <p className="text-sm text-muted-foreground">没有发现碰撞或空间不足，可以继续尝试其他规格。</p>}
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
      {sheet === "help" && <div className="space-y-4 text-sm">
        <p>1. 选择接近你家的户型，点击房间或在家具面板里指定房间。</p><p>2. 添加一件家具，单指拖动摆放。移动按 50 mm 吸附，底部“尺寸 / 微调”可精调。</p><p>3. 双指捏合缩放；“浏览”模式下单指移动画布。右下角按钮可回到完整户型。</p><p>4. 家具选中后可旋转、换规格、移除，并查看空间检查。紫色虚线是建议使用空间。</p><p>5. 每个户型分别自动保存，撤销 / 重做保留本次操作历史。容器清理后本地数据可能丢失，可出图保存。</p>
        <p className="text-xs text-muted-foreground">{saved ? "当前布局已保存在本机。" : "本机存储不可用，关闭后布局将丢失。"} 此工具完全离线运行。</p><Button variant="destructive" className="h-12 w-full" onClick={() => setSheet("reset")}>重置当前户型的家具</Button>
      </div>}
      {sheet === "reset" && <div className="space-y-4"><p className="text-sm">恢复“{active.name}”的初始家具布局。其他户型的布局会保留，本次重置可撤销。</p><div className="flex gap-3"><Button variant="outline" className="h-12 flex-1" onClick={() => setSheet(null)}>取消</Button><Button variant="destructive" className="h-12 flex-1" onClick={() => { commit(loadPlan(active.id, {})); setSelected(null); setRoomId(null); setSheet(null); notify("已恢复初始布局"); }}>确认重置</Button></div></div>}
    </SheetDialog>}
  </main>;
}

createRoot(document.getElementById("root")!).render(<App />);
