import React, { useEffect, useRef, useState } from 'react';

const CustomAudioVisualizer = ({ 
  audioContext, 
  masterGainNode, 
  width = 200, 
  height = 75, 
  barWidth = 6, 
  gap = 10, 
  barColor = "#F18888",
  isActive = false 
}) => {
  const canvasRef = useRef(null);
  const analyserRef = useRef(null);
  const animationIdRef = useRef(null);
  const [audioData, setAudioData] = useState(new Uint8Array(0));

  useEffect(() => {
    if (!audioContext || !masterGainNode || !isActive) {
      // 停止動畫並清除canvas
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
        animationIdRef.current = null;
      }
      
      // 清除canvas
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      
      return;
    }

    // 創建分析器節點
    if (!analyserRef.current) {
      analyserRef.current = audioContext.createAnalyser();
      analyserRef.current.fftSize = 128; // 較小的FFT size，產生更少的頻率條
      analyserRef.current.smoothingTimeConstant = 0.8;
      
      // 連接分析器到master gain
      masterGainNode.connect(analyserRef.current);
    }

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const updateAudioData = () => {
      if (!analyserRef.current) return;
      
      analyserRef.current.getByteFrequencyData(dataArray);
      setAudioData([...dataArray]);
      
      animationIdRef.current = requestAnimationFrame(updateAudioData);
    };

    updateAudioData();

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [audioContext, masterGainNode, isActive]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !audioData.length) return;

    const ctx = canvas.getContext('2d');
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    // 清除canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // 計算要顯示的頻率條數量（基於canvas寬度）
    const totalBars = Math.floor(canvasWidth / (barWidth + gap));
    const step = Math.floor(audioData.length / totalBars);

    // 設置樣式
    ctx.fillStyle = barColor;

    for (let i = 0; i < totalBars; i++) {
      const audioIndex = i * step;
      const barHeight = (audioData[audioIndex] / 255) * canvasHeight * 0.8; // 最大高度為canvas的80%
      
      const x = i * (barWidth + gap);
      const y = canvasHeight - barHeight;

      // 繪製圓角矩形（頻率條）
      // 使用兼容性更好的方法繪製圓角矩形
      const radius = barWidth / 2;
      ctx.beginPath();
      
      if (typeof ctx.roundRect === 'function') {
        // 如果瀏覽器支持 roundRect，使用它
        ctx.roundRect(x, y, barWidth, barHeight, radius);
      } else {
        // 手動繪製圓角矩形作為備用方案
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + barWidth - radius, y);
        ctx.quadraticCurveTo(x + barWidth, y, x + barWidth, y + radius);
        ctx.lineTo(x + barWidth, y + barHeight - radius);
        ctx.quadraticCurveTo(x + barWidth, y + barHeight, x + barWidth - radius, y + barHeight);
        ctx.lineTo(x + radius, y + barHeight);
        ctx.quadraticCurveTo(x, y + barHeight, x, y + barHeight - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
      }
      
      ctx.fill();
    }
  }, [audioData, barWidth, gap, barColor, width, height]);

  return (
    <div 
      className="custom-audio-visualizer" 
      style={{ 
        width, 
        height,
        opacity: isActive ? 1 : 0,
        transition: 'all 0.3s ease-in-out',
      }}
    >
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{ 
          width: '100%', 
          height: '100%',
          borderRadius: '4px'
        }}
      />
    </div>
  );
};

export default CustomAudioVisualizer;