import React from "react";
import classNames from 'classnames';
import "./Box.scss";

const Box = ({ children, className, isFluid }) => (
    <div className={
        classNames(
            "site-box",
            className,
            { "site-box-fluid": isFluid }
        )
    }>{children}</div>
)

export default Box;
