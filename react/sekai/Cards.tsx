/* SPDX-License-Identifier: Apache-2.0 */
/* SPDX-FileCopyrightText: 2026 The 25-ji-code-de Team */

import { type ReactNode } from "react";
import { cx, type PropsOf } from "../types";

/**
 * Three attachment cards built three different ways, on purpose:
 *   FileCard  glass — it floats over the conversation
 *   LinkCard  panel + spine — it points somewhere else
 *   ReplyChip chip + strip — it points backwards in this thread
 */

export interface FileCardProps extends PropsOf<"div"> {
  name: string;
  /** Size, type, whatever — rendered in mono. Machine facts. */
  meta?: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
}

export function FileCard({
  name,
  meta,
  icon,
  action,
  className,
  ...rest
}: FileCardProps) {
  return (
    <div className={cx("sekai-file-card", className)} {...rest}>
      <div className="sekai-file-icon">{icon}</div>
      <div className="sekai-file-details">
        <div className="sekai-file-name">{name}</div>
        {meta ? <div className="sekai-file-meta">{meta}</div> : null}
      </div>
      {action ? <div className="sekai-file-action">{action}</div> : null}
    </div>
  );
}

export interface LinkCardProps extends PropsOf<"a"> {
  /** Uppercase site name — the smallest, dimmest line. */
  site?: string;
  title: string;
  desc?: string;
  /** The full URL, in mono. You check it; you don't read it. */
  url?: string;
  showArrow?: boolean;
}

export function LinkCard({
  site,
  title,
  desc,
  url,
  showArrow = true,
  className,
  ...rest
}: LinkCardProps) {
  return (
    <a className={cx("sekai-link-card", className)} {...rest}>
      <span className="sekai-link-accent" />
      <span className="sekai-link-content">
        {site ? <span className="sekai-link-site">{site}</span> : null}
        <span className="sekai-link-title">{title}</span>
        {desc ? <span className="sekai-link-desc">{desc}</span> : null}
        {url ? <span className="sekai-link-url">{url}</span> : null}
      </span>
      {showArrow ? <span className="sekai-link-arrow">›</span> : null}
    </a>
  );
}

export interface ReplyChipProps extends PropsOf<"div"> {
  icon?: ReactNode;
}

export function ReplyChip({
  icon,
  className,
  children,
  ...rest
}: ReplyChipProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      className={cx("sekai-reply-chip", className)}
      {...rest}
    >
      {icon ? <span className="sekai-reply-accent">{icon}</span> : null}
      <span className="sekai-reply-content">{children}</span>
    </div>
  );
}

export interface ErrorPlaceholderProps extends PropsOf<"div"> {
  icon?: ReactNode;
  text: string;
}

export function ErrorPlaceholder({
  icon = "⚠",
  text,
  className,
  ...rest
}: ErrorPlaceholderProps) {
  return (
    <div className={cx("sekai-error-placeholder", className)} {...rest}>
      <span className="sekai-error-icon">{icon}</span>
      <span className="sekai-error-text">{text}</span>
    </div>
  );
}
