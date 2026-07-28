/* SPDX-License-Identifier: Apache-2.0 */
/* SPDX-FileCopyrightText: 2026 The 25-ji-code-de Team */

import { type ReactNode } from "react";
import { cx, type PropsOf } from "../types";

export function Page({ className, ...rest }: PropsOf<"div">) {
  return <div className={cx("sekai-page", className)} {...rest} />;
}

export interface PageHeaderProps extends Omit<PropsOf<"div">, "title"> {
  title: ReactNode;
  subtitle?: ReactNode;
}

export function PageHeader({
  title,
  subtitle,
  className,
  ...rest
}: PageHeaderProps) {
  return (
    <div className={cx("sekai-page-header", className)} {...rest}>
      <h2>{title}</h2>
      {subtitle ? <p className="sekai-page-subtitle">{subtitle}</p> : null}
    </div>
  );
}

/** Section title in the machine voice — it names a subsystem, not a
 *  topic. Accent-coloured, widely tracked, uppercase. */
export function SettingsHeader({
  title,
  className,
  ...rest
}: Omit<PropsOf<"div">, "title"> & { title: ReactNode }) {
  return (
    <div className={cx("sekai-settings-header", className)} {...rest}>
      <h2>{title}</h2>
    </div>
  );
}

export interface ProfileProps extends PropsOf<"div"> {
  avatar?: ReactNode;
}

/** Dashed border, because this block is a readout rather than a form.
 *  The dash is the tell. */
export function Profile({
  avatar,
  className,
  children,
  ...rest
}: ProfileProps) {
  return (
    <div className={cx("sekai-profile", className)} {...rest}>
      {avatar}
      <div className="sekai-profile__meta">{children}</div>
    </div>
  );
}

export interface MetaRowProps extends PropsOf<"div"> {
  label: ReactNode;
  value: ReactNode;
}

export function MetaRow({ label, value, className, ...rest }: MetaRowProps) {
  return (
    <div className={cx("sekai-meta-row", className)} {...rest}>
      <span className="sekai-meta-row__key">{label}</span>
      <span className="sekai-meta-row__value">{value}</span>
    </div>
  );
}

/** Bordered rows: mono label left, sans value right. */
export function Readout({ className, ...rest }: PropsOf<"div">) {
  return <div className={cx("sekai-readout", className)} {...rest} />;
}

export function ReadoutRow({
  label,
  value,
}: {
  label: ReactNode;
  value: ReactNode;
}) {
  return (
    <p>
      <strong>{label}</strong>
      <span>{value}</span>
    </p>
  );
}

export function Footer({ className, ...rest }: PropsOf<"footer">) {
  return <footer className={cx("sekai-footer", className)} {...rest} />;
}

export function UriList({ className, ...rest }: PropsOf<"ul">) {
  return <ul className={cx("sekai-uri-list", className)} {...rest} />;
}
