import { useState, useEffect } from "react";
import Chart from "react-apexcharts";

const DailyLoginsChart = () => {
    const [data, setData] = useState([]);
  
    useEffect(() => {
      const fetchDailyLogins = async () => {
        try {
          const response = await fetch(
            "http://localhost:8081/superAdmin/getDailyLogins",
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
          const fetchedData = await response.json();
          setData([
            {
              id: 'Daily logins',
              data: fetchedData.map((item, index) => ({ x: `Day ${index + 1}`, y: item.logins })),
            },
          ]);
        } catch (error) {
          console.error('Error fetching data', error);
        }
      };
    
      fetchDailyLogins();
      
    }, []);
  
    const chartOptions = {
        chart: {
          id: "basic-bar",
          toolbar: {
            tools: {
              download: true, // This will show the download icon
              selection: false, // This will hide the selection icon
              zoom: false, // This will hide the zoom icon
              zoomin: false, // This will hide the zoom in icon
              zoomout: false, // This will hide the zoom out icon
              pan: false, // This will hide the pan icon
              reset: true, // This will hide the reset icon
            },
          },
        },
        xaxis: {
          categories: data[0]?.data?.map((item) => item.x), // Add optional chaining here
        },
        yaxis: {
          title: {
            text: "Logins",
            align: "center",
            style: {
              fontSize: "20px",
              color: "#263238",
            },
          },
          tickAmount: data[0]?.data
            ? Math.max(...data[0].data.map((item) => item.y))
            : 10, // Add optional chaining here
          min: 0, // Start the y-axis at 0
          labels: {
            formatter: function (val) {
              return Math.round(val); // Round off the value to the nearest whole number
            },
          },
        },
        title: {
          text: "Daily Logins",
          align: "center",
          style: {
            fontSize: "20px",
            color: "#263238",
          },
        },
        stroke: {
          curve: "smooth",
        },
        markers: {
          size: 5,
        },
        colors: ["#1E88E5"],
      };

      return (
        <Chart
          options={chartOptions}
          series={data}
          type="line"
          width="50%"
          height="400"
        />
      );
    };
  
  export default DailyLoginsChart;
  