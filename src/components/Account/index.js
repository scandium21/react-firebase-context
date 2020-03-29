import React, { useState, useEffect } from "react";

import { PasswordForgetForm } from "../PasswordForget";
import PasswordChangeForm from "../PasswordChange";
import { AuthUserContext, withAuthorization } from "../Session";
import { withFirebase } from "../Firebase";

const SIGN_IN_METHODS = [
  {
    id: "password",
    provider: null
  },
  {
    id: "google.com",
    provider: "googleProvider"
  },
  {
    id: "facebook.com",
    provider: "facebookProvider"
  },
  {
    id: "twitter.com",
    provider: "twitterProvider"
  }
];

const Account = () => {
  return (
    <AuthUserContext.Consumer>
      {authUser => (
        <div>
          <h1>Account: {authUser.email}</h1>
          <PasswordForgetForm />
          <PasswordChangeForm />
          <LoginManagement authUser={authUser} />
        </div>
      )}
    </AuthUserContext.Consumer>
  );
};

const SocialLoginToggle = ({
  onlyOneLeft,
  isEnabled,
  signInMethod,
  onLink,
  onUnlink
}) =>
  isEnabled ? (
    <button
      type="button"
      onClick={() => onUnlink(signInMethod.id)}
      disabled={onlyOneLeft}
    >
      Deactivate {signInMethod.id}
    </button>
  ) : (
    <button type="button" onClick={() => onLink(signInMethod.provider)}>
      Link {signInMethod.id}
    </button>
  );

const DefaultLoginToggle = props => {
  const [state, setState] = useState({ passwordOne: "", passwordTwo: "" });
  const { onlyOneLeft, isEnabled, signInMethod, onUnlink } = props;
  const { passwordOne, passwordTwo } = state;
  const isInvalid = passwordOne !== passwordTwo || passwordOne === "";
  const onSubmit = e => {
    e.preventDefault();
    props.onLink(state.passwordOne);
    setState({ passwordOne: "", passwordTwo: "" });
  };
  const onChange = e => {
    setState({ ...state, [e.target.name]: e.target.value });
  };
  return isEnabled ? (
    <button
      type="button"
      onClick={() => onUnlink(signInMethod.id)}
      disabled={onlyOneLeft}
    >
      Deactivate {signInMethod.id}
    </button>
  ) : (
    <form onSubmit={onSubmit}>
      <input
        type="password"
        name="passwordOne"
        value={passwordOne}
        onChange={onChange}
        placeholder="New Password"
      />
      <input
        type="password"
        name="passwordTwo"
        value={passwordTwo}
        onChange={onChange}
        placeholder="Confirm New Password"
      />
      <button disabled={isInvalid} type="submit">
        Link {signInMethod.id}
      </button>
    </form>
  );
};

const LoginManagementBase = props => {
  const [state, setState] = useState({ activeSignInMethods: [], error: null });
  const { activeSignInMethods, error } = state;
  const fetchSignInMethods = () => {
    props.firebase.auth
      .fetchSignInMethodsForEmail(props.authUser.email)
      .then(activeSignInMethods =>
        setState({ activeSignInMethods, error: null })
      )
      .catch(error => setState({ ...state, error }));
  };
  const onDefautLoginLink = password => {
    const credential = props.firebase.emailAuthProvider.credential(
      props.authUser.email,
      password
    );
    props.firebase.auth.currentUser
      .linkAndRetrieveDataWithCredential(credential)
      .then(fetchSignInMethods)
      .catch(error => setState({ ...state, error }));
  };
  const onSocialLoginLink = provider => {
    props.firebase.auth.currentUser
      .linkWithPopup(props.firebase[provider])
      .then(fetchSignInMethods)
      .catch(error => setState({ ...state, error }));
  };
  const onUnlink = providerID => {
    props.firebase.auth.currentUser
      .unlink(providerID)
      .then(fetchSignInMethods)
      .catch(error => setState({ ...state, error }));
  };
  useEffect(() => {
    fetchSignInMethods();
  }, []);
  return (
    <div>
      Sign In Methods:
      <ul>
        {SIGN_IN_METHODS.map(signInMethod => {
          const onlyOneLeft = activeSignInMethods.length === 1;
          const isEnabled = activeSignInMethods.includes(signInMethod.id);
          return (
            <li key={signInMethod.id}>
              {signInMethod.id === "password" ? (
                <DefaultLoginToggle
                  onlyOneLeft={onlyOneLeft}
                  isEnabled={isEnabled}
                  signInMethod={signInMethod}
                  onLink={onDefautLoginLink}
                  onUnlink={onUnlink}
                />
              ) : (
                <SocialLoginToggle
                  onlyOneLeft={onlyOneLeft}
                  isEnabled={isEnabled}
                  signInMethod={signInMethod}
                  onLink={onSocialLoginLink}
                  onUnlink={onUnlink}
                />
              )}
            </li>
          );
        })}
      </ul>
      {error && error.message}
    </div>
  );
};

const LoginManagement = withFirebase(LoginManagementBase);

const condition = authUser => !!authUser;

export default withAuthorization(condition)(Account);
