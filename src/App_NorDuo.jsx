import { Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar'
import Footer from './components/Footer'

const App_NorDuo = () => {
    return (
        <div className='wrap'>
            <NavBar />
            {/* <Routes>
                <Route path='/' element={<div>Home</div>} />
                <Route path='/about' element={<div>About</div>} />
                <Route path='/contact' element={<div>Contact</div>} />
            </Routes> */}
            <Footer />
        </div>
    )
}

export default App_NorDuo