import { useContext } from "react"
import React from 'react'
import Currpgcontext from "../context/currpgcontext"
export default function Header() {
    const context=useContext(Currpgcontext)
    const{currpg}=context
  return (
<p className="flex h-10 justify-end sticky top-0 z-10 p-7 text-2xl text-blue-900
 border-b border-blue-500 items-center bg-white shadow-blue-50 rounded-br-xl  ">
      {currpg}
    </p>
  )
}
