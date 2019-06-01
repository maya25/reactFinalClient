import React, { useEffect } from "react";
import Box from "../../components/Box/Box";
import { metadata, pageLinks } from "./consts";
import PageHeading from "../../components/PageHeading/PageHeading";
import RouteList from "../../components/RouteList/RouteList";
import './EventsView.scss';

const nestedRoutes = pageLinks.map(link => ({
  path: link.path,
  component: link.component
}));

const EventsView = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  });
  return (
    <>
      <PageHeading title={metadata.title} icon={metadata.icon} links={pageLinks} />
      <Box className="events-view">
        <RouteList routes={nestedRoutes} />
      </Box>
    </>
  );
};

export default EventsView;
