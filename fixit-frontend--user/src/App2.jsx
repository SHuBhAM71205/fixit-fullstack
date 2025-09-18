import React from 'react'
import './App.css'
import { Route, Routes, BrowserRouter as Router }
  from 'react-router-dom'
import Home from './components/Home'
import Request from './components/Request'
import TrackRequest from './components/TrackRequest'
import Feedback from './components/Feedback'
import Hystory from './components/Hystory'
import Navbar from './components/Navbar'
import HeaderCom from './components/HeaderCom'
import Currpgcontextprovider from './context/Currpgcontextprovider'
import Requestcontextprovider from './context/requestContextProvider'
function App2() {

  return (
    <Currpgcontextprovider>
    <Requestcontextprovider>
      <div className='flex  h-screen bg-slate-100'>
        
          <Navbar />
          <div className="flex-col h-screen flex-1 overflow-scroll ">
            <HeaderCom/>
            <div className="flex">
              <Routes>
                <Route path="/" element={
                  <Home />
                } />
                <Route path="/request" element={
                  <Request />
                } />
                <Route path="/track-request" element={
                  <TrackRequest />
                } />
                <Route path="/feedback" element={
                  <Feedback />
                } />
                <Route path="/history" element={
                  <Hystory />
                } />
              </Routes>
                </div>
            </div>
          </div>
      
      </Requestcontextprovider>
      </Currpgcontextprovider>

      )
}

      export default App2
