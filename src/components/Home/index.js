import React, { useState, useEffect } from "react";
import { compose } from "recompose";

import { withAuthorization, withEmailVerification } from "../Session";
import { withFirebase } from "../Firebase";

const Home = () => {
  return (
    <div>
      <h1>Home Page</h1>
      <p>The home page is accessible by every signed in user. </p>
      <Messages />
    </div>
  );
};

const MessagesBase = props => {
  const [state, setState] = useState({
    loading: false,
    messages: []
  });
  const { messages, loading } = state;
  useEffect(() => {
    setState({ ...state, loading: true });
    props.firebase.messages().on("value", snapshot => {
      const messageObj = snapshot.val();
      if (messageObj) {
        const messageList = Object.keys(messageObj).map(key => ({
          ...messageObj[key],
          uid: key
        }));
        // convert messages list from snapshot
        setState({ messages: messageList, loading: false });
      } else {
        setState({ messages: null, loading: false });
      }
    });
    return () => {
      props.firebase.messages().off();
    };
  }, []);
  return (
    <div>
      {loading && <div>Loading...</div>}
      {messages ? (
        <MessageList messages={messages} />
      ) : (
        <div>There are no messages...</div>
      )}
    </div>
  );
};

const MessageList = ({ messages }) => (
  <ul>
    {messages.map(message => (
      <MessageItem key={message.uid} message={message} />
    ))}
  </ul>
);

const MessageItem = ({ message }) => (
  <li>
    <strong>{message.userID}</strong> {message.text}
  </li>
);

const condition = authUser => !!authUser;

const Messages = withFirebase(MessagesBase);

export default compose(
  withEmailVerification,
  withAuthorization(condition)
)(Home);
