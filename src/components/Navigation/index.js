import React from "react";
import { Link } from "react-router-dom";

import SignOutButton from "../SignOut";
import * as ROUTES from "../../constants/routes";

// Regarding components, everything is set to fulfil
// a full authentication roundtrip.
// Users can sign up (register), sign in (login), and sign out (logout).

const Navigation = () => {
  return (
    <div>
      <ul>
        <li>
          <Link to={ROUTES.SIGN_IN}>Sign In</Link>
        </li>
        <li>
          <Link to={ROUTES.LANDING}>Landing</Link>
        </li>
        <li>
          <Link to={ROUTES.HOME}>Home</Link>
        </li>
        <li>
          <Link to={ROUTES.ACCOUNT}>Account</Link>
        </li>
        <li>
          <Link to={ROUTES.ADMIN}>Admin</Link>
        </li>
        <li>
          <SignOutButton />
        </li>
      </ul>
    </div>
  );
};

export default Navigation;
