import React from 'react'
import './App.css'
import { Route, Routes, BrowserRouter as Router}
  from 'react-router-dom'
import Home from './components/Home'
import TaskList from './components/taskList'
import Feedback from './Feedback'
import Hystory from './components/Hystory'
import Navbar from './components/Navbar'
import Stastic from './components/Stastic'
import HeaderCom from './components/HeaderCom'
import Currpgcontextprovider from './context/currpgcontextprovider'

function App2() {

  return (
    
    <Currpgcontextprovider>
    <div className='flex flex-row h-screen bg-zinc-200'>
        
        <Navbar />
        <div className="flex-col h-screen flex-1 overflow-auto">
          <HeaderCom/>
          <div className="">
            <Routes>
              <Route path="/" element={
                <Home />
              } />
              <Route path="/tasklist" element={
                <TaskList />
              } />
              <Route path="/stastic" element={
                <Stastic />
              } />
              <Route path="/history" element={
                <Hystory />
              } />
              <Route path="/feedback" element={
                <Feedback />
              } />
            </Routes>
          </div>
        </div>
    
    </div>
    </Currpgcontextprovider>
  )
}

export default App2
