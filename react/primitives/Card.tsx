/* SPDX-License-Identifier: Apache-2.0 */
/* SPDX-FileCopyrightText: 2026 The 25-ji-code-de Team */

import { Fragment, type ReactNode } from "react";
import { cx, type PropsOf } from "../types";

export interface CardProps extends PropsOf<"div"> {
  /** Removes padding — for cards whose children own their own edges. */
  flush?: boolean;
  /** Adds the hover lift. Use only when the whole card is clickable. */
  interactive?: boolean;
  /** Dashed border: a readout or a not-yet-filled slot. */
  draft?: boolean;
  tone?: "danger" | "accent";
  /** Seals the top edge with the accent hairline. One per screen. */
  cap?: boolean;
  /** Glass construction — floats over content rather than sitting in it. */
  glass?: boolean;
}

export function Card({
  flush,
  interactive,
  draft,
  tone,
  cap,
  glass,
  className,
  ...rest
}: CardProps) {
  return (
    <div
      className={cx(
        "sekai-card",
        flush && "sekai-card--flush",
        interactive && "sekai-card--interactive",
        draft && "sekai-card--draft",
        tone && `sekai-card--${tone}`,
        cap && "sekai-cap",
        glass && "sekai-glass",
        className,
      )}
      {...rest}
    />
  );
}

export function CardHeader({ className, ...rest }: PropsOf<"div">) {
  return <div className={cx("sekai-card__header", className)} {...rest} />;
}

export function CardTitle({ className, ...rest }: PropsOf<"h3">) {
  return <h3 className={cx("sekai-card__title", className)} {...rest} />;
}

export function CardDesc({ className, ...rest }: PropsOf<"p">) {
  return <p className={cx("sekai-card__desc", className)} {...rest} />;
}

/**
 * A sunken container for rows that belong to each other: OAuth
 * scopes, metadata, uri lists. Sunken + inner shadow, so the rows
 * read as contents rather than as a stack of separate cards.
 */
export function Well({ className, ...rest }: PropsOf<"div">) {
  return <div className={cx("sekai-well", className)} {...rest} />;
}

export function WellRow({ className, ...rest }: PropsOf<"div">) {
  return <div className={cx("sekai-well__row", className)} {...rest} />;
}

export interface MetaListProps extends PropsOf<"dl"> {
  /** Rendered as mono uppercase keys with sans values. */
  items?: Array<{ key: string; value: ReactNode }>;
}

export function MetaList({
  items,
  className,
  children,
  ...rest
}: MetaListProps) {
  return (
    <dl className={cx("sekai-meta", className)} {...rest}>
      {items?.map((it) => (
        <Fragment key={it.key}>
          <dt>{it.key}</dt>
          <dd>{it.value}</dd>
        </Fragment>
      ))}
      {children}
    </dl>
  );
}

/**
 * A one-time-visible credential. `user-select: all` so the whole
 * string selects in a single click — half a client secret is worse
 * than none.
 */
export function Secret({ className, ...rest }: PropsOf<"code">) {
  return <code className={cx("sekai-secret", className)} {...rest} />;
}
