import React, { useCallback, useEffect, useRef, useState } from 'react'
import CustomAudioVisualizer from '../components/CustomAudioVisualizer'
import { FaGuitar } from "react-icons/fa6";
import { PiPianoKeysFill } from "react-icons/pi";
import { GiGuitar } from "react-icons/gi";
import { FaDrum } from "react-icons/fa";
import { GiSaxophone } from "react-icons/gi";

// 音樂檔案陣列
const AUDIO_CONFIG = [
    {
        id: 'guitar',
        name: 'guitar',
        audioUrl: './audios/guitar.mp3',
        display: <FaGuitar />
    },
    {
        id: 'kb',
        name: 'kb',
        audioUrl: './audios/kb.mp3',
        display: <PiPianoKeysFill />
    },
    {
        id: 'bass',
        name: 'bass',
        audioUrl: './audios/bass.mp3',
        display: <GiGuitar />
    },
    {
        id: 'drum',
        name: 'drum',
        audioUrl: './audios/drum.mp3',
        display: <FaDrum />
    },
    {
        id: 'sax',
        name: 'sax',
        audioUrl: './audios/sax.mp3',
        display: <GiSaxophone />
    }
];

// 全域設定
const GLOBAL_SETTINGS = {
    fadeInDuration: 1000,    // 淡入時間 (毫秒)
    fadeOutDuration: 500,    // 淡出時間 (毫秒)
    defaultVolume: 70,       // 預設音量 (0-100)
    masterVolume: 60,        // 主音量 (0-100)
    enableCrossfade: true    // 是否啟用淡入淡出效果
};

const SoundCreator = () => {
    // 狀態管理
    const [isPreloaded, setIsPreloaded] = useState(false); // 音頻是否已預載
    const [isPlaying, setIsPlaying] = useState(false); // 是否正在播放
    const [isLoading, setIsLoading] = useState(false);
    const [isGlobalMuted, setIsGlobalMuted] = useState(false);
    const [globalVolume, setGlobalVolume] = useState(GLOBAL_SETTINGS.masterVolume);
    const [errorSounds, setErrorSounds] = useState(new Set());
    const [currentDateTime, setCurrentDateTime] = useState(new Date());
    const [isCopied, setIsCopied] = useState(false);

    const [soundStates, setSoundStates] = useState(() => {
        const states = {};
        AUDIO_CONFIG.forEach(sound => {
            states[sound.id] = {
                isMuted: false,
                volume: GLOBAL_SETTINGS.defaultVolume,
                isLoaded: false,
                hasError: false,
            };
        });
        return states;
    });

    // Web Audio API 引用
    const audioContextRef = useRef(null);
    const masterGainRef = useRef(null);
    const audioBuffersRef = useRef(new Map()); // 存儲預載的音頻緩衝區
    const soundNodesRef = useRef(new Map()); // 存儲播放節點

    // 載入音頻文件但不播放
    const loadAudioFile = useCallback(async (soundConfig) => {
        try {
            const response = await fetch(soundConfig.audioUrl);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const arrayBuffer = await response.arrayBuffer();
            if (arrayBuffer.byteLength === 0) {
                throw new Error('音頻文件為空');
            }

            const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer);

            // 存儲音頻緩衝區，但不播放
            audioBuffersRef.current.set(soundConfig.id, audioBuffer);

            return audioBuffer;

        } catch (error) {
            console.error(`❌ 音頻載入失敗: ${soundConfig.name}`, error);
            setErrorSounds(prev => new Set([...prev, soundConfig.id]));
            setSoundStates(prev => ({
                ...prev,
                [soundConfig.id]: {
                    ...prev[soundConfig.id],
                    hasError: true
                }
            }));
            throw error;
        }
    }, []);

    // 預載所有音頻文件
    const preloadAllAudio = useCallback(async () => {
        if (isPreloaded) return;

        setIsLoading(true);
        setErrorSounds(new Set());

        try {
            // 創建 AudioContext
            audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();

            // 創建主音量節點
            masterGainRef.current = audioContextRef.current.createGain();
            masterGainRef.current.connect(audioContextRef.current.destination);
            masterGainRef.current.gain.value = globalVolume / 100;

            // 並行載入所有音頻文件
            const loadPromises = AUDIO_CONFIG.map(sound => loadAudioFile(sound));
            const results = await Promise.allSettled(loadPromises);

            // 統計載入結果
            const successful = results.filter(result => result.status === 'fulfilled').length;
            const failed = results.length - successful;

            if (successful > 0) {
                // 更新成功載入的音頻狀態
                AUDIO_CONFIG.forEach(sound => {
                    if (audioBuffersRef.current.has(sound.id)) {
                        setSoundStates(prev => ({
                            ...prev,
                            [sound.id]: {
                                ...prev[sound.id],
                                isLoaded: true,
                                hasError: false
                            }
                        }));
                    }
                });

                setIsPreloaded(true);
            } else {
                throw new Error('沒有任何音頻文件載入成功');
            }

            if (failed > 0) {
                console.warn(`⚠️ ${failed} 個音頻文件載入失敗，請檢查文件路徑`);
            }

        } catch (error) {
            console.error('❌ 音頻預載失敗:', error);
            alert(`音頻預載失敗: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    }, [isPreloaded, globalVolume, loadAudioFile]);

    // 創建音頻播放節點
    const createPlaybackNode = useCallback((soundId, audioBuffer) => {
        try {
            const source = audioContextRef.current.createBufferSource();
            const gainNode = audioContextRef.current.createGain();

            source.buffer = audioBuffer;
            source.loop = true;

            // 計算初始音量
            const soundVolume = soundStates[soundId].volume / 100;
            const isMuted = soundStates[soundId].isMuted || isGlobalMuted;
            const finalVolume = isMuted ? 0 : soundVolume * (globalVolume / 100);

            // 設置音量
            gainNode.gain.setValueAtTime(finalVolume, audioContextRef.current.currentTime);

            // 連接音頻圖
            source.connect(gainNode);
            gainNode.connect(masterGainRef.current);

            return { source, gainNode, audioBuffer };

        } catch (error) {
            console.error(`❌ 創建播放節點失敗: ${soundId}`, error);
            throw error;
        }
    }, [soundStates, isGlobalMuted, globalVolume]);

    // 開始播放所有音頻
    const startAllAudio = useCallback(async () => {
        if (!isPreloaded || isPlaying) return;

        try {
            // 確保 AudioContext 處於運行狀態
            if (audioContextRef.current.state === 'suspended') {
                await audioContextRef.current.resume();
            }

            // 停止並清除現有的播放節點
            soundNodesRef.current.forEach((soundNode) => {
                try {
                    soundNode.source.stop();
                    soundNode.source.disconnect();
                    soundNode.gainNode.disconnect();
                } catch (error) {
                    // 靜默處理清理錯誤
                }
            });
            soundNodesRef.current.clear();

            // 為所有已載入的音頻創建新的播放節點
            const startTime = audioContextRef.current.currentTime + 0.1; // 稍微延遲確保同步

            audioBuffersRef.current.forEach((audioBuffer, soundId) => {
                if (!soundStates[soundId].hasError) {
                    try {
                        const playbackNode = createPlaybackNode(soundId, audioBuffer);
                        soundNodesRef.current.set(soundId, playbackNode);

                        // 在統一的時間點開始播放
                        playbackNode.source.start(startTime);
                    } catch (error) {
                        console.error(`❌ 啟動 ${soundId} 播放失敗:`, error);
                    }
                }
            });

            setIsPlaying(true);

        } catch (error) {
            console.error('❌ 啟動播放失敗:', error);
            alert(`啟動播放失敗: ${error.message}`);
        }
    }, [isPreloaded, isPlaying, soundStates, createPlaybackNode]);

    // 停止所有音頻
    const stopAllAudio = useCallback(() => {
        if (!isPlaying) return;

        soundNodesRef.current.forEach((soundNode) => {
            try {
                soundNode.source.stop();
                soundNode.source.disconnect();
                soundNode.gainNode.disconnect();
            } catch (error) {
                // 靜默處理停止錯誤
            }
        });

        soundNodesRef.current.clear();
        setIsPlaying(false);
    }, [isPlaying]);

    // 切換播放/停止
    const togglePlayback = useCallback(async () => {
        if (!isPreloaded) {
            // 如果還沒預載，先預載
            await preloadAllAudio();
            return;
        }

        if (isPlaying) {
            stopAllAudio();
        } else {
            await startAllAudio();
        }
    }, [isPreloaded, isPlaying, preloadAllAudio, startAllAudio, stopAllAudio]);

    // 切換單個音頻靜音
    const toggleSoundMute = useCallback((soundId) => {
        if (!isPlaying) return;

        const soundNode = soundNodesRef.current.get(soundId);
        if (!soundNode || soundStates[soundId].hasError) return;

        const newMutedState = !soundStates[soundId].isMuted;
        const soundVolume = soundStates[soundId].volume / 100;
        const finalVolume = (newMutedState || isGlobalMuted) ? 0 : soundVolume * (globalVolume / 100);

        // 應用淡入淡出效果
        if (GLOBAL_SETTINGS.enableCrossfade) {
            const currentTime = audioContextRef.current.currentTime;
            const fadeDuration = newMutedState ? GLOBAL_SETTINGS.fadeOutDuration : GLOBAL_SETTINGS.fadeInDuration;

            soundNode.gainNode.gain.cancelScheduledValues(currentTime);
            soundNode.gainNode.gain.setValueAtTime(soundNode.gainNode.gain.value, currentTime);
            soundNode.gainNode.gain.linearRampToValueAtTime(finalVolume, currentTime + fadeDuration / 1000);
        } else {
            soundNode.gainNode.gain.value = finalVolume;
        }

        setSoundStates(prev => ({
            ...prev,
            [soundId]: {
                ...prev[soundId],
                isMuted: newMutedState
            }
        }));
    }, [isPlaying, soundStates, isGlobalMuted, globalVolume]);

    // 切換全域靜音
    const toggleGlobalMute = useCallback(() => {
        if (!isPlaying) return;

        const newGlobalMutedState = !isGlobalMuted;

        soundNodesRef.current.forEach((soundNode, soundId) => {
            if (soundStates[soundId].hasError) return;

            const soundVolume = soundStates[soundId].volume / 100;
            const isSoundMuted = soundStates[soundId].isMuted;
            const finalVolume = (newGlobalMutedState || isSoundMuted) ? 0 : soundVolume * (globalVolume / 100);

            if (GLOBAL_SETTINGS.enableCrossfade) {
                const currentTime = audioContextRef.current.currentTime;
                const fadeDuration = newGlobalMutedState ? GLOBAL_SETTINGS.fadeOutDuration : GLOBAL_SETTINGS.fadeInDuration;

                soundNode.gainNode.gain.cancelScheduledValues(currentTime);
                soundNode.gainNode.gain.setValueAtTime(soundNode.gainNode.gain.value, currentTime);
                soundNode.gainNode.gain.linearRampToValueAtTime(finalVolume, currentTime + fadeDuration / 1000);
            } else {
                soundNode.gainNode.gain.value = finalVolume;
            }
        });

        setIsGlobalMuted(newGlobalMutedState);
    }, [isPlaying, isGlobalMuted, soundStates, globalVolume]);

    // 調整全域音量
    const handleGlobalVolumeChange = useCallback((newVolume) => {
        setGlobalVolume(newVolume);

        if (masterGainRef.current) {
            masterGainRef.current.gain.value = newVolume / 100;
        }

        if (isPlaying && !isGlobalMuted) {
            soundNodesRef.current.forEach((soundNode, soundId) => {
                if (soundStates[soundId].hasError) return;

                const soundVolume = soundStates[soundId].volume / 100;
                const isSoundMuted = soundStates[soundId].isMuted;
                const finalVolume = isSoundMuted ? 0 : soundVolume * (newVolume / 100);
                soundNode.gainNode.gain.value = finalVolume;
            });
        }
    }, [isPlaying, isGlobalMuted, soundStates]);

    // 隨機切換音效
    const randomizeSounds = useCallback(() => {
        if (!isPlaying) return;

        AUDIO_CONFIG.forEach(sound => {
            const shouldMute = Math.random() > 0.5;
            if (soundStates[sound.id].isMuted !== shouldMute) {
                toggleSoundMute(sound.id);
            }
        });
    }, [isPlaying, soundStates, toggleSoundMute]);

    // 組件掛載時自動預載
    useEffect(() => {
        preloadAllAudio();
    }, [preloadAllAudio]);

    // 清理資源
    useEffect(() => {
        return () => {
            soundNodesRef.current.forEach((soundNode) => {
                try {
                    soundNode.source.stop();
                    soundNode.source.disconnect();
                    soundNode.gainNode.disconnect();
                } catch (error) {
                    // 靜默處理清理錯誤
                }
            });

            if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
                audioContextRef.current.close();
            }
        };
    }, []);

    // 時間更新
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentDateTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // 分享功能
    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (error) {
            // Fallback 方法
            const textArea = document.createElement('textarea');
            textArea.value = window.location.href;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        }
    };

    // 格式化時間
    const formatDateTime = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const weekdays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
        const weekday = weekdays[date.getDay()];
        return `${year}.${month}.${day} ${weekday} ${hours}:${minutes}`;
    };

    // 檢查是否有任何音頻在播放（用於視覺化）
    const hasActiveAudio = isPlaying && !isGlobalMuted &&
        Object.values(soundStates).some(state => !state.isMuted && !state.hasError);

    return (
        <div className='sound_creator_content_wrap'>
            <div className='sound_deco_left'>
                <img className='left1' src="./images/SoundCreator/left-deco1.svg" alt="" />
                <img className='left2' src="./images/SoundCreator/left-deco2.svg" alt="" />
                <img className='left3' src="./images/SoundCreator/left-deco3.svg" alt="" />
            </div>

            <div className='sound_creator_wrap'>
                <video src="./videos/noise.mp4" autoPlay loop muted playsInline className='sound_creator_vid' />

                <div className='creator_header'>
                    <div className='datetime_info'>
                        <p className='datetime'>{formatDateTime(currentDateTime)}</p>
                        <p className='earth_date'>Earth date</p>
                        <div className='signal_bars' style={{ marginTop: '10px' }}>
                            {Array.from({ length: 10 }, (_, index) => {
                                const barLevel = (index + 1) * 10;
                                const isActive = globalVolume >= barLevel;
                                return (
                                    <span
                                        key={index}
                                        className="bar"
                                        style={{
                                            backgroundColor: isActive ? '#F18888' : '#adb5bd',
                                            opacity: isActive ? 1 : 0.3,
                                            cursor: isPreloaded ? 'pointer' : 'not-allowed',
                                            transition: 'all 0.2s ease'
                                        }}
                                        onClick={() => {
                                            if (isPreloaded) {
                                                handleGlobalVolumeChange(barLevel);
                                            }
                                        }}
                                    />
                                );
                            })}
                            <p>Volume: {globalVolume}%</p>
                        </div>
                    </div>

                    <div className='creation_status'>
                        <h2 className='creating_title'>
                            {isLoading ? 'Loading...' :
                                !isPreloaded ? 'Ready to Load' :
                                    isPlaying ? 'Creating...' : 'Ready to Play'}
                        </h2>
                        <p className='file_info'>File type: sound</p>
                    </div>
                </div>

                <div className='creator_controls'>
                    <div className='sound_selection'>
                        <div className='selection_panel'>
                            <h3 className='selection_title'>Choose your instruments!</h3>
                            <div className='sound_numbers'>
                                {AUDIO_CONFIG.map((sound) => {
                                    const isActive = isPreloaded && isPlaying && !soundStates[sound.id].isMuted && !isGlobalMuted;
                                    const hasError = soundStates[sound.id].hasError;
                                    const isLoaded = soundStates[sound.id].isLoaded;

                                    return (
                                        <button
                                            key={sound.id}
                                            className={`sound_btn ${isActive ? 'active' : ''}`}
                                            onClick={() => {
                                                if (!isPreloaded) {
                                                    preloadAllAudio();
                                                } else if (isPlaying) {
                                                    toggleSoundMute(sound.id);
                                                }
                                            }}
                                            disabled={isLoading || hasError || (!isPreloaded && !isLoading)}
                                            style={{
                                                opacity: hasError ? 0.5 : isLoaded ? 1 : 0.7,
                                                backgroundColor: hasError ? '#ff6b6b' : undefined
                                            }}
                                        >
                                            {sound.display}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className='sound_visualizer'>
                            <CustomAudioVisualizer
                                audioContext={audioContextRef.current}
                                masterGainNode={masterGainRef.current}
                                width={200}
                                height={75}
                                barWidth={6}
                                gap={10}
                                barColor="#F18888"
                                isActive={hasActiveAudio}
                            />
                        </div>
                    </div>

                    <div className='control_panel'>
                        <div className='control_group'>
                            <h4 className='control_label'>Random</h4>
                            <button
                                className='random_btn'
                                onClick={randomizeSounds}
                                disabled={!isPlaying}
                            >
                                <svg width="56" height="57" viewBox="0 0 56 57" fill="transparent" xmlns="http://www.w3.org/2000/svg">
                                    <rect x="1.5" y="2.14307" width="53" height="53" rx="6.5" strokeWidth="3" />
                                    <circle cx="28.5" cy="29.1431" r="3.5" />
                                    <circle cx="16.5" cy="17.1431" r="3.5" />
                                    <circle cx="16.5" cy="41.1431" r="3.5" />
                                    <circle cx="40.5" cy="17.1431" r="3.5" />
                                    <circle cx="40.5" cy="41.1431" r="3.5" />
                                </svg>
                            </button>
                        </div>

                        <div className='control_group'>
                            <h4 className='control_label'>Sound</h4>
                            <button
                                className={'sound_toggle'}
                                onClick={isPlaying ? toggleGlobalMute : togglePlayback}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Loading...' :
                                    !isPreloaded ? 'Load' :
                                        !isPlaying ? 'Start' :
                                            isGlobalMuted ? 'Unmute' : 'Mute'}
                            </button>
                        </div>

                        <div className='control_group'>
                            <h4 className='control_label'>Share</h4>
                            <button className='share_btn' onClick={handleShare}>
                                {isCopied ? 'Copied!' : 'Link'}
                            </button>
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