import StatisticsCard from "../components/StatisticsCard";
import LocationChart from "../components/LocationChart";
import RandomStatistics from "../components/RandomStatistics";
import SalesChart from "../components/SalesChart";


function StatisticsAdmin() {
  return (
    <div>
      <RandomStatistics/>
      <StatisticsCard />


      <div className="flex justify-between">
        <div className="w-1/2 p-2">
        <LocationChart />
        </div>
        <div className="w-1/2 p-2">
        <SalesChart/>
        </div>
      </div>

    </div>
  );
}

export default StatisticsAdmin;
