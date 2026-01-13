import React from 'react'

const CompleteTask = ({ data }) => {
    return (
        <div className='flex-shrink-0 h-full w-[300px] p-5 bg-green-400 rounded-xl'>
            <div className='flex items-center justify-between'>
                <h3 className='bg-green-600 px-3 py-1 rounded text-sm text-white font-semibold uppercase'>{data.category}</h3>
                <h4 className='text-sm font-medium text-white'>{data.date}</h4>
            </div>
            <h2 className='text-2xl font-bold text-white mt-5'>{data.title}</h2>
            <p className='mt-2 text-sm text-white opacity-90 leading-relaxed h-[100px] overflow-y-auto'>
                {data.description}
            </p>
            <div className=''>
                <button className='w-full bg-green-600 hover:bg-green-700 transition-colors px-3 py-2 rounded-lg text-sm font-bold text-white'>Completed</button>
            </div>
        </div>
    )
}

export default CompleteTask