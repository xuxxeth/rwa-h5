import withIconColor from '../withIconColor'
import type { SvgIconProps } from '../types'

const History = ({ size, color, ...props }: SvgIconProps) => {
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
        d="M16.2501 10V3.75C16.2501 2.71447 15.4107 1.875 14.3751 1.875H5.62512C4.58959 1.875 3.75012 2.71447 3.75012 3.75V16.25C3.75012 17.2855 4.58959 18.125 5.62512 18.125H10.0001"
        stroke={color || 'currentColor'}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.875 5H13.125"
        stroke={color || 'currentColor'}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.875 8.125H13.125"
        stroke={color || 'currentColor'}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.875 11.25H10"
        stroke={color || 'currentColor'}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.3703 12.2959C13.6732 12.2959 12.2963 13.6728 12.2963 15.37C12.2963 17.0671 13.6732 18.4441 15.3703 18.4441C17.0675 18.4441 18.4444 17.0671 18.4444 15.37C18.4444 13.6728 17.0675 12.2959 15.3703 12.2959Z"
        stroke={color || 'currentColor'}
        strokeMiterlimit={10}
      />
      <path
        d="M15.3704 13.3203V15.6259H16.9074"
        stroke={color || 'currentColor'}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const Icon = withIconColor(History)
export default Icon
