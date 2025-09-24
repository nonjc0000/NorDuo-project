import React, { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'

const HeroSection = () => {
  const ref = useRef(null)
  
  // 追蹤滾動進度 - 元素進入視窗15%時開始動畫
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.9", "end end"], // 元素頂部到達視窗85%位置時開始（即進入15%）
    // 添加 container 屬性以確保與 Lenis 相容
    container: typeof window !== 'undefined' ? document.documentElement : undefined
  })

  // 使用 useSpring 讓動畫更平滑
  const springScrollY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  // 視差效果 - 影片背景
  const videoOpacity = useTransform(springScrollY, [0, 0.5, 1], [0, 0.3, 1])

  // 頂部裝飾元素
  const topDecoY = useTransform(springScrollY, [0, 1], ["-50%", "0%"])
  const topDecoOpacity = useTransform(springScrollY, [0, 0.5], [0, 1])

  // 標語動畫
  const sloganY = useTransform(springScrollY, [0, 1], ["-150%", "0%"])
  const sloganOpacity = useTransform(springScrollY, [0, 0.6], [0, 1])
  const sloganScale = useTransform(springScrollY, [0, 0.5], [0.8, 1])

  // 電池指示器 - 改為基於滾動的動畫
  const batteryY = useTransform(springScrollY, [0, 1], ["-150%", "0%"])
  const batteryOpacity = useTransform(springScrollY, [0, 0.4], [0, 1])
  
  // 電池條容器的透明度
  const batteryIndicatorOpacity = useTransform(springScrollY, [0.4, 0.6], [0, 1])
  
  // 為每個電池條建立不同的動畫進度
  const batteryBarsProgress = Array.from({ length: 6 }, (_, index) => {

    // 每個電池條在不同的滾動進度開始動畫
    const startProgress = 0.5 + (index * 0.05) // 從 0.5 開始，每個延遲 0.05
    const endProgress = Math.min(startProgress + 0.15, 1) // 動畫持續 0.15 的滾動進度
    
    return {
      scaleY: useTransform(springScrollY, [startProgress, endProgress], [0, 1]),
      opacity: useTransform(springScrollY, [startProgress, endProgress], [0, 1])
    }
  })

  // REC 點閃爍效果（與滾動無關，保持原有動畫）
  const recVariants = {
    animate: {
      scale: [1, 1.2, 1],
      opacity: [1, 0.7, 1]
    }
  }

  // 監聽 Lenis 滾動事件以確保同步（可選）
  useEffect(() => {
    if (window.lenis) {
      const handleScroll = () => {
        // 如果需要自定義滾動處理，可以在這裡添加
      }
      
      window.lenis.on('scroll', handleScroll)
      
      return () => {
        if (window.lenis) {
          window.lenis.off('scroll', handleScroll)
        }
      }
    }
  }, [])

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
        {/* 影片背景 - 增強淡入效果 */}
        <motion.video 
          src="./videos/band_performance.mp4" 
          autoPlay 
          loop 
          muted 
          playsInline 
          className='hero_vid'
          style={{
            opacity: videoOpacity
          }}
        />

        {/* 頂部裝飾元素 - 從上方滑入 */}
        <motion.div 
          className="deco_top"
          style={{
            y: topDecoY,
            opacity: topDecoOpacity,
            scale: 1,
          }}
        >
          <motion.figure 
            className="deco_arrow"
          >
            <img src="./images/HeroSection/deco_arrow.svg" alt="" />
          </motion.figure>
          
          <motion.div 
            className="deco_rec"
          >
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
            <motion.span 
              className='rec_text'
            >
              REC
            </motion.span>
          </motion.div>
        </motion.div>

        <motion.div 
          className="deco_bottom"
        >
          {/* 標語部分 */}
          <motion.div 
            className="deco_slogan"
            style={{
              y: sloganY,
              opacity: sloganOpacity,
              scale: sloganScale
            }}
          >
            <motion.p 
              className='slogan_line'
            >
              We play.
            </motion.p>
            
            <motion.p 
              className='slogan_line'
            >
              We create.
            </motion.p>
            
            <motion.div 
              className='slogan_decoration'
            >
              <figure className='decoration_lines'>
                <img src="./images/deco/decoration_lines.svg" alt="" />
              </figure>
            </motion.div>
          </motion.div>

          {/* 電池指示器 - 改為基於滾動的動畫 */}
          <motion.div 
            className="deco_battery"
            style={{
              y: batteryY,
              opacity: batteryOpacity
            }}
          >
            <motion.p 
              className='battery_label'
            >
              Battery
            </motion.p>
            
            {/* 電池指示器容器 - 移除時間基礎的動畫 */}
            <motion.div 
              className='battery_indicator'
              style={{
                opacity: batteryIndicatorOpacity
              }}
            >
              {/* 電池條依序根據滾動進度出現 */}
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