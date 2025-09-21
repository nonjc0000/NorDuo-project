import React, { useCallback, useEffect, useRef, useState } from 'react'

// 音樂檔案陣列
const AUDIO_CONFIG = [
    {
        id: 'guitar',
        name: 'guitar',
        audioUrl: './audios/guitar.mp3',
        displayNumber: 1
    },
    {
        id: 'kb',
        name: 'kb',
        audioUrl: './audios/kb.mp3',
        displayNumber: 2
    },
    {
        id: 'bass',
        name: 'bass',
        audioUrl: './audios/bass.mp3',
        displayNumber: 3
    },
    {
        id: 'drum',
        name: 'drum',
        audioUrl: './audios/drum.mp3',
        displayNumber: 4
    },
    {
        id: 'sax',
        name: 'sax',
        audioUrl: './audios/sax.mp3',
        displayNumber: 5
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
    const [isInitialized, setIsInitialized] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [isGlobalMuted, setIsGlobalMuted] = useState(false);
    const [globalVolume, setGlobalVolume] = useState(GLOBAL_SETTINGS.masterVolume);
    const [errorSounds, setErrorSounds] = useState(new Set());
    const [selectedSound, setSelectedSound] = useState(null); // 當前選中的音效

    const [soundStates, setSoundStates] = useState(() => {
        const states = {};
        AUDIO_CONFIG.forEach(sound => {
            states[sound.id] = {
                isMuted: false,
                volume: GLOBAL_SETTINGS.defaultVolume,
                isLoaded: false,
                isPlaying: false,
                hasError: false,
            };
        });
        return states;
    });

    // Web Audio API 引用
    const audioContextRef = useRef(null);
    const masterGainRef = useRef(null);
    const soundNodesRef = useRef(new Map());

    const loadAudioFile = useCallback(async (soundConfig) => {
        try {
            console.log(`🔄 正在載入音頻: ${soundConfig.name} (${soundConfig.audioUrl})`);

            // 檢查文件是否存在
            const response = await fetch(soundConfig.audioUrl);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('audio')) {
                console.warn(`⚠️ 警告: ${soundConfig.audioUrl} 可能不是音頻文件 (Content-Type: ${contentType})`);
            }

            const arrayBuffer = await response.arrayBuffer();

            if (arrayBuffer.byteLength === 0) {
                throw new Error('音頻文件為空');
            }

            const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer);

            console.log(`✅ 音頻載入成功: ${soundConfig.name} (時長: ${audioBuffer.duration.toFixed(1)}秒)`);
            return audioBuffer;

        } catch (error) {
            console.error(`❌ 音頻載入失敗: ${soundConfig.name}`, error);

            // 記錄錯誤
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

    // 創建音頻節點
    const createAudioNode = useCallback((soundConfig, audioBuffer) => {
        try {
            const source = audioContextRef.current.createBufferSource();
            const gainNode = audioContextRef.current.createGain();

            source.buffer = audioBuffer;
            source.loop = true;

            // 計算最終音量
            const soundVolume = soundStates[soundConfig.id].volume / 100;
            const isMuted = soundStates[soundConfig.id].isMuted || isGlobalMuted;
            const finalVolume = isMuted ? 0 : soundVolume * (globalVolume / 100);

            // 設置音量（支援淡入效果）
            if (GLOBAL_SETTINGS.enableCrossfade) {
                gainNode.gain.setValueAtTime(0, audioContextRef.current.currentTime);
                gainNode.gain.linearRampToValueAtTime(
                    finalVolume,
                    audioContextRef.current.currentTime + GLOBAL_SETTINGS.fadeInDuration / 1000
                );
            } else {
                gainNode.gain.value = finalVolume;
            }

            // 連接音頻圖
            source.connect(gainNode);
            gainNode.connect(masterGainRef.current);

            // 開始播放
            source.start();

            return { source, gainNode, audioBuffer };

        } catch (error) {
            console.error(`❌ 創建音頻節點失敗: ${soundConfig.name}`, error);
            throw error;
        }
    }, [soundStates, isGlobalMuted, globalVolume]);

    // 初始化單個音頻
    const initializeSound = useCallback(async (soundConfig, index) => {
        try {
            // 更新載入進度
            setLoadingProgress(Math.round((index / AUDIO_CONFIG.length) * 100));

            const audioBuffer = await loadAudioFile(soundConfig);
            const audioNodes = createAudioNode(soundConfig, audioBuffer);

            // 存儲節點引用
            soundNodesRef.current.set(soundConfig.id, {
                ...audioNodes,
                isPlaying: true
            });

            // 更新狀態
            setSoundStates(prev => ({
                ...prev,
                [soundConfig.id]: {
                    ...prev[soundConfig.id],
                    isLoaded: true,
                    isPlaying: true,
                    hasError: false
                }
            }));

            return true;

        } catch (error) {
            console.error(`❌ 初始化音頻失敗: ${soundConfig.name}`, error);
            return false;
        }
    }, [loadAudioFile, createAudioNode]);

    // 初始化音頻系統
    const initializeAudioSystem = useCallback(async () => {
        if (isInitialized) return;

        setIsLoading(true);
        setLoadingProgress(0);
        setErrorSounds(new Set());

        try {
            console.log('🎵 開始初始化音頻系統...');

            // 創建 AudioContext
            audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();

            // 恢復 AudioContext
            if (audioContextRef.current.state === 'suspended') {
                await audioContextRef.current.resume();
            }

            // 創建主音量節點
            masterGainRef.current = audioContextRef.current.createGain();
            masterGainRef.current.connect(audioContextRef.current.destination);
            masterGainRef.current.gain.value = globalVolume / 100;

            console.log(`🎛️ AudioContext 創建成功 (採樣率: ${audioContextRef.current.sampleRate}Hz)`);

            // 並行載入所有音頻文件
            const loadPromises = AUDIO_CONFIG.map((sound, index) =>
                initializeSound(sound, index)
            );

            const results = await Promise.allSettled(loadPromises);

            // 統計載入結果
            const successful = results.filter(result => result.status === 'fulfilled' && result.value).length;
            const failed = results.length - successful;

            setLoadingProgress(100);
            setIsInitialized(true);

            console.log(`✅ 音頻系統初始化完成! 成功: ${successful}, 失敗: ${failed}`);

            if (failed > 0) {
                console.warn(`⚠️ ${failed} 個音頻文件載入失敗，請檢查文件路徑`);
            }

        } catch (error) {
            console.error('❌ 音頻系統初始化失敗:', error);
            alert(`音頻系統初始化失敗: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    }, [isInitialized, globalVolume, initializeSound]);

    // 切換單個音頻靜音
    const toggleSoundMute = useCallback((soundId) => {
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

        const soundName = AUDIO_CONFIG.find(s => s.id === soundId)?.name;
        console.log(`🔇 ${soundName} ${newMutedState ? '靜音' : '取消靜音'}`);
    }, [soundStates, isGlobalMuted, globalVolume]);

    // 切換全域靜音
    const toggleGlobalMute = useCallback(() => {
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
        console.log(`🔇 全域${newGlobalMutedState ? '靜音' : '取消靜音'}`);
    }, [isGlobalMuted, soundStates, globalVolume]);

    // 調整全域音量
    const handleGlobalVolumeChange = useCallback((newVolume) => {
        setGlobalVolume(newVolume);

        if (masterGainRef.current) {
            masterGainRef.current.gain.value = newVolume / 100;
        }

        if (!isGlobalMuted) {
            soundNodesRef.current.forEach((soundNode, soundId) => {
                if (soundStates[soundId].hasError) return;

                const soundVolume = soundStates[soundId].volume / 100;
                const isSoundMuted = soundStates[soundId].isMuted;
                const finalVolume = isSoundMuted ? 0 : soundVolume * (newVolume / 100);
                soundNode.gainNode.gain.value = finalVolume;
            });
        }
    }, [isGlobalMuted, soundStates]);

    // 隨機切換音效（新增功能）
    const randomizeSounds = useCallback(() => {
        if (!isInitialized) return;

        AUDIO_CONFIG.forEach(sound => {
            const shouldMute = Math.random() > 0.5;
            if (soundStates[sound.id].isMuted !== shouldMute) {
                toggleSoundMute(sound.id);
            }
        });
    }, [isInitialized, soundStates, toggleSoundMute]);

    // 清理資源
    useEffect(() => {
        return () => {
            soundNodesRef.current.forEach((soundNode) => {
                try {
                    soundNode.source.stop();
                    soundNode.source.disconnect();
                    soundNode.gainNode.disconnect();
                } catch (error) {
                    console.warn('清理音頻資源時出現錯誤:', error);
                }
            });

            if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
                audioContextRef.current.close();
            }
        };
    }, []);

    return (
        <div className='sound_creator_content_wrap'>
            {/* 載入遮罩 */}
            {isLoading && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 9999,
                    color: 'white'
                }}>
                    <div style={{ textAlign: 'center' }}>
                        <div>Loading...</div>
                        <div>{loadingProgress}% completed</div>
                    </div>
                </div>
            )}

            <div className='sound_deco_left'>
                <img className='left1' src="./images/SoundCreator/left-deco1.svg" alt="" />
                <img className='left2' src="./images/SoundCreator/left-deco2.svg" alt="" />
                <img className='left3' src="./images/SoundCreator/left-deco3.svg" alt="" />
            </div>
            
            <div className='sound_creator_wrap'>
                <video src="./videos/noise.mp4" autoPlay loop muted playsInline className='sound_creator_vid' />
                
                <div className='creator_header'>
                    <div className='datetime_info'>
                        <p className='datetime'>2025.08.11 MON 21:50</p>
                        <p className='earth_date'>Earth date</p>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={globalVolume}
                            onChange={(e) => handleGlobalVolumeChange(parseInt(e.target.value))}
                            disabled={!isInitialized}
                            style={{ marginTop: '10px' }}
                        />
                        <span>{globalVolume}%</span>
                        
                        {/* 錯誤提示 */}
                        {errorSounds.size > 0 && (
                            <div style={{ 
                                marginTop: '10px', 
                                fontSize: '0.8rem', 
                                color: '#ff6b6b' 
                            }}>
                                ⚠️ {errorSounds.size} 個音頻載入失敗
                            </div>
                        )}
                    </div>
                    
                    <div className='creation_status'>
                        <h2 className='creating_title'>
                            {isInitialized ? 'Creating...' : 'Waiting...'}
                        </h2>
                        <p className='file_info'>File type: sound</p>
                    </div>
                </div>

                <div className='creator_controls'>
                    <div className='sound_selection'>
                        <div className='selection_panel'>
                            <h3 className='selection_title'>Choose your sound!</h3>
                            <div className='sound_numbers'>
                                {AUDIO_CONFIG.map((sound) => {
                                    const isActive = isInitialized && !soundStates[sound.id].isMuted && !isGlobalMuted;
                                    const hasError = soundStates[sound.id].hasError;
                                    
                                    return (
                                        <button
                                            key={sound.id}
                                            className={`sound_btn ${isActive ? 'active' : ''}`}
                                            onClick={() => isInitialized ? toggleSoundMute(sound.id) : initializeAudioSystem()}
                                            disabled={isLoading || hasError}
                                            style={{
                                                opacity: hasError ? 0.5 : 1,
                                                backgroundColor: hasError ? '#ff6b6b' : undefined
                                            }}
                                        >
                                            {sound.displayNumber}
                                        </button>
                                    );
                                })}
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
                            <button 
                                className='random_btn'
                                onClick={randomizeSounds}
                                disabled={!isInitialized}
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
                                className={`sound_toggle ${!isGlobalMuted ? 'playing' : ''}`}
                                onClick={isInitialized ? toggleGlobalMute : initializeAudioSystem}
                                disabled={isLoading}
                            >
                                {!isInitialized ? 'Start' : isGlobalMuted ? 'On' : 'Off'}
                            </button>
                        </div>

                        <div className='control_group'>
                            <h4 className='control_label'>Share</h4>
                            <button 
                                className='share_btn'
                                onClick={() => {
                                    const activeTrackNumbers = AUDIO_CONFIG
                                        .filter(sound => !soundStates[sound.id].isMuted && !isGlobalMuted)
                                        .map(sound => sound.displayNumber);
                                    
                                    if (activeTrackNumbers.length > 0) {
                                        const shareText = `正在播放音軌: ${activeTrackNumbers.join(', ')}`;
                                        if (navigator.share) {
                                            navigator.share({ text: shareText });
                                        } else {
                                            navigator.clipboard.writeText(shareText);
                                            alert('分享內容已複製到剪貼板！');
                                        }
                                    } else {
                                        alert('沒有播放中的音軌可分享');
                                    }
                                }}
                                disabled={!isInitialized}
                            >
                                Link
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