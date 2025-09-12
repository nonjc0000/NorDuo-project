import React from 'react'

const SongCard = () => {
    return (
        <div className='SongCard_wrap'>
            <button className='play_btn'></button> {/* bg-img切換樣式 */}
            <div className='text_box'>
                <h3>Songtitle</h3>
                <p>desc</p>
            </div>
            <p>3:52</p>
        </div>
    )
}

const Latest_release = () => {
    return (
        <div className="latest_release_wrap">
            <div className="latest_release_content">
                <div className='album_cover'>
                    <div className='album_box'>
                        <figure className='album_img'>
                            <img src="./images/Latest_release/album_cover.jpg" alt="" />
                        </figure>
                        <figure className='album_deco'>
                            <img src="./images/Latest_release/album_deco.svg" alt="" />
                        </figure>
                    </div>
                </div>
                <div className='songlist'>
                    <div className="songlist_title">
                        <h2>Neon Attic</h2>
                        <p>an intimate, after-hours soundtrack</p>
                    </div>
                    <div className="songlist_items">
                        <SongCard />
                        <SongCard />
                        <SongCard />
                        <SongCard />
                        <SongCard />
                    </div>
                    <div className="btn_box">
                        <button className='Listen_on_Spotify'>
                            Listen on Spotify
                            <svg viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10 0.286133C4.47581 0.286133 0 4.76194 0 10.2861C0 15.8103 4.47581 20.2861 10 20.2861C15.5242 20.2861 20 15.8103 20 10.2861C20 4.76194 15.5242 0.286133 10 0.286133ZM14.0605 14.9998C13.8911 14.9998 13.7863 14.9474 13.629 14.8547C11.1129 13.3386 8.18548 13.274 5.29435 13.8668C5.1371 13.9071 4.93145 13.9716 4.81452 13.9716C4.42339 13.9716 4.17742 13.6611 4.17742 13.3345C4.17742 12.9192 4.42339 12.7216 4.72581 12.6571C8.02823 11.9273 11.4032 11.9918 14.2823 13.7136C14.5282 13.8708 14.6734 14.0119 14.6734 14.3789C14.6734 14.7458 14.3871 14.9998 14.0605 14.9998ZM15.1452 12.3547C14.9355 12.3547 14.7944 12.2619 14.6492 12.1853C12.129 10.6934 8.37097 10.0926 5.02823 10.9998C4.83468 11.0523 4.72984 11.1047 4.54839 11.1047C4.11694 11.1047 3.76613 10.7539 3.76613 10.3224C3.76613 9.89097 3.97581 9.60468 4.39113 9.48775C5.5121 9.17323 6.65726 8.93936 8.33468 8.93936C10.9516 8.93936 13.4798 9.58855 15.4718 10.774C15.7984 10.9676 15.9274 11.2176 15.9274 11.5684C15.9234 12.0039 15.5847 12.3547 15.1452 12.3547ZM16.3952 9.2821C16.1855 9.2821 16.0565 9.22968 15.875 9.12484C13.004 7.41113 7.87097 6.99984 4.54839 7.92726C4.40323 7.96758 4.22177 8.0321 4.02823 8.0321C3.49597 8.0321 3.08871 7.61678 3.08871 7.08049C3.08871 6.5321 3.42742 6.22162 3.79032 6.11678C5.20968 5.70146 6.79839 5.50387 8.52823 5.50387C11.4718 5.50387 14.5565 6.11678 16.8105 7.43129C17.125 7.61275 17.3306 7.86274 17.3306 8.34258C17.3306 8.89097 16.8871 9.2821 16.3952 9.2821Z" fill="#F18888" />
                            </svg>
                        </button>
                        <button className='more'>More!</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Latest_release