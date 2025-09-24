import { Routes, Route } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import Lenis from '@studio-freight/lenis'
import NavBar from './components/NavBar'
import Footer from './components/Footer'
import Home from './pages/Home'

const App_NorDuo = () => {
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
        });

        lenisRef.current = lenis;
        
        // 將 lenis 掛載到 window 上，供其他組件使用
        window.lenis = lenis;

        // RAF 循環
        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        // 清理函數
        return () => {
            lenis.destroy();
            window.lenis = null;
        };
    }, []);

    // 捲動到指定section的函數 - 現在使用 Lenis
    const scrollToSection = (sectionName) => {
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

        if (targetRef && targetRef.current && lenisRef.current) {
            // 使用 Lenis 的平滑滾動
            lenisRef.current.scrollTo(targetRef.current, {
                duration: 1.5,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            });
        }
    };

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