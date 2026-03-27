import withIconColor from '../withIconColor'
import type { SvgIconProps } from '../types'

const MarketOpen = (props: SvgIconProps) => {
  return (
    <svg
      width={props.size}
      height={props.size}
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width={18} height={18} rx={4} fill="#10B981" fillOpacity={0.1} />
      <g clipPath="url(#clip0_session_market_open)">
        <path
          d="M14.4166 9.49967H13.0733C12.8366 9.49917 12.6062 9.57621 12.4174 9.71903C12.2286 9.86185 12.0918 10.0626 12.0279 10.2905L10.755 14.8188C10.7468 14.847 10.7297 14.8717 10.7062 14.8893C10.6828 14.9068 10.6543 14.9163 10.625 14.9163C10.5957 14.9163 10.5672 14.9068 10.5437 14.8893C10.5203 14.8717 10.5032 14.847 10.495 14.8188L7.50498 4.18051C7.49678 4.15238 7.47967 4.12767 7.45623 4.11009C7.43279 4.09251 7.40428 4.08301 7.37498 4.08301C7.34568 4.08301 7.31717 4.09251 7.29373 4.11009C7.27029 4.12767 7.25318 4.15238 7.24498 4.18051L5.97206 8.70884C5.9084 8.93588 5.77239 9.13595 5.5847 9.27868C5.397 9.42141 5.16786 9.499 4.93206 9.49967H3.58331"
          stroke="#10B981"
          strokeWidth={1.2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_session_market_open">
          <rect width={13} height={13} fill="white" transform="translate(2.5 3)" />
        </clipPath>
      </defs>
    </svg>
  )
}

const Icon = withIconColor(MarketOpen)
export default Icon
