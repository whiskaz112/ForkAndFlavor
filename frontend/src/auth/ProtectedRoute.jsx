import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from 'react-redux';

function ProtectedRoute({children}) {

    const user = useSelector((state) => state.auth.isAuthenticated);
    console.log(user)
    if(!user) {
        return <Navigate to="/"/>
    }

    return children;
}

export default ProtectedRoute;