import { useEffect, useState } from 'react';
import axios from 'axios'
import { Link } from 'react-router-dom'
import { Table } from 'antd'
import PieChart from '../Components/PieChart';
import Sidebar from '../Components/Sidebar';

const DashboardPage = () => {
  const logout = () => {
    localStorage.clear()
    window.location.replace('/login')

  }
  const [data, setData] = useState([])
  const [name, setName] = useState('')
  const [pagination, setPagination] = useState(1)
  const [pageSize, setPageSize] = useState(5)
  const proxyUrl = 'http://localhost:8080/';

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
    if (!token) {
      window.location.replace('/login')
    }
    fetchUser()
    fetchData()
  }, [])
  const columns = [
    {
      title: 'Index',
      dataIndex: 'id',
      key: 'id',
      render: (text, record, index) => pagination * pageSize + index + 1 - pageSize,
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Profile Photo',
      dataIndex: 'profilePhoto',
      key: 'profilePhoto',
      render: (text, record) => (
        <img src={`${proxyUrl}${record?.profilePhoto}`}
          referrerPolicy="no-referrer"
          crossOrigin="anonymous"
          headers={{ "X-Requested-With": "XMLHttpRequest" }}
          alt={record.username} className="w-12 h-12 rounded-full" />
      ),
    },
    {
      title: 'Prediction',
      dataIndex: 'prediction',
      key: 'prediction',
      render: (text, record) => (
        <span>{record.prediction ? "Fake" : "Not Fake"}</span>
      )
    },
    {
      title: 'Timestamp',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (text, record) => (
        new Date(record.timestamp).toLocaleString()
      )
    }
  ];

  return (
    <div className="flex bg-[#fff] min-h-screen">
      <Sidebar />

      <div className="flex-1 p-10 ml-64">      
        <Table columns={columns} dataSource={data}
          pagination={{ pageSize: 5 }}
          onChange={(pagination, filters, sorter, extra) => {
            setPagination(pagination.current)
            console.log('params', pagination, filters, sorter, extra);
          }
          }
        />
      </div>
    </div>
  );
};

export default DashboardPage;
