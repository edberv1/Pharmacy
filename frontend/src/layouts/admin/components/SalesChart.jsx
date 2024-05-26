import  { useEffect, useState } from 'react';
import Chart from 'react-apexcharts'; // Make sure to install react-apexcharts using npm install react-apexcharts apexcharts

function SalesChart() {
  const [series, setSeries] = useState([]);

  const fetchData = async () => {
    try {
      const response = await fetch(
        "http://localhost:8081/admin/getSalesData",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      // Create an array for the past 7 days in UTC
      const dates = Array.from({length: 7}, (_, i) => {
        const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
        const year = d.getUTCFullYear();
        const month = String(d.getUTCMonth() + 1).padStart(2, '0');
        const day = String(d.getUTCDate()).padStart(2, '0');
        return `${year}-${month}-${day}`; 
      }).reverse(); 

      const groupedData = {};
      data.forEach(item => {
        if (!groupedData[item.pharmacyName]) {
          groupedData[item.pharmacyName] = dates.map(date => ({ date, sales: 0 }));
        }
        const saleDate = item.saleDate.split('T')[0];
        const dateIndex = groupedData[item.pharmacyName].findIndex(d => d.date === saleDate);
        if (dateIndex !== -1) {
          groupedData[item.pharmacyName][dateIndex].sales = item.sales;
        }
      });

      // Format series data
      const seriesData = Object.keys(groupedData).map(pharmacyName => {
        return {
          name: pharmacyName,
          data: groupedData[pharmacyName].map(item => item.sales),
        };
      });

      setSeries(seriesData);
    } catch (error) {
      console.error("Error fetching sales data: ", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const options = {
    chart: {
      type: 'area',
      toolbar: {
        tools: {
          download: true, // This will show the download icon
          selection: false, // This will hide the selection icon
          zoom: false, // This will hide the zoom icon
          zoomin: false, // This will hide the zoom in icon
          zoomout: false, // This will hide the zoom out icon
          pan: false, // This will hide the pan icon
          reset: false, // This will hide the reset icon
        },
      },
    },
    stroke: {
      curve: 'smooth'
    },
    xaxis: {
      categories: Array.from({length: 6}, (_, i) => {
        const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
        const year = d.getUTCFullYear();
        const month = String(d.getUTCMonth() + 1).padStart(2, '0');
        const day = String(d.getUTCDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      }).reverse() 
    },
    yaxis: {
      forceNiceScale: true, // This will avoid floating numbers
      tickAmount: 2, // This will display 10 ticks
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.9,
        stops: [0, 90, 100]
      }
    }
  };

  return (
    <>
      <h1>Sales</h1>
          <Chart
            options={options}
            series={series}
            type="area"
            width="100%"
            height="400"
          />
    </>
  );
}

export default SalesChart;

