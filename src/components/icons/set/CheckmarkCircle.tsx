import withIconColor from '../withIconColor'
import type { SvgIconProps } from '../types'

const CheckmarkCircle = ({ size, color, ...props }: SvgIconProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M14 8C14 4.6875 11.3125 2 8 2C4.6875 2 2 4.6875 2 8C2 11.3125 4.6875 14 8 14C11.3125 14 14 11.3125 14 8Z"
        stroke={color || 'currentColor'}
        strokeMiterlimit={10}
      />
      <path
        d="M10.9999 5.5L6.79988 10.5L4.99988 8.5"
        stroke={color || 'currentColor'}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const Icon = withIconColor(CheckmarkCircle)
export default Icon
