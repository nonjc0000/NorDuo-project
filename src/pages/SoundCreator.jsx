import React, { useState } from 'react'

const SoundCreator = () => {
    const [selectedSound, setSelectedSound] = useState(3)
    const [isPlaying, setIsPlaying] = useState(false)

    const soundOptions = [1, 2, 3, 4, 5]

    const handleSoundSelect = (soundNum) => {
        setSelectedSound(soundNum)
    }

    const togglePlay = () => {
        setIsPlaying(!isPlaying)
    }

    return (
        <div className='sound_creator_content_wrap'>
            <div className='sound_deco_left'>
                <img src="./images/SoundCreator/left-deco1.svg" alt="" />
                <img src="./images/SoundCreator/left-deco2.svg" alt="" />
                <img src="./images/SoundCreator/left-deco3.svg" alt="" />
            </div>
            <div className='sound_creator_wrap'>
                <div className='creator_header'>
                    <div className='datetime_info'>
                        <p className='datetime'>2025.08.11 MON 21:50</p>
                        <p className='earth_date'>Earth date</p>
                        <div className='signal_bars'>
                            <span className='bar'></span>
                            <span className='bar'></span>
                            <span className='bar'></span>
                            <span className='bar'></span>
                            <span className='bar'></span>
                            <span className='bar'></span>
                            <span className='bar'></span>
                            <span className='bar'></span>
                            <span className='bar'></span>
                            <span className='bar'></span>
                            <span className='bar'></span>
                            <p>100%</p>
                        </div>
                    </div>
                    <div className='creation_status'>
                        <h2 className='creating_title'>Creating...</h2>
                        <p className='file_info'>File type: sound</p>
                    </div>
                </div>

                {/* <div className='creator_main'>
                    <figure className='visual_container'>
                        <img src="./images/SoundCreator/hud-bg.png" alt="Sound visualization" />
                    </figure>
                </div> */}

                <div className='creator_controls'>
                    <div className='sound_selection'>
                        <div className='selection_panel'>
                            <h3 className='selection_title'>Choose your sound!</h3>
                            <div className='sound_numbers'>
                                {soundOptions.map((num) => (
                                    <button
                                        key={num}
                                        className={`sound_btn ${selectedSound === num ? 'active' : ''}`}
                                        onClick={() => handleSoundSelect(num)}
                                    >
                                        {num}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className='sound_visualizer'>
                            <div className='visualizer_bars'>
                                <span className='vis_bar'></span>
                                <span className='vis_bar'></span>
                                <span className='vis_bar'></span>
                                <span className='vis_bar'></span>
                                <span className='vis_bar'></span>
                            </div>
                        </div>
                    </div>

                    <div className='control_panel'>
                        <div className='control_group'>
                            <h4 className='control_label'>Random</h4>
                            <button className='random_btn'>
                                <svg width="56" height="57" viewBox="0 0 56 57" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect x="1.5" y="2.14307" width="53" height="53" rx="6.5" stroke="#F18888" stroke-width="3" />
                                    <circle cx="28.5" cy="29.1431" r="3.5" fill="#F18888" />
                                    <circle cx="16.5" cy="17.1431" r="3.5" fill="#F18888" />
                                    <circle cx="16.5" cy="41.1431" r="3.5" fill="#F18888" />
                                    <circle cx="40.5" cy="17.1431" r="3.5" fill="#F18888" />
                                    <circle cx="40.5" cy="41.1431" r="3.5" fill="#F18888" />
                                </svg>

                            </button>
                        </div>

                        <div className='control_group'>
                            <h4 className='control_label'>Sound</h4>
                            <button
                                className={`sound_toggle ${isPlaying ? 'playing' : ''}`}
                                onClick={togglePlay}
                            >
                                {isPlaying ? 'Off' : 'On'}
                            </button>
                        </div>

                        <div className='control_group'>
                            <h4 className='control_label'>Share</h4>
                            <button className='share_btn'>Copy</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className='sound_deco_right'>
                <img src="./images/SoundCreator/right-deco.svg" alt="" />
            </div>
        </div>
    )
}

export default SoundCreator