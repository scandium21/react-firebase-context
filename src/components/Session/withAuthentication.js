import React, { useEffect, useState } from "react";
import AuthUserContext from "./context";
import { withFirebase } from "../Firebase";

const withAuthentication = Component => {
  const WithAuthentication = props => {
    const [authUser, setAuthUser] = useState(null);

    useEffect(() => {
      // onAuthStateChanged() receives a function as parameter
      // that has access to the authenticated user
      // the passed function is called every time something changes for the authenticated user
      // It is called when a user signs up, signs in, and signs out
      const listener = props.firebase.onAuthUserListener(
        authUser => {
          setAuthUser(authUser);
        },
        () => {
          setAuthUser(null);
        }
      );
      return function cleanup() {
        listener();
      };
    }, []);
    return (
      <AuthUserContext.Provider value={authUser}>
        <Component {...props} />
      </AuthUserContext.Provider>
    );
  };
  return withFirebase(WithAuthentication);
};

export default withAuthentication;
