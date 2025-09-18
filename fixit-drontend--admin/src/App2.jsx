import React ,{useState}from 'react'
import './App.css'
import { Route, Routes, BrowserRouter as Router}
  from 'react-router-dom'
import User from './components/User'
import Seeting from './components/Seeting'
import Navbar from './components/Navbar'
import Stastic from './components/Stastic'
import Request from './components/Request'
import Header from './components/HeaderCom'
import Currpgcontext from './context/currpgcontext'
import Currpgcontextprovider from './context/Currpgcontextprovider'
import TaskmasterApplications from './components/TaskmaterApplic'


export default function App2() {
  return (

    <Currpgcontextprovider>
    <div className='flex h-screen bg-gray-800'>
      
        <Navbar />
        <div className=" h-screen w-fit flex-col flex-1 overflow-x-clip overflow-y-auto">
          <Header/>
          <div className="flex">
            <Routes>
              <Route path="/" element={
                <Stastic />
              } />
              <Route path="/Request" element={
                <Request />
              } />
              <Route path="/TaskmasterApplications" element={
                <TaskmasterApplications/>
              }/>
              <Route path="/User" element={
                <User />
              } />
              <Route path="/Seeting" element={
                <Seeting />
              } />
            </Routes>
          </div>
          </div>
          {/* <LoginSignupPage/> */}
      
    </div>
    </Currpgcontextprovider>
  )
}
