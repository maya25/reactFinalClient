import UserStore from "../../stores/UserStore";
import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";

export default ({ component: Component, ...rest }) => {
  const user = useContext(UserStore);
  const renderMethod = props =>
    user.isLoggedIn ? (
      <Component {...props} />
    ) : (
      <Redirect to={{ pathname: "/login", state: { from: props.location } }} />
    );
  return <Route {...rest} render={renderMethod} />;
};
