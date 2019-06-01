import React from 'react';
import { Route } from 'react-router-dom';

const RouteList = ({ routes }) => (
    <>
        {routes.map((item, idx) => <Route key={idx} {...item} />)}
    </>
)


export default RouteList;