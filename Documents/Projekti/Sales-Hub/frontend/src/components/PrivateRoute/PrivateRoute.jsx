import React from "react";
import PropTypes from "prop-types";

import {
  Route,
  Redirect
} from "react-router-dom";
import Auth from "../../helpers/Auth";

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    { ...rest }
    render={ props =>
      Auth.isUserAuthenticated() ? (
        <Component { ...props } />
      ) : (
        <Redirect
          to={ {
            pathname: '/',
            state: { from: props.location }
          } }
        />
      )
    }
  />
)

PrivateRoute.propTypes = {
  component: PropTypes.any,
  location: PropTypes.object
}

export default PrivateRoute