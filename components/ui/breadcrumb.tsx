import * as React from "react"
import { ChevronRight, MoreHorizontal } from "lucide-react"

import { cn } from "@/lib/utils"

type WithClassName = { className?: string }

function Slot<P extends WithClassName>({
  children,
  className,
  ...props
}: Omit<React.HTMLAttributes<HTMLElement>, "children"> & {
  children: React.ReactElement<P>
}) {
  if (!React.isValidElement(children)) return null

  const childProps = children.props
  return React.cloneElement(children, {
    ...(childProps as P),
    ...(props as unknown as Partial<P>),
    className: cn(className, childProps.className),
  })
}

function Breadcrumb({ className, ...props }: React.ComponentProps<"nav">) {
  return <nav aria-label="breadcrumb" className={cn(className)} {...props} />
}

function BreadcrumbList({ className, ...props }: React.ComponentProps<"ol">) {
  return (
    <ol
      className={cn("flex flex-wrap items-center gap-1.5 wrap-break-word", className)}
      {...props}
    />
  )
}

function BreadcrumbItem({ className, ...props }: React.ComponentProps<"li">) {
  return <li className={cn("inline-flex items-center", className)} {...props} />
}

type BreadcrumbLinkProps =
  | ({
      asChild: true
      children: React.ReactElement<WithClassName>
      className?: string
    } & React.HTMLAttributes<HTMLElement>)
  | ({
      asChild?: false
      className?: string
      children?: React.ReactNode
    } & React.ComponentProps<"a">)

function BreadcrumbLink({
  asChild,
  className,
  children,
  ...props
}: BreadcrumbLinkProps) {
  if (asChild) {
    return (
      <Slot
        className={cn("transition-colors hover:text-foreground", className)}
        {...(props as React.HTMLAttributes<HTMLElement>)}
      >
        {children}
      </Slot>
    )
  }

  return (
    <a
      className={cn("transition-colors hover:text-foreground", className)}
      {...(props as React.ComponentProps<"a">)}
    >
      {children}
    </a>
  )
}

function BreadcrumbPage({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      aria-current="page"
      className={cn("font-medium text-foreground", className)}
      {...props}
    />
  )
}

function BreadcrumbSeparator({ children, className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      role="presentation"
      aria-hidden="true"
      className={cn("text-muted-foreground", className)}
      {...props}
    >
      {children ?? <ChevronRight className="h-3.5 w-3.5" />}
    </li>
  )
}

function BreadcrumbEllipsis({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      role="presentation"
      aria-hidden="true"
      className={cn("flex h-9 w-9 items-center justify-center", className)}
      {...props}
    >
      <MoreHorizontal className="h-4 w-4" />
      <span className="sr-only">More</span>
    </span>
  )
}

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
}
