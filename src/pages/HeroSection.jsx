import React, { useRef } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'

const HeroSection = () => {
  const ref = useRef(null)
  
  // 追蹤滾動進度 - 元素進入視窗15%時開始動畫
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end start"] // 元素頂部到達視窗85%位置時開始（即進入15%）
  })

  // 使用 useSpring 讓動畫更平滑
  const springScrollY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  // 視差效果 - 影片背景
  const videoY = useTransform(springScrollY, [0, 1], ["0%", "30%"])
  const videoScale = useTransform(springScrollY, [0, 1], [1, 1.1])
  const videoOpacity = useTransform(springScrollY, [0, 0.5, 1], [0, 0.3, 1])

  // 頂部裝飾元素
  const topDecoY = useTransform(springScrollY, [0, 1], ["0%", "-50%"])
  const topDecoOpacity = useTransform(springScrollY, [0, 0.3], [1, 0])

  // 標語動畫
  const sloganY = useTransform(springScrollY, [0, 1], ["0%", "80%"])
  const sloganOpacity = useTransform(springScrollY, [0, 0.6], [1, 0])
  const sloganScale = useTransform(springScrollY, [0, 0.5], [1, 0.8])

  // 電池指示器
  const batteryX = useTransform(springScrollY, [0, 1], ["0%", "30%"])
  const batteryOpacity = useTransform(springScrollY, [0, 0.4], [1, 0])

  // REC 點閃爍效果（與滾動無關，保持原有動畫）
  const recVariants = {
    animate: {
      scale: [1, 1.2, 1],
      opacity: [1, 0.7, 1]
    }
  }

  // 初始載入動畫變體
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.3
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  }

  return (
    <motion.section 
      ref={ref}
      className='hero_section_wrap'
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className='hero_content'>
        {/* 影片背景 - 視差效果 */}
        <motion.video 
          src="./videos/band_performance.mp4" 
          autoPlay 
          loop 
          muted 
          playsInline 
          className='hero_vid'
          style={{
            y: videoY,
            scale: videoScale,
            opacity: videoOpacity
          }}
        />

        {/* 頂部裝飾元素 - 向上滑出 */}
        <motion.div 
          className="deco_top"
          variants={itemVariants}
          style={{
            y: topDecoY,
            opacity: topDecoOpacity
          }}
        >
          <motion.figure 
            className="deco_arrow"
            whileHover={{ x: -5, filter: "brightness(1.2)" }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <img src="./images/HeroSection/deco_arrow.svg" alt="" />
          </motion.figure>
          
          <div className="deco_rec">
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
            <span className='rec_text'>REC</span>
          </div>
        </motion.div>

        {/* 底部內容區 */}
        <motion.div 
          className="deco_bottom"
          variants={containerVariants}
        >
          {/* 標語部分 - 視差向下移動 */}
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
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              We play.
            </motion.p>
            
            <motion.p 
              className='slogan_line'
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              We create.
            </motion.p>
            
            <motion.div 
              className='slogan_decoration'
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 1 }}
            >
              <figure className='decoration_lines'>
                <img src="./images/deco/decoration_lines.svg" alt="" />
              </figure>
            </motion.div>
          </motion.div>

          {/* 電池指示器 - 向右滑出 */}
          <motion.div 
            className="deco_battery"
            variants={itemVariants}
            style={{
              x: batteryX,
              opacity: batteryOpacity
            }}
          >
            <motion.p 
              className='battery_label'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              Battery
            </motion.p>
            
            <motion.div 
              className='battery_indicator'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1 }}
            >
              {/* 電池條依序亮起的動畫 */}
              {[...Array(6)].map((_, index) => (
                <motion.span 
                  key={index}
                  className='battery_bar'
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ 
                    duration: 0.3, 
                    delay: 1.2 + (index * 0.1),
                    ease: "easeOut"
                  }}
                  style={{ transformOrigin: "bottom" }}
                />
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  )
}

export default HeroSection