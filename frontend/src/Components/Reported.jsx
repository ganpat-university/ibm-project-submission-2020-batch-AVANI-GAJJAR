import { useEffect, useState } from 'react';
import axios from 'axios'
import { Table, notification } from 'antd'
import toast, { Toaster } from 'react-hot-toast';

const Reported = () => {

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
        const filtered = data?.data?.filter((item)=>item?.isReported === true)
        const data_filt = filtered.filter((item)=>item?.prediction === true)
        setData(data_filt)
      }
    }
    catch (error) {

      console.log(error)
    }

  }
  
  const sendReport = async (id) => {
    try{
        const response = await axios.get(`${process.env.REACT_APP_BASE_URI}/report/${id}`)
        const data = response?.data        
        console.log(data)        
        toast.success("Profile Reported Successfully")
        fetchData()
    }
    catch(err){
        console.log(err)
    }
 }

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      window.location.replace('/login')
    }
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
    <div className="flex bg-[#fff] min-h-screen w-full">
      <Toaster />

      <div className="flex-1 w-full">      
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

export default Reported;
