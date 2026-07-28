<!-- SPDX-License-Identifier: Apache-2.0 -->
<!-- SPDX-FileCopyrightText: 2026 The 25-ji-code-de Team -->

# @sekai/design

SEKAI 生态的统一设计系统 —— 从 **nightcord** 和 **SEKAI Pass** 两套设计里抽象
出来的一层 token 契约 + 组件。

CSS 是唯一真源，React 是等价薄封装。两者输出完全相同的类名。

📖 **设计规范：[DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)** —— 为什么每条规则存在。
🎨 **可视化：`demo.html`**（先 `npm run build`，然后直接用浏览器打开）。

---

## 装它

```bash
npm i @sekai/design
```

仓库内直接引用也可以（本生态目前的用法）：

```html
<link rel="stylesheet" href="../sekai-design/dist/sekai-design.css" />
```

---

## 用它（vanilla —— nightcord / hub / 25ji / Pass）

```html
<html class="world-night">        <!-- 或 world-system -->
  <head>
    <link rel="stylesheet" href="/sekai-design/dist/sekai-design.css" />
  </head>
  <body>
    <button class="sekai-btn sekai-btn--primary">授权</button>
  </body>
</html>
```

`world-*` 这个 class 是颜色 token 真正取到值的地方。没有它，一切回退到
world-system 的默认值。

### 只要变量，不要组件样式

hub 目前是把 SEKAI Pass 的 `:root` 块**复制粘贴**过去的
（`hub/assets/css/style.css` 顶部就写着 “SEKAI Pass Theme Variables”）。
那份拷贝可以直接换成：

```css
@import "../../sekai-design/dist/sekai-tokens.css";
```

---

## 用它（React）

```tsx
import { SekaiRoot, Button, AuthPanel, ScopeItem } from "@sekai/design";
import "@sekai/design/css";

export function Authorize() {
  return (
    <SekaiRoot world="system">
      <AuthPanel wide>
        <ScopeItem name="profile" desc="读取昵称、头像与个人简介" />
        <Button variant="primary">授权</Button>
      </AuthPanel>
    </SekaiRoot>
  );
}
```

React 组件不带任何自己的样式 —— 它们只是把类名拼对。

---

## 目录

```
tokens/
  primitives.css     字号/间距/圆角/高度/动效/层级 —— 与 world 无关
  contract.css       语义契约 + 默认值（= world-system）
  world-system.css   SEKAI Pass 血统：近黑、终端感
  world-night.css    nightcord 血统：紫罗兰、环境感
css/
  base.css           reset、focus、滚动条、动效策略
  signatures.css     十个签名装置
  components/        button field card badge alert avatar feedback modal
  sekai/             text cards media audio-device audio-simple
  layout/            shell chat auth page
react/               与上面一一对应的薄封装
dist/                构建产物（.js / .cjs / .global.js / .css / .d.ts）
```

---

## 命令

```bash
npm run build        # dist/ 全量（JS + CSS + 类型）
npm run validate     # token 引用完整性 + 两个 world 对齐
npm run type-check   # React 层类型
npm run check        # validate + type-check
```

---

## 两个 world

| | `world-system` | `world-night` |
|---|---|---|
| 血统 | SEKAI Pass | nightcord |
| 气质 | 终端 / 基础设施 | 环境 / 久待 |
| 画布 | `#0b0b0e` + 网格 | `#50476a` |
| 主色 | `#a48cd6` | `#a78bfa` |
| 按钮 | 大写 + 宽字距 | 句首大写 |
| 用于 | Pass、hub、docs、控制台 | nightcord、25ji、stickers |

**两边声明的 token 名字完全一致**，只是值不同 —— `npm run validate` 会强制
这一点。

---

## 关于 nightcord 接入

`css/sekai/*` 的每个类名都和 `sekai-renderer.js` 输出的名字逐字相同。
nightcord 接入这套系统靠**删 CSS**，不用改渲染器。

---

Apache-2.0 · The 25-ji-code-de Team
