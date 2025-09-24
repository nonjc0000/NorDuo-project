import React, { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'

const HeroSection = () => {
  const ref = useRef(null)
  const [isClient, setIsClient] = useState(false)
  
  // 確保只在客戶端運行
  useEffect(() => {
    setIsClient(true)
  }, [])

  // 修正後的 useScroll 配置 - 移除 container 屬性
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.9", "end end"]
    // 不要設置 container 屬性，讓 Lenis 處理滾動
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
    const startProgress = 0.5 + (index * 0.05)
    const endProgress = Math.min(startProgress + 0.15, 1)
    
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

  // Lenis 滾動事件監聽 - 可選的自定義處理
  useEffect(() => {
    if (!isClient || !window.lenis) return

    const handleScroll = (e) => {
      // 如果需要自定義滾動處理，可以在這裡添加
      // console.log('Lenis scroll:', e.scroll)
    }
    
    window.lenis.on('scroll', handleScroll)
    
    return () => {
      if (window.lenis) {
        window.lenis.off('scroll', handleScroll)
      }
    }
  }, [isClient])

  // 在客戶端 hydration 完成前不渲染動畫元素
  if (!isClient) {
    return (
      <section className='hero_section_wrap' ref={ref}>
        <div className='hero_content'>
          <video 
            src="./videos/band_performance.mp4" 
            autoPlay 
            loop 
            muted 
            playsInline 
            className='hero_vid'
          />
          {/* 靜態內容 */}
          <div className="deco_top">
            <figure className="deco_arrow">
              <img src="./images/HeroSection/deco_arrow.svg" alt="" />
            </figure>
            <div className="deco_rec">
              <figure className='rec_dot'>
                <img src="./images/HeroSection/rec_dot.svg" alt="" />
              </figure>
              <span className='rec_text'>REC</span>
            </div>
          </div>
          <div className="deco_bottom">
            <div className="deco_slogan">
              <p className='slogan_line'>We play.</p>
              <p className='slogan_line'>We create.</p>
              <div className='slogan_decoration'>
                <figure className='decoration_lines'>
                  <img src="./images/deco/decoration_lines.svg" alt="" />
                </figure>
              </div>
            </div>
            <div className="deco_battery">
              <p className='battery_label'>Battery</p>
              <div className='battery_indicator'>
                {Array.from({ length: 6 }, (_, index) => (
                  <span key={index} className='battery_bar' />
                ))}
              </div>
            </div>
          </div>
        </div>
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
          {/* 標語部分 */}
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

          {/* 電池指示器 - 改為基於滾動的動畫 */}
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
              style={{
                opacity: batteryIndicatorOpacity
              }}
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