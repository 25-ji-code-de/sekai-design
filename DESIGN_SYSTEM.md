<!-- SPDX-License-Identifier: Apache-2.0 -->
<!-- SPDX-FileCopyrightText: 2026 The 25-ji-code-de Team -->

# SEKAI Design System

本设计系统由 nightcord 与 SEKAI Pass 的现有设计整理而成。本文说明各项规则的
设计依据；具体实现在 `tokens/`、`css/` 和 `react/` 中。

## 0. 设计方法

nightcord 与 SEKAI Pass 的视觉差异主要来自环境光和使用场景：

| | SEKAI Pass | nightcord |
|---|---|---|
| 画布 | `#0b0b0e` 近黑色，带 40px 网格 | `#50476a` 紫罗兰色 |
| 卡面 | `#17171c` 实色 | 低透明度玻璃渐变与模糊 |
| 主色 | `#a48cd6` | `#a78bfa` / `#7c6fac` |
| 描边 | 1px 实色 `#2a2a30` | 1px 低透明度白色 |
| 圆角 | 4 / 8 / 12 | 4 / 6 / 8 / 12 / 24 |
| 按钮 | 大写、1px 字距、700 字重 | 句首大写、600 字重 |

两者的表面取值不同，但对光照、层级、强调色和排版的处理方式一致。因此，本系统
采用一套语义令牌契约和两个 world，而不是把两种风格合并为一套折中配色。

### 0.1 先确定对象，再确定形式

SEKAI 的设计原则可以概括为：先确认一个元素代表什么，再使它的形式与含义一致。

推杆、机械键和指示灯本身已有明确的物理结构，界面只需如实表达。授权、权限、引用
和输入框等抽象概念则没有固定外形，需要先为它们选择操作方式相符的物理参照：

| 抽象概念 | 物理参照 |
|---|---|
| 一次授权 | 两个端子和一条通电的连接线 |
| 一组权限 | 面板中凹下的托盘 |
| 隐藏文字 | 覆盖在文字上的胶带 |
| 引用或提醒 | 技术手册页边的变更条 |
| 一段附件 | 浮在对话上方的玻璃片 |
| 输入框 | 面板中凹下的槽 |

物理参照确定后，元素的形态、光照、状态和交互应遵循同一结构。例如，音频播放装置
采用磁带走带机构后，就应有完整的 transport 键位、转盘、播放头和状态灯。

### 0.2 物理参照的判断标准

物理参照与抽象概念的操作应尽量一一对应：

- 如果物理参照提供了抽象概念并不存在的操作，界面会制造错误预期。例如，日历中的
  皮革缝线和翻页动画只具有装饰作用。
- 如果抽象概念需要的操作无法由物理参照表达，原有参照会限制功能。例如，完整的音频
  操作包括播放、停止、后退、快进、音量和定位，只提供两个 transport 键并不完整。

同样，语音适合显示时域波形，因为语音的包络有直接意义；音乐装置适合显示频谱，
因为各频段的能量分布可供观察。两者互换后，图形就不再对应实际数据用途。

### 0.3 身份色

缺少明确物理参照的元素，容易退回通用组件库的默认方案。nightcord 原有的八种身份色
中有七种直接使用 Tailwind 色值和类名，而系统其余部分没有类似情况。

这些颜色原本配白色首字母使用。`scripts/derive-identity-tints.mjs` 的计算结果显示，
其中六种组合的对比度低于 4.5:1，最差的一组只有 1.86:1。

身份色的合适参照是线缆色标或设备标签：鲜明的底色便于远距离区分，同色相的深色文字
保证可读性。当前八种身份色以 SEKAI 主色的色相为起点，按 45° 等距生成，并为每种
底色计算达到 4.5:1 对比度的同色相文字。身份色不随 world 改变，以免同一用户在不同
应用中出现不同颜色。

这也给出了一条实际规则：暂时找不到合适参照时，应继续检查元素的用途和操作方式，
不应直接用装饰弥补。

### 0.4 参照也需要维护

物理参照并非永久有效。数字对象可能增加原参照无法表达的操作。例如，磁带只能线性
走带，而数字音频还可以变速、转写和按内容检索。当功能集合发生变化时，应重新检查
原参照是否仍然适用。

发现操作缺口后，先检查是否可以把问题放到更合适的层级处理。隐藏文字采用胶带作为
参照，因此单条内容的 `.revealed` 状态不可逆。如果需要在有人靠近时重新隐藏内容，
不必让胶带支持不符合实物的开合操作，可以由容器 `.sekai-recover` / `<Recover>`
统一恢复遮挡。只有在调整层级后仍无法表达所需操作时，才需要更换物理参照。

参照较弱并不意味着组件必须重做。Toast 的物理参照并不突出，但现有形式没有产生
错误含义，也没有限制操作，因此没有修改的必要。

## 1. 四条生成规则

以下四条规则用于解释现有取值，也用于判断新组件应如何实现。抽象时应保留取值背后的
原因，而不是只整理一张数值对照表。

### 1.1 场景使用同一个左上方光源

SEKAI 不是在平面元素上任意添加阴影，而是在同一光照条件下表达表面的朝向和高度。
每个表面根据朝向呈现明暗，抬起的物体向右下投影，投影也可以落到相邻元素上。

| CSS | 表达的结构 |
|---|---|
| `linear-gradient(135deg / 145deg, 亮, 暗)` | 表面朝向左上方光源 |
| `inset 0 1px 0 rgb(255 255 255 / .08)` | 凸起按键的顶边受光 |
| 按下时使用 inset 阴影和 `translateY(1px)` | 按键从凸起变为凹下 |
| 熄灭的 indicator 使用 inset 阴影 | 指示灯位于孔内 |
| 点亮的 indicator 使用外发光 | 指示灯自身发光 |
| `inset 4px 0 8px -4px rgb(0 0 0 / .1)` | 播放键向相邻屏幕区域投影 |
| transport 的 active 状态使用 inset 阴影 | 机械键锁定在按下位置 |
| `.scope-list` 使用 inset 阴影 | 面板中凹下的托盘 |

阴影应根据物体尺寸和离开底面的距离选择，而不是根据业务重要性选择。32px 的回复键
投影面积很小，需要较深的短阴影才能与底面分离；嵌在消息流中的播放器只略微抬起，
使用较浅的阴影即可。

发丝线和阴影承担不同职责：

```text
共面  →  只有边
抬起  →  边 + 影
```

1px 发丝线表示物体边缘，阴影表示物体离开当前平面。抬起的物体仍然有边，因此二者
并不互斥。共面卡片不应添加阴影，否则会表达并不存在的高度。

| 边和阴影同时存在 | 只有边 |
|---|---|
| `.container` 主面板 | `.app-card` |
| `.name-chooser-content` 模态框 | `.sekai-file-card` |
| `.sekai-update-toast` | `.sekai-link-card` |
| `.sekai-code-block` | `.permission-box` / `.user-info` |
| 回复键、提及列表、播放器、spoiler | |

### 1.2 层级由相对明暗表示

表面本身没有绝对高度。相对所在平面，抬起的表面受光更多，颜色更亮；凹下的表面
受光更少，颜色更暗。

```text
nightcord   画布 #50476a
            侧栏 #3f355b          画布中的凹槽
            .channel #50476a      槽中的凸片
            .message-file #2b2633 更深的凹槽

Pass        画布 #0b0b0e
            .container #17171c    安装在画布上的面板
            input #111114         面板中的凹槽
```

同一个颜色值可以在不同底面上表达不同高度。`#2b2633` 位于近黑遮罩上方时比底面亮，
表现为抬起的模态框；位于 `#50476a` 画布上时比底面暗，表现为附件区域的凹槽。

因此，模态框遮罩不仅用于降低背景亮度，也重新设置了模态框的明暗参照。遮罩将画布
压暗后，模态框无需改变自身颜色便能呈现抬起状态。

`--sekai-surface-raised` 和 `--sekai-surface-sunken` 的名称包含绝对方向，与相对层级
原则并不完全一致。为避免破坏现有接口，当前暂不改名；使用时应将其理解为画布之外的
第二、第三层取值。相对层级机制的限制见 §10.1。

### 1.3 渐变角度表示不同职责

现有样式中的渐变角度有固定含义：

- 90deg 沿阅读方向展开，用于引导视线或表示进度，例如顶部 cap、身份按钮扫光、
  连接线中的数据包、进度条和 `auth-divider`。
- 100deg、135deg、145deg 和 180deg 用于描述表面朝向和受光方向。

新增渐变时，应先判断它用于引导还是用于描述表面，再选择相应角度。

强调色也用于引导，而不是大面积装饰。3px 顶栏标示主体面板，4px 左侧色带标示阅读
起点，播放头三角指向当前位置，`›` 指向外部目标，回复 chip 的色带与 `↩` 指向前文。

### 1.4 等宽字表示机壳丝印

等宽字体用于不可编辑的机壳丝印，无衬线字体用于设备屏幕中可变化的内容。

`SEKAI PASS // SYSTEM`、`EDITABLE DATA`、`STEREO`、字节数、时间码和 scope 的
`READ` 标记都属于丝印；昵称、消息正文和应用名属于屏幕内容。

禁用后的输入框切换为等宽字体也遵循这一区分。值不可编辑后，不再是可输入内容，
而成为固定铭牌。

## 2. 两个 world

`world-system` 源自 SEKAI Pass，`world-night` 源自 nightcord。二者声明相同的令牌
名称，仅取值不同。

```html
<html class="world-system">   <!-- Pass / hub / docs / 控制台 -->
<html class="world-night">    <!-- nightcord / 25ji / stickers -->
```

```tsx
<SekaiRoot world="night">…</SekaiRoot>
```

| 语义 | world-system | world-night |
|---|---|---|
| `--sekai-canvas` | `#0b0b0e` | `#50476a` |
| `--sekai-surface` | `#17171c` | `#3f355b` |
| `--sekai-surface-raised` | `#202025` | `#2b2633` |
| `--sekai-surface-sunken` | `#111114` | `#1e1b24` |
| `--sekai-line` | `#2a2a30` @ 1 | `#ffffff` @ .08 |
| `--sekai-divider` | `#2a2a30` @ 1 | `#2b2633` @ 1 |
| `--sekai-fg` | `#e2e2e6` | `#ffffff` |
| `--sekai-accent` | `#a48cd6` | `#a78bfa` |
| `--sekai-accent-deep` | `#594483` | `#7c6fac` |
| `--sekai-accent-fill` | `#a48cd6` | `#7c6fac` |
| `--sekai-fg-on-accent` | `#1a1a1e` | `#ffffff` |
| `--sekai-radius-control` | 4px | 6px |
| `--sekai-control-transform` | `uppercase` | `none` |

两个 world 的环境亮度不同，但层级方向一致。`world-system` 在近黑画布上使用较亮面板；
`world-night` 在紫罗兰画布中使用较暗的槽和井。相对底面，抬起仍然更亮，凹下仍然
更暗。

`accent` 与 `accent-deep` 不是同一颜色的两个等级。`accent` 用于焦点环、图标和悬停
等交互状态；`accent-deep` 用于左侧色带和顶部渐变条等结构标记。

`accent-fill` 和 `fg-on-accent` 分开定义，是因为两个 world 的主色亮度不同。
SEKAI Pass 使用 `#a48cd6` 填充和深色文字；nightcord 使用 `#7c6fac` 填充和白色文字。

语义色（danger、success、warning、info、signal）在两个 world 中保持一致。danger
最终采用 SEKAI Pass 的 `#e57373`，与 `#81c784` success 配合；nightcord 中的
`#ed4245` 为 Discord 遗留色。

## 3. 颜色规则

调色板令牌只存储以空格分隔的 RGB 三元组，并通过 `rgb(var(--x) / alpha)` 使用。
不要为同一颜色再建立 hex 形式的变量。

```css
/* 错误 */ color: var(--sekai-accent);
/* 正确 */ color: rgb(var(--sekai-accent));
/* 正确 */ background: rgb(var(--sekai-accent) / 0.15);
```

sekai-pass 的 `CSS_REFACTOR_PLAN.md` 曾记录 `--error-color` 在 `styles.css` 中使用
`229 115 115`，在 `html.ts` 中使用 `#e57373`，导致服务端与客户端样式漂移。
只保留一种表示方式可以避免同类问题。

配套约定如下：

- `--sekai-*-a` 存储角色在当前 world 中的默认透明度，例如 `line`、`divider` 和
  `scrim`。
- `--sekai-tint-*` 存储跨 world 不变的完整颜色值，例如
  `--sekai-tint-hover: rgb(255 255 255 / .05)`。
- `--sekai-hairline` 和 `--sekai-hairline-divider` 提供常用的 1px 边线简写，减少
  重复声明造成的差异。

`npm run validate` 会检查所有 `var(--sekai-*)` 引用是否有声明，以及两个 world
声明的令牌集合是否一致。

## 4. 排版

| | 无衬线（屏幕内容） | 等宽（机壳丝印） |
|---|---|---|
| 内容 | 正文、标题、按钮文字、说明 | 标签、ID、字节数、时间码、状态、代码、签名 |
| 大小写 | 句首大写 | 大写 |
| 字距 | 正常 | `0.5px` / `1px` / `2px` |
| 颜色 | `--sekai-fg` | `--sekai-fg-muted` |

常用类：

- `.sekai-sig`：10px，用于 `SEKAI PASS // SYSTEM`、`STEREO`、`READ` 等小型丝印；
- `.sekai-label` / `.sekai-field__label`：12px 表单标签；
- `.sekai-meta dt` / `.sekai-meta-row__key`：键值表中的键。

字号取自两套源设计：

```text
micro 10  meta 11  label 12  sm 13  md 14  lg 15  xl 18  2xl 20  3xl 24  4xl 32
```

`md` 用于 SEKAI Pass 正文，`lg` 用于 nightcord 消息正文。聊天内容需要稍大的字号，
因此两档都保留。

## 5. 高度与描边

阴影令牌描述物体尺寸及其离开底面的距离：

```css
--sekai-elev-1: 0 2px 4px  rgb(0 0 0 / .2);   /* 小型卡片 */
--sekai-elev-2: 0 4px 12px rgb(0 0 0 / .2);   /* 代码块、悬停状态 */
--sekai-elev-3: 0 8px 24px rgb(0 0 0 / .3);   /* entity 头像 */
--sekai-elev-4: 0 20px 60px rgb(0 0 0 / .5);  /* Pass 主面板 */
--sekai-elev-modal: 0 25px 50px -12px rgb(0 0 0 / .5);
```

### 5.1 阶梯是默认值，不是强制取值

nightcord 使用六种浅阴影：`0 2px 4px` 有 .1、.2、.3 三档，`0 4px 12px` 有 .15、
.2 两档，另有 `0 4px 8px / .4`。这些差异与元素尺寸有关，不应全部就近调整到统一
阶梯。

| 位置 | 值 | 原因 |
|---|---|---|
| `.sekai-auth` padding | `42px` | 保留 Pass 主面板的原始间距 |
| `.sekai-audio-player-simple` | `0 2px 4px /.1`、`0 4px 12px /.15` | 播放器嵌在消息流中，只需轻微抬起 |
| `.sekai-message__action` | `0 2px 4px /.3`、`0 4px 8px /.4` | 32px 小面积需要更紧、更深的阴影 |
| `.sekai-audio-progress-fill::after` | `0 2px 4px /.3` | 12px 圆点需要与轨道分离 |

新增例外时，应说明具体原因；没有尺寸或结构依据的取值应使用默认阶梯。

描边分为三个职责：

- `--sekai-line`：卡片、输入框和 chip 的边线；
- `--sekai-line-strong`：悬停等强调状态下的边线；
- `--sekai-divider`：顶部栏底边、侧栏边缘等布局分隔线。

`world-system` 的 `line` 与 `divider` 使用同一灰色；`world-night` 的 `line` 使用低透明度
白色，`divider` 使用深紫实色。合并两者会使其中一个 world 的结构失真。

## 6. 动效

```text
instant .1s   fast .15s   base .2s   slow .3s   slower .4s
ease          cubic-bezier(.4, 0, .2, 1)
ease-out      cubic-bezier(.2, .8, .2, 1)     nightcord 默认
ease-spring   cubic-bezier(.16, 1, .3, 1)     入场
```

统一的悬停动作是边框提亮并 `translateY(-1px)`，按下时回到原位。该动作由
`.sekai-lift` 提供。

动画只用于强化已有信息，不应成为唯一的信息载体。因此，`base.css` 在
`prefers-reduced-motion` 下关闭这些动画。除模态框 logo 的 6 秒浮动外，不应增加
无需用户操作便持续运行的动画。

## 7. 标志性样式

这些样式用于保持 SEKAI 的视觉特征。新增装饰前，应先检查是否已有合适的样式。

| 类 | 来源 | 用途 | 限制 |
|---|---|---|---|
| `.sekai-cap` | Pass 主面板 | 3px 主色渐变顶边 | 每个页面主体只使用一次 |
| `.sekai-grid` | Pass body | 40px 低透明度网格 | 只用于页面背景 |
| `.sekai-sig` | Pass `// SYSTEM` | 最小号机壳丝印 | — |
| `.sekai-rule[data-label]` | Pass `EDITABLE DATA` | 带等宽标签的分隔线 | `--sekai-rule-bg` 应与承载面一致 |
| `.sekai-strip` | nightcord 代码块与引用 | 3px 左侧变更条 | 用于标记无需阅读全文即可定位的内容 |
| `.sekai-glass` | nightcord 文件卡 | 低透明度渐变、模糊和发丝线 | 保持较低透明度 |
| `.sekai-lift` | 两边通用 | 统一的悬停抬起动作 | — |
| `.sekai-sheen` | nightcord Pass 登录键 | 悬停时的斜向高光 | 每页只用于一个身份操作 |
| `.sekai-led` | walkman transport | 6px 状态灯 | signal 橙仅在点亮状态填充 |
| `.sekai-flow` | Pass 授权页连接线 | 连接线中的主色数据包 | 只描述实体关系 |

### 7.1 音频装置

`.sekai-audio-player`（walkman × DAW）是一台放置在界面中的独立设备。它不使用
world 的画布阶梯和主色，也不随周围组件调整圆角。设备所需颜色由
`--sekai-device-*` 和 `--sekai-signal` 提供，因此在两个 world 中保持一致。

`.sekai-audio-player-simple` 属于当前 world，使用其 surface 与 accent，只保留硬件
设备中的 signal LED。

- 共同聆听音乐时使用 `AudioDevice`；
- 语音或一般音频附件使用 `AudioPlayer`。

两种播放器显示不同数据：

| | `AudioDevice` | `AudioPlayer` |
|---|---|---|
| 用途 | 音乐 | 语音或一般音频 |
| 可视化 | 32 段频谱柱 | 时域示波器 |
| 数据 | `getByteFrequencyData` | `getByteTimeDomainData` |
| fftSize | 64，得到 32 个 bin | 2048 |

`AudioDevice` 的 32 根柱子与 `frequencyBinCount` 一一对应。修改柱子数量时必须同步
修改 fftSize。

示波器每帧使用 `--sekai-surface-card-live` 的 25% alpha 覆盖上一帧，以保留短暂
拖影。LED 的缩放、透明度和光晕由每帧 RMS 数据驱动。无法获得信号时，示波器保持
静止中线，不使用与真实数据无关的动画。

transport 包含 `play / stop / rw(-5s) / ff(+10s)` 四个键，以保留实体 deck 的完整
操作。简单播放器另有 `--sekai-surface-card` 和 `--sekai-surface-card-live` 两档颜色，
对应 nightcord 的 `#2f273f → #352e46`。这组变化表示播放状态，不应替换为表示悬停的
`surface-hover`。

简单播放器的阴影使用 `.1` 和 `.15`，约为 `elev-1`、`elev-2` 的一半，因为它位于
消息流内而不是浮层。progress 手柄同时响应 4px 轨道和 12px 交互容器的悬停，避免
在可拖动区域内仍保持隐藏。

## 8. Signal 橙

`--sekai-signal` 的值为 `#ff5500`，只表示设备或参与者处于活动状态：

1. transport 键的锁定状态；
2. 点亮的 LED 或指示灯；
3. `@AI` mention，即消息流中非人类参与者。

signal 橙不用于普通强调、警告或装饰，因此 `sekai-alert` 没有 signal 变体。

## 9. 组件接口

CSS 类名是主要接口，React 组件只生成对应类名。

### 基础组件

`Button`（primary / secondary / ghost / danger / danger-outline / identity ×
sm / md / lg × block）· `IconButton` · `ButtonRow` · `ButtonGrid` ·
`Field` · `Input` · `Textarea` · `Checkbox` · `InputRow` · `Hint` ·
`InputShell` · `BareInput` · `Card` · `CardHeader/Title/Desc` · `Well` ·
`WellRow` · `MetaList` · `Secret` · `Badge` · `Chip` · `Alert` ·
`StatusPill` · `Toast` · `Spinner` · `Progress` · `Skeleton` ·
`EmptyState` · `Avatar` · `Presence` · `Modal` · `OrDivider` ·
`Signature` · `Rule` · `Led` · `FlowLine`

### SEKAI 内容组件

`RichText` · `InlineCode` · `CodeBlock` · `Spoiler` · `Recover` · `Mention` ·
`InlineLink` · `ColoredText` · `Blockquote` · `FileCard` · `LinkCard` ·
`ReplyChip` · `ErrorPlaceholder` · `ImageCard` · `Sticker` ·
`AudioPlayer` · `AudioDevice`

### 布局组件

`Shell` · `Sidebar` · `SidebarHeader/Body` · `Main` · `SectionLabel` ·
`Channel` · `RosterItem` · `Bar` · `BarTitle` · `WindowDots` ·
`MessageList` · `Message` · `Composer` · `SuggestList` · `SuggestItem` ·
`AuthPage` · `AuthPanel` · `AuthLogo` · `AuthHeader/Title/Subtitle` ·
`Entity` · `ConnectionVisual` · `ScopeList` · `ScopeItem` ·
`SecurityNote` · `PrivacyNote` · `AuthLink` · `CaptchaSlot` · `Page` ·
`PageHeader` · `SettingsHeader` · `Profile` · `MetaRow` · `Readout` ·
`ReadoutRow` · `Footer` · `UriList`

### nightcord 兼容性

`css/sekai/*` 中的类名与 nightcord `sekai-renderer.js` 输出的 81 个实际类名一致。
因此，nightcord 接入时可以删除重复 CSS，而不需要修改渲染器。

渲染器会为示波器 canvas 输出 `sekai-audio-oscilloscope`，但 nightcord 原样式中没有
对应规则，导致 canvas 保留 inline 基线空隙。本系统已补充该样式。

状态类继续兼容 nightcord 的 `.active`、`.playing`、`.revealed` 和 `.loading`，同时
接受 `.is-*` 形式。

## 10. 使用约束与校验

- 颜色令牌必须通过 `rgb(var(--sekai-x) / alpha)` 使用。
- 标签使用丝印排版，可变化的值使用屏幕内容排版。
- signal 橙只能表示活动状态。
- 每页主体最多使用一个 `.sekai-cap` 和一个 `.sekai-sheen`。
- 音频装置保持独立硬件外观，不随 world 调整。
- 组件 CSS 只能引用语义令牌，不得直接引用 world 文件或写入调色板 hex 值。
- 用户输入内容（应用名、回调地址、bio）应使用 `overflow-wrap: anywhere`。
- 异步内容应预留固定高度，例如 `.sekai-captcha-slot`、`.sekai-status` 和
  `.sekai-image-container.loading`，以避免加载时产生布局跳动。
- 按钮默认保持自动宽度；需要占满容器时显式使用 `--block`。

```bash
npm run validate     # 检查令牌引用和两个 world 的契约一致性
npm run type-check   # 检查 React 层类型
npm run build        # 构建 dist 和类型声明
```

`validate` 检查两类问题：

1. 悬空令牌：拼写错误的 `var(--sekai-*)` 会在浏览器中静默失效；
2. world 失配：只在一个 world 中声明的令牌会使另一个 world 回退到 `:root` 默认值。

### 10.1 相对层级的实现限制

当前令牌保存的是根据各自画布预先计算的固定颜色。该方式可读、可校验，但令牌名称
不应暗示绝对方向，嵌套层级也需要人工计算。

理想的相对写法会让每一层只声明相对当前平面的明暗差：

```css
.sekai-raise {
  --sekai-plane: color-mix(in oklab, var(--sekai-plane), white 6%);
  background: var(--sekai-plane);
}
```

同一元素中的 CSS 自定义属性自引用会形成循环，并在 computed-value 阶段失效。
规避循环需要增加承载元素，或在层级间交替使用两个属性名；前者增加无语义结构，后者
增加接口复杂度。`color-mix` 还会返回完整颜色，不能继续使用 RGB 三元组契约。

因此，当前继续使用预计算值。后续若修改这一机制，需要同时处理令牌命名、嵌套结构和
颜色表示方式。

## 许可

本包使用 Apache-2.0。nightcord 使用 AGPL-3.0-only，SEKAI Pass 使用 Apache-2.0；
两者版权均属于 The 25-ji-code-de Team。Apache-2.0 便于 Pass、gateway 等同许可项目
直接引用本包。
