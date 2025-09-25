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
        url: './images/shop/bass.jpg'
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
    const [isHovering, setIsHovering] = useState(false); // 追蹤hover狀態

    // 當currentImgIndex改變時，會觸發useEffect
    useEffect(() => {

        if (isHovering) {
            // 如果正在hover，不設置自動播放
            return;
        }

        // 每3秒呼叫nextSlide()換下一張圖
        const autoplay = setInterval(() => {
            setCurrentImgIndex((prevIndex) => (prevIndex === PRODUCTS_DATA.length - 1 ? 0 : prevIndex + 1));
        }, 3000);


        // 每3秒後，移除autoplay，這樣才能取得最新的索引編號
        return () => clearInterval(autoplay);
    }, [isHovering]); // 只依賴isHovering，不依賴currentImgIndex


    // 處理hover進入
    const handleMouseEnter = (index) => {
        setIsHovering(true);
        setCurrentImgIndex(index);
    }

    // 處理hover離開
    const handleMouseLeave = () => {
        setIsHovering(false);
        // hover離開後，會重新觸發useEffect，恢復自動播放
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
                        <img src={`${PRODUCTS_DATA[currentImgIndex].url}`} alt={PRODUCTS_DATA[currentImgIndex].name} />
                    </figure>
                    <p>{PRODUCTS_DATA[currentImgIndex].name}</p>
                </div>
            </div>

            <div className='categories_box'>
                <p>Go Shopping ⟶</p>

                <div className="categories_list">
                    <div className="catagories_item"
                        onMouseEnter={() => handleMouseEnter(0)}
                        onMouseLeave={handleMouseLeave}>
                        <h3 className='guitar'>Guitar</h3>
                        <h3>[01]</h3>
                    </div>
                    <div className="catagories_item"
                        onMouseEnter={() => handleMouseEnter(1)}
                        onMouseLeave={handleMouseLeave}>
                        <h3 className='bass'>Bass</h3>
                        <h3>[02]</h3>
                    </div>
                    <div className="catagories_item"
                        onMouseEnter={() => handleMouseEnter(2)}
                        onMouseLeave={handleMouseLeave}>
                        <h3 className='kb'>Keyboard</h3>
                        <h3>[03]</h3>
                    </div>
                    <div className="catagories_item"
                        onMouseEnter={() => handleMouseEnter(3)}
                        onMouseLeave={handleMouseLeave}>
                        <h3 className='others'>Others</h3>
                        <h3>[04]</h3>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Shop