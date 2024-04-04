import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Admin from './components/admin/Admin';
import Client from './components/client/Client';
import SuperAdmin from './components/superadmin/SuperAdmin';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/admin" component={Admin} />
        <Route path="/client" component={Client} />
        <Route path="/superadmin" component={SuperAdmin} />
      </Switch>
    </Router>
  );
}

export default App;
