import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Chart from 'react-apexcharts';

const LineChart = () => {
    const [data, setData] = useState({ fake: 0, real: 0 });

    const fetchData = async () => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BASE_URI}/lineChart`);
            setData(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    const chartOptions = {
        chart: {
            id: 'bar-chart',
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
        },
        plotOptions: {
            bar: {
                barHeight: '100%', // This makes the height of each bar equal to the available height
                distributed: true, // This will distribute the bars evenly
                horizontal: false, // This will make the bars vertical
                columnWidth: '50%', // Adjust this value to reduce the width of the bars
            }
        },
        xaxis: {
            categories: Object.keys(data)
        }
    };

    const series = [{
        name: 'Prediction',
        data: Object.values(data)
    }];

    return (
        <div>
            <Chart
                options={chartOptions}
                series={series}
                type="bar"
                height={350}
            />
        </div>
    );
}

export default LineChart;
