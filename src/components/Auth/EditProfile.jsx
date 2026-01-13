import React, { useState, useContext } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthProvider'

const EditProfile = () => {
    const { user, setUser } = useContext(AuthContext)
    const [firstName, setFirstName] = useState(user?.firstName || "")
    const [oldPassword, setOldPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const navigate = useNavigate()

    const submitHandler = async (e) => {
        e.preventDefault();

        if (newPassword && newPassword !== confirmPassword) {
            alert("New passwords do not match!");
            return;
        }

        try {
            const response = await axios.patch('http://localhost:5000/api/auth/update-profile', {
                userId: user._id,
                role: user.role,
                firstName,
                oldPassword: oldPassword || undefined,
                newPassword: newPassword || undefined
            });

            const updatedUser = { ...user, firstName: response.data.user.firstName };
            setUser(updatedUser);
            localStorage.setItem('loggedInUser', JSON.stringify(updatedUser));

            alert("Profile updated successfully!");
            navigate('/');
        } catch (error) {
            alert(error.response?.data?.message || "Failed to update profile");
        }
    }

    return (
        <div className='flex h-screen w-screen items-center justify-center bg-[#0a0a0a] relative overflow-hidden'>
            <div className='absolute w-96 h-96 bg-emerald-600/20 rounded-full blur-[120px] -top-20 -left-20 animate-pulse'></div>
            <div className='absolute w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] -bottom-20 -right-20 animate-pulse' style={{ animationDelay: '1s' }}></div>

            <div className='relative z-10 w-full max-w-lg mx-5'>
                <div className='bg-white/5 backdrop-blur-xl border border-white/10 p-12 md:p-16 lg:p-10 rounded-[2.5rem] shadow-2xl'>
                    <button
                        onClick={() => navigate('/')}
                        className='text-emerald-400 hover:text-emerald-300 mb-6 lg:mb-4 flex items-center gap-2 transition-all'
                    >
                        ← Back
                    </button>
                    <div className='text-center mb-10 lg:mb-6'>
                        <h1 className='text-4xl md:text-5xl lg:text-4xl font-bold text-white mb-3 tracking-tight'>Edit Profile</h1>
                        <p className='text-gray-400 text-lg lg:text-base'>Update your information</p>
                    </div>

                    <form onSubmit={submitHandler} className='space-y-4 lg:space-y-3'>
                        <div className='space-y-2 lg:space-y-1'>
                            <p className='text-gray-400 text-sm ml-2'>Edit Name</p>
                            <input
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                                type="text"
                                placeholder='First Name'
                                className='w-full text-white outline-none bg-white/5 border border-white/10 focus:border-emerald-500/50 focus:bg-white/10 rounded-2xl py-4 px-6 lg:py-2 lg:px-4 text-lg lg:text-sm transition-all placeholder:text-gray-600'
                            />
                        </div>

                        <div className='pt-4 lg:pt-3 border-t border-white/5 space-y-4 lg:space-y-3'>
                            <p className='text-gray-400 text-sm ml-2'>Change Password (Optional)</p>
                            <input
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                type="password"
                                placeholder='Current Password'
                                className='w-full text-white outline-none bg-white/5 border border-white/10 focus:border-emerald-500/50 focus:bg-white/10 rounded-2xl py-4 px-6 lg:py-2 lg:px-4 text-lg lg:text-sm transition-all placeholder:text-gray-600'
                            />
                            <input
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                type="password"
                                placeholder='New Password'
                                className='w-full text-white outline-none bg-white/5 border border-white/10 focus:border-emerald-500/50 focus:bg-white/10 rounded-2xl py-4 px-6 lg:py-2 lg:px-4 text-lg lg:text-sm transition-all placeholder:text-gray-600'
                            />
                            <input
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                type="password"
                                placeholder='Confirm New Password'
                                className='w-full text-white outline-none bg-white/5 border border-white/10 focus:border-emerald-500/50 focus:bg-white/10 rounded-2xl py-4 px-6 lg:py-2 lg:px-4 text-lg lg:text-sm transition-all placeholder:text-gray-600'
                            />
                        </div>

                        <button className='w-full group relative flex items-center justify-center bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 px-6 lg:py-2.5 rounded-2xl text-xl lg:text-base transition-all duration-300 shadow-lg shadow-emerald-900/20 active:scale-[0.98] overflow-hidden mt-4'>
                            <span className='relative z-10'>Update Profile</span>
                            <div className='absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700'></div>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default EditProfile
