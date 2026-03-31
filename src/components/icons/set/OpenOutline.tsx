import type { SvgIconProps } from '../types'

/** Figma: open-outline icon — external link */
const OpenOutline = ({ size, color, ...props }: SvgIconProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox='0 0 14 14'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      <path
        d='M5.25 2.625H3.0625C2.82088 2.625 2.58912 2.72098 2.41799 2.89212C2.24685 3.06325 2.15088 3.29501 2.15088 3.53662V10.9375C2.15088 11.1791 2.24685 11.4109 2.41799 11.582C2.58912 11.7531 2.82088 11.8491 3.0625 11.8491H10.4634C10.705 11.8491 10.9368 11.7531 11.1079 11.582C11.279 11.4109 11.375 11.1791 11.375 10.9375V8.75'
        stroke={color || 'currentColor'}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M8.75 2.625H11.375V5.25'
        stroke={color || 'currentColor'}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M6.5625 7.4375L11.375 2.625'
        stroke={color || 'currentColor'}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  )
}

export default OpenOutline
