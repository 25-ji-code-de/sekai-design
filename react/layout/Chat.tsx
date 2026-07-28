/* SPDX-License-Identifier: Apache-2.0 */
/* SPDX-FileCopyrightText: 2026 The 25-ji-code-de Team */

import { type ReactNode } from "react";
import { cx, type PropsOf } from "../types";

export function Bar({ className, ...rest }: PropsOf<"header">) {
  return <header className={cx("sekai-bar", className)} {...rest} />;
}

export function BarTitle({ className, ...rest }: PropsOf<"span">) {
  return <span className={cx("sekai-bar__title", className)} {...rest} />;
}

/** Decorative traffic lights. They are not window controls — never
 *  make them the only route to an action. */
export function WindowDots({ className, ...rest }: PropsOf<"div">) {
  return (
    <div
      className={cx("sekai-window-dots", className)}
      aria-hidden="true"
      {...rest}
    >
      <i />
      <i />
      <i />
    </div>
  );
}

export function MessageList({ className, ...rest }: PropsOf<"div">) {
  return <div className={cx("sekai-messages", className)} {...rest} />;
}

export interface MessageProps extends PropsOf<"div"> {
  author: ReactNode;
  time?: ReactNode;
  avatar?: ReactNode;
  /** Amber strip + tint. The one row-level state that takes a colour. */
  mentioned?: boolean;
  /** Pulse-once tint, for jump-to-reply. */
  highlighted?: boolean;
  /** Appears on row hover only. Usually a reply IconButton. */
  action?: ReactNode;
  /** Renders the trailing block caret for a token-by-token reply. */
  streaming?: boolean;
}

export function Message({
  author,
  time,
  avatar,
  mentioned,
  highlighted,
  action,
  streaming,
  className,
  children,
  ...rest
}: MessageProps) {
  return (
    <div
      className={cx(
        "sekai-message",
        mentioned && "is-mentioned",
        highlighted && "is-highlighted",
        streaming && "sekai-streaming",
        className,
      )}
      {...rest}
    >
      {avatar}
      <div className="sekai-message__body">
        <div className="sekai-message__header">
          <span className="sekai-message__author">{author}</span>
          {time ? <span className="sekai-message__time">{time}</span> : null}
        </div>
        <div className="sekai-message__text">{children}</div>
      </div>
      {action ? <div className="sekai-message__action">{action}</div> : null}
    </div>
  );
}

export function Composer({ className, ...rest }: PropsOf<"div">) {
  return <div className={cx("sekai-composer", className)} {...rest} />;
}

export interface SuggestListProps extends PropsOf<"div"> {
  open?: boolean;
}

/** Mention / sticker autocomplete, anchored above the composer. */
export function SuggestList({ open, className, ...rest }: SuggestListProps) {
  return (
    <div
      role="listbox"
      className={cx("sekai-suggest", !open && "is-hidden", className)}
      {...rest}
    />
  );
}

export interface SuggestItemProps extends PropsOf<"div"> {
  active?: boolean;
  preview?: string;
  label?: ReactNode;
  desc?: ReactNode;
}

export function SuggestItem({
  active,
  preview,
  label,
  desc,
  className,
  children,
  ...rest
}: SuggestItemProps) {
  return (
    <div
      role="option"
      aria-selected={active}
      className={cx("sekai-suggest__item", active && "is-active", className)}
      {...rest}
    >
      {preview ? (
        <img className="sekai-suggest__preview" src={preview} alt="" />
      ) : null}
      {label || desc ? (
        <span>
          {label ? <span className="sekai-suggest__label">{label}</span> : null}
          {desc ? <span className="sekai-suggest__desc">{desc}</span> : null}
        </span>
      ) : (
        children
      )}
    </div>
  );
}
