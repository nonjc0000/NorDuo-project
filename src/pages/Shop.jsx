import React, { useState } from 'react'

const Shop = () => {

    return (
        <div className='shop_wrap'>
            <figure className='deco_cube'> {/* 用bg-img寫 */}
            </figure>

            <div className='desc_box'>
                <h1>New Arrival</h1>
                <p>Find Your Sound.<br />Play Your Style.</p>
                <div className='product_container'>
                    <figure className='product_box'>
                        <img src="./images/shop/guitar.png" alt="" />
                    </figure>
                    <p>Foundwave Player II Terecaster </p>
                </div>
            </div>

            <div className='categories_box'>
                <p>Go Shopping ⟶</p>

                <div className="categories_list">
                    <div className="catagories_item">
                        <h3 className='guitar'>Guitar</h3>
                        <h3>[01]</h3>
                    </div>
                    <div className="catagories_item">
                        <h3 className='bass'>Bass</h3>
                        <h3>[02]</h3>
                    </div>
                    <div className="catagories_item">
                        <h3 className='kb'>Keyboard</h3>
                        <h3>[03]</h3>
                    </div>
                    <div className="catagories_item">
                        <h3 className='others'>Others</h3>
                        <h3>[04]</h3>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Shop