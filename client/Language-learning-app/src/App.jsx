import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import SelectLanguage from './Pages/SelectLanguage/SelectLanguage'
import Exercise from './Pages/Exercise/Exercise'
import PersonalProfile from './Pages/Profile/Profile'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  

  return (
    <Router>
      <div className='App'>
        <Routes>
        <Route path='/' element={<SelectLanguage />} />
        <Route path='/exercise/:id' element={<Exercise />} />
        <Route path='/profile' element={<PersonalProfile />} />
        </Routes>
      </div>
    </Router>
  )
}
export default App
