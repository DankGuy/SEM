import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import SignIn from "./Authentication/SignIn";
import SignUp from "./Authentication/SignUp";

import Applicant from "./Applicant/Applicant";
import ApplicantLayout from "./Applicant/ApplicantLayout";
import Application from "./Applicant/Application/Application";
import PersonalInformation from "./Applicant/PersonalInformation";
import Questions from "./Applicant/Questions";

//programme
import ProgrammeMain from "./Programme/ProgrammeMain";
import ProgrammeDetails from "./Programme/details";

import Admin from "./Admin/Admin";
import AdminLayout from "./Admin/AdminLayout";
import AdminQuestions from "./Admin/Questions";

import { useAuth } from "./Authentication/AuthProvider";
import NotFound from "./Components/NotFound";

import StaffDirectory from "./StaffDirectory/StaffDirectory";
import Staff from "./StaffDirectory/Staff";

function App() {
  const { userSession, auth } = useAuth();

  const userTypeRoutes = () => {
    if (userSession && auth) {
      if (userSession.user.user_metadata.userType === "applicant") {
        return (
          <>
            <Route path="/" element={<Navigate to="/applicant" />} />
            <Route path="/signIn" element={<Navigate to="/applicant" />} />
            <Route path="signUp" element={<Navigate to="/applicant" />} />

            <Route path="/applicant/" element={<ApplicantLayout />}>
              <Route index element={<Applicant />} />
              <Route path="application" element={<Application />} />
              <Route path="personalInformation" element={<PersonalInformation />} />
              <Route path="questions" element={<Questions />} />
              <Route path="*" element={<NotFound />} />
            </Route>

              <Route path="/Programme/" element={<ProgrammeMain />}>
                <Route path="programmeDetails" element={<ProgrammeDetails />} />
                <Route path="*" element={<NotFound />} />
              </Route>

          </>
        );
      } else {
        return (
          <>
            <Route path="/" element={<Navigate to="/admin" />} />
            <Route path="/signIn" element={<Navigate to="/admin" />} />
            <Route path="signUp" element={<Navigate to="/admin" />} />

            <Route path="/admin/" element={<AdminLayout />}>
              <Route index element={<Admin />} />
              <Route path="questions" element={<AdminQuestions />} />
              <Route path="*" element={<NotFound />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </>
        );
      }
    }
  };

  return (
    <>
      <Routes>
        {userTypeRoutes()}
        <Route path="/" element={<Navigate to="/signIn" />} />
        <Route path="/signIn" element={<SignIn />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path='/staffDirectory' element={< StaffDirectory />} />
        <Route path='/staffDirectory/staff' element={< Staff />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
