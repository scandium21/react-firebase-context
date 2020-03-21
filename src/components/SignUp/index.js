import React, { useState } from "react";
import { Link } from "react-router-dom";

import * as ROUTES from "../../constants/routes";

const INITIAL_STATE = {
  username: "",
  email: "",
  passwordOne: "",
  passwordTwo: "",
  error: null
};

const SignUpPage = props => {
  return (
    <div>
      <h1>SignUp</h1>
      <SignUpForm />
    </div>
  );
};

const SignUpForm = props => {
  const [state, setState] = useState(INITIAL_STATE);
  const onSubmit = e => {
    e.preventDefault();
    const { username, email, passwordOne } = state;
    props.firebase
      .doCreateUserWithEmailAndPassword(email, passwordOne)
      .then(authUser => setState(INITIAL_STATE))
      .catch(error => {
        setState({ ...state, error });
      });
  };
  const onChange = e => {
    setState({ ...state, [e.target.name]: e.target.value });
  };
  const { username, email, passwordOne, passwordTwo, error } = state;
  const isInvalid =
    passwordOne !== passwordTwo ||
    passwordOne === "" ||
    email === "" ||
    username === "";
  return (
    <form onSubmit={onSubmit}>
      <input
        type="text"
        name="username"
        value={username}
        onChange={onChange}
        placeholder="Full name"
      />
      <input
        type="text"
        name="email"
        value={email}
        onChange={onChange}
        placeholder="Email Address"
      />
      <input
        type="password"
        name="passwordOne"
        value={passwordOne}
        onChange={onChange}
        placeholder="Password"
      />
      <input
        type="password"
        name="passwordTwo"
        value={passwordTwo}
        onChange={onChange}
        placeholder="Confirm Password"
      />
      <button disabled={isInvalid} type="submit">
        Sign Up
      </button>
      {error && <p>{error.message}</p>}
    </form>
  );
};

const SignUpLink = () => {
  return (
    <p>
      Don't have an account? <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
    </p>
  );
};

export default SignUpPage;

export { SignUpForm, SignUpLink };
