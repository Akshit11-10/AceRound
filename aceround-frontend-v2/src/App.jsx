import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthProvider from "./components/AuthProvider";
import ProtectedRoute from "./components/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";

import Home      from "./pages/Home";
import Login     from "./pages/Login";
import Register  from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Interview from "./pages/Interview";
import MockDriveRole from "./pages/MockDriveRole";
import MockDriveResume from "./pages/MockDriveResume";
import MockDriveMcq from "./pages/MockDriveMcq";
import MockDriveAptitude from "./pages/MockDriveAptitude";
import MockDriveCoding from "./pages/MockDriveCoding";
import MockDriveInterview from "./pages/MockDriveInterview";
import MockDriveReport from "./pages/MockDriveReport";
import ResumeAtsChecker from "./pages/ResumeAtsChecker";
import Results   from "./pages/Results";
import Settings  from "./pages/Settings";
import Admin     from "./pages/Admin";

export default function App() {  
  return (
    <AuthProvider> 
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Public routes */}
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* All other routes require login */}
          <Route element={<ProtectedRoute />}>
            <Route path="/"          element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/interview" element={<Interview />} />
            <Route path="/mock-drive/role" element={<MockDriveRole />} />
            <Route path="/mock-drive/resume" element={<MockDriveResume />} />
            <Route path="/mock-drive/:id/aptitude" element={<MockDriveAptitude />} />
            <Route path="/mock-drive/:id/mcq" element={<MockDriveMcq />} />
            <Route path="/mock-drive/:id/coding" element={<MockDriveCoding />} />
            <Route path="/mock-drive/:id/interview" element={<MockDriveInterview />} />
            <Route path="/mock-drive/:id/report" element={<MockDriveReport />} />
            <Route path="/resume-checker" element={<ResumeAtsChecker />} />
            <Route path="/results"   element={<Results />} />
            <Route path="/settings"  element={<Settings />} />
            <Route path="/admin"     element={<Admin />} />
          </Route>

          {/* Anything unknown goes to login */}
          <Route path="*" element={<Navigate to="/login"/>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}