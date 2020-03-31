import React, { useState, useEffect } from "react";
import { Switch, Route, Link } from "react-router-dom";
import { compose } from "recompose";

import * as ROLES from "../../constants/roles";
import * as ROUTES from "../../constants/routes";
import {
  AuthUserContext,
  withAuthorization,
  withEmailVerification
} from "../Session";
import { withFirebase } from "../Firebase";

const Admin = props => {
  return (
    <AuthUserContext.Consumer>
      {authUser => (
        <div>
          <h1>Admin</h1>
          <p>Restricted area! Only users with the admin role are authorized.</p>
          <Switch>
            <Route exact path={ROUTES.ADMIN_DETAILS} component={UserItem} />
            <Route exact path={ROUTES.ADMIN} component={UserList} />
          </Switch>
        </div>
      )}
    </AuthUserContext.Consumer>
  );
};

const UserItemBase = props => {
  const [state, setState] = useState({
    loading: false,
    user: null,
    ...props.location.state
  });
  const { user, loading } = state;

  const onSendPasswordResetEmail = () => {
    props.firebase.doPasswordReset(state.user.email);
  };

  useEffect(() => {
    // If users navigate from the UserList to the UserItem component, should arrive immediately.
    if (state.user) return;

    // If URL is entered by hand or with other link, fetch user from db
    setState({ ...state, loading: true });
    props.firebase.user(props.match.params.id).on("value", snapshot => {
      setState({
        user: snapshot.val(),
        loading: false
      });
    });
    return function cleanup() {
      props.firebase.user(props.match.params.id).off();
    };
  }, []);
  return (
    <div>
      <h2>User ({props.match.params.id})</h2>
      {loading && <div>Loading...</div>}
      {user && (
        <div>
          <span>
            <strong>ID:</strong> {user.uid}
          </span>
          <span>
            <strong>Email:</strong> {user.email}
          </span>
          <span>
            <strong>Username:</strong> {user.username}
          </span>
          <span>
            <button onClick={onSendPasswordResetEmail}>Reset Password</button>
          </span>
        </div>
      )}
    </div>
  );
};

const UserListBase = props => {
  const [state, setState] = useState({ loading: false, users: [] });
  const { loading, users } = state;
  useEffect(() => {
    setState({ ...state, loading: true });
    props.firebase.users().on("value", snapshot => {
      const usersObj = snapshot.val();
      const usersList = Object.keys(usersObj).map(key => ({
        ...usersObj[key],
        uid: key
      }));
      setState({
        users: usersList,
        loading: false
      });
      return function cleanup() {
        props.firebase.users().off();
      };
    });
  }, []);
  return (
    <div>
      <h2>Users</h2>
      {loading && <div>Loading...</div>}
      <ul>
        {users.map(user => (
          <li key={user.uid}>
            <span>
              <strong>ID: </strong>
              {user.uid}
            </span>
            <span>
              <strong>E-mail: </strong>
              {user.email}
            </span>
            <span>
              <strong>Username: </strong>
              {user.username}
            </span>
            <span>
              <Link
                to={{
                  pathname: `${ROUTES.ADMIN}/${user.uid}`,
                  state: { user }
                }}
              >
                Details
              </Link>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const condition = authUser => authUser && !!authUser.roles[ROLES.ADMIN];

const UserList = withFirebase(UserListBase);
const UserItem = withFirebase(UserItemBase);

export default compose(
  withEmailVerification,
  withAuthorization(condition),
  withFirebase
)(Admin);

// study Firebase's Admin SDK to do delete user from Firebase's auth, change email address...
// https://firebase.google.com/docs/auth/admin/
