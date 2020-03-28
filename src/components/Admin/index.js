import React, { useState, useEffect } from "react";
import { compose } from "recompose";

import * as ROLES from "../../constants/roles";
import { AuthUserContext, withAuthorization } from "../Session";
import { withFirebase } from "../Firebase";

const Admin = props => {
  const [state, setState] = useState({ loading: false, users: [] });
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
  const { loading, users } = state;
  return (
    <AuthUserContext.Consumer>
      {authUser => (
        <div>
          <h1>Admin</h1>
          <p>Restricted area! Only users with the admin role are authorized.</p>
          {loading && <div>Loading...</div>}
          <UserList users={users} />
        </div>
      )}
    </AuthUserContext.Consumer>
  );
};

const UserList = ({ users }) => (
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
      </li>
    ))}
  </ul>
);

const condition = authUser => authUser && !!authUser.roles[ROLES.ADMIN];

export default compose(withAuthorization(condition), withFirebase)(Admin);
