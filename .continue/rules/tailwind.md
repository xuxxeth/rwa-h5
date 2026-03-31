# Tailwind Rules (Strict)

## Version
- Project uses **Tailwind CSS v4**
- `tailwind.config.js` is NOT the primary config (legacy only)
- Custom tokens MUST be defined in `src/index.css` via `@theme`

## Custom Token
- Add spacing/color/size tokens in `@theme` block of `src/index.css`
- Use CSS variable naming: `--spacing-xxx`, `--color-xxx`, `--min-height-xxx`
- Example:
    ```css
    @theme {
      --spacing-navbar: 52px;
      --min-height-main: calc(100vh - 52px);
    }
    ```
- ❌ DO NOT add tokens in `tailwind.config.js` (v4 ignores them)

## MUST
- Use Tailwind tokens only
- Example:
    - text-gray-400
    - bg-gray-950
    - border-gray-850
    - top-navbar
    - min-h-main

## FORBIDDEN
- ❌ text-[#xxx]
- ❌ bg-[#xxx]
- ❌ border-[#xxx]
- ❌ Adding custom tokens in `tailwind.config.js`

## Exception
- ✅ rgba() allowed
- ✅ Arbitrary values for non-color properties (e.g. `z-[5]`, `text-[14px]`) allowed when no token exists
