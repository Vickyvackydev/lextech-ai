import React from "react";
import DashboardLayout from "../shared/Layouts/DashboardLayout";
import { Route, Routes } from "react-router-dom";
import Document from "../features/documents";
import Updates from "../features/updates/page";
import { Chat } from "../features/chat";

function MainRoutes() {
  return (
    <DashboardLayout>
      <Routes>
        <Route element={<Chat />} path="/" />
        <Route element={<Chat />} path="/chat/:id" />
        <Route element={<Document />} path="/documents" />
        <Route element={<Updates />} path="/updates" />
      </Routes>
    </DashboardLayout>
  );
}

export default MainRoutes;
