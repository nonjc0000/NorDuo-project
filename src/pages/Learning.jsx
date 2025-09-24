import React, { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'

const Learning = () => {
    const ref = useRef(null)
    const [isClient, setIsClient] = useState(false)
    
    // 確保只在客戶端運行
    useEffect(() => {
        setIsClient(true)
    }, [])

    // 修正後的 useScroll 配置 - 移除 container 屬性
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end end"]
        // 不要設置 container 屬性，讓 Lenis 處理滾動
    })

    // 使用 useSpring 讓動畫更平滑
    const springScrollY = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    })

    // 定義三角形展開的動畫
    const secondPointY = useTransform(springScrollY, [0, 0.5], [0, 100])
    const thirdPointX = useTransform(springScrollY, [0.5, 1], [100, 0])

    // 組合成完整的 points 字符串
    const trianglePoints = useTransform(
        [secondPointY, thirdPointX],
        ([y, x]) => `100,0 100,${y} ${x},100`
    )

    // 三角形的透明度動畫
    const triangleOpacity = useTransform(springScrollY, [0, 0.2], [0, 1])

    // 內容動畫
    const contentY = useTransform(springScrollY, [0, 0.6], [100, 0])
    const contentOpacity = useTransform(springScrollY, [0.1, 0.6], [0, 1])

    const cardsY = useTransform(springScrollY, [0.3, 0.8], [150, 0])
    const cardsOpacity = useTransform(springScrollY, [0.4, 0.8], [0, 1])

    // Lenis 滾動事件監聽
    useEffect(() => {
        if (!isClient || !window.lenis) return

        const handleScroll = (e) => {
            // 如果需要自定義滾動處理，可以在這裡添加
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
            <div className="learning_wrap" ref={ref}>
                {/* 靜態背景 */}
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
        >
            {/* 背景三角形 - 使用 motion.svg */}
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