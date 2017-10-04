import dva from 'dva';
import { Router, Route, browserHistory } from 'dva/router';
import React from 'react';

import GamePage from './routers/Game';

// 1. Initialize
const app = dva({
  history: browserHistory,
});

// 2. Model
// Remove the comment and define your model.
//app.model({});
app.model(require("./models/GRID"));

// 3. Router
app.router(({ history }) =>
  <Router history={history}>
    <Route path="/" component={GamePage} />
  </Router>
);

// 4. Start
app.start('#root');
