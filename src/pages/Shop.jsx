import React, { useEffect, useState } from 'react'

// 產品資料結構
const PRODUCTS_DATA = [
    {
        id: 'guitar',
        name: 'Foundwave Player II Telecaster',
        url: './images/shop/guitar.png'
    },
    {
        id: 'bass',
        name: 'Foundwave American Ultra Jazz Bass',
        url: './images/shop/bass.png'
    },
    {
        id: 'kb',
        name: 'Rolane RKB-88',
        url: './images/shop/kb.png'
    },
    {
        id: 'drum',
        name: 'Rolane ZAD-506',
        url: './images/shop/drum.png'
    }
];

const Shop = () => {

    const [currentImgIndex, setCurrentImgIndex] = useState(0);

    // 當currentImgIndex改變時，會觸發useEffect
    useEffect(() => {
        // 每3秒呼叫nextSlide()換下一張圖
        const autoplay = setInterval(() => {
            nextSlide();
        }, 3000);


        // 每3秒後，移除autoplay，這樣才能取得最新的索引編號
        return () => clearInterval(autoplay);
    }, [currentImgIndex]);

    // 下一張
    const nextSlide = () => {
        // 取得前一張的索引編號，檢查是否為最後一個編號
        // 是=>回到第一張
        // 否=>跳到下一張
        setCurrentImgIndex((prevIndex) => (prevIndex === PRODUCTS_DATA.length - 1 ? 0 : prevIndex + 1))
    }



    return (
        <div className='shop_wrap'>
            <figure className='deco_cube'> {/* 用bg-img寫 */}
            </figure>

            <div className='desc_box'>
                <h1>New Arrival</h1>
                <p>Find Your Sound.<br />Play Your Style.</p>
                <div className='product_container'>
                    <figure className='product_box'>
                        <img src={`${PRODUCTS_DATA[currentImgIndex].url}`} alt="" />
                    </figure>
                    <p>{PRODUCTS_DATA[currentImgIndex].name}</p>
                </div>
            </div>

            <div className='categories_box'>
                <p>Go Shopping ⟶</p>

                <div className="categories_list">
                    <div className="catagories_item" onMouseEnter={() => setCurrentImgIndex(0)}>
                        <h3 className='guitar'>Guitar</h3>
                        <h3>[01]</h3>
                    </div>
                    <div className="catagories_item" onMouseEnter={() => setCurrentImgIndex(1)}>
                        <h3 className='bass'>Bass</h3>
                        <h3>[02]</h3>
                    </div>
                    <div className="catagories_item" onMouseEnter={() => setCurrentImgIndex(2)}>
                        <h3 className='kb'>Keyboard</h3>
                        <h3>[03]</h3>
                    </div>
                    <div className="catagories_item" onMouseEnter={() => setCurrentImgIndex(3)}>
                        <h3 className='others'>Others</h3>
                        <h3>[04]</h3>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Shop