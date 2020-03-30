import React, { useState } from "react";

import AuthUserContext from "./context";
import { withFirebase } from "../Firebase";

const needsEmailVerification = authUser =>
  authUser &&
  !authUser.emailVerified &&
  authUser.providerData
    .map(provider => provider.providerId)
    .includes("password");

const withEmailVerification = Component => {
  const WithEmailVerification = props => {
    const [isSent, setIsSent] = useState(false);
    const onSendEmailVerification = () => {
      props.firebase.doSendEmailVerification().then(() => setIsSent(true));
    };
    return (
      <AuthUserContext.Consumer>
        {authUser =>
          needsEmailVerification(authUser) ? (
            <div>
              {isSent ? (
                <p>
                  Email confirmation sent: check your inbox (spam folder
                  included) for confirmation email. Refresh this page once your
                  email is confirmed.
                </p>
              ) : (
                <p>
                  Verify your Email: check your inbox (spam folder included) for
                  confirmation email or send another confirmation email.
                </p>
              )}

              <button onClick={onSendEmailVerification} disabled={isSent}>
                Send confirmation email
              </button>
            </div>
          ) : (
            <Component {...props} />
          )
        }
      </AuthUserContext.Consumer>
    );
  };
  return withFirebase(WithEmailVerification);
};

export default withEmailVerification;
