import React, { useRef } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'

const Learning = () => {
    // 步驟1：創建ref來追蹤這個組件
    const ref = useRef(null)

    // 步驟2：使用useScroll追蹤滾動進度
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end end"]
    })

    // 步驟3：使用useSpring讓動畫更平滑
    const springScrollY = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    })

    // 步驟4：定義三角形展開的動畫
    // 初始：三角形只是右上角的一個點 "100,0 100,0 100,0"
    // 最終：完整的三角形 "100,0 100,100 0,100"

    // 第一個點始終在右上角 (100,0)
    // 第二個點從 (100,0) 移動到 (100,100) - 垂直展開
    const secondPointY = useTransform(springScrollY, [0, 0.5], [0, 100])

    // 第三個點從 (100,100) 移動到 (0,100) - 水平展開  
    const thirdPointX = useTransform(springScrollY, [0.5, 1], [100, 0])

    // 步驟5：組合成完整的points字符串
    const trianglePoints = useTransform(
        [secondPointY, thirdPointX],
        ([y, x]) => `100,0 100,${y} ${x},100`
    )

    // 步驟6：三角形的透明度動畫
    const triangleOpacity = useTransform(springScrollY, [0, 0.2], [0, 1])

    // 步驟7：內容動畫（可選）
    const contentY = useTransform(springScrollY, [0, 0.6], [100, 0])
    const contentOpacity = useTransform(springScrollY, [0.1, 0.6], [0, 1])

    const cardsY = useTransform(springScrollY, [0.3, 0.8], [150, 0])
    const cardsOpacity = useTransform(springScrollY, [0.4, 0.8], [0, 1])

    return (
        <motion.div
            ref={ref}
            className="learning_wrap"
        >
            {/* 背景三角形 - 現在使用motion.svg */}
            <motion.svg
                className="bg_triangle"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                style={{ opacity: triangleOpacity }}
            >
                <motion.polygon
                    points={trianglePoints}
                    fill="#d9d9d9" // 對應$gray-bg
                />
            </motion.svg>

            <motion.div
                className="learning_content_box"
                style={{
                    y: contentY,
                    opacity: contentOpacity
                }}
            >
                <div className="text_box">
                    <h1><span>Learn</span> with us!</h1>
                    <div className="desc_box">
                        <p>Find Your Sound. <br />
                            Play Your Style.</p>
                        <p>We help you master riffs, rhythm, and improvisation—anytime, anywhere.</p>
                        <p>Go check our online <br />courses ⟶</p>
                    </div>
                    <motion.div
                        className="card_box"
                        style={{
                            y: cardsY,
                            opacity: cardsOpacity
                        }}
                    >
                        <motion.div
                            className='card1'
                            whileHover={{
                                y: -10,
                                boxShadow: "0 15px 40px rgba(241, 136, 136, 0.2)"
                            }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <p>Learn<br />
                                Guitar</p>
                            <figure className='card1_img'></figure>
                        </motion.div>
                        <motion.div
                            className='card2'
                            whileHover={{
                                y: -10,
                                boxShadow: "0 15px 40px rgba(241, 136, 136, 0.2)"
                            }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <p>Learn<br />
                                Music<br />
                                Theory</p>
                            <figure className='card2_img'></figure>
                        </motion.div>
                    </motion.div>
                </div>
            </motion.div>
        </motion.div>
    )
}

export default Learning