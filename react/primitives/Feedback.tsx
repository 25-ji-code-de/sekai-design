/* SPDX-License-Identifier: Apache-2.0 */
/* SPDX-FileCopyrightText: 2026 The 25-ji-code-de Team */

import { type ReactNode } from "react";
import { cx, type PropsOf } from "../types";
import { IconButton } from "./Button";

/** The signal orange is reserved for live/AI state, so it is
 *  deliberately absent here — an alert is never "live". */
export type AlertTone = "error" | "success" | "warning" | "info" | "accent";

export interface AlertProps extends PropsOf<"div"> {
  tone?: AlertTone;
}

/** Tinted field + 3px left strip + mono text. The strip does the
 *  work; the tint only gives it something to belong to. */
export function Alert({ tone = "info", className, ...rest }: AlertProps) {
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={cx("sekai-alert", `sekai-alert--${tone}`, className)}
      {...rest}
    />
  );
}

export interface StatusPillProps extends PropsOf<"div"> {
  state?: "idle" | "working" | "success" | "error";
}

/**
 * A full-width state readout that occupies the space the result will
 * occupy, so nothing reflows when it resolves. From the Pass
 * proof-of-work indicator.
 */
export function StatusPill({
  state = "idle",
  className,
  children,
  ...rest
}: StatusPillProps) {
  return (
    <div
      role="status"
      className={cx(
        "sekai-status",
        state !== "idle" && `sekai-status--${state}`,
        className,
      )}
      {...rest}
    >
      {state === "working" ? <Spinner small /> : null}
      {children}
    </div>
  );
}

export interface ToastProps extends PropsOf<"div"> {
  icon?: ReactNode;
  /** Rendered to the right of the message. */
  actions?: ReactNode;
  onDismiss?: () => void;
  dismissLabel?: string;
}

export function Toast({
  icon,
  actions,
  onDismiss,
  dismissLabel = "Dismiss",
  className,
  children,
  ...rest
}: ToastProps) {
  return (
    <div
      role="status"
      className={cx("sekai-toast", "sekai-glass--overlay", className)}
      {...rest}
    >
      <div className="sekai-toast__content">
        {icon ? <span className="sekai-toast__icon">{icon}</span> : null}
        {children}
      </div>
      <div className="sekai-toast__actions">
        {actions}
        {onDismiss ? (
          <IconButton dismiss label={dismissLabel} onClick={onDismiss}>
            ×
          </IconButton>
        ) : null}
      </div>
    </div>
  );
}

export function Spinner({
  small,
  className,
  ...rest
}: PropsOf<"span"> & { small?: boolean }) {
  return (
    <span
      role="progressbar"
      aria-label="Loading"
      className={cx("sekai-spinner", small && "sekai-spinner--sm", className)}
      {...rest}
    />
  );
}

export interface ProgressProps extends PropsOf<"div"> {
  /** 0-100. */
  value: number;
  /** Shows the numeric percentage in mono at the end of the bar. */
  showValue?: boolean;
}

export function Progress({
  value,
  showValue = true,
  className,
  ...rest
}: ProgressProps) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className={cx("sekai-progress", className)} {...rest}>
      <div
        className="sekai-progress__track"
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className="sekai-progress__fill" style={{ width: `${clamped}%` }} />
      </div>
      {showValue ? (
        <span className="sekai-progress__value">{Math.round(clamped)}%</span>
      ) : null}
    </div>
  );
}

export function Skeleton({ className, style, ...rest }: PropsOf<"div">) {
  return (
    <div className={cx("sekai-skeleton", className)} style={style} {...rest} />
  );
}

export function EmptyState({ className, ...rest }: PropsOf<"div">) {
  return <div className={cx("sekai-empty", className)} {...rest} />;
}
