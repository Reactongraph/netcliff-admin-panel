import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";

// This component protects routes that require authentication
// If user is not authenticated, they are redirected to login
const ProtectedRoute = ({ component: Component, isAuth, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      isAuth === true ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: "/login",
            state: { from: props.location }
          }}
        />
      )
    }
  />
);

const mapStateToProps = (state) => ({
  isAuth: state.admin.isAuth,
});

export default connect(mapStateToProps)(ProtectedRoute); 