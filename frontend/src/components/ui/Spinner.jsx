import React from 'react'

const Spinner = ({ size = 'h-5 w-5' }) => {
  return (
    <div
      className={`${size} animate-spin rounded-full border-2 border-white border-t-transparent`}
    />
  )
}

export default Spinner