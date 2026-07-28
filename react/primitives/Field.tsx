/* SPDX-License-Identifier: Apache-2.0 */
/* SPDX-FileCopyrightText: 2026 The 25-ji-code-de Team */

import { forwardRef, useId, type ReactNode } from "react";
import { cx, type BaseProps, type PropsOf } from "../types";

export interface FieldProps extends BaseProps {
  /** Rendered in the machine voice: mono, uppercase, dim. */
  label?: string;
  /** Mono helper text under the control. */
  hint?: string;
  /** Shown in danger red; also marks the control invalid. */
  error?: string;
  htmlFor?: string;
}

/**
 * Label + control + hint/error.
 *
 * The label is always mono/uppercase and the value always sans —
 * that contrast is the rule to preserve when adding a control type.
 */
export function Field({
  label,
  hint,
  error,
  htmlFor,
  className,
  children,
}: FieldProps) {
  return (
    <div className={cx("sekai-field", className)}>
      {label ? (
        <label className="sekai-field__label" htmlFor={htmlFor}>
          {label}
        </label>
      ) : null}
      {children}
      {error ? (
        <span className="sekai-error-text is-visible" role="alert">
          {error}
        </span>
      ) : hint ? (
        <span className="sekai-hint">{hint}</span>
      ) : null}
    </div>
  );
}

export interface InputProps extends PropsOf<"input"> {
  invalid?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { invalid, className, ...rest },
  ref,
) {
  return (
    <input
      ref={ref}
      aria-invalid={invalid || undefined}
      className={cx("sekai-input", invalid && "sekai-input--error", className)}
      {...rest}
    />
  );
});

export interface TextareaProps extends PropsOf<"textarea"> {
  invalid?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ invalid, className, ...rest }, ref) {
    return (
      <textarea
        ref={ref}
        aria-invalid={invalid || undefined}
        className={cx("sekai-textarea", className)}
        {...rest}
      />
    );
  },
);

export interface CheckboxProps extends Omit<PropsOf<"input">, "type"> {
  /** Prose, not a label — this row escapes the uppercase treatment. */
  children?: ReactNode;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox({ className, children, id, ...rest }, ref) {
    const auto = useId();
    const inputId = id ?? auto;
    return (
      <label className={cx("sekai-check", className)} htmlFor={inputId}>
        <input ref={ref} id={inputId} type="checkbox" {...rest} />
        <span>{children}</span>
      </label>
    );
  },
);

/** An input with a trailing action button. Stacks under 768px. */
export function InputRow({ className, ...rest }: PropsOf<"div">) {
  return <div className={cx("sekai-input-row", className)} {...rest} />;
}

/** Mono helper text, standalone. */
export function Hint({ className, ...rest }: PropsOf<"span">) {
  return <span className={cx("sekai-hint", className)} {...rest} />;
}

export interface InputShellProps extends PropsOf<"div"> {
  /** Rendered to the right of the field. */
  actions?: ReactNode;
}

/**
 * A composer: the shell IS the surface and the field inside has no
 * chrome of its own. Used for the nightcord message box.
 */
export function InputShell({
  actions,
  className,
  children,
  ...rest
}: InputShellProps) {
  return (
    <div className={cx("sekai-input-shell", className)} {...rest}>
      {children}
      {actions ? <div className="sekai-composer__actions">{actions}</div> : null}
    </div>
  );
}

/** The chromeless field that lives inside an InputShell. */
export const BareInput = forwardRef<HTMLTextAreaElement, PropsOf<"textarea">>(
  function BareInput({ className, rows = 1, ...rest }, ref) {
    return (
      <textarea
        ref={ref}
        rows={rows}
        className={cx("sekai-input-bare", className)}
        {...rest}
      />
    );
  },
);
