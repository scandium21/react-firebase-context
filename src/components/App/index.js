import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import Navigation from "../Navigation";
import LandingPage from "../Landing";
import SignUpPage from "../SignUp";
import SignInPage from "../SignIn";
import PasswordForgetPage from "../PasswordForget";
import HomePage from "../Home";
import AccountPage from "../Account";
import AdminPage from "../Admin";

import * as ROUTES from "../../constants/routes";
import { withFirebase } from "../Firebase";

const App = props => {
  const [authUser, setAuthUser] = useState(null);

  useEffect(() => {
    // onAuthStateChanged() receives a function as parameter
    // that has access to the authenticated user
    // the passed function is called every time something changes for the authenticated user
    // It is called when a user signs up, signs in, and signs out
    props.firebase.auth.onAuthStateChanged(authUser => {
      authUser ? setAuthUser(authUser) : setAuthUser(null);
    });
  }, []);
  return (
    <Router>
      <div>
        <Navigation authUser={authUser} />
        <hr />
        <Route path={ROUTES.LANDING} component={LandingPage} exact />
        <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
        <Route path={ROUTES.SIGN_IN} component={SignInPage} />
        <Route path={ROUTES.PASSWORD_FORGET} component={PasswordForgetPage} />
        <Route path={ROUTES.HOME} component={HomePage} />
        <Route path={ROUTES.ACCOUNT} component={AccountPage} />
        <Route path={ROUTES.ADMIN} component={AdminPage} />
      </div>
    </Router>
  );
};

export default withFirebase(App);
