import React from "react";
import "./CancelButton.scss";

export default (props) => (
    <button className="cancel-button" type="button" {...props}>
        <span>x</span>
    </button>
)