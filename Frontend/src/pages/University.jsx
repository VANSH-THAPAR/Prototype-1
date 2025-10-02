import React from 'react'
import '../App.css'

const University = () => {
  return (
    <div className="flex flex-col h-[100vh] justify-around w-[100vw] bg-slate-50">
        <p className="text-5xl self-center font-extrabold h-[5vh]">DASHBOARD</p>
       <div className="flex justify-evenly items-center h-[20vh]">
            <div className="flex flex-col w-[25%] h-[90%] items-center justify-evenly border-[0.1em] border-slate-200 rounded-xl bg-white transition duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-gray-200">
              <p className="text-3xl font-semibold">Alumni</p>
              <span className='text-2xl' >2,500</span>
            </div>
            <div className="flex flex-col w-[25%] h-[90%] items-center justify-evenly border-[0.1em] border-slate-200 rounded-xl bg-white transition duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-gray-200">
              <p className="text-3xl font-semibold">Students</p>
              <span className='text-2xl' >1,500</span>
            </div>
            <div className="flex flex-col w-[25%] h-[90%] items-center justify-evenly border-[0.1em] border-slate-200 rounded-xl bg-white transition duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-gray-200">
              <p className="text-3xl font-semibold">Funds Raised</p>
              <span className='text-2xl' >2,22,500</span>
            </div>
       </div>
       <div className='flex justify-evenly h-[50vh]'>
            <div className="bg-white flex justify-center h-[100%] border-slate-200 border-[0.1em] w-[30%] rounded-xl">
              <p className="text-3xl font-semibold mt-3">New Requests</p>
            </div>
            <div className="bg-white flex justify-center h-[100%] border-slate-200 border-[0.1em] w-[60%] rounded-xl">
              <p className="text-3xl font-semibold mt-3">Event history</p>
            </div>
       </div>
    </div>
  )
}

export default University