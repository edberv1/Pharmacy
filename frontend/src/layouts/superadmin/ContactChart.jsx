import { useState, useEffect } from "react";
import Chart from "react-apexcharts";

const ContactChart = () => {
  const [series, setSeries] = useState([]);
  const [period, setPeriod] = useState('7');
  const [options, setOptions] = useState({
    chart: {
      id: "basic-line",
      toolbar: {
        show: true,
        tools: {
          download: true, // Only show download button
          selection: false,
          zoom: false,
          zoomin: false,
          zoomout: false,
          pan: false,
          reset: false
        },
        autoSelected: 'zoom' // Default selection
      }
    },
    stroke: {
      curve: 'smooth', // Makes the line chart smoother
      width: 2 // Adjusts the line width
    },
    colors: ['#F44336'], // Changes the line color
    xaxis: {
      categories: ['7 days', '14 days', '1 month'],
      labels: {
        style: {
          colors: '#333', // Changes the color of x-axis labels
          fontSize: '12px' // Changes the font size of x-axis labels
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: '#333', // Changes the color of y-axis labels
          fontSize: '12px' // Changes the font size of y-axis labels
        }
      }
    }
  });

  useEffect(() => {
    const url = `http://localhost:8080/contact/contactChart?days=${period}`;
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    };
  
    fetch(url, requestOptions)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      setSeries([{
        name: "contacts",
        data: data.map(item => item.count)
      }]);
      setOptions({
        ...options,
        xaxis: {
          categories: data.map(item => new Date(item.date).toLocaleDateString())
        },
      });
    })
    .catch(error => console.error('Error:', error));
  }, [period]);
  

  
  return (
    <div>
      <select value={period} onChange={e => setPeriod(e.target.value)}>
        <option value="7">Last 7 days</option>
        <option value="14">Last 14 days</option>
        <option value="30">Last 30 days</option>
      </select>
      <Chart
        options={options}
        series={series}
        type="line"
        width="100%"
        height="400px"
      />
    </div>
  );
};

export default ContactChart;
