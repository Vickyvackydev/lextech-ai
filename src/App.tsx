import React from "react";
import { Route, Routes } from "react-router-dom";
import MainRoutes from "./routes";
import PrivateRoute from "./privateroute";
import SignIn from "./pages/auth/sign-in";
import Signup from "./pages/auth/sign-up";
import { Chat } from "./features/chat";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Routes>
        <Route
          path="/*"
          element={
            <PrivateRoute>
              <MainRoutes />
            </PrivateRoute>
          }
        />
        <Route element={<SignIn />} path="/sign-in" />
        <Route element={<Signup />} path="/sign-up" />
      </Routes>
      <Toaster position="top-right" />
    </>
  );
}

export default App;
