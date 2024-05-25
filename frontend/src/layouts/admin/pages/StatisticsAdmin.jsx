import StatisticsCard from "../components/StatisticsCard";
import LocationChart from "../components/LocationChart";
import RandomStatistics from "../components/RandomStatistics";


function StatisticsAdmin() {
  return (
    <div>
      <RandomStatistics/>
      <StatisticsCard />
      <LocationChart />
    </div>
  );
}

export default StatisticsAdmin;
