import React from "react";
import { Link } from "react-router-dom";

import SignOutButton from "../SignOut";
import * as ROUTES from "../../constants/routes";
import * as ROLES from "../../constants/roles";
import { AuthUserContext } from "../Session";

// Regarding components, everything is set to fulfill
// a full authentication roundtrip.
// Users can sign up (register), sign in (login), and sign out (logout).

const Navigation = () => (
  <AuthUserContext.Consumer>
    {authUser =>
      authUser ? <NavigationAuth authUser={authUser} /> : <NavigationNonAuth />
    }
  </AuthUserContext.Consumer>
);

const NavigationAuth = ({ authUser }) => {
  return (
    <div>
      <ul>
        <li>
          <Link to={ROUTES.LANDING}>Landing</Link>
        </li>
        <li>
          <Link to={ROUTES.HOME}>Home</Link>
        </li>
        <li>
          <Link to={ROUTES.ACCOUNT}>Account</Link>
        </li>
        {!!authUser.roles[ROLES.ADMIN] && (
          <li>
            <Link to={ROUTES.ADMIN}>Admin</Link>
          </li>
        )}
        <li>
          <SignOutButton />
        </li>
      </ul>
    </div>
  );
};

const NavigationNonAuth = () => (
  <ul>
    <li>
      <Link to={ROUTES.LANDING}>Landing</Link>
    </li>
    <li>
      <Link to={ROUTES.SIGN_IN}>Sign In</Link>
    </li>
  </ul>
);

export default Navigation;
