import React, { useEffect, useRef, useState } from 'react'

const SongCard = ({ audioSrc }) => {

    // playing state

    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    const audioRef = useRef(null);

    // update the current time
    const handleTimeUpdate = () => {
        setCurrentTime(audioRef.current.currentTime);
        setDuration(audioRef.current.duration);
    }

    // format duration
    function formatDuration(durationSeconds) {
        const minutes = Math.floor(durationSeconds / 60);
        const seconds = Math.floor(durationSeconds % 60);
        const formattedSeconds = seconds.toString().padStart(2, "0");
        return `${minutes}:${formattedSeconds}`
    }

    // Fn to handle playing
    const handlePlay = () => {

        audioRef.current.play();
        setIsPlaying(true);
    }

    // Fn to handle pausing
    const handlePause = () => {

        audioRef.current.pause();
        setIsPlaying(false);
    }

    // btn play state toggle
    const handlePlayPause = () => {

        if (isPlaying) {
            handlePause();
        } else {
            handlePlay();
        }
    }

    // listen for time update
    useEffect(() => {
        audioRef.current.addEventListener('timeupdate', handleTimeUpdate);

        // clean up the eventListener when component unmount
        return () => {
            audioRef.current.removeEventListener('timeupdate', handleTimeUpdate)
        };
    }, []);

    return (
        <div className='SongCard_wrap'>
            <audio ref={audioRef} src={audioSrc} />
            <button className={
                isPlaying ? 'play_btn pause' : 'play_btn play'
            } onClick={handlePlayPause}>
            </button> {/* bg-img切換樣式 */}
            <div className='text_box'>
                <h3>Songtitle</h3>
                <p>desc</p>
            </div>
            <p>{formatDuration(duration)}</p>
        </div>
    )
}

export default SongCard