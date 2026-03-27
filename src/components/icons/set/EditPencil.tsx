import withIconColor from '../withIconColor'
import type { SvgIconProps } from '../types'

const EditPencil = ({ size, color, ...props }: SvgIconProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox='0 0 18 18'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      <path
        d='M10.085 6.37012L4 12.4547V14.0005H5.54583L11.6304 7.91553L10.085 6.37012Z'
        fill='currentColor'
      />
      <path
        d='M13.6799 4.32004C13.4749 4.11512 13.1969 4 12.907 4C12.6172 4 12.3391 4.11512 12.1341 4.32004L10.6758 5.78046L12.2212 7.32588L13.6795 5.86754C13.7813 5.76602 13.862 5.64543 13.9171 5.51268C13.9722 5.37993 14.0006 5.23761 14.0006 5.09388C14.0007 4.95015 13.9724 4.80782 13.9173 4.67503C13.8623 4.54225 13.7816 4.42162 13.6799 4.32004Z'
        fill='currentColor'
      />
    </svg>
  )
}

const Icon = withIconColor(EditPencil)
export default Icon
