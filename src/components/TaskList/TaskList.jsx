import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { AuthContext } from '../../context/AuthProvider'

const TaskList = ({ data, onReassignRequest }) => {
    const navigate = useNavigate()
    const { user } = useContext(AuthContext)

    const handleStatusUpdate = async (taskId, newStatus, e) => {
        e.stopPropagation()
        try {
            await axios.patch(`http://localhost:5000/api/tasks/${taskId}/status`, {
                status: newStatus
            })
            // Reload the page to refresh task list and counters
            window.location.reload()
        } catch (error) {
            alert(error.response?.data?.message || "Failed to update task status")
            console.error("Error updating task:", error)
        }
    }

    const handleDelete = async (taskId, e) => {
        e.stopPropagation()
        if (!window.confirm("Are you sure you want to delete this task?")) return;

        try {
            await axios.delete(`http://localhost:5000/api/tasks/${taskId}`)
            window.location.reload()
        } catch (error) {
            alert(error.response?.data?.message || "Failed to delete task")
            console.error("Error deleting task:", error)
        }
    }

    return (
        <div id='tasklist' className='bg-white/5 backdrop-blur-xl border border-white/10 p-5 md:p-8 lg:p-6 mt-6 md:mt-10 lg:mt-6 rounded-2xl md:rounded-3xl min-h-64 h-[60%] overflow-y-auto relative custom-scrollbar'>
            <div className='bg-white/5 border border-white/5 mb-4 lg:mb-3 py-3 px-6 lg:py-2 lg:px-6 hidden md:flex justify-between rounded-xl sticky top-0 backdrop-blur-md z-10'>
                <h2 className='text-gray-400 font-bold w-1/4 uppercase text-sm lg:text-xs tracking-wider'>Task Title</h2>
                <h3 className='text-gray-400 font-bold w-1/4 uppercase text-sm lg:text-xs tracking-wider text-center'>Category</h3>
                <h5 className='text-gray-400 font-bold w-1/4 uppercase text-sm lg:text-xs tracking-wider text-center'>Date</h5>
                <h5 className='text-gray-400 font-bold w-1/4 uppercase text-sm lg:text-xs tracking-wider text-right'>Actions</h5>
            </div>

            <div className='space-y-3 lg:space-y-2 font-medium'>
                {data?.tasks?.length > 0 ? (
                    data.tasks.map((elem, idx) => {
                        return (
                            <div
                                key={idx}
                                onClick={() => navigate(`/task/${elem._id}`)}
                                className='bg-white/5 border border-white/5 hover:bg-white/10 transition-all py-4 px-5 md:py-4 md:px-6 lg:py-2.5 lg:px-6 flex flex-col md:flex-row justify-between items-start md:items-center rounded-xl group cursor-pointer gap-3 md:gap-0'
                            >
                                <div className='w-full md:w-1/4 mb-2 md:mb-0'>
                                    <h2 className='text-white text-lg md:text-base lg:text-sm truncate group-hover:px-0 md:group-hover:px-2 transition-all'>{elem.title}</h2>
                                    <span className='md:hidden text-gray-500 text-xs mt-1 block'>
                                        {new Date(elem.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>

                                <div className='w-full md:w-1/4 flex justify-start md:justify-center mb-2 md:mb-0'>
                                    <span className='bg-emerald-500/10 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/20'>
                                        {elem.category}
                                    </span>
                                </div>
                                <h5 className='text-gray-400 w-1/4 text-center hidden md:block text-base lg:text-sm'>
                                    {new Date(elem.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                </h5>

                                <div className='w-full md:w-1/4 flex justify-end gap-2 mt-2 md:mt-0'>
                                    {user?.role === 'employee' && (
                                        <>
                                            {elem.status === 'new' && (
                                                <button
                                                    onClick={(e) => handleStatusUpdate(elem._id, 'active', e)}
                                                    className='bg-purple-600 hover:bg-purple-500 text-white text-[10px] font-bold py-2 px-4 md:py-1.5 md:px-3 rounded-lg shadow-lg shadow-purple-900/10 transition-all active:scale-95'
                                                >
                                                    Accept
                                                </button>
                                            )}
                                            {elem.status === 'active' && (
                                                <>
                                                    <button
                                                        onClick={(e) => handleStatusUpdate(elem._id, 'completed', e)}
                                                        className='bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold py-2 px-4 md:py-1.5 md:px-3 rounded-lg shadow-lg shadow-emerald-900/10 transition-all active:scale-95'
                                                    >
                                                        Done
                                                    </button>
                                                    <button
                                                        onClick={(e) => handleStatusUpdate(elem._id, 'failed', e)}
                                                        className='bg-red-600 hover:bg-red-500 text-white text-[10px] font-bold py-2 px-4 md:py-1.5 md:px-3 rounded-lg shadow-lg shadow-red-900/10 transition-all active:scale-95'
                                                    >
                                                        Fail
                                                    </button>
                                                </>
                                            )}
                                            {elem.status === 'completed' && (
                                                <span className='bg-green-500/10 text-green-400 text-[10px] font-bold px-3 py-1.5 rounded-lg border border-green-500/20'>
                                                    Completed
                                                </span>
                                            )}
                                            {elem.status === 'failed' && (
                                                <span className='bg-red-500/10 text-red-400 text-[10px] font-bold px-3 py-1.5 rounded-lg border border-red-500/20'>
                                                    Failed
                                                </span>
                                            )}
                                            {elem.status === 'overdue' && (
                                                <span className='bg-orange-500/10 text-orange-400 text-[10px] font-bold px-3 py-1.5 rounded-lg border border-orange-500/20'>
                                                    Overdue
                                                </span>
                                            )}
                                        </>
                                    )}
                                    {user?.role === 'admin' && (
                                        <div className='flex items-center gap-2'>
                                            <span className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold 
                                                ${elem.status === 'new' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : ''}
                                                ${elem.status === 'active' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : ''}
                                                ${elem.status === 'completed' ? 'bg-green-500/10 text-green-400 border-green-500/20' : ''}
                                                ${elem.status === 'failed' ? 'bg-red-500/10 text-red-400 border-red-500/20' : ''}
                                                ${elem.status === 'overdue' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : ''}
                                            `}>
                                                {elem.status.charAt(0).toUpperCase() + elem.status.slice(1)}
                                            </span>
                                            {/* Reassign Button Placeholder - will implement logic next */}
                                            {elem.status === 'overdue' && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        // Trigger Reassign
                                                        if (onReassignRequest) onReassignRequest(elem);
                                                    }}
                                                    className='bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold py-1.5 px-3 rounded-lg shadow-lg active:scale-95'
                                                >
                                                    Reassign
                                                </button>
                                            )}
                                            <button
                                                onClick={(e) => handleDelete(elem._id, e)}
                                                className='bg-red-600 hover:bg-red-500 text-white text-[10px] font-bold py-1.5 px-3 rounded-lg shadow-lg active:scale-95'
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })
                ) : (
                    <div className='flex flex-col items-center justify-center py-10'>
                        <p className='text-gray-500 text-lg'>No tasks available yet! 😴</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default TaskList