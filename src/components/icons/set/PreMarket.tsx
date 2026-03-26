import withIconColor from '../withIconColor'
import type { SvgIconProps } from '../types'

const PreMarket = (props: SvgIconProps) => {
  return (
    <svg
      width={props.size}
      height={props.size}
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width={18} height={18} rx={4} fill="#F59E0B" fillOpacity={0.1} />
      <path
        d="M6.40002 4.59999L9.00001 2L11.6 4.59999"
        stroke="#F59E0B"
        strokeWidth={1.11428}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 2V7.19998"
        stroke="#F59E0B"
        strokeWidth={1.11428}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.40454 7.80469L5.32104 8.72118"
        stroke="#F59E0B"
        strokeWidth={1.11428}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.5 12.3994H3.79999"
        stroke="#F59E0B"
        strokeWidth={1.11428}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.2 12.3994H15.5"
        stroke="#F59E0B"
        strokeWidth={1.11428}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.5955 7.80469L12.679 8.72118"
        stroke="#F59E0B"
        strokeWidth={1.11428}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.4999 15H2.5"
        stroke="#F59E0B"
        strokeWidth={1.11428}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.6 12.3998C11.6 11.7102 11.3261 11.0489 10.8385 10.5613C10.3509 10.0737 9.68957 9.7998 9.00001 9.7998C8.31045 9.7998 7.64914 10.0737 7.16154 10.5613C6.67395 11.0489 6.40002 11.7102 6.40002 12.3998"
        stroke="#F59E0B"
        strokeWidth={1.11428}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const Icon = withIconColor(PreMarket)
export default Icon
