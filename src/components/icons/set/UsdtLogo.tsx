import withIconColor from '../withIconColor'
import type { SvgIconProps } from '../types'

const UsdtLogo = ({ size, color, ...props }: SvgIconProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g clipPath="url(#clip0_usdt_logo)">
        <path
          d="M8 0C12.4181 0 16 3.58192 16 8C16 12.4181 12.4179 16 8 16C3.58208 16 0 12.419 0 8C0 3.58096 3.58144 0 8 0Z"
          fill="#53AE94"
        />
        <path
          d="M8.98734 6.93402V5.74394H11.7088V3.93066H4.29822V5.74394H7.01998V6.93306C4.80798 7.03466 3.14478 7.47274 3.14478 7.99754C3.14478 8.52234 4.80878 8.96042 7.01998 9.06266V12.8747H8.98798V9.06235C11.196 8.96042 12.8558 8.52266 12.8558 7.99834C12.8558 7.47402 11.196 7.03626 8.98798 6.93434M8.98798 8.73946V8.7385C8.93246 8.74202 8.64718 8.75914 8.01198 8.75914C7.50414 8.75914 7.14686 8.74474 7.02094 8.73818V8.73978C5.0667 8.65322 3.60798 8.3129 3.60798 7.9057C3.60798 7.4985 5.06686 7.15866 7.02094 7.07194V8.40074C7.14894 8.40954 7.51502 8.43114 8.0203 8.43114C8.62718 8.43114 8.9323 8.40586 8.9883 8.40074V7.07194C10.9387 7.15882 12.3941 7.49946 12.3941 7.90522C12.3941 8.31098 10.9381 8.65178 8.9883 8.73866"
          fill="white"
        />
      </g>
      <defs>
        <clipPath id="clip0_usdt_logo">
          <rect width={16} height={16} fill="white" />
        </clipPath>
      </defs>
    </svg>
  )
}

const Icon = withIconColor(UsdtLogo)
export default Icon
