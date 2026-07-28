/* SPDX-License-Identifier: Apache-2.0 */
/* SPDX-FileCopyrightText: 2026 The 25-ji-code-de Team */

import { type ReactNode } from "react";
import { cx, type PropsOf } from "../types";
import { IconButton } from "./Button";

export interface ModalProps extends Omit<PropsOf<"div">, "title"> {
  open?: boolean;
  title?: ReactNode;
  subtitle?: ReactNode;
  /** The mark above the title. Breathes on a 6s float. */
  logo?: ReactNode;
  onClose?: () => void;
  closeLabel?: string;
  /** Click the scrim to dismiss. Off by default — a modal asking for
   *  a decision should not be dismissable by a stray click. */
  closeOnScrim?: boolean;
}

export function Modal({
  open = true,
  title,
  subtitle,
  logo,
  onClose,
  closeLabel = "Close",
  closeOnScrim = false,
  className,
  children,
  ...rest
}: ModalProps) {
  if (!open) return null;
  return (
    <div
      className="sekai-overlay"
      onClick={closeOnScrim && onClose ? onClose : undefined}
    >
      <div
        role="dialog"
        aria-modal="true"
        className={cx("sekai-modal", className)}
        onClick={(e) => e.stopPropagation()}
        {...rest}
      >
        {onClose ? (
          <IconButton
            dismiss
            label={closeLabel}
            className="sekai-modal__close"
            onClick={onClose}
          >
            ×
          </IconButton>
        ) : null}
        {logo ? <div className="sekai-modal__logo">{logo}</div> : null}
        {title ? <h2 className="sekai-modal__title">{title}</h2> : null}
        {subtitle ? <p className="sekai-modal__subtitle">{subtitle}</p> : null}
        {children}
      </div>
    </div>
  );
}

/** "OR" between a primary path and an alternative one. */
export function OrDivider({
  children = "or",
  className,
  ...rest
}: PropsOf<"div">) {
  return (
    <div className={cx("sekai-or", className)} {...rest}>
      <span>{children}</span>
    </div>
  );
}
