import React from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContexts';

const withRole = (WrappedComponent, requiredRole) => {
  return function WithRole(props) {
    const { user } = React.useContext(UserContext);

    if (!user || user.role !== requiredRole) {
      // Redirect to the home page or a 403 Forbidden page
      return <Navigate to="/" />;
    }

    return <WrappedComponent {...props} />;
  };
};

export default withRole;
