import React from "react";
import "./FormField.scss";

export default ({ children, title }) => (
  <div className="site-form-field">
    <label className="site-form-field-title">{title}</label>
    <div className="site-form-input-container">{children}</div>
  </div>
);
