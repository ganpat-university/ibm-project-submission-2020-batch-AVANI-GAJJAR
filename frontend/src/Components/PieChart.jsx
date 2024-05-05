import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Chart from 'react-apexcharts';

const PieChart = () => {
    const [data, setData] = useState({ fake: 0, real: 0 });

    const fetchData = async () => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BASE_URI}/pieChart`);
            setData(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    const chartOptions = {
        labels: ['Fake', 'Real'],
        colors: ['#ff5722', '#50C878'],
        responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                    width: 200
                },
                legend: {
                    position: 'bottom'
                }
            }
        }],
        chart: {
            toolbar: {
                show: true,
                tools: {
                    download: true,
                    selection: true,
                    zoom: true,
                    zoomin: true,
                    zoomout: true,
                    pan: true,
                    reset: true,
                    customIcons: []
                },
                autoSelected: 'zoom'
            }
        }
    };

    const series = [data.fake, data.real];

    return (
        <div>
            <Chart options={chartOptions} series={series} type="pie" width="380" />
        </div>
    );
}

export default PieChart;
