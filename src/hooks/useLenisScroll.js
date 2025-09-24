import { useEffect, useRef, useState } from 'react'
import { useMotionValue, useSpring } from 'framer-motion'

/**
 * useLenisScroll - 整合 Lenis 與 Framer Motion 的自定義 Hook
 * 
 * @param {Object} options - 配置選項
 * @param {string} options.startOffset - 開始觸發動畫的偏移量，如 '10vh' 或數字
 * @param {string} options.endOffset - 結束動畫的偏移量，如 '0vh' 或數字  
 * @param {Object} options.springConfig - Spring 動畫配置
 * @returns {Object} - 返回 ref, scrollY, springScrollY 和 isClient
 */
export const useLenisScroll = (options = {}) => {
    const {
        startOffset = '10vh',
        endOffset = '0vh',
        springConfig = {
            stiffness: 100,
            damping: 30,
            restDelta: 0.001
        }
    } = options

    const ref = useRef(null)
    const [isClient, setIsClient] = useState(false)
    const scrollY = useMotionValue(0)

    // 確保只在客戶端運行
    useEffect(() => {
        setIsClient(true)
    }, [])

    // 轉換偏移量字符串為數值
    const parseOffset = (offset) => {
        if (typeof offset === 'number') return offset
        
        if (typeof offset === 'string') {
            if (offset.includes('vh')) {
                return (parseFloat(offset) / 100) * window.innerHeight
            } else if (offset.includes('px')) {
                return parseFloat(offset)
            } else if (offset.includes('%')) {
                return (parseFloat(offset) / 100) * window.innerHeight
            }
        }
        
        return 0
    }

    // 使用 Lenis 滾動事件來更新 Framer Motion 的 scrollY 值
    useEffect(() => {
        if (!isClient || !window.lenis || !ref.current) return

        const updateScrollY = () => {
            if (window.lenis && ref.current) {
                const rect = ref.current.getBoundingClientRect()
                const elementTop = rect.top + window.scrollY
                const elementHeight = rect.height
                const windowHeight = window.innerHeight
                
                // 解析偏移量
                const startOffsetPx = parseOffset(startOffset)
                const endOffsetPx = parseOffset(endOffset)
                
                // 計算當前元素在視窗中的進度 (0-1)
                const scrollTop = window.scrollY
                const startTrigger = elementTop - windowHeight + startOffsetPx
                const endTrigger = elementTop + elementHeight + endOffsetPx
                
                let progress = 0
                if (scrollTop > startTrigger) {
                    progress = Math.min(
                        Math.max((scrollTop - startTrigger) / (endTrigger - startTrigger), 0), 
                        1
                    )
                }
                
                scrollY.set(progress)
            }
        }

        // 初始更新
        updateScrollY()

        // 監聽 Lenis 滾動事件
        const handleScroll = () => {
            updateScrollY()
        }
        
        window.lenis.on('scroll', handleScroll)
        
        // 監聽窗口大小變化，重新計算偏移量
        const handleResize = () => {
            updateScrollY()
        }
        
        window.addEventListener('resize', handleResize)
        
        return () => {
            if (window.lenis) {
                window.lenis.off('scroll', handleScroll)
            }
            window.removeEventListener('resize', handleResize)
        }
    }, [isClient, scrollY, startOffset, endOffset])

    // 使用 useSpring 讓動畫更平滑
    const springScrollY = useSpring(scrollY, springConfig)

    return {
        ref,
        scrollY,
        springScrollY,
        isClient
    }
}

/**
 * useLenisScrollProgress - 簡化版本，只返回滾動進度
 * 
 * @param {Object} options - 配置選項  
 * @returns {Object} - 返回 ref, progress 和 isReady
 */
export const useLenisScrollProgress = (options = {}) => {
    const { ref, springScrollY, isClient } = useLenisScroll(options)
    
    return {
        ref,
        progress: springScrollY,
        isReady: isClient && window.lenis
    }
}

export default useLenisScroll