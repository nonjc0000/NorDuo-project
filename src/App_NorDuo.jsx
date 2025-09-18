import { Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar'
import Footer from './components/Footer'
import Home from './pages/Home'
import { useRef } from 'react'

const App_NorDuo = () => {
    // 在這裡定義所有的 refs
    const soundCreatorRef = useRef(null);
    const heroRef = useRef(null);
    const aboutUsRef = useRef(null);
    const latestReleaseRef = useRef(null);
    const learningRef = useRef(null);
    const shopRef = useRef(null);
    const contactUsRef = useRef(null);

    // 捲動到指定section的函數
    const scrollToSection = (sectionName) => {
        let targetRef;

        switch (sectionName) {
            case 'home':
                targetRef = heroRef; // 首頁捲動到 Hero Section
                break;
            case 'about':
                targetRef = aboutUsRef;
                break;
            case 'works':
                targetRef = latestReleaseRef; // Works 對應到 Latest Release
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

        if (targetRef && targetRef.current) { // 1. targetRef - 檢查 ref 對象本身是否存在 2. targetRef.current - 檢查 ref 是否已經綁定到 DOM 元素

            window.scrollTo({
                top: targetRef.current.offsetTop,
                behavior: 'smooth'
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