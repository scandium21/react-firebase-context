import React, { useState } from "react";

import { withFirebase } from "../Firebase";

const INITIAL_STATE = {
  passwordOne: "",
  passwordTwo: "",
  error: null
};

const PasswordChangeForm = props => {
  const [state, setState] = useState(INITIAL_STATE);
  const { passwordOne, passwordTwo, error } = state;
  const isInvalid = passwordOne !== passwordTwo || passwordOne === "";
  const onSubmit = event => {};
  const onChange = () => {};
  return (
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
        Reset My Password
      </button>
      {error && <p>{error.message}</p>}
    </form>
  );
};

export default withFirebase(PasswordChangeForm);
