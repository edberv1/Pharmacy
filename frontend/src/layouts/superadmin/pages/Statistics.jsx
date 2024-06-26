import StatsCards from "../components/StatsCards";
import BigChart from "../components/BigChart";
import DailyLoginsChart from "../components/LoginsChart";

function Statistics() {
  return (
    <>
      <StatsCards />
      <div className="flex justify-between"> 
        <div className="w-1/2 p-2">
        <BigChart />
        </div>
        <div className="w-1/2 p-2">
        <DailyLoginsChart />
        </div>
      </div>
    </>
  );
}

export default Statistics;
