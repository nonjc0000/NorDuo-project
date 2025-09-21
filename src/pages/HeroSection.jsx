import React, { useRef } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'

const HeroSection = () => {
  const ref = useRef(null)
  
  // 追蹤滾動進度 - 元素進入視窗15%時開始動畫
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.9", "end end"] // 元素頂部到達視窗85%位置時開始（即進入15%）
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

  // 電池指示器
  const batteryY = useTransform(springScrollY, [0, 1], ["-150%", "0%"])
  const batteryOpacity = useTransform(springScrollY, [0, 0.4], [0, 1])

  // REC 點閃爍效果（與滾動無關，保持原有動畫）
  const recVariants = {
    animate: {
      scale: [1, 1.2, 1],
      opacity: [1, 0.7, 1]
    }
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

          {/* 電池指示器 */}
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
            
            <motion.div 
              className='battery_indicator'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.4 }}
            >
              {/* 電池條依序亮起的動畫 */}
              {[...Array(6)].map((_, index) => (
                <motion.span 
                  key={index}
                  className='battery_bar'
                  initial={{ scaleY: 0, opacity: 0 }}
                  animate={{ scaleY: 1, opacity: 1 }}
                  transition={{ 
                    duration: 0.4, 
                    delay: 1.6 + (index * 0.1),
                    ease: "easeOut",
                    type: "spring",
                    stiffness: 120
                  }}
                  whileHover={{
                    scaleY: 1.2,
                    backgroundColor: "#FF6B6B"
                  }}
                  style={{ transformOrigin: "bottom" }}
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