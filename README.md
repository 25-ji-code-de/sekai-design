<!-- SPDX-License-Identifier: Apache-2.0 -->
<!-- SPDX-FileCopyrightText: 2026 The 25-ji-code-de Team -->

# @sekai/design

SEKAI 生态共用的设计系统，由 nightcord 与 SEKAI Pass 的现有设计整理而成，
包含设计令牌、CSS 组件和 React 封装。

CSS 是样式的唯一来源。React 组件只负责生成相同的类名。

- [设计规范](./DESIGN_SYSTEM.md)：规则及其设计依据
- `demo.html`：交互示例；运行 `npm run build` 后可直接在浏览器中打开

## 安装

```bash
npm i @sekai/design
```

生态内的仓库也可以直接引用构建产物：

```html
<link rel="stylesheet" href="../sekai-design/dist/sekai-design.css" />
```

## 在原生 HTML 中使用

适用于 nightcord、hub、25ji 和 SEKAI Pass 等项目。

```html
<html class="world-night">        <!-- 也可使用 world-system -->
  <head>
    <link rel="stylesheet" href="/sekai-design/dist/sekai-design.css" />
  </head>
  <body>
    <button class="sekai-btn sekai-btn--primary">授权</button>
  </body>
</html>
```

`world-*` 类为颜色令牌赋值。未指定时，组件使用 `world-system` 的默认值。

### 只引入设计令牌

如果项目只需要变量，不需要组件样式，可以单独引入令牌文件。例如，hub 当前复制了
SEKAI Pass 的 `:root` 变量块，可以将其改为：

```css
@import "../../sekai-design/dist/sekai-tokens.css";
```

## 在 React 中使用

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

React 组件不包含独立样式，只组合并输出 CSS 接口所需的类名。

## 目录

```
tokens/
  primitives.css     与 world 无关的字号、间距、圆角、动效和层级
  contract.css       语义令牌契约及 world-system 默认值
  world-system.css   源自 SEKAI Pass 的近黑色主题
  world-night.css    源自 nightcord 的紫罗兰主题
css/
  base.css           reset、焦点、滚动条和动效策略
  signatures.css     十种 SEKAI 标志性样式
  components/        button field card badge alert avatar feedback modal
  sekai/             text cards media audio-device audio-simple
  layout/            shell chat auth page
react/               对应 CSS 接口的 React 封装
dist/                JS、CSS、source map 和类型声明
```

## 命令

```bash
npm run build        # 构建 JS、CSS 和类型声明
npm run validate     # 检查令牌引用及两个 world 的契约一致性
npm run type-check   # 检查 React 层类型
npm run check        # 依次执行 validate 与 type-check
```

## World

| | `world-system` | `world-night` |
|---|---|---|
| 来源 | SEKAI Pass | nightcord |
| 视觉特征 | 近黑、终端式 | 紫罗兰、环境式 |
| 画布 | `#0b0b0e` + 网格 | `#50476a` |
| 主色 | `#a48cd6` | `#a78bfa` |
| 按钮文字 | 大写、宽字距 | 句首大写 |
| 适用项目 | Pass、hub、docs、控制台 | nightcord、25ji、stickers |

两个 world 声明相同的令牌名称，仅取值不同。`npm run validate` 会检查这一约束。

## nightcord 兼容性

`css/sekai/*` 中的类名与 `sekai-renderer.js` 的输出一致。因此，nightcord 接入时
可以删除重复样式，无需修改渲染器。

Apache-2.0 · The 25-ji-code-de Team
