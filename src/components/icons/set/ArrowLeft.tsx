import withIconColor from '../withIconColor'
import type { SvgIconProps } from '../types'

const ArrowLeft = ({ size, color, ...props }: SvgIconProps) => {
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
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13.5617 2.68536C13.3107 2.43431 12.9036 2.43431 12.6526 2.68536L5.34086 9.99707L12.6526 17.3088C12.9036 17.5598 13.3107 17.5598 13.5617 17.3088C13.8128 17.0577 13.8128 16.6507 13.5617 16.3996L7.15914 9.99707L13.5617 3.5945C13.8128 3.34344 13.8128 2.93641 13.5617 2.68536Z"
        fill={color || 'white'}
      />
    </svg>
  )
}

const Icon = withIconColor(ArrowLeft)
export default Icon
