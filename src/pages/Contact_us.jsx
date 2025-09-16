import React from 'react'
import FallingTags from '../components/FallingTags';

const CarouselItem = () => {
    return (
        <span className='carousel_content'>
            <p>CONTACT US</p>
            <img src="./images/Contact_us/arrow_up_right.svg" alt="" />
        </span>
    )
}

const Contact_us = () => {

    return (
        <div className='contact_wrap'>
            <div className='falling'>
                <h1 className='title'>Got a question?</h1>
                <FallingTags />
            </div>

            <div className='carousel_box'>
                <div className='carousel'>
                    <CarouselItem />
                    <CarouselItem />
                    <CarouselItem />
                    <CarouselItem />
                    <CarouselItem />
                    <CarouselItem />
                </div>
            </div>
        </div>
    )
}

export default Contact_us