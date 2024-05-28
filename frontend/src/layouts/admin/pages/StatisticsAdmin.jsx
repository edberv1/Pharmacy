import StatisticsCard from "../components/StatisticsCard";
import LocationChart from "../components/LocationChart";
import RandomStatistics from "../components/RandomStatistics";
import SalesChart from "../components/SalesChart";
import CardStatistics from "../components/CardStatistics";

function StatisticsAdmin() {
  return (
    <div className="pl-8">
      <RandomStatistics />
      <CardStatistics />
      
      <div className="flex justify-between">
        <div className="w-1/2 p-2">
          <LocationChart />
        </div>
        <div className="w-1/2 p-2">
          <SalesChart />
        </div>
      </div>

      <StatisticsCard />

      
    </div>
  );
}

export default StatisticsAdmin;
