import React from "react";
import LoginForm from "./LoginForm";
import "./LoginView.scss";
import hotelImg from "../../static/images/hotel.jpg";

const LoginView = () => {
  return (
    <>
      <div className="login-view">
        <div className="login-upper" style={{ backgroundImage: `url(${hotelImg})` }}></div>
        <LoginForm />
      </div>
    </>
  );
};


export default LoginView;
