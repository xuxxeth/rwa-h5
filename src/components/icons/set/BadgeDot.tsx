import withIconColor from '../withIconColor'
import type { SvgIconProps } from '../types'

const BadgeDot = ({ size = 6, color, ...props }: SvgIconProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 6 6"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="3" cy="3" r="3" fill={color || '#FFB219'} />
    </svg>
  )
}

const Icon = withIconColor(BadgeDot)
export default Icon
