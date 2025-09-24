import { useEffect, useCallback } from 'react'

/**
 * useLenis Hook - 提供與 Lenis smooth scroll 集成的功能
 */
export const useLenis = () => {
    // 滾動到元素
    const scrollTo = useCallback((target, options = {}) => {
        if (!window.lenis) {
            console.warn('Lenis is not available')
            return
        }

        const defaultOptions = {
            duration: 1.5,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            immediate: false,
            force: true,
            ...options
        }

        try {
            if (typeof target === 'string') {
                // 如果是選擇器字符串
                const element = document.querySelector(target)
                if (element) {
                    window.lenis.scrollTo(element, defaultOptions)
                }
            } else if (target?.current) {
                // 如果是 React ref
                window.lenis.scrollTo(target.current, defaultOptions)
            } else if (target instanceof Element) {
                // 如果是 DOM 元素
                window.lenis.scrollTo(target, defaultOptions)
            } else if (typeof target === 'number') {
                // 如果是數字（滾動距離）
                window.lenis.scrollTo(target, defaultOptions)
            }
        } catch (error) {
            console.error('Lenis scroll error:', error)
            // Fallback 到原生滾動
            if (typeof target === 'number') {
                window.scrollTo({ top: target, behavior: 'smooth' })
            }
        }
    }, [])

    // 滾動到頂部
    const scrollToTop = useCallback((options = {}) => {
        scrollTo(0, options)
    }, [scrollTo])

    // 獲取當前滾動進度
    const getScrollProgress = useCallback(() => {
        if (!window.lenis) return 0
        return window.lenis.progress || 0
    }, [])

    // 開始滾動
    const start = useCallback(() => {
        if (window.lenis) {
            window.lenis.start()
        }
    }, [])

    // 停止滾動
    const stop = useCallback(() => {
        if (window.lenis) {
            window.lenis.stop()
        }
    }, [])

    // 監聽滾動事件
    const onScroll = useCallback((callback) => {
        if (!window.lenis) return () => {}

        window.lenis.on('scroll', callback)
        
        return () => {
            if (window.lenis) {
                window.lenis.off('scroll', callback)
            }
        }
    }, [])

    return {
        scrollTo,
        scrollToTop,
        getScrollProgress,
        start,
        stop,
        onScroll,
        isAvailable: !!window.lenis
    }
}

export default useLenis