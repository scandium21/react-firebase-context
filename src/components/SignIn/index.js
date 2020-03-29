import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import { compose } from "recompose";

import { SignUpLink } from "../SignUp";
import { PasswordForgetLink } from "../PasswordForget";
import { withFirebase } from "../Firebase";
import * as ROUTES from "../../constants/routes";

const ERROR_CODE_ACCOUNT_EXISTS =
  "auth/account-exists-with-different-credential";

const ERROR_MSG_ACCOUNT_EXISTS = `An account with an E-Mail address to this social account already exists. Try to login from this account instead and associate your social accounts on your personal account page.
`;

const SignInPage = () => (
  <div>
    <h1>SignIn</h1>
    <SignInForm />
    <SignInGoogle />
    <SignInFacebook />
    <SignInTwitter />
    <PasswordForgetLink />
    <SignUpLink />
  </div>
);

const INITIAL_STATE = {
  email: "",
  password: "",
  error: null
};

const SignInFormBase = props => {
  const [state, setState] = useState(INITIAL_STATE);
  const onSubmit = e => {
    e.preventDefault();
    const { email, password } = state;
    props.firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        setState(INITIAL_STATE);
        props.history.push(ROUTES.HOME);
      })
      .catch(error => {
        if (error.code === ERROR_CODE_ACCOUNT_EXISTS)
          error.message = ERROR_MSG_ACCOUNT_EXISTS;
        setState({ error });
      });
  };
  const onChange = e => {
    setState({ ...state, [e.target.name]: e.target.value });
  };
  const { email, password, error } = state;
  const isInvalid = password === "" || email === "";
  return (
    <form onSubmit={onSubmit}>
      <input
        type="text"
        name="email"
        value={email}
        onChange={onChange}
        placeholder="Email Address"
      />
      <input
        type="password"
        name="password"
        value={password}
        onChange={onChange}
        placeholder="Password"
      />
      <button disabled={isInvalid} type="submit">
        Sign In
      </button>
      {error && <p>{error.message}</p>}
    </form>
  );
};

const SignInGoogleBase = props => {
  const [state, setState] = useState({ error: null });
  const { error } = state;
  const onSubmit = e => {
    e.preventDefault();
    props.firebase
      .doSignInWithGoogle()
      .then(socialAuthUser => {
        // create a user in firebase realtime db
        return props.firebase.user(socialAuthUser.user.uid).set({
          username: socialAuthUser.user.displayName,
          email: socialAuthUser.user.email,
          roles: {}
        });
      })
      .then(() => {
        setState({ error: null });
        props.history.push(ROUTES.HOME);
      })
      .catch(error => {
        if (error.code === ERROR_CODE_ACCOUNT_EXISTS)
          error.message = ERROR_MSG_ACCOUNT_EXISTS;
        setState({ error });
      });
  };
  return (
    <form onSubmit={onSubmit}>
      <button type="submit">Sign In with Google</button>
      {error && <p>{error.message}</p>}
    </form>
  );
};

const SignInFacebookBase = props => {
  const [error, setError] = useState(null);
  const onSubmit = e => {
    e.preventDefault();
    props.firebase
      .doSignInWithFacebook()
      .then(socialAuthUser => {
        // create a user in firebase db
        return props.firebase.user(socialAuthUser.user.uid).set({
          username: socialAuthUser.additionalUserInfo.profile.name,
          email: socialAuthUser.additionalUserInfo.profile.email,
          roles: {}
        });
      })
      .then(() => {
        setError(null);
        props.history.push(ROUTES.HOME);
      })
      .catch(error => {
        if (error.code === ERROR_CODE_ACCOUNT_EXISTS)
          error.message = ERROR_MSG_ACCOUNT_EXISTS;
        setError({ error });
      });
  };
  return (
    <form onSubmit={onSubmit}>
      <button type="submit">Sign In with Facebook</button>
      {error && <p>{error.message}</p>}
    </form>
  );
};

const SignInTwitterBase = props => {
  const [error, setError] = useState(null);
  const onSubmit = e => {
    e.preventDefault();
    props.firebase
      .doSignInWithTwitter()
      .then(socialAuthUser => {
        console.log(socialAuthUser);
        return props.firebase.user(socialAuthUser.user.uid).set({
          username: socialAuthUser.user.displayName,
          email: socialAuthUser.user.email,
          roles: {}
        });
      })
      .then(() => {
        setError(null);
        props.history.push(ROUTES.HOME);
      })
      .catch(error => {
        if (error.code === ERROR_CODE_ACCOUNT_EXISTS)
          error.message = ERROR_MSG_ACCOUNT_EXISTS;
        setError({ error });
      });
  };
  return (
    <form onSubmit={onSubmit}>
      <button type="submit">Sign In with Twitter</button>
      {error && <p>{error.message}</p>}
    </form>
  );
};

const SignInForm = compose(withRouter, withFirebase)(SignInFormBase);

const SignInGoogle = compose(withRouter, withFirebase)(SignInGoogleBase);

const SignInFacebook = compose(withRouter, withFirebase)(SignInFacebookBase);

const SignInTwitter = compose(withRouter, withFirebase)(SignInTwitterBase);

export { SignInForm, SignInGoogle, SignInFacebook, SignInTwitter };

export default SignInPage;
