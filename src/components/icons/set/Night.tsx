import withIconColor from '../withIconColor'
import type { SvgIconProps } from '../types'

const Night = ({ size, color, ...props }: SvgIconProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect width={18} height={18} rx={4} fill="#A855F7" fillOpacity={0.1} />
      <path
        d="M12.25 5.70801H14.4167"
        stroke="#A855F7"
        strokeWidth={1.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.3333 4.625V6.79167"
        stroke="#A855F7"
        strokeWidth={1.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.8669 9.7629C13.8161 10.7033 13.494 11.6089 12.9396 12.3702C12.3851 13.1314 11.622 13.7158 10.7426 14.0526C9.86307 14.3895 8.90484 14.4644 7.98371 14.2682C7.06258 14.0721 6.21798 13.6133 5.552 12.9474C4.88602 12.2815 4.42719 11.437 4.23096 10.5159C4.03473 9.59476 4.10951 8.63653 4.44625 7.75701C4.783 6.87748 5.36729 6.11433 6.1285 5.5598C6.88972 5.00527 7.79526 4.68309 8.73567 4.63223C8.95504 4.62031 9.06988 4.8814 8.95342 5.06719C8.5639 5.6904 8.39711 6.42724 8.48027 7.15745C8.56343 7.88766 8.89163 8.56813 9.4113 9.08781C9.93097 9.60748 10.6114 9.93568 11.3417 10.0188C12.0719 10.102 12.8087 9.93521 13.4319 9.54569C13.6182 9.42923 13.8788 9.54352 13.8669 9.7629Z"
        stroke="#A855F7"
        strokeWidth={1.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const Icon = withIconColor(Night)
export default Icon
