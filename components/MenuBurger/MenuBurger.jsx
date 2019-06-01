import React from "react";
import "./MenuBurger.scss";

const MenuBurger = ({ onClick }) => (
    <div className="menu-burger" onClick={onClick}>
        <div className="menu-burger-stripe"></div>
        <div className="menu-burger-stripe"></div>
        <div className="menu-burger-stripe"></div>
    </div>
)

export default MenuBurger;