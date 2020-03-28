import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import { compose } from "recompose";

import { SignUpLink } from "../SignUp";
import { PasswordForgetLink } from "../PasswordForget";
import { withFirebase } from "../Firebase";
import * as ROUTES from "../../constants/routes";

const SignInPage = () => (
  <div>
    <h1>SignIn</h1>
    <SignInForm />
    <SignInGoogle />
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
      .catch(error => setState({ error }));
  };
  return (
    <form onSubmit={onSubmit}>
      <button type="submit">Sign In with Google</button>
      {error && <p>{error.message}</p>}
    </form>
  );
};

const SignInForm = compose(withRouter, withFirebase)(SignInFormBase);

const SignInGoogle = compose(withRouter, withFirebase)(SignInGoogleBase);

export { SignInForm, SignInGoogle };

export default SignInPage;
