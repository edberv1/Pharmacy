import UserTable from '../components/UserTable';
import BigChart from "../components/BigChart"
import DailyLoginsChart from "../components/LoginsChart"

const Users = () => {
    return (
    <>
    <div className="flex justify-between">
        <div className="w-1/2 p-2">
          <BigChart />
        </div>
        <div className="w-1/2 p-2">
          <DailyLoginsChart />
        </div>
      </div>
      <UserTable/>     
    </>
  );
};

export default Users;
