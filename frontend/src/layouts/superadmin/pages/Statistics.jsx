import StatsCards from "../components/StatsCards";
import BigChart from "../components/BigChart";
import DailyLoginsChart from "../components/LoginsChart";
import AllLocations from "../components/AllLocations";
import ContactChart from "../ContactChart";

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
      <div className="w-full h-1 bg-gray-900"></div>
      <div className="flex justify-between">
        <div className="w-1/2 p-2">
        <ContactChart/>
        </div>
        <div className="w-1/2 p-2">
        <AllLocations />
        </div>
      </div>
      
      
    </>
  );
}

export default Statistics;
