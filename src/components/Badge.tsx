import BadgeDot from '@/components/icons/set/BadgeDot'

export const Badge = () => {
  return (
    <span
      className="absolute"
      style={{
        right: '-5px',
        top: '0',
        width: '6px',
        height: '6px',
        aspectRatio: '1/1',
      }}
    >
      <BadgeDot size={6} />
    </span>
  )
}
