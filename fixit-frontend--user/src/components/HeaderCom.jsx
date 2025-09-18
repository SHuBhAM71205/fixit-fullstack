import { useContext } from "react"
import React from 'react'
import Currpgcontext from "../context/currpgcontext"
export default function Header() {
    const context=useContext(Currpgcontext)
    const{currpg}=context;
    const date=new Date();
    const date2=date.getDate().toString()+'-'+date.getMonth().toString()+'-'+date.getFullYear().toString();
  return (
<div className="flex h-10 justify-between sticky top-0 z-10 p-7 text-2xl text-blue-900
 border-b border-blue-500 items-center bg-gray-200 shadow-blue-50 rounded-br-xl  ">
      <div className="text-sm pt-7">{date2}</div>{currpg}
    </div>
  )
}
