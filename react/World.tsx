/* SPDX-License-Identifier: Apache-2.0 */
/* SPDX-FileCopyrightText: 2026 The 25-ji-code-de Team */

import { createContext, useContext } from "react";
import { cx, type BaseProps, type World } from "./types";

const WorldContext = createContext<World>("system");

/** Read the world the current subtree is rendering in. */
export function useWorld(): World {
  return useContext(WorldContext);
}

export interface SekaiRootProps extends BaseProps {
  /**
   * Which world's token values apply below this element.
   * - `system` — SEKAI Pass: near-black, terminal register.
   * - `night`  — nightcord: violet, ambient register.
   */
  world?: World;
  /** Render as a different element. Defaults to `div`. */
  as?: "div" | "body" | "main" | "section";
}

/**
 * Applies a world's token values to everything inside it.
 *
 * EVERY SEKAI component must have one of these above it — the world
 * class is where the colour tokens actually get their values, so an
 * unwrapped component renders against the fallback (system) palette
 * whatever the surrounding app looks like. Put one at the app root.
 *
 * Nesting is supported and occasionally correct: a `night` chat panel
 * embedded in a `system` dashboard keeps its own violet surfaces.
 */
export function SekaiRoot({
  world = "system",
  as: Tag = "div",
  className,
  children,
  ...rest
}: SekaiRootProps & Record<string, unknown>) {
  return (
    <WorldContext.Provider value={world}>
      <Tag className={cx(`world-${world}`, className)} {...rest}>
        {children}
      </Tag>
    </WorldContext.Provider>
  );
}
