import React, { useEffect, useState } from 'react'
import axios from 'axios'
import TaskList from '../TaskList/TaskList'

const AdminOverdueTasks = () => {
    const [overdueTasks, setOverdueTasks] = useState([])
    const [allEmployees, setAllEmployees] = useState([])
    const [reassignTarget, setReassignTarget] = useState(null)
    const [newAssignee, setNewAssignee] = useState('')
    const [loading, setLoading] = useState(true)

    const fetchData = async () => {
        try {
            const [tasksRes, usersRes] = await Promise.all([
                axios.get('http://localhost:5000/api/tasks'),
                axios.get('http://localhost:5000/api/users')
            ])

            // Filter only overdue tasks
            const overdue = tasksRes.data.filter(t => t.status === 'overdue')
            setOverdueTasks(overdue)
            setAllEmployees(usersRes.data)
        } catch (error) {
            console.error("Error fetching overdue tasks:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleReassignSubmit = async () => {
        if (!newAssignee) return alert("Please select an employee");
        try {
            await axios.put(`http://localhost:5000/api/tasks/${reassignTarget._id}/reassign`, {
                assignedTo: newAssignee
            });
            alert("Task reassigned successfully!");
            setReassignTarget(null);
            setNewAssignee('');
            fetchData(); // Refresh list
        } catch (error) {
            console.error("Reassign error:", error);
            alert(error.response?.data?.message || "Failed to reassign task");
        }
    }

    if (loading) return null; // Or loading spinner, but null avoids flicker if empty
    if (overdueTasks.length === 0) return null; // Don't show section if no overdue tasks

    return (
        <div id='admin-overdue-tasks' className='bg-white/5 backdrop-blur-xl border border-red-500/20 p-5 md:p-8 lg:p-6 mt-6 md:mt-10 lg:mt-6 rounded-2xl md:rounded-3xl'>
            <div className='flex items-center gap-3 mb-4'>
                <div className='w-3 h-3 rounded-full bg-red-500 animate-pulse'></div>
                <h2 className='text-red-400 font-bold uppercase text-lg tracking-wider'>Attention: Overdue Tasks</h2>
            </div>

            {/* Reuse TaskList but passing only overdue tasks */}
            {/* We pass onReassignRequest to trigger the modal */}
            <TaskList
                data={{ tasks: overdueTasks }}
                onReassignRequest={(task) => setReassignTarget(task)}
            />

            {/* Reassign Modal */}
            {reassignTarget && (
                <div className='fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm'>
                    <div className='bg-[#1c1c1c] border border-white/10 p-8 rounded-2xl w-full max-w-md shadow-2xl'>
                        <h2 className='text-2xl font-bold text-white mb-4'>Reassign Task</h2>
                        <p className='text-gray-400 mb-6'>
                            Reassigning <strong>"{reassignTarget.title}"</strong> ({reassignTarget.category}).
                            <br />
                            <span className='text-red-400 text-sm'>Currently Overdue</span>
                        </p>

                        <div className='mb-6'>
                            <label className='block text-sm text-gray-400 mb-2'>Select New Employee ({reassignTarget.category})</label>
                            <select
                                value={newAssignee}
                                onChange={(e) => setNewAssignee(e.target.value)}
                                className='w-full bg-white/5 border border-white/10 text-white rounded-xl p-3 outline-none focus:border-emerald-500'
                            >
                                <option value="" className='bg-[#1c1c1c] text-gray-500'>Select Employee</option>
                                {allEmployees
                                    // Filter by same designation
                                    .filter(emp => emp.designation === reassignTarget.category)
                                    .map(emp => (
                                        <option key={emp._id} value={emp._id} className='bg-[#1c1c1c]'>
                                            {emp.firstName}
                                        </option>
                                    ))
                                }
                            </select>
                        </div>

                        <div className='flex justify-end gap-3'>
                            <button
                                onClick={() => {
                                    setReassignTarget(null);
                                    setNewAssignee('');
                                }}
                                className='px-4 py-2 text-white hover:bg-white/5 rounded-xl transition-all'
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleReassignSubmit}
                                className='px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-900/20 active:scale-95 transition-all'
                            >
                                Confirm Reassign
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminOverdueTasks
