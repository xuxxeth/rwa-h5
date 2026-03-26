# ICON_KEYS build 后为空

## 问题

`src/components/icons/index.tsx` 中 `ICON_KEYS` 在 build 后为空数组 `[]`，导致图标页面无法渲染。

## 根因

`withIconColor` 使用了 `React.forwardRef(...)`，其返回值是一个 React **对象**（`typeof === 'object'`，带有 `$$typeof: Symbol(react.forward_ref)`），而非普通函数。

原始代码中的判断：

```ts
if (typeof component === 'function') {
  Components[componentName] = component
}
```

对所有经过 `forwardRef` 包装的图标组件都会失败，导致 `Components` 始终为空，`ICON_KEYS = Object.keys(Components)` 自然也为 `[]`。

## 修复

将类型检查改为同时接受 `forwardRef` / `memo` 等 React exotic component：

```ts
if (typeof component === 'function' || (component != null && component.$$typeof != null)) {
  Components[componentName] = component
}
```

## 涉及文件

- `src/components/icons/index.tsx`
- `src/components/icons/withIconColor.tsx`（使用了 `forwardRef`）
