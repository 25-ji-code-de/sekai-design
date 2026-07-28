/* SPDX-License-Identifier: Apache-2.0 */
/* SPDX-FileCopyrightText: 2026 The 25-ji-code-de Team */

import { cx, type PropsOf, type Tone } from "../types";

/* ---------- Badge / Chip ---------- */

export interface BadgeProps extends PropsOf<"span"> {
  /** `pill` for card headers, `identity` for a signed-in-as plate. */
  shape?: "tag" | "pill" | "identity";
  tone?: Extract<Tone, "accent" | "signal" | "danger" | "success">;
}

/** Machine voice by construction. If it should read in sentence case,
 *  you want a `Chip`, not a `Badge`. */
export function Badge({ shape = "tag", tone, className, ...rest }: BadgeProps) {
  return (
    <span
      className={cx(
        "sekai-badge",
        shape !== "tag" && `sekai-badge--${shape}`,
        tone && `sekai-badge--${tone}`,
        className,
      )}
      {...rest}
    />
  );
}

export interface ChipProps extends PropsOf<"span"> {
  interactive?: boolean;
}

export function Chip({ interactive, className, ...rest }: ChipProps) {
  return (
    <span
      className={cx(
        "sekai-chip",
        interactive && "sekai-chip--interactive",
        className,
      )}
      {...rest}
    />
  );
}

/* ---------- Signature devices ---------- */

/** Mono, uppercase, widely tracked, dim. The system stamp. */
export function Signature({
  loud,
  className,
  ...rest
}: PropsOf<"span"> & { loud?: boolean }) {
  return (
    <span
      className={cx("sekai-sig", loud && "sekai-sig--loud", className)}
      {...rest}
    />
  );
}

export interface RuleProps extends PropsOf<"hr"> {
  /** Interrupts the line with a mono label, e.g. "EDITABLE DATA". */
  label?: string;
}

export function Rule({ label, className, ...rest }: RuleProps) {
  return (
    <hr className={cx("sekai-rule", className)} data-label={label} {...rest} />
  );
}

export interface LedProps extends PropsOf<"span"> {
  active?: boolean;
  /** Defaults to the signal orange — the live/recording colour. */
  tone?: "signal" | "accent" | "success";
}

export function Led({ active, tone = "signal", className, ...rest }: LedProps) {
  return (
    <span
      className={cx(
        "sekai-led",
        tone !== "signal" && `sekai-led--${tone}`,
        active && "is-active",
        className,
      )}
      {...rest}
    />
  );
}

/** A hairline with a packet of accent travelling along it. Depicts a
 *  relationship between two entities; never ambient decoration. */
export function FlowLine({
  vertical,
  className,
  ...rest
}: PropsOf<"div"> & { vertical?: boolean }) {
  return (
    <div
      className={cx(
        "sekai-flow",
        vertical && "sekai-flow--vertical",
        className,
      )}
      aria-hidden="true"
      {...rest}
    />
  );
}

/* ---------- Avatar ---------- */

export interface AvatarProps extends PropsOf<"span"> {
  src?: string;
  alt?: string;
  /** Shown when there is no image. Usually one or two characters. */
  initials?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  /**
   * `person` is a circle, `entity` is a squircle. The shape is how a
   * user is told apart from an app at a glance — don't mix them.
   */
  kind?: "person" | "entity";
  /** Only meaningful for `entity`: tints the glow. */
  entityRole?: "user" | "app";
  /** 1-8. Derive it from a hash of the user id so the same person
   *  keeps the same colour across every SEKAI app. */
  tint?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
}

export function Avatar({
  src,
  alt = "",
  initials,
  size = "md",
  kind = "person",
  entityRole,
  tint,
  className,
  ...rest
}: AvatarProps) {
  return (
    <span
      className={cx(
        "sekai-avatar",
        size !== "md" && `sekai-avatar--${size}`,
        kind === "entity" && "sekai-avatar--entity",
        entityRole && `is-${entityRole}`,
        tint && `sekai-avatar--t${tint}`,
        className,
      )}
      {...rest}
    >
      {src ? <img src={src} alt={alt} /> : initials}
    </span>
  );
}

export function Presence({
  status = "offline",
  className,
  ...rest
}: PropsOf<"span"> & { status?: "online" | "idle" | "offline" }) {
  return (
    <span
      className={cx("sekai-presence", `sekai-presence--${status}`, className)}
      {...rest}
    />
  );
}
