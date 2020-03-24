import React, { useState } from "react";
import { Link } from "react-router-dom";

import { withFirebase } from "../Firebase";
import * as ROUTES from "../../constants/routes";

const PasswordForgetPage = () => {
  return (
    <div>
      <h1>PasswordForget</h1>
      <PasswordForgetForm />
    </div>
  );
};

const INITIAL_STATE = {
  email: "",
  error: null
};

const PasswordForgetBase = props => {
  const [state, setState] = useState(INITIAL_STATE);
  const onSubmit = e => {
    const { email } = state;
    props.firebase
      .doPasswordReset(email)
      .then(() => {
        setState(INITIAL_STATE);
      })
      .catch(error => setState({ error }));
  };
  const onChange = e => {
    setState({ ...state, [e.target.name]: e.target.value });
  };
  const { email, error } = state;
  const isInvalid = email === "";
  return (
    <form onSubmit={onSubmit}>
      <input
        type="text"
        name="email"
        value={email}
        onChange={onChange}
        placeholder="Email Address"
      />
      <button disabled={isInvalid} type="submit">
        Reset My Password
      </button>
      {error && <p>{error.message}</p>}
    </form>
  );
};

const PasswordForgetLink = () => (
  <p>
    <Link to={ROUTES.PASSWORD_FORGET}>Forget password?</Link>
  </p>
);

export default PasswordForgetPage;

const PasswordForgetForm = withFirebase(PasswordForgetBase);

export { PasswordForgetForm, PasswordForgetLink };
