import withIconColor from '../withIconColor'
import type { SvgIconProps } from '../types'

const ChevronDown = ({ size, color, ...props }: SvgIconProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M4.375 7.1875L10 12.8125L15.625 7.1875"
        stroke={color || 'currentColor'}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const Icon = withIconColor(ChevronDown)
export default Icon
