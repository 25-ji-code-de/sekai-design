/* SPDX-License-Identifier: Apache-2.0 */
/* SPDX-FileCopyrightText: 2026 The 25-ji-code-de Team */

/**
 * SEKAI Design System — React surface.
 *
 * These wrappers carry NO styles of their own. Every one of them
 * emits the same class names the CSS layer defines, which is why a
 * vanilla nightcord page and a React app render identically. Load
 * `@sekai/design/css` (or `dist/sekai-design.css`) alongside.
 *
 * Wrap your app in <SekaiRoot world="system" | "night"> — that class
 * is where the colour tokens get their values.
 */

export { cx } from "./types";
export type { World, Tone, BaseProps, PropsOf } from "./types";

export { SekaiRoot, useWorld } from "./World";
export type { SekaiRootProps } from "./World";

/* ---------- Primitives ---------- */
export { Button, IconButton, ButtonRow, ButtonGrid } from "./primitives/Button";
export type {
  ButtonProps,
  ButtonVariant,
  ButtonSize,
  IconButtonProps,
  ButtonRowProps,
} from "./primitives/Button";

export {
  Field,
  Input,
  Textarea,
  Checkbox,
  InputRow,
  Hint,
  InputShell,
  BareInput,
} from "./primitives/Field";
export type {
  FieldProps,
  InputProps,
  TextareaProps,
  CheckboxProps,
  InputShellProps,
} from "./primitives/Field";

export {
  Card,
  CardHeader,
  CardTitle,
  CardDesc,
  Well,
  WellRow,
  MetaList,
  Secret,
} from "./primitives/Card";
export type { CardProps, MetaListProps } from "./primitives/Card";

export {
  Badge,
  Chip,
  Signature,
  Rule,
  Led,
  FlowLine,
  Avatar,
  Presence,
} from "./primitives/Display";
export type {
  BadgeProps,
  ChipProps,
  RuleProps,
  LedProps,
  AvatarProps,
} from "./primitives/Display";

export {
  Alert,
  StatusPill,
  Toast,
  Spinner,
  Progress,
  Skeleton,
  EmptyState,
} from "./primitives/Feedback";
export type {
  AlertProps,
  AlertTone,
  StatusPillProps,
  ToastProps,
  ProgressProps,
} from "./primitives/Feedback";

export { Modal, OrDivider } from "./primitives/Modal";
export type { ModalProps } from "./primitives/Modal";

/* ---------- SEKAI content ---------- */
export {
  RichText,
  InlineCode,
  CodeBlock,
  Spoiler,
  Recover,
  Mention,
  InlineLink,
  ColoredText,
  Blockquote,
} from "./sekai/Text";
export type {
  CodeBlockProps,
  SpoilerProps,
  RecoverProps,
  MentionProps,
  MentionKind,
  ColoredTextProps,
} from "./sekai/Text";

export {
  FileCard,
  LinkCard,
  ReplyChip,
  ErrorPlaceholder,
} from "./sekai/Cards";
export type {
  FileCardProps,
  LinkCardProps,
  ReplyChipProps,
} from "./sekai/Cards";

export { ImageCard, Sticker } from "./sekai/Media";
export type { ImageCardProps, StickerProps } from "./sekai/Media";

export { AudioPlayer, AudioDevice } from "./sekai/Audio";
export type { AudioPlayerProps, AudioDeviceProps } from "./sekai/Audio";

/* ---------- Layout ---------- */
export {
  Shell,
  Sidebar,
  SidebarHeader,
  SidebarBody,
  Main,
  SectionLabel,
  Channel,
  RosterItem,
} from "./layout/Shell";
export type {
  SidebarProps,
  ChannelProps,
  RosterItemProps,
} from "./layout/Shell";

export {
  Bar,
  BarTitle,
  WindowDots,
  MessageList,
  Message,
  Composer,
  SuggestList,
  SuggestItem,
} from "./layout/Chat";
export type {
  MessageProps,
  SuggestListProps,
  SuggestItemProps,
} from "./layout/Chat";

export {
  AuthPage,
  AuthPanel,
  AuthLogo,
  AuthHeader,
  AuthTitle,
  AuthSubtitle,
  Entity,
  ConnectionVisual,
  ScopeList,
  ScopeItem,
  SecurityNote,
  PrivacyNote,
  AuthLink,
  CaptchaSlot,
} from "./layout/Auth";
export type {
  AuthPanelProps,
  AuthLogoProps,
  EntityProps,
  ConnectionVisualProps,
  ScopeItemProps,
} from "./layout/Auth";

export {
  Page,
  PageHeader,
  SettingsHeader,
  Profile,
  MetaRow,
  Readout,
  ReadoutRow,
  Footer,
  UriList,
} from "./layout/Page";
export type {
  PageHeaderProps,
  ProfileProps,
  MetaRowProps,
} from "./layout/Page";
