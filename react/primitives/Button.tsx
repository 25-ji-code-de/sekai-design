/* SPDX-License-Identifier: Apache-2.0 */
/* SPDX-FileCopyrightText: 2026 The 25-ji-code-de Team */

import { forwardRef } from "react";
import { cx, type PropsOf } from "../types";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "danger"
  | "danger-outline"
  | "identity";

export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends PropsOf<"button"> {
  /**
   * `primary` is the only solid accent fill in the system — one per
   * view. `secondary` is the correct default for everything else.
   * `identity` is the "Continue with SEKAI Pass" doorway and is the
   * only variant allowed to carry `sheen`.
   */
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Stretch to the container's full width. */
  block?: boolean;
  /** Adds the one-per-screen highlight sweep. Pairs with `identity`. */
  sheen?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = "secondary",
      size = "md",
      block,
      sheen,
      className,
      type = "button",
      ...rest
    },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type={type}
        className={cx(
          "sekai-btn",
          `sekai-btn--${variant}`,
          size !== "md" && `sekai-btn--${size}`,
          block && "sekai-btn--block",
          sheen && "sekai-sheen",
          className,
        )}
        {...rest}
      />
    );
  },
);

export interface IconButtonProps extends PropsOf<"button"> {
  /** Accessible name — an icon-only control has no text to read. */
  label: string;
  /** Rotates 90° on hover instead of fading. For close/dismiss. */
  dismiss?: boolean;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton(
    { label, dismiss, className, type = "button", ...rest },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type={type}
        aria-label={label}
        title={label}
        className={cx(
          "sekai-icon-btn",
          dismiss && "sekai-icon-btn--dismiss",
          className,
        )}
        {...rest}
      />
    );
  },
);

export interface ButtonRowProps extends PropsOf<"div"> {
  /** Pushes the first and last child to opposite ends. */
  split?: boolean;
}

export function ButtonRow({ split, className, ...rest }: ButtonRowProps) {
  return (
    <div
      className={cx(
        "sekai-btn-row",
        split && "sekai-btn-row--split",
        className,
      )}
      {...rest}
    />
  );
}

/** Two equal columns that stack under 768px. The Approve/Deny pair. */
export function ButtonGrid({ className, ...rest }: PropsOf<"div">) {
  return <div className={cx("sekai-btn-grid", className)} {...rest} />;
}
