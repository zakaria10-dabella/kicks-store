/** Side-profile sneaker drawn in SVG, recoloured per product. No image files needed. */
export default function ShoeArt({ colors, className = '', shadow = true }) {
  const { upper, sole, outsole, accent, lace } = colors
  return (
    <svg viewBox="0 0 400 240" className={className} aria-hidden="true">
      {shadow && <ellipse cx="210" cy="214" rx="170" ry="12" fill="#000" opacity=".12" />}
      {/* outsole + midsole */}
      <path d="M40 190 Q36 206 58 208 L350 208 Q380 206 382 188 L382 180 L40 180 Z" fill={outsole} />
      <path d="M36 158 L384 158 Q394 168 386 184 L40 188 Q28 176 36 158Z" fill={sole} />
      <path d="M44 172 L380 170" stroke="#000" strokeOpacity=".08" strokeWidth="3" />
      {/* upper */}
      <path d="M48 162 C42 120 50 88 70 68 C80 58 98 56 112 64 L140 82 C170 96 200 104 236 112 C290 124 340 134 366 146 C386 154 388 162 384 162 Z" fill={upper} />
      <path d="M48 162 C42 120 50 88 70 68 C80 58 98 56 112 64 L140 82 C170 96 200 104 236 112 C290 124 340 134 366 146 C386 154 388 162 384 162 Z" fill="url(#shade)" opacity=".5" />
      {/* toe cap + mudguard */}
      <path d="M296 124 C340 132 372 144 384 160 L296 162 C292 150 292 136 296 124Z" fill="#000" opacity=".07" />
      <path d="M52 150 L382 150 L384 162 L48 162 Z" fill="#000" opacity=".06" />
      {/* collar + tongue */}
      <path d="M118 62 C128 46 152 44 164 56 L160 96 L132 86Z" fill={upper} stroke="#000" strokeOpacity=".12" />
      <path d="M68 70 C80 60 100 60 116 70 L108 80 C96 72 82 72 74 80 Z" fill="#000" opacity=".55" />
      {/* heel tab */}
      <path d="M48 162 C42 128 46 100 58 80 L72 86 C62 110 62 138 66 162 Z" fill={accent} />
      {/* side stripe */}
      <path d="M104 150 C180 146 252 128 334 98 C268 140 190 162 112 164 Z" fill={accent} />
      {/* laces */}
      {[0, 1, 2, 3, 4].map((i) => {
        const x = 150 + i * 24
        const y = 94 + i * 6
        return (
          <g key={i}>
            <circle cx={x - 2} cy={y + 6} r="3" fill="#000" opacity=".35" />
            <path d={`M${x - 4} ${y + 8} L${x + 16} ${y - 6}`} stroke={lace} strokeWidth="6" strokeLinecap="round" />
          </g>
        )
      })}
      {/* stitching */}
      <path d="M62 146 C140 142 260 140 372 148" fill="none" stroke="#000" strokeOpacity=".18" strokeWidth="1.5" strokeDasharray="4 5" />
      <defs>
        <linearGradient id="shade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".35" />
          <stop offset="1" stopColor="#000" stopOpacity=".15" />
        </linearGradient>
      </defs>
    </svg>
  )
}
