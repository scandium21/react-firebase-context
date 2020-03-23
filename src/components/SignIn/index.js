import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import { compose } from "recompose";

import { SignUpLink } from "../SignUp";
import { withFirebase } from "../Firebase";
import * as ROUTES from "../../constants/routes";

const SignInPage = () => (
  <div>
    <h1>SignIn</h1>
    <SignInForm />
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

const SignInForm = compose(withRouter, withFirebase)(SignInFormBase);

export { SignInForm };

export default SignInPage;
