import UserStore from "../../stores/UserStore";
import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";

const AnonymousRoute = ({ component: Component, ...rest }) => {
    const user = useContext(UserStore);
    const renderMethod = props =>
        user.isLoggedIn ?
            (
                <Redirect to={{ pathname: "/", state: { from: props.location } }} />
            ) :
            (
                <Component {...props} />
            );
    return <Route {...rest} render={renderMethod} />;
};

export default AnonymousRoute;