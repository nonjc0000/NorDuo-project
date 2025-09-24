import React from 'react'
import { motion, useTransform } from 'framer-motion'
import { useLenisScroll } from '../hooks/useLenisScroll'

const HeroSection = () => {
  // ✅ 調整觸發時機 - 更早開始動畫
  const { ref, springScrollY, isClient } = useLenisScroll({
    startOffset: '50vh',  // 元素進入視窗前 50vh 就開始
    endOffset: '-50vh',   // 元素進入視窗後繼續動畫
    springConfig: {
      stiffness: 100,
      damping: 30,
      restDelta: 0.001
    }
  })

  // ✅ 調整動畫時機 - 更早開始，更早結束
  const videoOpacity = useTransform(springScrollY, [0, 0.3, 0.8], [0, 0.3, 1])

  // ✅ 頂部元素 - 立即開始
  const topDecoY = useTransform(springScrollY, [0, 0.5], ["-50%", "0%"])      // 從 [0, 1] 改為 [0, 0.5]
  const topDecoOpacity = useTransform(springScrollY, [0, 0.3], [0, 1])        // 從 [0, 0.5] 改為 [0, 0.3]

  // ✅ 標語動畫 - 分階段進入
  const sloganY = useTransform(springScrollY, [0, 0.4], ["-150%", "0%"])      // 從 [0, 1] 改為 [0, 0.4]
  const sloganOpacity = useTransform(springScrollY, [0, 0.4], [0, 1])         // 從 [0, 0.6] 改為 [0, 0.4]
  const sloganScale = useTransform(springScrollY, [0, 0.3], [0.8, 1])         // 從 [0, 0.5] 改為 [0, 0.3]

  // ✅ 電池動畫 - 最早觸發
  const batteryY = useTransform(springScrollY, [0, 0.4], ["-150%", "0%"])     // 從 [0, 1] 改為 [0, 0.4]
  const batteryOpacity = useTransform(springScrollY, [0, 0.2], [0, 1])        // 從 [0, 0.4] 改為 [0, 0.2]
  const batteryIndicatorOpacity = useTransform(springScrollY, [0.2, 0.4], [0, 1]) // 從 [0.4, 0.6] 改為 [0.2, 0.4]

  // ✅ 電池條動畫 - 更早開始，更密集觸發
  const batteryBarsProgress = Array.from({ length: 6 }, (_, index) => {
    const startProgress = 0.2 + (index * 0.03)  // 從 0.5 改為 0.2，間隔從 0.05 改為 0.03
    const endProgress = Math.min(startProgress + 0.1, 0.8)  // 動畫持續時間從 0.15 改為 0.1
    
    return {
      scaleY: useTransform(springScrollY, [startProgress, endProgress], [0, 1]),
      opacity: useTransform(springScrollY, [startProgress, endProgress], [0, 1])
    }
  })

  // REC 動畫保持不變
  const recVariants = {
    animate: {
      scale: [1, 1.2, 1],
      opacity: [1, 0.7, 1]
    }
  }

  // Loading 狀態保持不變
  if (!isClient) {
    return (
      <section className='hero_section_wrap' ref={ref}>
        {/* 靜態內容 */}
      </section>
    )
  }

  return (
    <motion.section 
      ref={ref}
      className='hero_section_wrap'
      initial="hidden"
      animate="visible"
    >
      <motion.div 
        className='hero_content'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        {/* 影片背景 - 更早顯示 */}
        <motion.video 
          src="./videos/band_performance.mp4" 
          autoPlay 
          loop 
          muted 
          playsInline 
          className='hero_vid'
          style={{ opacity: videoOpacity }}
        />

        {/* 頂部裝飾元素 - 立即開始 */}
        <motion.div 
          className="deco_top"
          style={{
            y: topDecoY,
            opacity: topDecoOpacity,
          }}
        >
          <motion.figure className="deco_arrow">
            <img src="./images/HeroSection/deco_arrow.svg" alt="" />
          </motion.figure>
          
          <motion.div className="deco_rec">
            <motion.figure 
              className='rec_dot'
              variants={recVariants}
              animate="animate"
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <img src="./images/HeroSection/rec_dot.svg" alt="" />
            </motion.figure>
            <motion.span className='rec_text'>REC</motion.span>
          </motion.div>
        </motion.div>

        <motion.div className="deco_bottom">
          {/* 標語 - 快速進入 */}
          <motion.div 
            className="deco_slogan"
            style={{
              y: sloganY,
              opacity: sloganOpacity,
              scale: sloganScale
            }}
          >
            <motion.p className='slogan_line'>We play.</motion.p>
            <motion.p className='slogan_line'>We create.</motion.p>
            
            <motion.div className='slogan_decoration'>
              <figure className='decoration_lines'>
                <img src="./images/deco/decoration_lines.svg" alt="" />
              </figure>
            </motion.div>
          </motion.div>

          {/* 電池指示器 - 最早觸發 */}
          <motion.div 
            className="deco_battery"
            style={{
              y: batteryY,
              opacity: batteryOpacity
            }}
          >
            <motion.p className='battery_label'>Battery</motion.p>
            
            <motion.div 
              className='battery_indicator'
              style={{ opacity: batteryIndicatorOpacity }}
            >
              {batteryBarsProgress.map((barProgress, index) => (
                <motion.span 
                  key={index}
                  className='battery_bar'
                  style={{
                    scaleY: barProgress.scaleY,
                    opacity: barProgress.opacity,
                    transformOrigin: "bottom"
                  }}
                />
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.section>
  )
}

export default HeroSection