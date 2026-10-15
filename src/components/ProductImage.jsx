import { photo } from '../data/products'

/**
 * A product photograph in a square, neutral tile.
 * fit="cover" crops to the product's focal point; fit="contain" shows the whole frame on the tile.
 */
export default function ProductImage({ p, fit = 'cover', eager = false, className = '', imgClassName = '', style, sizes = '(min-width: 1024px) 25vw, 50vw' }) {
  return (
    <img
      src={photo(p.id)}
      alt={`${p.name} in ${p.colorway}, ${p.line} ${p.category.toLowerCase()} sneaker`}
      width={p.w}
      height={p.h}
      sizes={sizes}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      draggable={false}
      style={{ objectPosition: fit === 'cover' ? p.pos : '50% 50%', ...style }}
      className={`h-full w-full ${fit === 'cover' ? 'object-cover' : 'object-contain'} ${imgClassName} ${className}`}
    />
  )
}
