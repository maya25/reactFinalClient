import React from "react";
import Box from "../../components/Box/Box";
import PageHeading from "../../components/PageHeading/PageHeading";
import { ordersPageLinks } from "./consts";
import { breakfast } from "../../utils/icons";
import RouteList from "../../components/RouteList/RouteList";

const nestedRoutes = ordersPageLinks.map(link => ({
    path: link.path,
    component: link.component
}));

const OrdersView = () => {
    return (
        <>
            <PageHeading
                title="ההזמנות שלי"
                icon={breakfast}
                links={ordersPageLinks}
            />
            <Box>
                <RouteList routes={nestedRoutes} />
            </Box>
        </>
    )
}

export default OrdersView;