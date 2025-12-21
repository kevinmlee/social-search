import PropTypes from 'prop-types'
import React from 'react'

const Icon = ({ glyph, size = 24, viewBoxSize = 24, ...props }) => (
  <i {...props}>
    <svg viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`} height={size} width={size}>
      <path d={glyph} fill="currentColor" />
    </svg>
  </i>
)

Icon.propTypes = {
  glyph: PropTypes.string.isRequired,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  viewBoxSize: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
}

export default Icon