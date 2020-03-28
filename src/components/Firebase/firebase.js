import * as firebase from "firebase";

require("dotenv").config();

var firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APPID
};

// use a JavaScript class to encapsulate all Firebase functionalities,
// realtime database, and authentication,
// as a well-defined API for the rest of the application.
class Firebase {
  constructor() {
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    this.auth = firebase.auth();
    this.db = firebase.database();
  }

  /** Auth API */
  doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  doSignOut = () => this.auth.signOut();

  doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

  doPasswordUpdate = password => this.auth.currentUser.updatePassword(password);

  /** User API */
  user = uid => this.db.ref(`users/${uid}`);
  users = () => this.db.ref(`users`);

  /** Merge auth and DB user API */
  onAuthUserListener = (next, fallback) =>
    this.auth.onAuthStateChanged(authUser => {
      if (authUser) {
        this.user(authUser.uid)
          .once("value")
          .then(snapshot => {
            const dbUser = snapshot.val();
            if (!dbUser.roles) {
              dbUser.roles = {};
            }
            authUser = {
              uid: authUser.uid,
              email: authUser.email,
              ...dbUser
            };
            next(authUser);
          });
      } else {
        fallback();
      }
    });
}

// The paths follow the REST philosophy where every entity (e.g. user,
// message, book, author) is associated with a URI,
// and HTTP methods are used to create, update, delete and get entities.
// In Firebase, the RESTful URI becomes a simple path,
// and the HTTP methods become Firebase's API.

export default Firebase;
