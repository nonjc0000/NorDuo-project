import React, { useState, useEffect, useCallback, useRef } from 'react';

// 🎵 音頻配置 - 在這裡替換你的音頻文件路徑
const AUDIO_CONFIG = [
  { 
    id: 'MidnightGlow', 
    name: 'MidnightGlow',  
    audioUrl: './audios/midnightGlow.mp3',
  },
  { 
    id: 'VelvetShadows', 
    name: 'VelvetShadows',  
    audioUrl: './audios/VelvetShadows.mp3',
  },
  { 
    id: 'ElectricDreams', 
    name: 'ElectricDreams',  
    audioUrl: './audios/ElectricDreams.mp3',
  },
  { 
    id: 'WhispersInTheStatic', 
    name: 'WhispersInTheStatic',  
    audioUrl: './audios/WhispersInTheStatic.mp3',
  },
  { 
    id: 'DawnsEdge', 
    name: 'DawnsEdge',  
    audioUrl: './audios/DawnsEdge.mp3',
  }
];

// 🎛️ 全域設定
const GLOBAL_SETTINGS = {
  fadeInDuration: 1000,    // 淡入時間 (毫秒)
  fadeOutDuration: 500,    // 淡出時間 (毫秒)
  defaultVolume: 70,       // 預設音量 (0-100)
  masterVolume: 60,        // 主音量 (0-100)
  enableCrossfade: true    // 是否啟用淡入淡出效果
};

const CustomizableAudioPlayer = () => {
  // 📊 狀態管理
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isGlobalMuted, setIsGlobalMuted] = useState(false);
  const [globalVolume, setGlobalVolume] = useState(GLOBAL_SETTINGS.masterVolume);
  const [errorSounds, setErrorSounds] = useState(new Set());
  
  const [soundStates, setSoundStates] = useState(() => {
    const states = {};
    AUDIO_CONFIG.forEach(sound => {
      states[sound.id] = {
        isMuted: false,
        volume: GLOBAL_SETTINGS.defaultVolume,
        isLoaded: false,
        isPlaying: false,
        hasError: false
      };
    });
    return states;
  });

  // 🎵 Web Audio API 引用
  const audioContextRef = useRef(null);
  const masterGainRef = useRef(null);
  const soundNodesRef = useRef(new Map());

  // 📁 載入音頻文件
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

  // 🎛️ 創建音頻節點
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

  // 🚀 初始化單個音頻
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

  // 🎵 初始化音頻系統
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

  // 🔇 切換單個音頻靜音
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

  // 🔇 切換全域靜音
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

  // 🔊 調整音量
  const handleVolumeChange = useCallback((soundId, newVolume) => {
    setSoundStates(prev => ({
      ...prev,
      [soundId]: {
        ...prev[soundId],
        volume: newVolume
      }
    }));

    const soundNode = soundNodesRef.current.get(soundId);
    if (soundNode && !soundStates[soundId].hasError) {
      const isSoundMuted = soundStates[soundId].isMuted;
      const finalVolume = (isSoundMuted || isGlobalMuted) ? 0 : (newVolume / 100) * (globalVolume / 100);
      soundNode.gainNode.gain.value = finalVolume;
    }
  }, [soundStates, isGlobalMuted, globalVolume]);

  // 🔊 調整全域音量
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

  // 🧹 清理資源
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* 載入遮罩 */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold mb-2">載入音頻文件中...</h3>
              <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
                <div 
                  className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${loadingProgress}%` }}
                />
              </div>
              <p className="text-sm text-gray-300">{loadingProgress}% 完成</p>
            </div>
          </div>
        </div>
      )}

      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          {/* 📱 標題區 */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">
              🎵 自定義音頻播放器
            </h1>
            <p className="text-slate-300 text-lg">
              支援自定義音頻文件的背景循環播放系統
            </p>
            {errorSounds.size > 0 && (
              <div className="mt-4 p-4 bg-red-900/30 border border-red-500/50 rounded-lg">
                <p className="text-red-300">
                  ⚠️ {errorSounds.size} 個音頻文件載入失敗，請檢查文件路徑
                </p>
              </div>
            )}
          </div>

          {/* 🎛️ 全域控制 */}
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 mb-8 border border-white/20">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              <button
                onClick={isInitialized ? toggleGlobalMute : initializeAudioSystem}
                disabled={isLoading}
                className={`px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${
                  !isInitialized
                    ? 'bg-green-600 hover:bg-green-700 shadow-green-500/30'
                    : isGlobalMuted
                    ? 'bg-red-500 hover:bg-red-600 shadow-red-500/30'
                    : 'bg-blue-500 hover:bg-blue-600 shadow-blue-500/30'
                }`}
              >
                {!isInitialized ? (
                  <>🎵 開始播放音頻</>
                ) : isGlobalMuted ? (
                  <>🔇 取消全域靜音</>
                ) : (
                  <>🔊 全域靜音</>
                )}
              </button>

              <div className="flex items-center gap-4 min-w-64">
                <span className="text-sm whitespace-nowrap">🔊 總音量</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={globalVolume}
                  onChange={(e) => handleGlobalVolumeChange(parseInt(e.target.value))}
                  className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                  disabled={!isInitialized}
                />
                <span className="text-sm font-mono w-12 text-right">{globalVolume}%</span>
              </div>
            </div>
          </div>

          {/* 🎵 音頻控制卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {AUDIO_CONFIG.map((sound) => {
              const state = soundStates[sound.id];
              const isEffectivelyMuted = isGlobalMuted || state.isMuted;
              const hasError = state.hasError;
              
              return (
                <div
                  key={sound.id}
                  className={`relative overflow-hidden rounded-2xl border transition-all duration-300 ${
                    hasError
                      ? 'bg-red-900/20 border-red-500/50'
                      : isEffectivelyMuted
                      ? 'bg-slate-800/50 border-slate-600/50'
                      : 'bg-white/10 border-white/20 shadow-lg'
                  } backdrop-blur-md`}
                >
                  <div className="p-6">
                    {/* 音頻標題 */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{sound.emoji}</span>
                        <div>
                          <h3 className="text-lg font-semibold">{sound.name}</h3>
                          {hasError && (
                            <p className="text-xs text-red-400">載入失敗</p>
                          )}
                        </div>
                      </div>
                      
                      <div className={`w-3 h-3 rounded-full ${
                        hasError ? 'bg-red-500' :
                        !isInitialized ? 'bg-gray-400' :
                        isEffectivelyMuted ? 'bg-yellow-400' : 'bg-green-400 animate-pulse'
                      }`} />
                    </div>

                    {/* 音量控制 */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-300">音量</span>
                        <span className="text-sm font-mono">{state.volume}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={state.volume}
                        onChange={(e) => handleVolumeChange(sound.id, parseInt(e.target.value))}
                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                        disabled={!isInitialized || hasError}
                      />
                    </div>

                    {/* 控制按鈕 */}
                    <button
                      onClick={() => toggleSoundMute(sound.id)}
                      disabled={!isInitialized || hasError}
                      className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                        hasError
                          ? 'bg-red-600/50 cursor-not-allowed'
                          : !isInitialized
                          ? 'bg-gray-600 cursor-not-allowed'
                          : state.isMuted
                          ? 'bg-red-500 hover:bg-red-600 shadow-red-500/30'
                          : 'bg-green-500 hover:bg-green-600 shadow-green-500/30'
                      } shadow-lg`}
                    >
                      {hasError ? (
                        <>❌ 載入失敗</>
                      ) : !isInitialized ? (
                        '等待初始化...'
                      ) : state.isMuted ? (
                        <>🔇 取消靜音</>
                      ) : (
                        <>🔊 靜音</>
                      )}
                    </button>

                    {/* 錯誤提示 */}
                    {hasError && (
                      <div className="mt-3 p-2 bg-red-900/30 rounded-lg">
                        <p className="text-xs text-red-300">
                          檔案路徑: <code className="bg-black/30 px-1 rounded">{sound.audioUrl}</code>
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* 📋 使用說明 */}
          <div className="mt-8 bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
            <h3 className="text-xl font-semibold mb-4">📋 設定說明</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-blue-300 mb-3">🔧 如何替換音頻文件:</h4>
                <div className="space-y-2 text-sm text-slate-300">
                  <p>1. 將音頻文件放在 <code className="bg-black/30 px-1 rounded">/public/sounds/</code> 目錄下</p>
                  <p>2. 修改組件頂部的 <code className="bg-black/30 px-1 rounded">AUDIO_CONFIG</code> 陣列</p>
                  <p>3. 更新 <code className="bg-black/30 px-1 rounded">audioUrl</code> 路徑</p>
                  <p>4. 支援格式: MP3, OGG, WAV, M4A</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-blue-300 mb-3">⚙️ 全域設定:</h4>
                <div className="space-y-2 text-sm text-slate-300">
                  <p>• 淡入時間: {GLOBAL_SETTINGS.fadeInDuration}ms</p>
                  <p>• 淡出時間: {GLOBAL_SETTINGS.fadeOutDuration}ms</p>
                  <p>• 預設音量: {GLOBAL_SETTINGS.defaultVolume}%</p>
                  <p>• 淡入淡出: {GLOBAL_SETTINGS.enableCrossfade ? '啟用' : '停用'}</p>
                </div>
              </div>
            </div>

            <div className="mt-4 p-4 bg-blue-900/30 rounded-xl">
              <p className="text-sm">
                <strong>💡 提示:</strong> 
                首次載入時會檢查所有音頻文件的存在性。載入失敗的文件會顯示錯誤狀態，
                請檢查文件路徑是否正確。建議使用相對路徑並確保文件存在於正確的目錄中。
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 自定義樣式 */}
      <style jsx>{`
        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #ffffff;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
        }
        
        input[type="range"]::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #ffffff;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
        }

        input[type="range"]:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default CustomizableAudioPlayer;