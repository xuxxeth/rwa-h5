import * as React from "react"

interface CandleIconProps extends React.SVGProps<SVGSVGElement> {}

export default function CandleIcon({
  className,
  ...props
}: CandleIconProps) {
  return (
    <svg
      width="16" height="16" viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path d="M16 15.1452C16 15.3719 15.9063 15.5894 15.7396 15.7498C15.5727 15.9102 15.3466 16 15.1104 16H0.889583C0.653646 16 0.427344 15.9099 0.260417 15.7498C0.0934896 15.5894 0 15.3719 0 15.1452V6.16917C0 5.90543 0.127083 5.65646 0.34375 5.49456L7.45417 0.179787C7.77526 -0.0599288 8.22474 -0.0599288 8.54583 0.179787L15.6562 5.49456C15.8729 5.65646 16 5.90543 16 6.16917V15.1452ZM7 7V14.2905H9V7H7Z" fill="currentColor"/>
    </svg>
  )
}