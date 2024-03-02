import React from 'react'

const Button = (props) => {
  return (
      <button onClick={props.onClick} className='button'>
        {props.text}
      </button>
  )
}

export default Button