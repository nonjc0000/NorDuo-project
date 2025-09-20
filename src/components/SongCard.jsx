import React, { useEffect, useRef, useState } from 'react'

const SongCard = ({ songTitle, desc, audioSrc }) => {

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

    // handle when metadata is loaded (duration included)
    const handleLoadedMetadata = () => {
        setDuration(audioRef.current.duration);
    }

    // format duration
    const formatDuration = (durationSeconds) => {
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
        const audio = audioRef.current;

        // 監聽 timeupdate 事件
        audio.addEventListener('timeupdate', handleTimeUpdate);

        // 監聽 loadedmetadata 事件 - 這會在 duration 可用時觸發
        audio.addEventListener('loadedmetadata', handleLoadedMetadata);

        // clean up the eventListeners when component unmount
        return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        };
    }, []);

    return (
        <div className='SongCard_wrap'>
            <audio ref={audioRef} src={audioSrc} preload="metadata"/>
            <button className={
                isPlaying ? 'play_btn pause' : 'play_btn play'
            } onClick={handlePlayPause}>
            </button> {/* bg-img切換樣式 */}
            <div className='text_box'>
                <h3>{songTitle}</h3>
                <p>{desc}</p>
            </div>
            <p>
                {
                    isPlaying ?
                        formatDuration(currentTime) :
                        formatDuration(duration)
                }
            </p>
        </div>
    )
}

export default SongCard