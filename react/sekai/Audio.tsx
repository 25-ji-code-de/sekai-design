/* SPDX-License-Identifier: Apache-2.0 */
/* SPDX-FileCopyrightText: 2026 The 25-ji-code-de Team */

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type RefObject,
} from "react";
import { cx, type PropsOf } from "../types";

/* ============================================================
   The two players visualize different things ON PURPOSE.

     AudioDevice  32-band spectrum, fftSize 64  → MUSIC
                  you want to see the mix
     AudioPlayer  time-domain trace, fftSize 2048 → AUDIO
                  you want to see the utterance

   A voice note has no interesting spectrum; it has an envelope.
   Swapping these makes both players lie about what they are for.
   ============================================================ */

/** fftSize 64 → frequencyBinCount 32 → exactly 32 bars. The count is
 *  semantic, not decorative: one bar per band. */
const DEVICE_FFT = 64;
const DEVICE_BARS = DEVICE_FFT / 2;
const BAR_INDEX = Array.from({ length: DEVICE_BARS }, (_, i) => i);

const OSC = {
  width: 200,
  height: 20,
  lineWidth: 1.5,
  fftSize: 2048,
  smoothing: 0.8,
  /** Sample every Nth point when computing RMS — 2048 points per
   *  frame at 60fps is more arithmetic than the LED deserves. */
  rmsStride: 4,
} as const;

function clock(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

/** Reads a token off the element so canvas painting stays world-aware.
 *  Palette tokens hold `"r g b"`, so callers wrap in `rgb(...)`. */
function readToken(el: Element | null, name: string, fallback: string) {
  if (!el) return fallback;
  const v = getComputedStyle(el).getPropertyValue(name).trim();
  return v || fallback;
}

/* Built on an explicit ArrayBuffer: `new Uint8Array(n)` types as
   `Uint8Array<ArrayBufferLike>`, and the Web Audio getByte* methods
   want `Uint8Array<ArrayBuffer>` (SharedArrayBuffer doesn't count),
   so the bare constructor is rejected. Same shape as the fix in
   puzzle-sekai's auth/id-token.ts. */
type Analysis = {
  analyser: AnalyserNode;
  data: Uint8Array<ArrayBuffer>;
} | null;

/**
 * Web Audio wiring, created lazily on the first play so it happens
 * inside a user gesture.
 *
 * `createMediaElementSource` may only be called once per element and
 * throws on a cross-origin source without CORS headers. Both failures
 * resolve to `null`, and every caller falls back to a flat idle trace
 * — never to a faked animation. A visualizer that invents motion it
 * cannot measure is worse than one that admits it has no signal.
 */
function useAnalysis(audioRef: RefObject<HTMLAudioElement | null>, fftSize: number) {
  const ref = useRef<Analysis>(null);
  const attempted = useRef(false);
  const ctxRef = useRef<AudioContext | null>(null);

  const ensure = useCallback(() => {
    if (attempted.current) {
      void ctxRef.current?.resume();
      return ref.current;
    }
    attempted.current = true;
    const audio = audioRef.current;
    const Ctor =
      typeof window !== "undefined"
        ? window.AudioContext ??
          (window as unknown as { webkitAudioContext?: typeof AudioContext })
            .webkitAudioContext
        : undefined;
    if (!audio || !Ctor) return null;
    try {
      const ctx = new Ctor();
      ctxRef.current = ctx;
      const analyser = ctx.createAnalyser();
      analyser.fftSize = fftSize;
      analyser.smoothingTimeConstant = OSC.smoothing;
      ctx.createMediaElementSource(audio).connect(analyser);
      analyser.connect(ctx.destination);
      ref.current = {
        analyser,
        data: new Uint8Array(new ArrayBuffer(analyser.frequencyBinCount)),
      };
    } catch {
      ref.current = null;
    }
    return ref.current;
  }, [audioRef, fftSize]);

  useEffect(() => {
    return () => {
      void ctxRef.current?.close();
      ctxRef.current = null;
    };
  }, []);

  return { ref, ensure };
}

/** Shared <audio> wiring for both players. */
function useAudio(src: string, onFirstPlay?: () => void) {
  const ref = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onTime = () => setTime(el.currentTime);
    const onMeta = () => setDuration(el.duration);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onEnded = () => setPlaying(false);
    const onProgress = () => {
      if (el.buffered.length > 0) {
        setBuffered(el.buffered.end(el.buffered.length - 1));
      }
    };
    el.addEventListener("timeupdate", onTime);
    el.addEventListener("loadedmetadata", onMeta);
    el.addEventListener("durationchange", onMeta);
    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);
    el.addEventListener("ended", onEnded);
    el.addEventListener("progress", onProgress);
    return () => {
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("loadedmetadata", onMeta);
      el.removeEventListener("durationchange", onMeta);
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
      el.removeEventListener("ended", onEnded);
      el.removeEventListener("progress", onProgress);
    };
  }, [src]);

  const toggle = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    if (el.paused) {
      onFirstPlay?.();
      void el.play();
    } else {
      el.pause();
    }
  }, [onFirstPlay]);

  const stop = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.pause();
    el.currentTime = 0;
  }, []);

  const nudge = useCallback((delta: number) => {
    const el = ref.current;
    if (!el) return;
    const max = Number.isFinite(el.duration) ? el.duration : el.currentTime;
    el.currentTime = Math.max(0, Math.min(max, el.currentTime + delta));
  }, []);

  const seekToRatio = useCallback((ratio: number) => {
    const el = ref.current;
    if (!el || !Number.isFinite(el.duration)) return;
    el.currentTime = Math.max(0, Math.min(1, ratio)) * el.duration;
  }, []);

  return {
    ref,
    playing,
    time,
    duration,
    buffered,
    toggle,
    stop,
    nudge,
    seekToRatio,
  };
}

function ratioFromClick(e: MouseEvent<HTMLElement>): number {
  const box = e.currentTarget.getBoundingClientRect();
  return box.width > 0 ? (e.clientX - box.left) / box.width : 0;
}

/* ============================================================
   Oscilloscope
   ============================================================ */

interface OscilloscopeProps {
  analysisRef: RefObject<Analysis>;
  playing: boolean;
  /** Root-mean-square of the current frame, 0..1. Drives the LED. */
  onRms?: (rms: number) => void;
}

/**
 * The simple player's visualizer: a time-domain trace.
 *
 * The frame is cleared with the LIVE surface at 25% alpha rather than
 * wiped opaque — that partial clear is what leaves an afterglow trail
 * behind the trace. Painting it opaque removes the single detail that
 * makes this read as an instrument rather than a chart.
 */
function Oscilloscope({ analysisRef, playing, onRms }: OscilloscopeProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef(0);
  const rmsRef = useRef(onRms);
  rmsRef.current = onRms;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const { width: w, height: h } = OSC;
    const dpr = window.devicePixelRatio || 1;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    const idleBg = `rgb(${readToken(canvas, "--sekai-surface-card", "47 39 63")})`;
    const liveBg = `rgb(${readToken(canvas, "--sekai-surface-card-live", "53 46 70")} / 0.25)`;
    const line = `rgb(${readToken(canvas, "--sekai-accent", "167 139 250")})`;

    // Fades out at both ends so the trace doesn't collide with the
    // canvas edge. Built once, not per frame.
    const grad = ctx.createLinearGradient(0, 0, w, 0);
    grad.addColorStop(0, "transparent");
    grad.addColorStop(0.1, line);
    grad.addColorStop(0.9, line);
    grad.addColorStop(1, "transparent");

    const drawIdle = () => {
      ctx.fillStyle = idleBg;
      ctx.fillRect(0, 0, w, h);
      ctx.lineWidth = OSC.lineWidth;
      ctx.strokeStyle = grad;
      ctx.beginPath();
      ctx.moveTo(0, h / 2);
      ctx.lineTo(w, h / 2);
      ctx.stroke();
    };

    if (!playing) {
      drawIdle();
      return;
    }

    const frame = () => {
      const analysis = analysisRef.current;
      if (!analysis) {
        drawIdle();
        return; // no signal: hold the flat line, don't invent motion
      }
      const { analyser, data } = analysis;
      analyser.getByteTimeDomainData(data);

      ctx.fillStyle = liveBg;
      ctx.fillRect(0, 0, w, h);

      ctx.lineWidth = OSC.lineWidth;
      ctx.strokeStyle = grad;
      ctx.beginPath();

      const slice = w / data.length;
      let x = 0;
      let sumSquares = 0;
      let samples = 0;

      for (let i = 0; i < data.length; i++) {
        const raw = data[i] ?? 128;
        const y = (raw / 128) * (h / 2);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
        x += slice;
        if (i % OSC.rmsStride === 0) {
          const amp = (raw - 128) / 128;
          sumSquares += amp * amp;
          samples++;
        }
      }
      ctx.lineTo(w, h / 2);
      ctx.stroke();

      rmsRef.current?.(samples ? Math.sqrt(sumSquares / samples) : 0);
      rafRef.current = requestAnimationFrame(frame);
    };

    rafRef.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafRef.current);
  }, [playing, analysisRef]);

  return (
    <canvas
      ref={canvasRef}
      className="sekai-audio-oscilloscope"
      aria-hidden="true"
    />
  );
}

/* ============================================================
   AudioPlayer — the quiet one
   ============================================================ */

export interface AudioPlayerProps extends Omit<PropsOf<"div">, "onSeek"> {
  src: string;
  /** Shown before the timecode. */
  title?: string;
  preload?: "none" | "metadata" | "auto";
  /**
   * Needed for the waveform when `src` is cross-origin: without it
   * the analyser reads silence and the trace stays flat. Only set it
   * if the host actually sends CORS headers — otherwise playback
   * itself fails.
   */
  crossOrigin?: "anonymous" | "use-credentials";
}

/**
 * One DAW track embedded in a conversation, for a voice note or an
 * audio attachment. Takes the surrounding world's surface and accent.
 * For a shared listening moment, use `AudioDevice`.
 */
export function AudioPlayer({
  src,
  title,
  preload = "metadata",
  crossOrigin,
  className,
  ...rest
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const indicatorRef = useRef<HTMLSpanElement | null>(null);
  const lastPulse = useRef(0);
  const { ref: analysisRef, ensure } = useAnalysis(audioRef, OSC.fftSize);
  const { ref, playing, time, duration, toggle, seekToRatio } = useAudio(
    src,
    ensure,
  );
  useEffect(() => {
    audioRef.current = ref.current;
  });

  const pct = duration > 0 ? (time / duration) * 100 : 0;

  /* The LED pulses with measured loudness, not with a timer. Throttled
     to ~60fps because this writes to the DOM from inside a rAF loop. */
  const onRms = useCallback((rms: number) => {
    const el = indicatorRef.current;
    if (!el) return;
    const now = performance.now();
    if (now - lastPulse.current < 16 || rms <= 0.005) return;
    lastPulse.current = now;
    el.style.transform = `scale(${Math.min(1.5, 1 + rms * 1.5)})`;
    el.style.opacity = String(Math.min(1, 0.6 + rms * 2));
    el.style.boxShadow = `0 0 ${2 + rms * 15}px rgb(var(--sekai-signal))`;
  }, []);

  useEffect(() => {
    if (playing) return;
    const el = indicatorRef.current;
    if (el) el.style.cssText = "";
  }, [playing]);

  return (
    <div
      className={cx(
        "sekai-audio-player-simple",
        playing && "playing",
        className,
      )}
      {...rest}
    >
      <audio
        ref={(node) => {
          ref.current = node;
          audioRef.current = node;
        }}
        src={src}
        preload={preload}
        crossOrigin={crossOrigin}
      />
      <button
        type="button"
        className="sekai-audio-control"
        onClick={toggle}
        aria-label={playing ? "Pause" : "Play"}
      >
        <span className="sekai-audio-icon-span">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            {playing ? (
              <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
            ) : (
              <path d="M8 5v14l11-7z" />
            )}
          </svg>
        </span>
        <span
          ref={indicatorRef}
          className={cx("sekai-audio-indicator", playing && "active")}
        />
      </button>

      <div className="sekai-audio-content-simple">
        <div className="sekai-audio-info-row">
          <Oscilloscope
            analysisRef={analysisRef}
            playing={playing}
            onRms={onRms}
          />
          <span className="sekai-audio-time">
            {title ? `${title} · ` : ""}
            {clock(time)} / {clock(duration)}
          </span>
        </div>
        <div
          className="sekai-audio-progress-container"
          onClick={(e) => seekToRatio(ratioFromClick(e))}
          role="slider"
          tabIndex={0}
          aria-label="Seek"
          aria-valuenow={Math.round(pct)}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div className="sekai-audio-progress-bar">
            <div
              className="sekai-audio-progress-fill"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   AudioDevice — the foreign object
   ============================================================ */

const ICON = {
  play: "M8 5v14l11-7z",
  pause: "M6 5h4v14H6zM14 5h4v14h-4z",
  stop: "M6 6h12v12H6z",
  rw: "M11 18V6l-8.5 6 8.5 6zm.5-6l8.5 6V6l-8.5 6z",
  ff: "M13 6v12l8.5-6L13 6zM4 18l8.5-6L4 6v12z",
} as const;

export interface AudioDeviceProps extends PropsOf<"div"> {
  src: string;
  title?: string;
  artist?: string;
  preload?: "none" | "metadata" | "auto";
  crossOrigin?: "anonymous" | "use-credentials";
  /** Seconds the RW key jumps back. Podcast convention: 5. */
  rewindBy?: number;
  /** Seconds the FF key jumps forward. Podcast convention: 10. */
  forwardBy?: number;
}

/**
 * Walkman x DAW: a console fader, a black screen, and a column of
 * FOUR mechanical transport keys — play, stop, rewind, fast-forward.
 * It is modelled on a physical deck, so the key bank has to be
 * complete; a two-key transport reads as a web widget wearing a
 * chassis.
 *
 * This is the system's one piece of hardware. It ignores the world's
 * canvas and accent by design — the contrast is the point.
 */
export function AudioDevice({
  src,
  title = "UNTITLED",
  artist,
  preload = "metadata",
  crossOrigin,
  rewindBy = 5,
  forwardBy = 10,
  className,
  ...rest
}: AudioDeviceProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const barsRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef(0);
  const { ref: analysisRef, ensure } = useAnalysis(audioRef, DEVICE_FFT);
  const { ref, playing, time, duration, buffered, toggle, stop, nudge, seekToRatio } =
    useAudio(src, ensure);
  const [volume, setVolume] = useState(0.8);

  useEffect(() => {
    if (ref.current) ref.current.volume = volume;
  }, [volume, ref]);

  /* 32 bars driven by 32 frequency bins — one bar per band. */
  useEffect(() => {
    if (!playing) return;
    const frame = () => {
      const analysis = analysisRef.current;
      const host = barsRef.current;
      if (analysis && host) {
        const { analyser, data } = analysis;
        analyser.getByteFrequencyData(data);
        const children = host.children;
        for (let i = 0; i < children.length; i++) {
          const value = data[i] ?? 0;
          (children[i] as HTMLElement).style.height = `${Math.max(2, (value / 255) * 100)}%`;
        }
      }
      rafRef.current = requestAnimationFrame(frame);
    };
    rafRef.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafRef.current);
  }, [playing, analysisRef]);

  const pct = duration > 0 ? (time / duration) * 100 : 0;
  const bufPct = duration > 0 ? (buffered / duration) * 100 : 0;

  return (
    <div
      className={cx("sekai-audio-player", playing && "playing", className)}
      {...rest}
    >
      <audio
        ref={(node) => {
          ref.current = node;
          audioRef.current = node;
        }}
        src={src}
        preload={preload}
        crossOrigin={crossOrigin}
      />

      {/* 1. Console fader */}
      <div className="sekai-console-module">
        <div className="sekai-fader-scale" aria-hidden="true">
          {[0, 1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className={cx("sekai-fader-tick", i % 2 === 0 && "major")}
            />
          ))}
        </div>
        <div
          className="sekai-fader-track"
          onClick={(e) => {
            const box = e.currentTarget.getBoundingClientRect();
            setVolume(
              Math.max(0, Math.min(1, 1 - (e.clientY - box.top) / box.height)),
            );
          }}
          role="slider"
          tabIndex={0}
          aria-label="Volume"
          aria-valuenow={Math.round(volume * 100)}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="sekai-fader-cap"
            style={{ top: `${(1 - volume) * 100}%` }}
          />
        </div>
      </div>

      {/* 2. Screen */}
      <div className="sekai-audio-content">
        <div className="sekai-screen-meta">
          <div className="sekai-status-indicator">
            <span className={cx("sekai-led", playing && "active")} />
            <span className="sekai-status-text">
              {playing ? "PLAY" : "STOP"}
            </span>
          </div>
          <div className="sekai-track-info">
            <span className="sekai-track-title">{title}</span>
            {artist ? (
              <span className="sekai-track-artist">{artist}</span>
            ) : null}
          </div>
        </div>

        <div className="sekai-viz-area">
          <div className="sekai-tape-mechanism" aria-hidden="true">
            <span className="sekai-reel" />
            <span className="sekai-reel" />
          </div>
          <div
            ref={barsRef}
            className="sekai-audio-visualizer-bars sekai-viz--auto"
            aria-hidden="true"
          >
            {BAR_INDEX.map((i) => (
              <span
                key={i}
                className="sekai-viz-bar"
                style={{ ["--i" as string]: i }}
              />
            ))}
          </div>
        </div>

        <div
          className="sekai-tape-scrubber"
          onClick={(e) => seekToRatio(ratioFromClick(e))}
          role="slider"
          tabIndex={0}
          aria-label="Seek"
          aria-valuenow={Math.round(pct)}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div className="sekai-scrub-buffered" style={{ width: `${bufPct}%` }} />
          <div className="sekai-scrub-progress" style={{ width: `${pct}%` }} />
          <span className="sekai-scrub-time">
            {clock(time)} / {clock(duration)}
          </span>
        </div>
      </div>

      {/* 3. Transport — four keys, deck order: play, stop, rw, ff */}
      <div className="sekai-walkman-transport">
        <button
          type="button"
          className={cx("sekai-transport-btn", playing && "active")}
          onClick={toggle}
          aria-label={playing ? "Pause" : "Play"}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d={playing ? ICON.pause : ICON.play} />
          </svg>
        </button>
        <button
          type="button"
          className="sekai-transport-btn"
          onClick={stop}
          aria-label="Stop"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d={ICON.stop} />
          </svg>
        </button>
        <button
          type="button"
          className="sekai-transport-btn"
          onClick={() => nudge(-rewindBy)}
          aria-label={`Rewind ${rewindBy}s`}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d={ICON.rw} />
          </svg>
        </button>
        <button
          type="button"
          className="sekai-transport-btn"
          onClick={() => nudge(forwardBy)}
          aria-label={`Fast forward ${forwardBy}s`}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d={ICON.ff} />
          </svg>
        </button>
      </div>
    </div>
  );
}
