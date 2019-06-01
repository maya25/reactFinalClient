import React, { useContext } from "react";
import { Redirect } from "react-router-dom";
import UserStore from "../../stores/UserStore";

export default () => {
  const userStore = useContext(UserStore);
  userStore.logout();
  return <Redirect to="/login" />;
};
