import withIconColor from '../withIconColor'
import type { SvgIconProps } from '../types'

const CheckBlue = ({ size, color, ...props }: SvgIconProps) => {
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
        d="M16 5L7.38314 14L3 8.87695"
        stroke={color || 'currentColor'}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const Icon = withIconColor(CheckBlue)
export default Icon
