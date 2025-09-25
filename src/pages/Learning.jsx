import React from 'react'
import { motion, useTransform } from 'framer-motion'
import { useLenisScroll } from '../hooks/useLenisScroll'

const Learning = () => {
    // 使用 useLenisScroll hook，調整觸發時機
    const { ref, springScrollY, isClient } = useLenisScroll({
        startOffset: '50vh',  // 元素進入視窗前 50vh 就開始動畫
        endOffset: '-68vh',   // 元素離開視窗後 68vh 還在動畫
        springConfig: {
            stiffness: 100,
            damping: 30,
            restDelta: 0.001
        }
    })

    // ✅ 調整三角形動畫 - 更早開始
    const secondPointY = useTransform(springScrollY, [0, 0.3], [0, 100])      // 從 [0, 0.5] 改為 [0, 0.3]
    const thirdPointX = useTransform(springScrollY, [0.3, 0.6], [100, 0])     // 從 [0.5, 1] 改為 [0.3, 0.6]

    // 組合三角形 points
    const trianglePoints = useTransform(
        [secondPointY, thirdPointX],
        ([y, x]) => `100,0 100,${y} ${x},100`
    )

    // ✅ 三角形透明度 - 立即顯示
    const triangleOpacity = useTransform(springScrollY, [0, 0.1], [0, 1])     // 從 [0, 0.2] 改為 [0, 0.1]

    // ✅ 內容動畫 - 更早觸發
    const contentY = useTransform(springScrollY, [0, 0.4], [100, 0])          // 從 [0, 0.6] 改為 [0, 0.4]
    const contentOpacity = useTransform(springScrollY, [0, 0.3], [0, 1])      // 從 [0.1, 0.6] 改為 [0, 0.3]

    // ✅ 卡片動畫 - 早期觸發但稍有延遲
    const cardsY = useTransform(springScrollY, [0.2, 0.5], [150, 0])          // 從 [0.3, 0.8] 改為 [0.2, 0.5]
    const cardsOpacity = useTransform(springScrollY, [0.2, 0.5], [0, 1])      // 從 [0.4, 0.8] 改為 [0.2, 0.5]

    // 標題動畫 - 新增
    const titleY = useTransform(springScrollY, [0, 0.25], [50, 0])
    const titleOpacity = useTransform(springScrollY, [0, 0.25], [0, 1])
    const titleScale = useTransform(springScrollY, [0, 0.2], [0.9, 1])

    // 描述文字動畫 - 新增
    const descY = useTransform(springScrollY, [0.1, 0.35], [30, 0])
    const descOpacity = useTransform(springScrollY, [0.1, 0.35], [0, 1])

    // 在客戶端 hydration 完成前顯示靜態內容
    if (!isClient) {
        return (
            <div className="learning_wrap" ref={ref}>
                <svg className="bg_triangle" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <polygon points="100,0 100,100 0,100" fill="#d9d9d9" />
                </svg>

                <div className="learning_content_box">
                    <div className="text_box">
                        <h1><span>Learn</span> with us!</h1>
                        <div className="desc_box">
                            <p>Find Your Sound. <br />Play Your Style.</p>
                            <p>We help you master riffs, rhythm, and improvisation—anytime, anywhere.</p>
                            <p>Go check our online <br />courses ⟶</p>
                        </div>
                        <div className="card_box">
                            <div className='card1'>
                                <p>Learn<br />Guitar</p>
                                <figure className='card1_img'></figure>
                            </div>
                            <div className='card2'>
                                <p>Learn<br />Music<br />Theory</p>
                                <figure className='card2_img'></figure>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <motion.div
            ref={ref}
            className="learning_wrap"
            initial="hidden"
            animate="visible"
        >
            {/* 背景三角形 - 更早觸發 */}
            <motion.svg
                className="bg_triangle"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                style={{ opacity: triangleOpacity }}
            >
                <motion.polygon
                    points={trianglePoints}
                    fill="#d9d9d9"
                />
            </motion.svg>

            <motion.div className="learning_content_box">
                <div className="text_box">
                    {/* 標題動畫 - 分離出來獨立控制 */}
                    <motion.h1
                        style={{
                            y: titleY,
                            opacity: titleOpacity,
                            scale: titleScale
                        }}
                    >
                        <span>Learn</span> with us!
                    </motion.h1>

                    {/* 描述區塊 - 獨立動畫 */}
                    <motion.div
                        className="desc_box"
                        style={{
                            y: descY,
                            opacity: descOpacity
                        }}
                    >
                        <p>Find Your Sound. <br />
                            Play Your Style.</p>
                        <p>We help you master riffs, rhythm, and improvisation—anytime, anywhere.</p>
                        <p>Go check our online <br />courses ⟶</p>
                    </motion.div>

                    {/* 卡片區塊 - 更早觸發 */}
                    <motion.div
                        className="card_box"
                        style={{
                            y: cardsY,
                            opacity: cardsOpacity
                        }}
                    >
                        <motion.div
                            className='card1'
                            initial={{ scale: 0.9, opacity: 0 }}
                            whileInView={{
                                scale: 1,
                                opacity: 1,
                                transition: {
                                    delay: 0.1,
                                    duration: 0.5,
                                    ease: "easeOut"
                                }
                            }}
                            whileHover={{
                                y: -10,
                                scale: 1.02,
                                boxShadow: "0 15px 40px rgba(241, 136, 136, 0.2)",
                                transition: { type: "spring", stiffness: 300, damping: 20 }
                            }}
                            viewport={{ once: true, margin: "-10%" }}
                        >
                            <div className='text_marquee_learn'>
                            <p>Learn Learn Learn</p>
                            <p>Learn Learn Learn</p>
                            </div>
                            <div className='text_marquee_guitar'>
                            <p>Guitar Guitar Guitar</p>
                            <p>Guitar Guitar Guitar</p>
                            </div>
                            {/* <figure className='card1_img'></figure> */}
                        </motion.div>

                        <motion.div
                            className='card2'
                            initial={{ scale: 0.9, opacity: 0 }}
                            whileInView={{
                                scale: 1,
                                opacity: 1,
                                transition: {
                                    delay: 0.3,  // 稍微延遲，創造序列感
                                    duration: 0.5,
                                    ease: "easeOut"
                                }
                            }}
                            whileHover={{
                                y: -10,
                                scale: 1.02,
                                boxShadow: "0 15px 40px rgba(241, 136, 136, 0.2)",
                                transition: { type: "spring", stiffness: 300, damping: 20 }
                            }}
                            viewport={{ once: true, margin: "-10%" }}
                        >
                            <p>Learn<br />Music<br />Theory</p>
                            <figure className='card2_img'></figure>
                        </motion.div>
                    </motion.div>
                </div>
            </motion.div>
        </motion.div>
    )
}

export default Learning