import React from 'react';
import { Switch } from 'react-router-dom';

import Route from './Route';

import SignIn from '../pages/SignIn';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';

const Routes: React. FC = () => (
  <Switch>
    <Route path="/" exact component={SignIn} />
    <Route path="/register" component={Register} />

    <Route path="/dashboard" component={Dashboard} isPrivate />
  </Switch>
);

export default Routes;
