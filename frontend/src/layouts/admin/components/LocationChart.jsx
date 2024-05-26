import { useState, useEffect } from "react";
import Chart from "react-apexcharts";

const LocationChart = () => {



  const [series, setSeries] = useState([]);
  const [labels, setLabels] = useState([]);

  useEffect(() => {
    // Replace with your own API endpoint
    const url = 'http://localhost:8081/admin/getLocationChart';
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    };

    fetch(url, options)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        const locations = data.map(item => item.location);
        const counts = data.map(item => item.count);

        setLabels(locations);
        setSeries(counts);
      })
      .catch(error => {
        console.error('Error fetching data: ', error);
      });
  }, []);


  const chartOptions = {
    labels: labels,
    plotOptions: {
      pie: {
        startAngle: 0,
        endAngle: 360,
        expandOnClick: true,
        offsetX: 0,
        offsetY: 0,
        customScale: 1,
        dataLabels: {
          offset: 0,
          minAngleToShowLabel: 10,
        },
        donut: {
          size: "45%",
          background: "transparent",
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: "22px",
              fontFamily: "Helvetica, Arial, sans-serif",
              fontWeight: 600,
              color: undefined,
              offsetY: -10,
              formatter: function (val) {
                return val;
              },
            },
            value: {
              show: true,
              fontSize: "16px",
              fontFamily: "Helvetica, Arial, sans-serif",
              fontWeight: 400,
              color: undefined,
              offsetY: 16,
              formatter: function (val) {
                return val;
              },
            },
            total: {
              show: false,
              showAlways: false,
              label: "Total",
              fontSize: "22px",
              fontFamily: "Helvetica, Arial, sans-serif",
              fontWeight: 600,
              color: "#373d3f",
              formatter: function (w) {
                return w.globals.seriesTotals.reduce((a, b) => {
                  return a + b;
                }, 0);
              },
            },
          },
        },
      },
    },
  };

  return (

    <Chart
      options={chartOptions}
      series={series}
      type="donut"
      width="100%"
      height="400"
    />
  );
};

export default LocationChart;
