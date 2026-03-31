import type { SvgIconProps } from '../types'

/** Figma toast: yellow exclamation circle with bg */
const ToastWarning = ({ size, ...props }: SvgIconProps) => (
  <svg width={size} height={size} viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
    <rect width='24' height='24' rx='12' fill='#232427' />
    <path d='M12 4.5C7.86 4.5 4.5 7.86 4.5 12C4.5 16.14 7.86 19.5 12 19.5C16.14 19.5 19.5 16.14 19.5 12C19.5 7.86 16.14 4.5 12 4.5ZM12.75 15.75H11.25V14.25H12.75V15.75ZM12.75 12.75H11.25V8.25H12.75V12.75Z' fill='#FFB219' />
  </svg>
)

export default ToastWarning
