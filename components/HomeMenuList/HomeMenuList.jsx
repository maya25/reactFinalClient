import React from "react";
import "./HomeMenuList.scss";
import HomeMenuItem from "../HomeMenuItem/HomeMenuItem";

const HomeMenuList = ({ list }) => (
  <ul className="home-menu-list">
    {list.map((item, idx) => (
      <HomeMenuItem key={idx} {...item} />
    ))}
  </ul>
);

export default HomeMenuList;
