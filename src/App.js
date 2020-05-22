import React from 'react';
import './scss/ui.scss';

import { Router, Route, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';

import PathEditor from './components/PathEditor';
import Calendar from './components/Calendar';
import Settings from './components/Settings';
import Login from './components/Login';

import AdminSettings from './components/admin/Settings/index';

import { history } from './store';

function App() {
  return (
    <div className="App">
      <ConnectedRouter history={history}>
        <Switch>
          <Route path="/login/:action?" component={Login} />
          <Route path="/settings/:action?" component={Settings} />
          <Route path="/:patient?/calendar/:action?" component={Calendar} />
          <Route path="/:patient?/:page?/:action?" component={PathEditor} />


          <Route path="/admin/settings/:action?" component={AdminSettings} />

        </Switch>
      </ConnectedRouter>
    </div>
  );
}

export default App;
