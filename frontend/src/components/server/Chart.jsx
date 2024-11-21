import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Chart = () => {
  const [startDate, setStartDate] = useState(new Date(new Date().getFullYear(), 0, 1)); // Start of the year
  const [endDate, setEndDate] = useState(new Date()); // Current date
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/v1/sales', {
          params: {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
          },
        });
        setSalesData(response.data.sales);
      } catch (error) {
        console.error('Error fetching sales data:', error);
      }
    };

    fetchSalesData();
  }, [startDate, endDate]);

  const totalSales = salesData.reduce((sum, sale) => sum + sale.totalSales, 0);

  const data = {
    labels: salesData.map((sale) => new Date(sale._id.year, sale._id.month - 1, sale._id.day).toLocaleDateString('en-US')),
    datasets: [
      {
        label: 'Sales',
        data: salesData.map((sale) => sale.totalSales),
        backgroundColor: salesData.map((sale) => sale.totalSales < 2000 ? 'rgba(255, 99, 132, 0.6)' : 'rgba(75, 192, 192, 0.6)'),
        borderColor: salesData.map((sale) => sale.totalSales < 2000 ? 'rgba(255, 99, 132, 1)' : 'rgba(75, 192, 192, 1)'),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      x: {
        type: 'category',
        ticks: {
          font: {
            family: 'Montserrat, sans-serif',
          },
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          font: {
            family: 'Montserrat, sans-serif',
          },
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            const index = context.dataIndex;
            const sale = salesData[index];
            const date = new Date(sale._id.year, sale._id.month - 1, sale._id.day);
            const formattedDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
            return `Total Sales: ₱${sale.totalSales} on ${formattedDate}`;
          },
        },
        titleFont: {
          family: 'Montserrat, sans-serif',
        },
        bodyFont: {
          family: 'Montserrat, sans-serif',
        },
      },
      legend: {
        labels: {
          font: {
            family: 'Montserrat, sans-serif',
          },
        },
      },
    },
  };

  return (
    <div className="container mx-auto p-4 font-montserrat">
      <div className="bg-white p-6 rounded-lg shadow-md relative">
        <div className="absolute top-4 right-4 flex items-center space-x-2">
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            className="border border-gray-300 rounded-md p-1 text-sm w-24 text-center"
          />
          <div className="border-t border-gray-400 w-6 mx-2"></div>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            className="border border-gray-300 rounded-md p-1 text-sm w-24 text-center"
          />
        </div>
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Sales Revenue: ₱{totalSales.toLocaleString()}</h2>
        </div>
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default Chart;