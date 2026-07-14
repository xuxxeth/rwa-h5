# CA-H5

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

---

## Icon 预览页

### 功能

项目内置了一个独立的 Icon 预览页面，用于浏览项目中 `src/components/icons/set/` 目录下的所有图标组件。

- 以网格形式展示所有已注册的图标及其名称
- **点击图标卡片**可一键复制对应的 JSX 使用代码（如 `<Add size={}/>`）到剪贴板，并弹出 toast 提示
- 图标通过 `import.meta.glob` 自动扫描 `src/components/icons/set/` 目录，**新增图标文件后无需手动注册**，刷新页面即可看到

### 访问地址

> **仅开发环境可用**，生产构建不会包含此页面。

启动开发服务器后，在浏览器中访问：

```
http://localhost:<port>/icon.html
```

### 相关文件

| 文件 | 说明 |
| --- | --- |
| `icon.html` | 页面 HTML 入口 |
| `src/iconIndex.tsx` | 页面 React 入口及逻辑 |
| `src/components/icons/set/` | 图标 SVG 组件目录（自动扫描） |
| `src/components/icons/index.tsx` | 图标注册 & `getIcon` / `ICON_KEYS` 导出 |
| `src/components/icons/types.ts` | `IconKey`、`SvgIconProps` 等类型定义 |

### 在业务代码中使用图标

> **快捷方式：** 在 Icon 预览页中直接点击任意图标卡片，即可复制该图标的 JSX 标签（如 `<Add size={}/>`）到剪贴板，粘贴到业务代码中修改 `size` 等属性即可使用。

```tsx
import { getIcon } from '@/components/icons'
import type { IconKey } from '@/components/icons/types'

// 方式一：通过 getIcon 动态获取
getIcon('Add' as IconKey, { type: 'primary', size: 20 })

// 方式二：直接导入具名组件
import { Add } from '@/components/icons'

<Add size={20} type="primary" />
```

**Props 说明：**

| Prop | 类型 | 说明 |
| --- | --- | --- |
| `size` | `number` | 图标尺寸（宽高） |
| `type` | `'primary' \| 'disabled' \| 'white' \| 'danger'` | 预设颜色主题 |
| `color` | `string` | 自定义颜色 |
| `className` | `string` | 自定义 CSS 类名 |

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

curl https://xlayertestrpc.okx.com/terigon \
-H "content-type: application/json" \
--data '{
 "jsonrpc":"2.0",
 "method":"eth_chainId",
 "params":[],
 "id":1
}'
