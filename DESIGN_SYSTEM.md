<!-- SPDX-License-Identifier: Apache-2.0 -->
<!-- SPDX-FileCopyrightText: 2026 The 25-ji-code-de Team -->

# SEKAI Design System

从 **nightcord** 和 **SEKAI Pass** 两套设计中抽象出来的统一视觉语言。

这份文档是规范本身 —— 它解释了为什么每条规则存在。实现在 `tokens/` 和
`css/`，React 封装在 `react/`。

---

## 0. 出发点：两套设计其实是同一套语言的两个深度

把两份样式表并排读，差异是显性的：

| | SEKAI Pass | nightcord |
|---|---|---|
| 画布 | `#0b0b0e` 近黑 + 40px 网格 | `#50476a` 紫罗兰 |
| 卡面 | `#17171c` 实色 | `rgba(w,.06→.02)` 玻璃渐变 + blur |
| 主色 | `#a48cd6` | `#a78bfa` / `#7c6fac` |
| 描边 | 1px 实色 `#2a2a30` | 1px `rgba(255,255,255,.08)` |
| 圆角 | 4 / 8 / 12 | 4 / 6 / 8 / 12 / 24 |
| 按钮 | 大写 + 1px 字距 + 700 | 句首大写 + 600 |

但那些差异只是**环境光不同**。底下是同一套东西。

## 原则零：设计动作是选一次同构，此后没有决定

总纲：

> **先认清它是什么，然后不撒谎。**

这条只在东西有物理本性的时候直接成立。deck 是 deck，推杆是推杆，灯是灯 ——
没得选，只有服从。但界面里绝大部分东西不是这样：一次 OAuth 授权是什么？
一条权限 scope 是什么？一条消息、一个错误、一个人的身份色是什么？这些没有
物理原型。

但 SEKAI 显然对它们说了话。看它实际做了什么：

| 抽象物 | 被当作 |
|---|---|
| 一次授权 | 两个端子 + 一根通电的线 |
| 一组权限 | 面板上凿出来的托盘 |
| 黑幕 | 贴在字上的一条胶带 |
| 引用 | 手册页边的变更条 |
| 一段附件 | 浮在对话上方的一片玻璃 |
| 输入框 | 面板上凿的井 |

**真正的方法是：**

> **找到一个物理对象，它的可供性与这个抽象物的操作一一对应；
> 然后忠实于那个物理对象。**

设计动作**只发生一次**，就是选这个同构。选完之后，形态、光照、状态、
交互全部被那个物理对象决定，一个都不用再想 —— 这就是「本就应该如此」的机制。
walkman 之所以让人觉得压根没做过决定，不是因为没决定，是因为
「放音频 ↔ 磁带走带机构」这个映射太完美，**决定本身变得看不见了**。

### 判据：双射

同构好不好，可以判：

- **物理物提供了抽象物没有的操作 → 媚俗。**
  皮革缝线的日历、会翻页动画的设置面板。用户会去够一个不存在的功能。
- **抽象物有操作而物理物给不了 → 牢笼。**
  被自己的比喻卡住，只能硬塞一个不属于这个隐喻的东西进去。

transport 只给两个键，就是后一种：脑子里的「它」是**「一个播放器控件」
（2 个操作）**，而不是**「音频」（播放/停止/退/进/音量/定位）**。
隐喻没错，对事物的模型贫乏。缺可供性 = 牢笼。

示波器 vs 频谱柱不是审美之争：语音的操作里没有「分析频段配比」这一项，
给它频谱就是媚俗；音乐有，给它波形就是牢笼。

### 它有预测力

如果这条成立，那么：**凡是没找到强同构的地方，设计会退化成手边最近的通用方案。**

nightcord 里唯一直接搬了外部框架调色板的地方，是**身份色**——
`.bg-pink-500` / `.bg-purple-400` / `.bg-teal-400`，连类名带色值原样来自
Tailwind。八个里七个是 Tailwind 的，只有 `.bg-default #9a559b` 是自己的。
其余每一处 —— 推杆、灯、胶带、托盘、变更条、走带、丝印 —— 都没有这个现象。

而且它带着一个可测的后果：Tailwind 那几档是**给深色字当背景**设计的，
nightcord 在上面放白色首字母。实测（`scripts/derive-identity-tints.mjs`）
八个里**六个达不到 4.5:1**，最差 teal 上的白字 **1.86:1**。

### 「没有同构」不是事实，只是还没找到

身份色看起来没有物理原型。再想一层：一个人的颜色，物理上就是**彩色标签牌**
（线缆色标、设备铭牌、电阻色环）。标签牌的物理真相是：**鲜亮的底 + 同色相的
深色印字** —— 因为那样才能隔着距离一眼认出来，而「隔着距离一眼认出来」
正是身份色唯一的功能。

同构一旦找到，答案就被决定了。把底压暗迁就白字能读，但杀死了它唯一的功能。

> **「没有同构」从来不是事实，只是还没找到。
> 找不到，它就退化成通用；找到了，它就变回必然。**
>
> 找不到同构的时候，正确的动作是**继续找**，不是开始发明。

### 它同时是一台意义查询机

不知道某个元素**该是什么意思**的时候，问它的物理原型。

`.sekai-strip` 如果从用法归纳成「引用/派生的块」，只覆盖 6 处用法里的 3 处 ——
「出错」和「被点名」不是从任何东西派生的。换成问物理：一条印在左页边的竖线
是什么？是**技术手册的变更条**。它的职责是「让这个块不用读就能被扫到」。
六处用法当场全覆盖，而且顺带解释了为什么**只能在左边**：左侧是眼睛每换一行
都会回到的那一列，扫它不花钱。

### 它也能查出系统的自相矛盾

skeleton 如果用扫光动画，就与示波器那里的规矩冲突：
**取不到信号就保持静止的中线，绝不发明测不到的动作。** 扫光正是那种发明 ——
用运动暗示一个它一无所知的进度。

问物理：等待内容到达的那个位置是什么？是**机柜上空着的槽位**。凹进去、成形、
一动不动，一看就知道是留给一个模块的。
（如果同时还要说「系统在忙」，那是另一句话，有它自己的词汇：LED、
`.sekai-status--working`。一个元素不该同时说两句。）

### 忠实的代价：每一个同构最终都会变成牢笼

原则零说「选一次同构，然后忠实于它」。**但忠实是双向的 —— 继承的不只是
可供性，还有局限。**

磁带机只能线性走带。音频作为数据可以变速、可以转写、可以搜索、可以按内容跳。
物理对象是**冻结的**，而抽象物**会长出新操作**。所以：

> **每一个同构最终都会变成牢笼。不是因为当初选错了，是因为时间。**

皮革缝线的日历不是一开始就错的。日历还是纸的时候它是对的；它是在**操作集合
分岔之后**才变错的。所以「拟物过时了」是个误诊 —— 过时的不是拟物，
是**没有人给隐喻设过复检**。

**报警信号是结构性的，不是审美性的：**
当要给一个元素加一个**它的物理原型没有**的可供性时。
「看着有点旧了」是品味，不算；「这个隐喻表达不了它现在有的操作」才算。

#### 但报警响了，第一反应不是弃用隐喻，是把隐喻问深一层

**黑幕 = 贴在字上的胶带。** 胶带撕了贴不回去，所以 `.revealed` 不可逆。
但「内容警告」这个抽象物**有**「再遮回去」这个操作 —— 有人从身后走过来，
风险回来了。隐喻的忠实正在花掉事物真实拥有的一个操作。**这是牢笼，报警成立。**

浅的应对是弃用胶带（换成可开合的盖板），或者干脆给它加个 toggle —— 加 toggle
就是给实物添它没有的可供性，媚俗。

深一层的问法是：**物理上会怎么办？**
不会把同一张胶带贴回去。会**把整个东西重新盖上** —— 合上文件夹、盖上盖子。

于是这个操作根本不在单张胶带上，**它在容器上**（`.sekai-recover` / `<Recover>`）。
而且这恰好是更好的交互：真需要它的那个场景里，要的是「**全部立刻遮住**」，
不是一张张去找。

隐喻不但没死，还给出了一个比 toggle 更好的答案。

#### 什么时候才真该换

**只有当「问深一层」也答不出来的时候。** 那说明操作集合已经和物理原型
根本分岔，此时换掉的是这一个隐喻，不是原则 —— 换的是同构，方法照旧：
重新找一个可供性能对上的实物。

> **隐喻要定期复检。报警信号是可供性缺口。
> 应对顺序是「先问深一层，答不出才换」。**

### 反过来的约束：没有缺陷就不要动

同构薄不等于有缺陷。

Toast 就是这样：它的物理原型很弱（要硬找，是控制室的**信号盘** —— 灯亮、
确认、熄灭）。但它现在的样子是 nightcord 自己的，不是通用件，而且**指不出任何
一处在撒谎**。那就不动。

「发现」的另一面是**克制**：找不到缺陷就去改，那不是发现，那是发明；
而发明恰恰是这套哲学禁止的那个动作。

---

## SEKAI 现代拟物 —— 四条生成性原则

这一节是整份文档的地基。下面所有 token、组件、装置都是这四条的**推论**；
反过来，任何这四条推不出来的决定都是错的，不管它看起来多顺眼。

> **不要从取值抽象，要从理由抽象。** 从值抽象得到对照表；从理由抽象才得到
> 设计系统。对照表能复刻已有的东西，推不出下一个组件。

### 原则一：场景里有一个恒定光源，在左上偏上

**这不是「扁平 + 阴影」。这是一个统一打光的三维场景。** 每个表面按它的朝向
决定明暗，每个抬起的物体向右下投影 —— 包括**投到别的元素身上**。

源文件里的证据，逐条可查：

| CSS | 物理含义 |
|---|---|
| `linear-gradient(135deg / 145deg, 亮, 暗)` | 面朝左上，受光 |
| `inset 0 1px 0 rgb(255 255 255 / .08)` | 凸起键的**顶边棱受光** |
| `:active` → `inset 0 2px 4px rgb(0 0 0 / .2)` + `translateY(1px)` | 按下去了：顶边转为**背光**，面变凹 |
| indicator 熄灭 `inset 0 1px 2px rgb(0 0 0 / .3)` | 灯**沉在孔里**，没通电 |
| indicator 亮起 `0 0 6px` 外扩 | 它**自己在发光**，不是被照亮 |
| `inset 4px 0 8px -4px rgb(0 0 0 / .1)` | **播放键把影子投到了旁边的屏幕区上** |
| `.sekai-transport-btn.active` `inset 0 2px 4px` | 机械键**咔哒锁定在按下位** |
| `.scope-list` `inset 0 2px 4px` | 面板上**凿出来的托盘**，顶沿背光 |

最后几条是关键。**跨元素投影**（播放键→屏幕区）自称 flat design 的系统不会做；
做了就说明作者脑子里是一个场景，不是一张阴影表。

**推论一：阴影按尺寸挑，不按重要性挑。**
它是「这个物体多大、离底面多高」的函数。32px 的回复键几乎没有面积可投影，
需要 `.3` 才看得出离地；嵌在消息流里的播放器只抬起一点点，`.1` 就够，给 `.2`
它就飘起来了。两个重要性相同但尺寸不同的元素，阴影**必须**不同。

**推论二：发丝线和阴影各自有确切含义。**

> **1px 发丝线 = 物体的边。它一直都在。**
> **阴影 = 这个物体离开了它所在的平面。只有真离开了才加。**

于是不是二选一，是**单向蕴含**：

```
共面  →  只有边
抬起  →  边 + 影      （抬起来的东西当然还有边）
```

源文件里零例外：

| 边 + 影（真的抬起来了） | 只有边（与所在平面共面） |
|---|---|
| `.container` 主面板（装在仪器面上） | `.app-card` |
| `.name-chooser-content` 模态（浮在遮罩上） | `.sekai-file-card` |
| `.sekai-update-toast` 吐司 | `.sekai-link-card` |
| `.sekai-code-block`（"lift it from chat background"） | `.permission-box` / `.user-info` |
| `.message-reply-btn`、`.mention-list`、两台播放器、`.sekai-spoiler` | |

**给一张共面的卡片加阴影，等于让它宣称一个它没有的高度。**
通用暗色模式天天这么干（"卡片就该有阴影"），这两套设计一次都没干过。

### 原则二：层级是物理平面，不是亮度阶梯

规则只有一句：**相对它所在的那一层** —— 抬起 = 受光多 = 更亮；凹陷 = 受光少 =
更暗。

两个 world 遵守的是**同一条**规则：

```
nightcord   画布 #50476a  ← 桌面
            侧栏 #3f355b  ← 挖出来的槽（更暗）
            .channel #50476a ← 槽里放着的凸片（回到桌面高度）
            .message-file #2b2633 ← 更深的井
Pass        画布 #0b0b0e  ← 暗室里的仪器面
            .container #17171c ← 装在面上的面板，抬起受光（更亮）
            input #111114 ← 面板上凿的井（更暗）
```

两个 world 差在环境光的绝对值，不在方向。

#### 只有差是物理的

一个面**没有绝对高度**。说不出某个位置的势能是多少，只能说出两点之间差多少
—— 面也一样。`#2b2633` 不是「抬起的面」，也不是「凹陷的面」，它就是个值：

- 压在遮罩上（被压到近黑），它**比底下亮** → 抬起。模态。
- 压在 `#50476a` 画布上，它**比底下暗** → 凹陷。附件井。

**同一个数，两个参照系，两个读数同时成立，都不错。**

这条有一个很硬的后果 ——

**遮罩是在重设零点，不是在压暗气氛。**
`rgba(20, 20, 25, 0.92)` 把画布压到近黑，于是 `#2b2633` **不用改自己的颜色**
就成了抬起的。撤掉遮罩，同样这个值立刻变回一口井。
**是遮罩让模态浮起来的，不是模态的颜色。** 它是承重结构，不是氛围。

同理，为什么 `.sekai-channel` 用的是画布色 `#50476a`：它躺在比它暗的侧栏槽里，
所以是凸片。同一个值在画布上就什么都不是 —— 因为差为零。

> **命名说明。** `--sekai-surface-raised` / `--sekai-surface-sunken` 这两个
> 名字把方向写死了，那是绝对性声明，和上面这条直接矛盾。值没错，名字在说谎。
> 短期照旧，读的时候请当成「离画布第二层 / 第三层」，别当成方向。见 §10.1。

### 原则三：渐变角度编码职责，从不混用

源文件里 **零例外**：

- **90deg（沿阅读轴）= 引导。** 顶部 cap、identity 键的扫光、连接线上跑的
  数据包、进度条填充、`auth-divider` 的两侧淡出。
  它们都在**指路或表示进展**。
- **100 / 135 / 145 / 180deg = 拟物。** 描述一个面朝哪、哪边受光。

**加渐变之前先回答：它是在指路，还是在描述一个面？**角度由答案决定，不由好看决定。

同理，强调色是**路标不是装饰**：3px 顶栏说「这块面板是主体」，4px 左脊说
「这段内容来自别处，从这里开始读」，播放头三角**指着「现在」**，`›` 指向外部，
回复 chip 的脊 + `↩` 指向后方。每一处主色都在回答「往哪看 / 往哪走」。

### 原则四：等宽字是丝印

**等宽 = 印在机壳上的丝印字；无衬线 = 设备屏幕里显示的内容。**

`SEKAI PASS // SYSTEM`、`EDITABLE DATA`、`STEREO`、字节数、时间码、scope 的
`READ` 标 —— 全是**厂家印上去的**，改不了。用户的昵称、消息正文、应用名 ——
是**设备显示出来的**，会变。

这条额外解释了一件事：**为什么 disabled 的输入框要切换成等宽**
（`css/components/field.css`）。值一旦不可编辑，它就从"屏幕内容"变成了
"印上去的铭牌"。这不是随手加的效果，是同一条原则。

---

统一的答案不是二选一，而是：**一套 token 契约 + 两个 world** —— 同一个场景，
两种环境光。

---

## 1. 两个 world

`world-system`（Pass 血统）和 `world-night`（nightcord 血统）**声明完全相同的
token 名字**，只是值不同。切换一个 class 就换皮。

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
| `--sekai-fg-on-accent` | `#1a1a1e`（深字） | `#ffffff`（白字） |
| `--sekai-radius-control` | 4px | 6px |
| `--sekai-control-transform` | `uppercase` | `none` |

三个值得单独说的设计决定：

**两个 world 差在环境光，不在方向。** world-system 的画布是近黑，抬起的面
更亮（`#0b0b0e → #17171c → #202025`）；world-night 的画布是紫罗兰，挖槽与
井更深（`#50476a → #3f355b → #2b2633`）。相对所在层，抬起永远更亮、凹陷永远
更暗 —— 原则二在两边同样成立。

**`accent` 和 `accent-deep` 是两个角色，不是深浅两档。** `accent` 是亮的、交互
用的（focus ring、图标、hover）；`accent-deep` 是结构用的（左侧色带、顶部渐变
条）。两个 world 原本就各自有这一对，只是没命名。

**`accent-fill` / `fg-on-accent` 分开，是因为两个 world 的主色亮度不同。**
Pass 的 `#a48cd6` 够亮，配深色字（它自己的 `--button-color: #1a1a1e`）；
nightcord 的填充用更深的 `#7c6fac` 配白字（它自己的 `.sekai-update-btn`）。
两边都是自己原来的按钮，不是折中。

**语义色跨 world 完全相同**（danger / success / warning / info / signal）。
一个系统如果 danger 会随主题变色相，那它就是两个系统。

> nightcord 原本有三个 error 值（`#ed4245`、`#ff6b6b`、`#e57373` in Pass）。
> 统一取了 Pass 的 `#e57373` —— 最克制，也和 `#81c784` success 成对。
> `#ed4245` 是 Discord 遗留色。

---

## 2. 颜色规则（一条，无例外）

**调色板 token 存 RGB 三元组，永远用 `rgb(var(--x) / a)` 消费。没有 hex 双胞胎。**

```css
/* ✗ */  color: var(--sekai-accent);
/* ✓ */  color: rgb(var(--sekai-accent));
/* ✓ */  background: rgb(var(--sekai-accent) / 0.15);
```

这不是风格洁癖。sekai-pass 自己的 `CSS_REFACTOR_PLAN.md` 第一条严重问题就是
`--error-color` 在 `styles.css` 里是 `229 115 115`、在 `html.ts` 里是 `#e57373`,
「服务端渲染和客户端渲染样式不一致」。**一种拼写不可能漂移。**

两个配套约定：

- `--sekai-*-a` —— 裸数字，该 world 对该角色的默认 alpha（`line`、`divider`、
  `scrim`）。因为 world-night 的发丝线是白色低透明度，world-system 的是实色灰。
- `--sekai-tint-*` —— **完整颜色值**，直接用。跨 world 不变的中性叠加层
  （`--sekai-tint-hover` = `rgb(255 255 255 / .05)`）。
- `--sekai-hairline` / `--sekai-hairline-divider` —— 现成的 `1px solid rgb(...)`
  简写。全系统用了约 50 次，每次手写都是一次漂移机会。

`npm run validate` 会检查所有 `var(--sekai-*)` 引用都有声明，且两个 world
声明的 token 名字集合完全一致。

---

## 3. 排版：丝印与屏幕

| | 无衬线（屏幕内容） | 等宽（机壳丝印） |
|---|---|---|
| 承载 | 正文、标题、按钮文字、说明 | 标签、ID、字节数、时间码、状态、代码、签名 |
| 大小写 | 句首 | **大写** |
| 字距 | 正常 | `0.5px` / `1px` / `2px` |
| 颜色 | `--sekai-fg` | `--sekai-fg-muted` |

加一条控件时，只要保住这条对比就不会走样：**值是屏幕显示的，标签是印上去的。**

具体到实现，这条规则表现为三个类：

- `.sekai-sig` —— 10px，最小最暗，`SEKAI PASS // SYSTEM`、`STEREO`、`READ`
- `.sekai-label` / `.sekai-field__label` —— 12px 表单标签
- `.sekai-meta dt` / `.sekai-meta-row__key` —— 键值表的键

字号阶梯（都来自两份源文件的实际用值）：

```
micro 10  meta 11  label 12  sm 13  md 14  lg 15  xl 18  2xl 20  3xl 24  4xl 32
```

`md` 是 Pass 的正文，`lg` 是 nightcord 的消息正文 —— 两个都保留，因为聊天界面
确实需要更大一档。

---

## 4. 高度与描边

§0 原则一说的场景光照，落到实现上就是这套阴影。它们描述的是「一个多大的物体，
离底面多高」——

按尺寸挑，不要按语义挑：一张卡片和一个 32px 的芯片就算"重要性一样"，
影子也必须不同，因为它们投影的面积不同。

```css
--sekai-elev-1: 0 2px 4px  rgb(0 0 0 / .2);   /* 贴在面上的小卡片 */
--sekai-elev-2: 0 4px 12px rgb(0 0 0 / .2);   /* 代码块、hover 态 */
--sekai-elev-3: 0 8px 24px rgb(0 0 0 / .3);   /* entity 头像 */
--sekai-elev-4: 0 20px 60px rgb(0 0 0 / .5);  /* Pass 主面板 */
--sekai-elev-modal: 0 25px 50px -12px rgb(0 0 0 / .5);
```

### 阶梯不是法律

nightcord 实际用了 **6 个** 不同的浅阴影 —— `0 2px 4px` 有 .1/.2/.3 三档，
`0 4px 12px` 有 .15/.2 两档，还有一个 `0 4px 8px / .4`。阶梯只收了中间那档。

**这不是源设计不规范，是它在按元素尺寸调阴影。** 一个 32px 的回复按钮几乎没有
面积可以投影，需要比卡片更紧、更深的影子才读得出「浮起来」；一个嵌在消息流里的
播放器需要比卡片浅一半的影子才不脱离纸面。

所以规则是：**阶梯是默认词汇，不是强制。源设计为了某个具体理由手调过的值，
保留字面量并写清楚为什么。** 目前系统里有四处这样的例外，每处都带注释：

| 位置 | 值 | 理由 |
|---|---|---|
| `.sekai-auth` padding | `42px` | Pass 面板的从容感；32px 局促，48px 松垮 |
| `.sekai-audio-player-simple` | `0 2px 4px /.1`、`0 4px 12px /.15` | 嵌在流里，不是浮在上面 |
| `.sekai-message__action` | `0 2px 4px /.3`、`0 4px 8px /.4` | 32px 小面积，需要更紧更深 |
| `.sekai-audio-progress-fill::after` | `0 2px 4px /.3` | 12px 圆点，同上 |

反过来说 —— 加例外之前先问：这是源设计**为一个具体理由**调的，还是只是当时随手
写的？后者应该归到阶梯上。

描边分三个职责，不能合并：

- `--sekai-line` —— 卡片、输入框、chip 的发丝线
- `--sekai-line-strong` —— 同一条线的强调态（hover）
- `--sekai-divider` —— 布局区域之间的结构分隔（bar 底边、侧栏边缘）

world-system 里 `line` 和 `divider` 是同一个灰；world-night 里 `line` 是白色
低透明度而 `divider` 是深紫实色。合并会让其中一个 world 出错。

---

## 5. 动效

```
instant .1s   fast .15s   base .2s   slow .3s   slower .4s
ease          cubic-bezier(.4, 0, .2, 1)
ease-out      cubic-bezier(.2, .8, .2, 1)     ← nightcord 默认
ease-spring   cubic-bezier(.16, 1, .3, 1)     ← 入场
```

**唯一的 hover 手势**：边框提亮 + `translateY(-1px)`，按下落回。写成
`.sekai-lift`，直接挂在任何可点的卡片/按钮上。

全系统的动画都是「装饰性强化」，没有一个是唯一的信息载体 —— 所以
`prefers-reduced-motion` 可以全量关掉，`base.css` 里就是这么做的。

唯一无需用户输入就常驻运行的动画是 modal 的 logo 浮动（6s）。别再加第二个。

---

## 6. 十个签名装置

这些是「精致」的实际载体。加装饰之前先看这里有没有现成的。

| 类 | 出处 | 用法 | 约束 |
|---|---|---|---|
| `.sekai-cap` | Pass 主面板 | 3px 主色渐变封住顶边 | **每屏一个**。第二个会杀掉第一个的权威感 |
| `.sekai-grid` | Pass body | 40px 网格 @ 3% 白 | 页面底纹，绝不放进卡片里 |
| `.sekai-sig` | Pass `// SYSTEM` | 机壳丝印最小号 | — |
| `.sekai-rule[data-label]` | Pass `EDITABLE DATA` | 被一个等宽标签打断的分隔线 | 设 `--sekai-rule-bg` 与承载面一致 |
| `.sekai-strip` | nightcord 代码块 / 引用 | 3px 左侧色带 | 含义固定：「这块不用读就能被扫到」 |
| `.sekai-glass` | nightcord 文件卡 | 6%→2% 白渐变 + blur + 发丝线 | alpha 保持低。是玻璃不是糖霜 |
| `.sekai-lift` | 两边通用 | 那个 hover 手势 | — |
| `.sekai-sheen` | nightcord Pass 登录键 | hover 时一道斜向高光扫过 | **每屏一个**，只给身份动作。两个一起跑就不特别了 |
| `.sekai-led` | walkman transport | 6px 状态灯，亮时真的发光 | signal 橙唯一允许做填充的地方之一 |
| `.sekai-flow` | Pass 授权页连接线 | 一条发丝线上跑着一个主色光包 | 只用来描述两个实体的关系，不做环境装饰 |

### 6.7 装置：那台播放器

`.sekai-audio-player`（walkman × DAW）是这个系统里**唯一的异物**。

它不用画布梯子，不吃 world 的主色，也不为了合群而软化圆角。它读起来像有人把
一台硬件放进了界面里 —— 这恰恰是它在两个 world 里都不用改的原因。它需要的一切
都在 `--sekai-device-*` 加 `--sekai-signal` 里。

**如果想「协调」它和周围 UI：别。反差就是设计。**

它的轻量版 `.sekai-audio-player-simple` 相反 —— 那个属于 world，吃 world 的
surface 和 accent，只保留了 signal LED。

- 一起听的时刻 → 用 `AudioDevice`
- 一条语音附件 → 用 `AudioPlayer`

### 两个播放器可视化的是不同的东西

这不是装饰差异，是**语义差异**：

| | 装置 `AudioDevice` | 简单 `AudioPlayer` |
|---|---|---|
| 语义 | 音乐 | 音频（语音、语音条） |
| 可视化 | 32 段频谱柱 | 时域示波器 |
| 数据 | `getByteFrequencyData` | `getByteTimeDomainData` |
| fftSize | 64 → 32 bin | 2048 |

**一条语音没有值得看的频谱，它有的是包络。** 反过来，音乐的看点正是各频段
的配比。互换等于让两个播放器都对自己的用途撒谎。

32 这个数字也不是拍脑袋 —— `fftSize: 64` 决定了 `frequencyBinCount` 是 32，
**一根柱子对一个频段**。改柱子数就必须同时改 fftSize，否则一部分柱子在读
不存在的 bin。

示波器每帧是用 `--sekai-surface-card-live` **25% alpha** 半清屏，不是不透明
擦除 —— 那层残留就是拖影。画成不透明，这个组件唯一的「仪器感」就没了。
LED 的脉动也是真的：由每帧 RMS 驱动 scale / opacity / glow，不是定时器。

拿不到信号时（跨域音频没有 CORS 头、`createMediaElementSource` 抛错）
一律**保持静止的中线**，绝不退化成假动画。测不到却假装在动，比承认没信号更糟。

### transport 是四个键，不是两个

`play / stop / rw(−5s) / ff(+10s)`，播客式跳转。因为这台是**完全模仿实物 deck**
的，键位不全就露馅 —— 两个键的 transport 读起来像个套了机箱的网页控件。

**简单播放器有自己的两档微色阶**，比画布梯子更细：
`--sekai-surface-card` → `--sekai-surface-card-live`。nightcord 手调的是
`#2f273f → #352e46`（原注释「slightly lighter than chat bg」），两个值都不落在
梯子的任何一格上。就近取整塞进 `surface-raised` / `surface-hover` 会做错两件事
—— 压平这段渐变，并且因为 `surface-hover` 是中性灰紫，把「活着 = 更暖一点」
拧成了「鼠标悬停」。所以它单独占一对契约 token。

同理，它的两级阴影（`rgba(0,0,0,.1)` / `.15`）**刻意不上高度阶梯**，只有
`elev-1` / `elev-2` 的一半 alpha。它是嵌在消息流里的，不是浮在上面的；用 `.2`
它就脱离纸面，开始读起来像个弹出的 chip。

> 与 nightcord 的行为差异：progress 手柄的显形条件从 4px 高的
> `.sekai-audio-progress-bar:hover` 扩到了 12px 的
> `.sekai-audio-progress-container:hover`（原选择器保留，所以是超集不是替换）。
> 原来的目标比实际可拖拽区域小三倍，手柄经常在已经能拖的时候还不显形。

---

## 7. signal 橙的纪律

`--sekai-signal` = `#ff5500`。它只在三个地方出现：

1. transport 键按下的锁定态
2. LED / 指示灯亮起
3. `@AI` mention —— 消息流里唯一不是人的参与者

**不做强调色，不做警告色，不做装饰。** 它的意思固定是「这个东西是活的」。
`sekai-alert` 刻意没有 signal 变体。

---

## 8. 组件

CSS 类名是权威接口；React 组件是等价的薄封装，输出完全相同的类名。

### 基础层
`Button`（primary / secondary / ghost / danger / danger-outline / identity ×
sm / md / lg × block）· `IconButton` · `ButtonRow` · `ButtonGrid` ·
`Field` · `Input` · `Textarea` · `Checkbox` · `InputRow` · `Hint` ·
`InputShell` · `BareInput` · `Card` · `CardHeader/Title/Desc` · `Well` ·
`WellRow` · `MetaList` · `Secret` · `Badge` · `Chip` · `Alert` ·
`StatusPill` · `Toast` · `Spinner` · `Progress` · `Skeleton` ·
`EmptyState` · `Avatar` · `Presence` · `Modal` · `OrDivider` ·
`Signature` · `Rule` · `Led` · `FlowLine`

### SEKAI 内容层
`RichText` · `InlineCode` · `CodeBlock` · `Spoiler` · `Recover` · `Mention` ·
`InlineLink` · `ColoredText` · `Blockquote` · `FileCard` · `LinkCard` ·
`ReplyChip` · `ErrorPlaceholder` · `ImageCard` · `Sticker` ·
`AudioPlayer` · `AudioDevice`

### 布局层
`Shell` · `Sidebar` · `SidebarHeader/Body` · `Main` · `SectionLabel` ·
`Channel` · `RosterItem` · `Bar` · `BarTitle` · `WindowDots` ·
`MessageList` · `Message` · `Composer` · `SuggestList` · `SuggestItem` ·
`AuthPage` · `AuthPanel` · `AuthLogo` · `AuthHeader/Title/Subtitle` ·
`Entity` · `ConnectionVisual` · `ScopeList` · `ScopeItem` ·
`SecurityNote` · `PrivacyNote` · `AuthLink` · `CaptchaSlot` · `Page` ·
`PageHeader` · `SettingsHeader` · `Profile` · `MetaRow` · `Readout` ·
`ReadoutRow` · `Footer` · `UriList`

### 兼容性契约

`css/sekai/*` 里的每一个类名都和 nightcord `sekai-renderer.js` 实际输出的
名字**逐字相同**。这是刻意的：**nightcord 接入这套系统靠删 CSS，不用碰
渲染器。**

已核对：渲染器输出 81 个真实类名，全部有对应样式，无遗漏。

> 顺带发现一个既存缺陷：渲染器会给示波器 canvas 打上
> `sekai-audio-oscilloscope`（`sekai-renderer.js:274`），但 nightcord 的
> `styles.css` 里从来没有这个类的样式 —— canvas 停在默认 inline 基线对齐，
> 下方有一条 descender 空隙。本系统补上了。

状态类沿用 nightcord 的拼写（`.active` / `.playing` / `.revealed` /
`.loading`），同时接受 `.is-*` 作为新代码的写法。

---

## 9. Do / Don't

**Do**

- 用 `rgb(var(--sekai-x) / a)`，永远。
- 让标签说丝印话，让值说屏幕话。
- 加装饰之前先翻 §6 的十个装置。
- 用户可输入的文本（应用名、回调地址、bio）一律加 `overflow-wrap: anywhere`。
  Pass 的 CSS 里已经为此写了三处注释，这是真实踩过的坑。
- 需要留位的异步内容给它固定高度（`.sekai-captcha-slot`、`.sekai-status`、
  `.sekai-image-container.loading`）—— 面板不该在数据到达时跳一下。

**Don't**

- 别把 signal 橙用在「活着」以外的任何含义上。
- 别一屏放两个 `.sekai-cap` 或两个 `.sekai-sheen`。
- 别为了合群改那台播放器。
- 别在组件 CSS 里引用 world 文件或写死 hex —— 只准引用契约里的名字。
- 别给按钮默认 `width: 100%`。Pass 这么做过，然后用 `.btn-auto`、
  `.avatar-upload-btn` 和两个 `!important` 花了四条规则往回抢。本系统默认
  auto，满宽用 `--block` 显式声明。

---

## 10. 校验

```bash
npm run validate     # token 引用完整性 + 两个 world 的 token 名字对齐
npm run type-check   # React 层类型
npm run build        # dist/ + .d.ts
```

`validate` 挡住的是这套系统最容易犯的两类错：

1. **悬空 token** —— 拼错的 `var(--sekai-*)` 会静默解析为空，规则直接不生效。
   没有报错，没有警告，组件看起来「差不多对」。
2. **world 失配** —— 一个 token 只在一个 world 里声明，另一个 world 静默回退到
   `:root` 默认值。只在那一个主题下出错，是最难发现的一类 bug。

---

## 10.1 未决：要不要把「差」做成机制

§0 原则二承认了只有差是物理的，但 `tokens/` 里存的仍然是**已经对着画布算好的
固定值**。这是一次**预解析**：把「相对」在设计时算完，运行时只剩绝对数。

预解析没错 —— 源设计本来就是手调的固定 hex。但它有代价：token 名字必须
不带方向（当前欠着，见上），而且嵌套时不会自动跟着走。

真正「相对」的写法应该是这样，每一层只声明自己**比所在层深/浅多少**：

```css
.sekai-raise {
  --sekai-plane: color-mix(in oklab, var(--sekai-plane), white 6%);
  background: var(--sekai-plane);
}
```

**这段写不了。** CSS 自定义属性在同一个元素上自引用构成环
（`--sekai-plane` 的声明里 `var(--sekai-plane)` 指向的就是它自己），
按规范在 computed-value time 直接失效。绕开它要么每层套一个 wrapper 元素、
要么两个属性名交替 —— 两种都会把「一个面」变成「两个 div」，
为了表达物理反而弄脏了结构。

所以是个真岔路：

- **A · 维持预解析**（现状）。值固定、可读、可校验；代价是把 `-raised` /
  `-sunken` 改成不带方向的名字，且嵌套要人工算。
- **B · 换成相对机制**。物理上诚实、嵌套自动；代价是 `color-mix` 打破
  「颜色只存 RGB 三元组」这条铁律（`color-mix` 返回的是颜色不是三元组），
  而且每一层深度都要一个承载元素。

B 的代价是真的 —— 它会同时动到本系统的另一条硬规则。现状维持 A。

## 附：许可

本包 Apache-2.0。

源设计中 nightcord 是 AGPL-3.0-only、SEKAI Pass 是 Apache-2.0，两者版权同属
The 25-ji-code-de Team。选 Apache-2.0 是为了让 Pass、gateway 等 Apache 侧
仓库也能无摩擦引用。
