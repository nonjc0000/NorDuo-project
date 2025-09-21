import React from 'react'
import { motion } from 'framer-motion'

const HeroSection = () => {
  // 定義動畫變體
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.3 // 子元素依序出現，間隔 0.3 秒
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

  const videoVariants = {
    hidden: { opacity: 0, scale: 1.1 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 1.2, ease: "easeOut" }
    }
  }

  const sloganVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  }

  return (
    <motion.section 
      className='hero_section_wrap'
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className='hero_content'>
        {/* 影片淡入 + 輕微縮放效果 */}
        <motion.video 
          src="./videos/band_performance.mp4" 
          autoPlay 
          loop 
          muted 
          playsInline 
          className='hero_vid'
          variants={videoVariants}
        />

        {/* 頂部裝飾元素 */}
        <motion.div 
          className="deco_top"
          variants={itemVariants}
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
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [1, 0.7, 1] 
              }}
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
          {/* 標語部分 - 從左滑入 */}
          <motion.div 
            className="deco_slogan"
            variants={sloganVariants}
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

          {/* 電池指示器 */}
          <motion.div 
            className="deco_battery"
            variants={itemVariants}
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