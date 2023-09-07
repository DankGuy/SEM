import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import SignIn from "./Authentication/SignIn";
import SignUp from "./Authentication/SignUp";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/signIn"/>} />
      <Route path="/signIn" element={<SignIn />} />
      <Route path="/signUp" element={<SignUp />} />
    </Routes>
  );
}

export default App;
