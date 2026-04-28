export type HomepageGraphTooltipProps = {
  open: boolean;
  x: number;
  y: number;
  title?: string;
  subtitle?: string;
  description?: string;
  avatarSrc?: string;
};

export function HomepageGraphTooltip({
  open,
  x,
  y,
  title = "Chase",
  subtitle = "Skills · Projects",
  description = "Hover 根节点展示头像，拖拽节点可调整布局。",
  avatarSrc = "/avatar.png",
}: HomepageGraphTooltipProps) {
  if (!open) return null;

  return (
    <div
      className="pointer-events-none absolute z-10 w-[220px] rounded-2xl border border-zinc-900/10 bg-white/80 p-3 text-xs text-zinc-700 shadow-[0_20px_80px_rgba(0,0,0,0.10)] backdrop-blur dark:border-white/10 dark:bg-black/60 dark:text-zinc-200"
      style={{ left: x, top: y }}
    >
      <div className="flex items-center gap-2">
        <div className="h-7 w-7 overflow-hidden rounded-full border border-zinc-900/10 dark:border-white/10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={avatarSrc} alt={title} className="h-full w-full object-cover" />
        </div>
        <div className="min-w-0">
          <div className="truncate text-sm font-medium leading-5">{title}</div>
          <div className="truncate text-[11px] text-zinc-500 dark:text-zinc-400">
            {subtitle}
          </div>
        </div>
      </div>
      <div className="mt-2 text-[11px] leading-5 text-zinc-600 dark:text-zinc-300">
        {description}
      </div>
    </div>
  );
}

