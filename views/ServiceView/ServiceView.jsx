import React, { useEffect } from "react";
import "./ServiceView.scss";
import PageHeading from "../../components/PageHeading/PageHeading";
import RouteList from "../../components/RouteList/RouteList";
import { pageLinks, metadata } from "./consts";

const nestedRoutes = pageLinks.map(link => ({
  path: link.path,
  component: link.component
}));

const ServiceView = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  })
  return (
    <>
      <PageHeading
        title={metadata.title}
        icon={metadata.icon}
        links={pageLinks}
      />
      <div className="service-view">
        <RouteList routes={nestedRoutes} />
      </div>
    </>
  );
};

export default ServiceView;
