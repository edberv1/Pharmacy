import UserTable from '../components/UserTable';
import BigChart from "../components/BigChart"
import DailyLoginsChart from "../components/LoginsChart"

const Users = () => {
    return (
      <div className="flex-col w-full pl-8">
    <div className="flex justify-between">
        <div className="w-1/2 p-2">
          <BigChart />
        </div>
        <div className="w-1/2 p-2">
          <DailyLoginsChart />
        </div>
      </div>
      <div className='px-6 py-7'>
      <UserTable/>     
      </div>
    </div>
  );
};

export default Users;
