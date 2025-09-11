import React from 'react'

const SongCard = () => {
    return (
        <div className='SongCard_wrap'>
            <h3>Songtitle</h3>
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
                        <SongCard/>
                        <SongCard/>
                        <SongCard/>
                        <SongCard/>
                        <SongCard/>
                    </div>
                    <div className="btn_box">
                        <button className='Listen_on_Spotify'>
                            Listen on Spotify
                            <img src="./images/Footer/spotify.svg" alt="" style={{display:'inline-block', width: '20px'}}/>
                        </button>
                        <button className='more'>More!</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Latest_release