# 项目开发规范

## 图片与图标资源管理规则

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
