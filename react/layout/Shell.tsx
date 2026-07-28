/* SPDX-License-Identifier: Apache-2.0 */
/* SPDX-FileCopyrightText: 2026 The 25-ji-code-de Team */

import { type ReactNode } from "react";
import { cx, type PropsOf } from "../types";

/** Two-pane app frame. Under 768px the sidebar becomes a drawer. */
export function Shell({ className, ...rest }: PropsOf<"div">) {
  return <div className={cx("sekai-shell", className)} {...rest} />;
}

export interface SidebarProps extends PropsOf<"aside"> {
  /** Controls the drawer on narrow viewports. Ignored above 768px. */
  open?: boolean;
}

export function Sidebar({ open, className, ...rest }: SidebarProps) {
  return (
    <aside
      className={cx("sekai-sidebar", open && "is-open", className)}
      {...rest}
    />
  );
}

export function SidebarHeader({ className, ...rest }: PropsOf<"div">) {
  return <div className={cx("sekai-sidebar__header", className)} {...rest} />;
}

export function SidebarBody({ className, ...rest }: PropsOf<"div">) {
  return <div className={cx("sekai-sidebar__body", className)} {...rest} />;
}

export function Main({ className, ...rest }: PropsOf<"main">) {
  return <main className={cx("sekai-main", className)} {...rest} />;
}

export function SectionLabel({ className, ...rest }: PropsOf<"div">) {
  return <div className={cx("sekai-section-label", className)} {...rest} />;
}

export interface ChannelProps extends PropsOf<"div"> {
  icon?: ReactNode;
  active?: boolean;
}

export function Channel({
  icon,
  active,
  className,
  children,
  ...rest
}: ChannelProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      aria-current={active ? "true" : undefined}
      className={cx("sekai-channel", active && "is-active", className)}
      {...rest}
    >
      {icon ? <span className="sekai-channel__icon">{icon}</span> : null}
      {children}
    </div>
  );
}

export interface RosterItemProps extends PropsOf<"div"> {
  offline?: boolean;
  /** Rendered flush to the right edge — presence dot, badge, count. */
  trailing?: ReactNode;
}

export function RosterItem({
  offline,
  trailing,
  className,
  children,
  ...rest
}: RosterItemProps) {
  return (
    <div
      className={cx("sekai-roster-item", offline && "is-offline", className)}
      {...rest}
    >
      <span className="sekai-roster-item__info">{children}</span>
      {trailing}
    </div>
  );
}
