import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../hooks";
import { Store } from "../states/store";

interface protectedProps {
  children: JSX.Element;
}

export const PrivateRoutes = (props: protectedProps): JSX.Element => {
  let { children } = props;
  // selector to authenticator's store
  // const token = useAppSelector(selectToken);
  // const token = localStorage.getItem('token');
  const token = Store.getState().auths.token;

  const location = useLocation();

  if (token === null) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to={"/login"} state={{ from: location }} replace />;
  }

  return children;
};
