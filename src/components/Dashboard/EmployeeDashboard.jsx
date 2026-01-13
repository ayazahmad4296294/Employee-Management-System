import React, { useEffect, useState } from 'react'
import Header from '../other/Header'
import TaskListNumber from '../other/TaskListNumber'
import TaskList from '../TaskList/TaskList'
import axios from 'axios'

const EmployeeDashboard = ({ data }) => {
    const [tasks, setTasks] = useState([])

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                console.log('Fetching tasks for employee:', data._id, 'Name:', data.firstName);
                const response = await axios.get('http://localhost:5000/api/tasks', {
                    headers: {
                        role: 'employee',
                        userid: data._id
                    }
                })
                console.log('Received tasks:', response.data);
                setTasks(response.data)
            } catch (error) {
                console.error("Error fetching tasks:", error)
            }
        }
        fetchTasks()
    }, [data._id])

    // Calculate task counts dynamically from the fetched tasks
    const taskCounts = {
        newTask: tasks.filter(t => t.status === 'new').length,
        active: tasks.filter(t => t.status === 'active').length,
        completed: tasks.filter(t => t.status === 'completed').length,
        failed: tasks.filter(t => t.status === 'failed').length
    }

    return (
        <div className='min-h-screen w-full bg-[#0a0a0a] relative overflow-hidden'>
            <div className='absolute w-96 h-96 bg-emerald-600/10 rounded-full blur-[120px] -top-20 -left-20 animate-pulse'></div>
            <div className='absolute w-96 h-96 bg-blue-600/5 rounded-full blur-[120px] -bottom-20 -right-20 animate-pulse' style={{ animationDelay: '1s' }}></div>

            <div className='relative z-10 p-6 md:p-10'>
                <Header data={data} />
                <TaskListNumber data={{ ...data, taskCounters: taskCounts }} />
                <TaskList data={{ tasks }} />
            </div>
        </div>
    )
}

export default EmployeeDashboard