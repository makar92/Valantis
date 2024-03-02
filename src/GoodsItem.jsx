import React from 'react'

const GoodsItem = (props) => {
  return (
    <div className='goodsItem'>
      <div className='goodsItem__header'>
        <div className='goodsItem__name'>{props.product}</div>
        <div className='goodsItem__price'>
          <span>Цена: </span><span>{props.price} р.</span>
        </div>
      </div>
      {props.brand !== null
        ?<div className='goodsItem__brand'><span>Брэнд: </span>{props.brand}</div>
        :""
      }
      <div className='goodsItem__id'><span>ID:</span> {props.id}</div>
    </div>
  )
}

export default GoodsItem