# 项目开发规范

---

## 一、图片与图标资源管理规则

> **核心原则：页面组件目录下不放 assets 资源文件，图标走 icons 组件体系，图片走 public 静态资源。**

### 1. 图标（SVG Icon）

- **不要**在各页面目录下创建 `assets/` 文件夹放 SVG 文件
- **统一使用** `@/components/icons/set/` 下的 React 图标组件
- 如果需要新图标，在 `src/components/icons/set/` 下新建对应的组件文件，参照现有组件模式：
  - 使用 `withIconColor` 高阶组件包裹
  - 接收 `SvgIconProps` 类型参数
- 使用方式：

```tsx
import ChevronDown from '@/components/icons/set/ChevronDown'

<ChevronDown size={20} color="#fff" />
```

- `size` 控制尺寸，`color` 控制颜色（默认 `currentColor`）

### 2. 图片（PNG / 位图）

- 统一放置在 `public/images/` 目录下（如 `public/images/tokens/`）
- 以**绝对路径**直接引用，**无需 import**：

```tsx
<img src="/images/tokens/AMZN.png" alt="AMZN" className="h-4 w-4" />
```

### 3. 禁止事项

- ❌ 不要在 `src/views/*/assets/` 下放任何图片或 SVG
- ❌ 不要使用 `import xxx from '../assets/xxx.svg'` 方式引入图标
- ❌ 不要使用 `<img src={svgImport} />` 方式渲染 SVG 图标

---

## 二、Tailwind 颜色使用规则

> **核心原则：在 Tailwind className 中禁止使用硬编码 hex 颜色值，必须使用 `@theme` 颜色 token。**

### 1. 禁止写法

```tsx
// ❌ 以下写法全部禁止
className="text-[#9DA3AF]"
className="bg-[#101114]"
className="border-[#232427]"
```

### 2. 正确写法

```tsx
// ✅ 使用 @theme 中已定义的颜色 token
className="text-gray-400"      // 对应 --color-gray-400: #9da3af
className="bg-gray-975"        // 对应 --color-gray-975: #101114
className="border-gray-850"    // 对应 --color-gray-850: #232427
```

### 3. 如何添加新颜色

当设计稿中的颜色在现有 token 中不存在时：

1. 在 `src/index.css` 的 `@theme` 块（注释 `/* 这里是根据 ui 给出的颜色定义写的*/` 下方）中新增 `--color-xxx` 变量
2. 命名遵循现有色阶规律（如 `gray-450` 介于 `gray-400` 和 `gray-500` 之间）
3. 然后在 className 中使用 token 名

### 4. 唯一例外

带透明度的 `rgba()` 值**允许**直接在 className 中使用，因为无法表示为简单 token：

```tsx
// ✅ rgba 透明色允许
className="bg-[rgba(37,167,80,0.1)]"
className="bg-[rgba(255,255,255,0.04)]"
```

### 5. 现有颜色 Token 速查表

| Token 名 | Hex 值 | 用途说明 |
|---|---|---|
| `gray-975` | `#101114` | TittleBar 背景 |
| `gray-950` | `#131416` | 页面主背景 |
| `gray-900` | `#1a1b1e` | 卡片/区块背景 |
| `gray-875` | `#202129` | 卡片分割线（Figma "Base Plus"） |
| `gray-850` | `#232427` | 边框色 |
| `gray-800` | `#282a2f` | 次级区块背景 |
| `gray-750` | `#383a40` | 滚动条/分隔色 |
| `gray-700` | `#41464f` | — |
| `gray-500` | `#737a87` | 次要文字 |
| `gray-450` | `#848e9c` | 三级文字（如 hash 标签） |
| `gray-400` | `#9da3af` | 辅助文字 |
| `orange-50` | `#f29339` | 部分成交状态 |
| `yellow-50` | `#ffb219` | 警告/高亮 |
| `blue-50` | `#009dff` | 链接/信息 |
| `green-50` | `#25a750` | 买入/成功 |
| `green-100` | `#2ee4a7` | 涨幅 |
| `red-50` | `#ca3f64` | 卖出/错误 |
| `red-100` | `#f63c6b` | 跌幅 |
| `brand` | `#9cff3a` | 品牌主色 |
| `opacity-*` | `#FFFFFF` + 透明度 | 白色透明度系列（01/02/03/04/08/12/20/40/60/80） |

---

## 三、组件命名规范

### 1. TittleBar（双 t 拼写）

项目中顶部导航栏组件命名为 **`TittleBar`**（注意双 `t`），文件路径 `src/components/TittleBar.tsx`。

```tsx
import { TittleBar } from '@/components/TittleBar'
```

- Props 接口名：`TittleBarProps`
- 所有引用处保持此拼写，不要"纠正"为 `TitleBar`

---

## 四、技术栈与架构约定

### 1. 技术栈

| 类别 | 技术 |
|---|---|
| 框架 | React 19.1 + TypeScript 5.8 |
| 路由 | react-router-dom 7.8（BrowserRouter, 懒加载） |
| 状态管理 | Zustand（with persist middleware） |
| 数据请求 | TanStack React Query（含 infinite queries） |
| 样式 | Tailwind CSS 4 + `@theme` token + `tailwindcss-animate` |
| 构建 | Vite |
| 国际化 | i18next + `useTranslation` hook |
| 包管理器 | pnpm |

### 2. 路由

- 所有路由在 `src/routes/index.tsx` 中注册
- 使用 `React.lazy()` 懒加载页面组件
- 自定义 `useRouter` hook 封装 `useNavigate` / `useLocation`

### 3. 常用 Hooks

| Hook | 文件 | 用途 |
|---|---|---|
| `useActiveWeb3` | `src/hooks/useActiveWe3.ts` | 获取钱包 account / chainId |
| `useTradeUtils` | `src/hooks/useTrading.ts` | 交易操作（含 cancelOrder） |
| `useSignatureValidStatus` | `src/hooks/useSignature.ts` | 签名认证网关 |
| `useRwaByStockId` | `src/hooks/useRwaBalances.ts` | 通过 stockId 解析 RWA 代币元数据 |

### 4. i18n

- 语言文件位于 `src/locales/{en,zh}.json`
- 使用 `useTranslation()` hook，所有用户可见文案必须走 i18n
- key 命名遵循 `模块.子模块.字段` 格式，如 `assets.order.openOrders`

---

## 五、代码质量

### 1. TypeScript

- 编译检查命令：`npx tsc --noEmit --skipLibCheck`
- 所有新代码必须通过零错误编译

### 2. 文件组织

- 页面级组件放 `src/views/<模块>/index.tsx`
- 页面子组件放 `src/views/<模块>/components/`
- 公共组件放 `src/components/`
- Query 工厂放 `src/queries/`
- 服务类型定义放 `src/service/`
