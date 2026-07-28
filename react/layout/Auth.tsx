/* SPDX-License-Identifier: Apache-2.0 */
/* SPDX-FileCopyrightText: 2026 The 25-ji-code-de Team */

import { type ReactNode } from "react";
import { cx, type PropsOf } from "../types";
import { Well, WellRow } from "../primitives/Card";
import { FlowLine } from "../primitives/Display";

/** Centred single-panel page on the grid field. Put on the outermost
 *  element of an auth route. */
export function AuthPage({ className, ...rest }: PropsOf<"div">) {
  return <div className={cx("sekai-auth-page", className)} {...rest} />;
}

export interface AuthPanelProps extends PropsOf<"div"> {
  wide?: boolean;
}

/** The capped panel. Its accent hairline is the one cap per screen. */
export function AuthPanel({ wide, className, ...rest }: AuthPanelProps) {
  return (
    <div
      className={cx("sekai-auth", wide && "sekai-auth--wide", className)}
      {...rest}
    />
  );
}

export interface AuthLogoProps extends PropsOf<"div"> {
  src?: string;
  alt?: string;
  /** The mono stamp under the mark. Defaults to "SEKAI PASS // SYSTEM". */
  signature?: string;
}

export function AuthLogo({
  src,
  alt = "",
  signature,
  className,
  children,
  ...rest
}: AuthLogoProps) {
  return (
    <div
      className={cx("sekai-auth__logo", className)}
      data-sig={signature}
      {...rest}
    >
      {src ? <img src={src} alt={alt} /> : children}
    </div>
  );
}

export function AuthHeader({ className, ...rest }: PropsOf<"div">) {
  return <div className={cx("sekai-auth__header", className)} {...rest} />;
}

export function AuthTitle({ className, ...rest }: PropsOf<"h1">) {
  return <h1 className={cx("sekai-auth__title", className)} {...rest} />;
}

export function AuthSubtitle({ className, ...rest }: PropsOf<"p">) {
  return <p className={cx("sekai-auth__subtitle", className)} {...rest} />;
}

export interface EntityProps extends PropsOf<"div"> {
  label: string;
  /** Pass an <Avatar kind="entity" /> here. */
  avatar?: ReactNode;
}

export function Entity({
  label,
  avatar,
  className,
  children,
  ...rest
}: EntityProps) {
  return (
    <div className={cx("sekai-entity", className)} {...rest}>
      <div className="sekai-entity__avatar">{avatar ?? children}</div>
      <span className="sekai-entity__label">{label}</span>
    </div>
  );
}

export interface ConnectionVisualProps extends PropsOf<"div"> {
  from: ReactNode;
  to: ReactNode;
  /** Small round glyph sitting on the middle of the line. */
  badge?: ReactNode;
}

/**
 * Two entities and the live line between them — the entire argument
 * of a consent screen in one picture: who is talking to whom, and
 * that it is happening now. Stacks vertically under 768px, and the
 * packet animation turns with it.
 */
export function ConnectionVisual({
  from,
  to,
  badge,
  className,
  ...rest
}: ConnectionVisualProps) {
  return (
    <div className={cx("sekai-connection", className)} {...rest}>
      {from}
      <FlowLine />
      {badge ? <span className="sekai-connection__badge">{badge}</span> : null}
      {to}
    </div>
  );
}

/** A sunken list of the permissions being requested. */
export function ScopeList({ className, ...rest }: PropsOf<"div">) {
  return <Well className={className} {...rest} />;
}

export interface ScopeItemProps extends PropsOf<"div"> {
  name: ReactNode;
  desc?: ReactNode;
  icon?: ReactNode;
  /** Rendered inline after the name — e.g. a `READ` badge. */
  tag?: ReactNode;
}

export function ScopeItem({
  name,
  desc,
  icon,
  tag,
  className,
  ...rest
}: ScopeItemProps) {
  return (
    <WellRow className={className} {...rest}>
      {icon ? <span className="sekai-scope__icon">{icon}</span> : null}
      <span className="sekai-scope__content">
        <span className="sekai-scope__name">
          {name}
          {tag}
        </span>
        {desc ? <span className="sekai-scope__desc">{desc}</span> : null}
      </span>
    </WellRow>
  );
}

export function SecurityNote({ className, ...rest }: PropsOf<"div">) {
  return <div className={cx("sekai-security-note", className)} {...rest} />;
}

export function PrivacyNote({ className, ...rest }: PropsOf<"p">) {
  return <p className={cx("sekai-privacy-note", className)} {...rest} />;
}

export function AuthLink({ className, ...rest }: PropsOf<"div">) {
  return <div className={cx("sekai-auth__link", className)} {...rest} />;
}

/** Reserves a captcha widget's height so the panel doesn't jump when
 *  a third-party iframe finally paints. */
export function CaptchaSlot({ className, ...rest }: PropsOf<"div">) {
  return <div className={cx("sekai-captcha-slot", className)} {...rest} />;
}
