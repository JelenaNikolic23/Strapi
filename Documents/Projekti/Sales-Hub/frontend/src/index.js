// This must be the first line in src/index.js
import "react-app-polyfill/ie11";
import "react-app-polyfill/stable";
import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Route, Switch, HashRouter } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";

// core components
import LoginPage from "./views/LoginPage/LoginPage.jsx";
import LoginPageFL from "./views/LoginPage/LoginPageFL.jsx";
import Admin from "layouts/Admin.jsx";
import ErrorPage from "./views/Errors/ErrorPage.jsx";

// core styles
import "assets/css/material-dashboard-react.css?v=1.6.0";

const hist = createBrowserHistory();

ReactDOM.render(
  <HashRouter history={hist}>
    <Switch>
      <Route exact path="/" component={LoginPage} />
      <Route path="/loginFL/:persist_code" component={LoginPageFL} />
      <PrivateRoute path="/admin" component={Admin} />
      <Route exact path="/error" component={ErrorPage} />
    </Switch>
  </HashRouter>,
  document.getElementById("root")
);
