import React from "react";

// creates two components:
// 1. FirebaseContext.Provider - to provide a Firebase instance once at the top-level of React component tree
// 2. FirebaseContext.Consumer - to retrieve the Firebase instance if it is needed in the React component
const FirebaseContext = React.createContext(null);
export default FirebaseContext;
