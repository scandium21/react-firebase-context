import React, { useEffect } from "react";
import { withRouter } from "react-router-dom";
import { compose } from "recompose";

import AuthUserContext from "./context";
import { withFirebase } from "../Firebase";
import * as ROUTES from "../../constants/routes";

const withAuthorization = condition => Component => {
  const WithAuthorization = props => {
    useEffect(() => {
      const listener = props.firebase.onAuthUserListener(
        authUser => {
          if (!condition(authUser)) {
            props.history.push(ROUTES.SIGN_IN);
          }
        },
        () => props.history.push(ROUTES.SIGN_IN)
      );
      return function cleanup() {
        listener();
      };
    }, []);
    return (
      <AuthUserContext.Consumer>
        {authUser => (condition(authUser) ? <Component {...props} /> : null)}
      </AuthUserContext.Consumer>
    );
  };
  return compose(withRouter, withFirebase)(WithAuthorization);
};

export default withAuthorization;

// roles and permissions:
// 1. assign a user on sign up a role property
// 2. Merge the authenticated user and database user so they can be authorized
// with their roles in the authorization higher-order component
// 3. showcase a role authorization for one of the routes
