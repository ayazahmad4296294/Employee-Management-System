import React from 'react'

const TaskListNumber = ({ data }) => {
    return (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-6 md:mt-10'>
            <div className='relative group overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 p-6 md:p-9 rounded-3xl transition-all hover:bg-white/10'>
                <div className='absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-500/20 transition-all'></div>
                <h2 className='text-4xl font-bold text-white mb-2'>{data?.taskCounters?.newTask || 0}</h2>
                <h3 className='text-gray-400 text-lg font-semibold tracking-wide'>New Task</h3>
            </div>

            <div className='relative group overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 p-6 md:p-9 rounded-3xl transition-all hover:bg-white/10'>
                <div className='absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-emerald-500/20 transition-all'></div>
                <h2 className='text-4xl font-bold text-white mb-2'>{data?.taskCounters?.active || 0}</h2>
                <h3 className='text-gray-400 text-lg font-semibold tracking-wide'>Active Task</h3>
            </div>

            <div className='relative group overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 p-6 md:p-9 rounded-3xl transition-all hover:bg-white/10'>
                <div className='absolute top-0 right-0 w-24 h-24 bg-green-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-green-500/20 transition-all'></div>
                <h2 className='text-4xl font-bold text-white mb-2'>{data?.taskCounters?.completed || 0}</h2>
                <h3 className='text-gray-400 text-lg font-semibold tracking-wide'>Completed Task</h3>
            </div>

            <div className='relative group overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 p-6 md:p-9 rounded-3xl transition-all hover:bg-white/10'>
                <div className='absolute top-0 right-0 w-24 h-24 bg-yellow-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-yellow-500/20 transition-all'></div>
                <h2 className='text-4xl font-bold text-white mb-2'>{data?.taskCounters?.failed || 0}</h2>
                <h3 className='text-gray-400 text-lg font-semibold tracking-wide'>Failed Task</h3>
            </div>
        </div>
    )
}

export default TaskListNumber