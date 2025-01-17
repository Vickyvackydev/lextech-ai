import React from "react";
import { Store } from "./states/store";
import { Navigate, Route } from "react-router-dom";
import App from "./App";

interface Props {
  children: React.ReactNode;
}
function PrivateRoute(props: Props) {
  const { children } = props;
  const token = Store.getState().auths;

  if (token === null) return <Navigate to={"/"} />;

  return <>{children}</>;
}

export default PrivateRoute;
