/* SPDX-License-Identifier: Apache-2.0 */
/* SPDX-FileCopyrightText: 2026 The 25-ji-code-de Team */

import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

/** The two worlds this system ships. See DESIGN_SYSTEM.md §1. */
export type World = "system" | "night";

/** Semantic colour roles usable as a component tone. */
export type Tone =
  | "accent"
  | "signal"
  | "danger"
  | "success"
  | "warning"
  | "info";

/** Shared props every wrapper accepts. */
export interface BaseProps {
  className?: string;
  children?: ReactNode;
}

export type PropsOf<T extends ElementType> = ComponentPropsWithoutRef<T>;

/** Joins class names, dropping falsy entries. Exported because app
 *  code composing SEKAI classes needs the same helper. */
export function cx(
  ...parts: Array<string | false | null | undefined>
): string {
  return parts.filter(Boolean).join(" ");
}
