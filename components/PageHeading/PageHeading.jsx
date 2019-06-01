import React from "react";
import { Link, withRouter } from "react-router-dom";
import "./PageHeading.scss";
import classNames from "classnames";

const PageHeading = ({ title, icon, links, isStatic, onStaticClick }) => {
  const list = isStatic ? (
    <PageStaticList list={links} onItemClick={onStaticClick} />
  ) : (
    <PageLinkList list={links} />
  );
  return (
    <div className="page-heading">
      <div className="page-heading-top">
        <span className="page-heading-title">
          <span>{title}</span>
          <img
            src={icon}
            className="site-icon page-heading-top-icon"
            alt={title}
          />
        </span>
        <Link to="/">{'< '}חזור</Link>
      </div>
      <div className="page-heading-bottom">{list}</div>
    </div>
  );
};

const PageStaticList = ({ list, onItemClick }) => (
  <ul className="page-link-list">
    {list.map((item, idx) => {
      return <PageStaticItem key={idx} {...item} onClick={onItemClick} />;
    })}
  </ul>
);

const _pageLinkList = ({ list, routing }) => (
  <ul className="page-link-list">
    {list.map((item, idx) => {
      const isSelected = window.location.href.includes(item.path);
      return <PageLinkItem key={idx} {...item} selected={isSelected} />;
    })}
  </ul>
);
const PageLinkList = withRouter(_pageLinkList);

const PageLinkItem = ({ title, path, selected }) => (
  <li className={classNames("page-link-item", { selected: selected })}>
    <Link to={path}>{title}</Link>
  </li>
);

const PageStaticItem = ({ title, selected, id, onClick }) => (
  <li
    className={classNames("page-link-item", { selected: selected })}
    onClick={() => onClick(id)}
  >
    <span>{title}</span>
  </li>
);

export default PageHeading;
