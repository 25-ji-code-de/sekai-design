/* SPDX-License-Identifier: Apache-2.0 */
/* SPDX-FileCopyrightText: 2026 The 25-ji-code-de Team */

import { useState, type ReactNode } from "react";
import { cx, type PropsOf } from "../types";

/**
 * NOTE: every class name in react/sekai/* matches what nightcord's
 * sekai-renderer.js already emits. These wrappers and that renderer
 * produce byte-identical markup on purpose.
 */

export function RichText({ className, ...rest }: PropsOf<"div">) {
  return <div className={cx("sekai-text-node", className)} {...rest} />;
}

export function InlineCode({ className, ...rest }: PropsOf<"code">) {
  return <code className={cx("sekai-code-inline", className)} {...rest} />;
}

export interface CodeBlockProps extends PropsOf<"pre"> {
  /** Filename shown in the header. Omitting it drops the header. */
  name?: string;
  lang?: string;
  /** Renders collapsed behind a fade, with a toggle in the header. */
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

export function CodeBlock({
  name,
  lang,
  collapsible,
  defaultCollapsed = true,
  className,
  children,
  ...rest
}: CodeBlockProps) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const block = (
    <pre className={cx("sekai-code-block", className)} {...rest}>
      {children}
    </pre>
  );

  if (!name && !lang && !collapsible) return block;

  return (
    <div
      className={cx(
        "sekai-code-wrapper",
        collapsible && collapsed && "collapsed",
      )}
    >
      <div className="sekai-code-header">
        {name ? <span className="sekai-code-name">{name}</span> : null}
        {lang ? <span className="sekai-code-lang">{lang}</span> : null}
        {collapsible ? (
          <button
            type="button"
            className="sekai-code-toggle"
            onClick={() => setCollapsed((c) => !c)}
          >
            {collapsed ? "展开" : "折叠"}
          </button>
        ) : null}
      </div>
      {block}
    </div>
  );
}

export interface SpoilerProps extends PropsOf<"span"> {
  defaultRevealed?: boolean;
  /** Controlled mode. Supply this together with a `Recover` wrapper
   *  or your own state when the app needs to re-cover. */
  revealed?: boolean;
}

/**
 * Interference tape, not a blur — a blur leaks the shape of the text
 * underneath. Stays `color: transparent` and unselectable until
 * revealed, so a select-all can't lift the content out.
 *
 * One strip is deliberately one-way: peeled tape does not re-adhere.
 * To cover things again, wrap a region in `<Recover covered>` — you
 * don't re-stick one strip, you shut the whole folder.
 */
export function Spoiler({
  defaultRevealed = false,
  revealed: controlled,
  className,
  children,
  onClick,
  ...rest
}: SpoilerProps) {
  const [uncontrolled, setRevealed] = useState(defaultRevealed);
  const revealed = controlled ?? uncontrolled;
  return (
    <span
      role="button"
      tabIndex={0}
      aria-expanded={revealed}
      className={cx("sekai-spoiler", revealed && "revealed", className)}
      onClick={(e) => {
        setRevealed(true);
        onClick?.(e);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") setRevealed(true);
      }}
      {...rest}
    >
      {children}
    </span>
  );
}

export interface RecoverProps extends PropsOf<"div"> {
  /** While true, every spoiler inside is covered again, whatever its
   *  own state. Releasing it restores what was already revealed. */
  covered?: boolean;
}

/**
 * Puts the lid back on a whole region at once.
 *
 * A single spoiler cannot un-reveal, and shouldn't — but "content
 * warning" is an abstraction and it does have the operation "cover it
 * again" (someone walks up behind you). Taking the tape metaphor
 * seriously rather than dropping it puts that operation here, on the
 * container: you never re-stick one strip, you shut the folder. It is
 * also the better interaction — when you need this, you need
 * everything covered at once, not to hunt each strip.
 */
export function Recover({ covered, className, ...rest }: RecoverProps) {
  return (
    <div className={cx(covered && "sekai-recover", className)} {...rest} />
  );
}

export type MentionKind = "user" | "ai" | "all" | "role";

export interface MentionProps extends PropsOf<"span"> {
  kind?: MentionKind;
}

/** `ai` is the only mention that takes the signal orange — it marks
 *  the one participant in the stream who isn't a person. */
export function Mention({ kind = "user", className, ...rest }: MentionProps) {
  return (
    <span
      role="button"
      tabIndex={0}
      className={cx(
        "sekai-mention",
        kind !== "user" && `sekai-mention-${kind}`,
        className,
      )}
      {...rest}
    />
  );
}

export function InlineLink({ className, ...rest }: PropsOf<"a">) {
  return <a className={cx("sekai-link-inline", className)} {...rest} />;
}

export interface ColoredTextProps extends PropsOf<"span"> {
  color: string;
  /** Marks the colour as the author's raw value, unadjusted for
   *  contrast, with a leading diamond. */
  truecolor?: boolean;
}

export function ColoredText({
  color,
  truecolor,
  className,
  style,
  ...rest
}: ColoredTextProps) {
  return (
    <span
      className={cx(
        "sekai-colored-text",
        truecolor && "sekai-truecolor",
        className,
      )}
      style={{ color, ...style }}
      {...rest}
    />
  );
}

export function Blockquote({ children }: { children?: ReactNode }) {
  return (
    <div className="sekai-text-node">
      <blockquote>{children}</blockquote>
    </div>
  );
}
