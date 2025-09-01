import { Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar'
import Footer from './components/Footer'
import Home from './pages/Home'

const App_NorDuo = () => {
    return (
        <div className='wrap'>
            <NavBar />
            <Home />
            <Footer />
        </div>
    )
}

export default App_NorDuo