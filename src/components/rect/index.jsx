import React from "react"
import './index.css'
export const RectBox = ({ position, value, checked, currentValue, width, height }) => {
  return (
    <div onClick={() => checked(value)} style={({ top: position.top, left: position.left, width: width ? `${width}px` : '83px',height: height ? `${height}px` : '83px', })} className={currentValue.includes(value) ? 'box-wrapper active' : 'box-wrapper'}>
      {/* <div></div>
      <div></div>
      <div></div>
      <div></div> */}
    </div>
  )
}