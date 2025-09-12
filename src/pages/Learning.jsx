import React from 'react'

const Learning = () => {
    return (
        <div className="learning_wrap">{/* 背景三角形 */}
            <svg className="bg_triangle" viewBox="0 0 100 100" preserveAspectRatio="none">
                <polygon points="100,0 100,100 0,100" fill='none' />
            </svg>


            <div className="learning_content_box">
                <div className="text_box">
                    <h1><span>Learn</span> with us!</h1>
                    <div className="desc_box">
                        <p>Find Your Sound. <br />
                            Play Your Style.</p>
                        <p>We help you master riffs, rhythm, and improvisation—anytime, anywhere.</p>
                        <p>Go check our online <br />courses ⟶</p>
                    </div>
                    <div className="card_box">
                        <div className='card1'>
                            <p>Learn<br />
                                Guitar</p>
                            <figure className='card1_img'></figure> {/* 用bg-image切換hover */}
                        </div>
                        <div className='card2'>
                            <p>Learn<br />
                                Music<br />
                                Theory</p>
                            <figure className='card2_img'></figure>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Learning