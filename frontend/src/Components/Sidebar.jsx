import { useEffect, useState } from 'react';
import axios from 'axios'
import { Link } from 'react-router-dom'
import Avatar from 'react-avatar';

const Sidebar = () => {
    const logout = () => {
        localStorage.clear()
        window.location.replace('/login')

    }
    const [data, setData] = useState([])
    const [name, setName] = useState('')
    const [current, setCurrent] = useState('dashboard')
    const currentPath = window.location.pathname

    useEffect(() => {
        const currentPath = window.location.pathname
        if (currentPath.includes('statistics')) {
            setCurrent("statistics")
        }
        else if (currentPath.includes('predict')) {
            setCurrent("predict")
        }
        else if (currentPath.includes('dashboard')) {
            setCurrent("dashboard")
        }
        else if (currentPath.includes('report')) {
            setCurrent("report")
        }
        
    },[currentPath])

    const fetchData = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BASE_URI}/predictions`)
            const data = await response
            if (data) {
                setData(data.data)
            }
        }
        catch (error) {

            console.log(error)
        }

    }

    const fetchUser = async () => {
        try {
            const id = localStorage.getItem("id")
            const response = await axios.get(`${process.env.REACT_APP_BASE_URI}/user/${id}`)
            const data = await response
            if (data) {
                setName(data.data.name)
            }
        }
        catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        const token = localStorage.getItem("token")
        const currentPath = window.location.pathname 
        if (!token && currentPath !== "/predict") {
            window.location.replace('/login')
        }
        fetchUser()
        fetchData()
    }, [])


    return (
        <div className="flex bg-[#fff] min-h-screen">
            <div className="w-60 fixed min-h-screen bg-[#4a4a4a] p-4 transition-all">
                <ul className="list-none">
                    <li className="flex items-center mb-6">
                        <div className="overflow-hidden">
                            <Avatar name={name} size='40' round={true}/>
                        </div>
                        <h2 className="text-white text-lg ml-3">{name}</h2>
                    </li>
                    <li>
                        <Link className={`text-white ml-3 flex items-center hover:bg-[#242424] bg-opacity-25  ${current === "predict" && "bg-[#242424]"} rounded p-2 transition duration-500`} to={"/predict"}>Prediction</Link>
                    </li>
                    <li>
                        <Link className={`text-white ml-3 flex items-center hover:bg-[#242424] bg-opacity-25 ${current === "dashboard" && "bg-[#242424]"} rounded p-2 transition duration-500`} to={"/dashboard"}>Dashboard</Link>
                    </li>
                    <li>
                        <Link className={`text-white ml-3 flex items-center hover:bg-[#242424] bg-opacity-25 ${current === "statistics" && "bg-[#242424]"} rounded p-2 transition duration-500`} to={"/statistics"}>Statistics</Link>
                    </li>
                    <li>
                        <Link className={`text-white ml-3 flex items-center hover:bg-[#242424] bg-opacity-25 ${current === "report" && "bg-[#242424]"} rounded p-2 transition duration-500`} to={"/report"}>Report</Link>
                    </li>
                    <li>
                        <button className="flex items-center bg-red-500 hover:bg-red-600 text-white rounded p-2 ml-3" onClick={logout}>Log Out</button>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Sidebar;
