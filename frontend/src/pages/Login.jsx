import React from 'react';
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react';
import { toast, Toaster } from 'react-hot-toast'
const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        if (formData.email === '' || formData.password === '') {
            toast.error("All fields are required");
            return;
        }
        try {
            const response = await fetch(`${process.env.REACT_APP_BASE_URI}/login/`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            console.log(data);
            localStorage.removeItem("token");
            if (data.status === 'success') {
                localStorage.setItem("token", data.jwt);
                localStorage.setItem("id", data.id);
                window.location.replace('/verify');

            } else {
                toast.error(data.message);
            }

        }
        catch (error) {
            toast.error(error)
        }
    }

    useEffect(() => {
        const token = localStorage.getItem("token")
        localStorage.setItem("isVerified","false")
        if (token) {
            window.location.replace('/dashboard')
        }
    })
    return (
        <div className="flex min-h-screen items-center justify-center background rounded-md">
            <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet"></link>

            <Toaster />
            <div className='grid grid-cols-1'
            >
                <div className='w-full grid justify-center items-center bg-white rounded-md shadow-3xl'>
                    <div className=" p-8 rounded shadow-md w-96">
                        <h2 className="text-[37px] font-bold text-center text-gray-800 mb-6">Login</h2>
                        <form>
                            <div className="mb-4">
                                <label htmlFor="email" className="block text-gray-600 font-bold text-sm mb-2">Email</label>
                                <input type="text"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    id="email" className="w-full px-3 py-2 border rounded " />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="password" className="block text-gray-600 font-bold text-sm mb-2">Password</label>
                                <input type="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    id="password" className="w-full px-3 py-2 border rounded " />
                            </div>
                            <button type="submit" onClick={handleLogin} className="w-full bg-black py-3 text-white">
                                Login
                            </button>
                            <div className='py-2'>
                                <Link to="/predict">Predict?</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
