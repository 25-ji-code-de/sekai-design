/* SPDX-License-Identifier: Apache-2.0 */
/* SPDX-FileCopyrightText: 2026 The 25-ji-code-de Team */

import { useState } from "react";
import { cx, type PropsOf } from "../types";

export interface ImageCardProps extends Omit<PropsOf<"div">, "onLoad"> {
  src: string;
  alt?: string;
  /** Slides up from the bottom edge on hover. Attribution, not body. */
  caption?: string;
  size?: "small" | "large";
  /** Blurs the image behind a tap-to-reveal veil. Blur IS correct
   *  here (unlike text spoilers): you should be able to judge the
   *  composition before deciding to look. */
  spoiler?: boolean;
  revealLabel?: string;
}

export function ImageCard({
  src,
  alt = "",
  caption,
  size,
  spoiler,
  revealLabel,
  className,
  ...rest
}: ImageCardProps) {
  const [loaded, setLoaded] = useState(false);
  const [revealed, setRevealed] = useState(false);

  return (
    <div
      className={cx(
        "sekai-image-container",
        !loaded && "loading",
        size && `sekai-image-${size}`,
        spoiler && "sekai-image-spoiler",
        spoiler && revealed && "revealed",
        className,
      )}
      data-reveal-label={revealLabel}
      onClick={spoiler && !revealed ? () => setRevealed(true) : undefined}
      {...rest}
    >
      <img
        className="sekai-image-content"
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        style={{ opacity: loaded ? 1 : 0 }}
      />
      {caption ? <div className="sekai-image-caption">{caption}</div> : null}
    </div>
  );
}

export interface StickerProps extends PropsOf<"img"> {
  /** `inline` sits in a line of text; `single` stands alone. */
  layout?: "inline" | "single";
}

export function Sticker({
  layout = "inline",
  className,
  alt = "",
  ...rest
}: StickerProps) {
  return (
    <img
      className={cx("sekai-sticker", `sekai-sticker-${layout}`, className)}
      alt={alt}
      {...rest}
    />
  );
}
