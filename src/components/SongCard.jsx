import React, { useState } from 'react'

const SongCard = ({audioSrc}) => {

    // playing state

    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    // const audioRef = useRef(null);

    return (
        <div className='SongCard_wrap'>
            {/* <audio ref={audioRef} src={audioSrc} /> */}
            <button className='play_btn pause' /* onClick={handlePlayPause} */>
                </button> {/* bg-img切換樣式 */}
            <div className='text_box'>
                <h3>Songtitle</h3>
                <p>desc</p>
            </div>
            <p>{duration}</p>
        </div>
    )
}

export default SongCard