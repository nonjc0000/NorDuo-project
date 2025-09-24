import { Routes, Route } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import Lenis from '@studio-freight/lenis'
import NavBar from './components/NavBar'
import Footer from './components/Footer'
import Home from './pages/Home'

const App_NorDuo = () => {
    // 狀態管理
    const [isLenisReady, setIsLenisReady] = useState(false)
    
    // 在這裡定義所有的 refs
    const soundCreatorRef = useRef(null);
    const heroRef = useRef(null);
    const aboutUsRef = useRef(null);
    const latestReleaseRef = useRef(null);
    const learningRef = useRef(null);
    const shopRef = useRef(null);
    const contactUsRef = useRef(null);
    
    // Lenis 實例 ref
    const lenisRef = useRef(null);

    // 初始化 Lenis
    useEffect(() => {
        // 確保在客戶端環境
        if (typeof window === 'undefined') return;

        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 1,
            smoothTouch: false, // 手機上可能會影響體驗，建議設為 false
            touchMultiplier: 2,
            infinite: false,
            // 新增 wrapper 和 content 設置以確保與 Framer Motion 相容
            wrapper: window, // 明確設置滾動容器
            content: document.documentElement, // 設置滾動內容
        });

        lenisRef.current = lenis;
        
        // 將 lenis 掛載到 window 上，供其他組件使用
        window.lenis = lenis;

        // RAF 循環 - 優化性能
        let animationFrameId;
        const raf = (time) => {
            lenis.raf(time);
            animationFrameId = requestAnimationFrame(raf);
        }
        
        // 延遲啟動以確保 DOM 完全載入
        const startRAF = () => {
            animationFrameId = requestAnimationFrame(raf);
            setIsLenisReady(true);
        }

        // 使用 requestIdleCallback 在瀏覽器空閒時啟動，或者使用 setTimeout 作為 fallback
        if (window.requestIdleCallback) {
            window.requestIdleCallback(startRAF);
        } else {
            setTimeout(startRAF, 100);
        }

        // 添加錯誤處理
        const handleLenisError = (error) => {
            console.warn('Lenis error:', error);
        };
        
        lenis.on('error', handleLenisError);

        // 清理函數
        return () => {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
            if (lenisRef.current) {
                lenisRef.current.off('error', handleLenisError);
                lenisRef.current.destroy();
                lenisRef.current = null;
            }
            if (window.lenis) {
                window.lenis = null;
            }
            setIsLenisReady(false);
        };
    }, []);

    // 捲動到指定section的函數 - 改進版本
    const scrollToSection = (sectionName) => {
        if (!isLenisReady || !lenisRef.current) {
            console.warn('Lenis is not ready yet');
            return;
        }

        let targetRef;

        switch (sectionName) {
            case 'home':
                targetRef = heroRef;
                break;
            case 'about':
                targetRef = aboutUsRef;
                break;
            case 'works':
                targetRef = latestReleaseRef;
                break;
            case 'learning':
                targetRef = learningRef;
                break;
            case 'shop':
                targetRef = shopRef;
                break;
            case 'contact':
                targetRef = contactUsRef;
                break;
            default:
                targetRef = heroRef;
        }

        if (targetRef && targetRef.current) {
            try {
                // 使用 Lenis 的平滑滾動
                lenisRef.current.scrollTo(targetRef.current, {
                    duration: 1.5,
                    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                    immediate: false, // 確保使用動畫
                    force: true, // 強制滾動，即使目標已經在視窗內
                });
            } catch (error) {
                console.error('Scroll to section error:', error);
                // Fallback 到原生滾動
                targetRef.current.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    };

    // 提供 loading 狀態的處理
    if (!isLenisReady) {
        return (
            <div className='wrap'>
                <NavBar onNavigate={() => {}} />
                <div style={{ 
                    height: '100vh', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    fontSize: '1.2rem',
                    color: '#F18888'
                }}>
                    Loading smooth scroll...
                </div>
                <Footer onNavigate={() => {}} />
            </div>
        );
    }

    return (
        <div className='wrap'>
            <NavBar onNavigate={scrollToSection} />
            <Home refs={{
                soundCreatorRef,
                heroRef,
                aboutUsRef,
                latestReleaseRef,
                learningRef,
                shopRef,
                contactUsRef
            }} />
            <Footer onNavigate={scrollToSection} />
        </div>
    )
}

export default App_NorDuo