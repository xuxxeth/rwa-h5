# Tailwind Rules (Strict)

## Version
- Project uses **Tailwind CSS v4**
- `tailwind.config.js` is NOT the primary config (legacy only)
- Custom tokens MUST be defined in `src/index.css` via `@theme`

## Custom Token
- Add spacing/color/size tokens in `@theme` block of `src/index.css`
- Use CSS variable naming: `--spacing-xxx`, `--color-xxx`, `--min-height-xxx`
- Example:
- ❌ bg-[#xxx]
- ❌ border-[#xxx]
- ❌ Adding custom tokens in `tailwind.config.js`

## v4 @theme Conventions
- Layout tokens like `--spacing-navbar` and `--min-height-main` go in the `@theme` block
- Reference them via utility classes: `top-navbar`, `min-h-main`, etc.
- Keeps layout dimensions consistent and centralized

## Exception
- ✅ rgba() allowed
- ✅ Arbitrary values for non-color properties (e.g. `z-[5]`, `text-[14px]`) allowed when no token exists
