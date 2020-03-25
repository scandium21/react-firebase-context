import React from "react";

import * as ROLES from "../../constants/roles";
import { AuthUserContext, withAuthorization } from "../Session";

const Admin = () => {
  return (
    <AuthUserContext.Consumer>
      {authUser => (
        <div>
          <h1>Admin</h1>
          <p>Restricted area! Only users with the admin role are authorized.</p>
        </div>
      )}
    </AuthUserContext.Consumer>
  );
};

const condition = authUser => authUser && !!authUser.roles[ROLES.ADMIN];

export default withAuthorization(condition)(Admin);
