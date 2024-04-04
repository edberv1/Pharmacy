import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Admin from './components/admin/Admin';
import Client from './components/client/Client';
import SuperAdmin from './components/superadmin/SuperAdmin';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin" component={Admin} />
        <Route path="/client" component={Client} />
        <Route path="/superadmin" component={SuperAdmin} />
      </Routes>
    </Router>
  );
}

export default App;
