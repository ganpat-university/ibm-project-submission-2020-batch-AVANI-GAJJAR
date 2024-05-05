import { useEffect, useState } from 'react';
import PieChart from '../Components/PieChart';
import Sidebar from '../Components/Sidebar';
import LineChart from '../Components/LineChart';

const Statistics = () => {  

  return (
    <div className="flex bg-[#fff] min-h-screen"> 
    <Sidebar />   
      <div className="flex-1 p-10 ml-64">
        <div className='mb-8 grid grid-cols-2 gap-20'>
            <div>
          <h1 className='font-semibold text-lg mb-4'>All Predictions</h1>
          <PieChart />
          </div>
          <div>
          <h1 className='font-semibold text-lg mb-4'>Month Wise Prediction</h1>
          <LineChart />
          </div>
        </div>        
      </div>
    </div>
  );
};

export default Statistics;
