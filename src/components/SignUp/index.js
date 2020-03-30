import React, { useState } from "react";
// React Router node package offers a higher-order component
// to make the router properties accessible in the props of a component
// Any component that goes in the withRouter() higher-order component
// gains access to all the properties of the router
import { Link, withRouter } from "react-router-dom";
import { compose } from "recompose";

import { withFirebase } from "../Firebase";
import * as ROUTES from "../../constants/routes";
import * as ROLES from "../../constants/roles";

const ERROR_CODE_ACCOUNT_EXISTS = "auth/email-already-in-use";
const ERROR_MSG_ACCOUNT_EXISTS = `
An account with this E-Mail address already exists.
Try to login with this account instead. If you think the
account is already used from one of the social logins, try
to sign-in with one of them. Afterward, associate your accounts
on your personal account page.
`;

const INITIAL_STATE = {
  username: "",
  email: "",
  passwordOne: "",
  passwordTwo: "",
  isAdmin: false,
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

const SignUpFormBase = props => {
  const [state, setState] = useState(INITIAL_STATE);
  const { username, email, passwordOne, passwordTwo, isAdmin, error } = state;
  const onSubmit = e => {
    e.preventDefault();
    const { username, email, passwordOne, isAdmin } = state;
    const roles = {};
    if (isAdmin) roles[ROLES.ADMIN] = ROLES.ADMIN;
    props.firebase
      .doCreateUserWithEmailAndPassword(email, passwordOne)
      .then(authUser => {
        // create a user in Firebase database
        return props.firebase.user(authUser.user.uid).set({
          username,
          email,
          roles
        });
      })
      .then(() => {
        return props.firebase.doSendEmailVerification();
      })
      .then(() => {
        setState(INITIAL_STATE);
        props.history.push(ROUTES.HOME);
      })
      .catch(error => {
        if (error.code === ERROR_CODE_ACCOUNT_EXISTS)
          error.message = ERROR_MSG_ACCOUNT_EXISTS;
        setState({ ...state, error });
      });
  };
  const onChange = e => {
    setState({ ...state, [e.target.name]: e.target.value });
  };
  const onChangeCheckbox = e => {
    setState({ ...state, [e.target.name]: e.target.checked });
  };
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
      <label htmlFor="admin">
        Admin:
        <input
          name="isAdmin"
          type="checkbox"
          id="admin"
          checked={isAdmin}
          onChange={onChangeCheckbox}
        />
      </label>
      <button disabled={isInvalid} type="submit">
        Sign Up
      </button>
      {error && <p>{error.message}</p>}
    </form>
  );
};

//the compose function applies the higher-order components from right to left
const SignUpForm = compose(withRouter, withFirebase)(SignUpFormBase);

const SignUpLink = () => {
  return (
    <p>
      Don't have an account? <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
    </p>
  );
};

export default SignUpPage;

export { SignUpForm, SignUpLink };
