import { BrowserRouter, Routes, Route } from "react-router";

import Home from "./pages/Home";
import Courses from "./pages/Courses";
import CourseDetails from "./pages/CourseDetails";
import AppLayout from "./layouts/AppLayout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import VerifyEmail from "./pages/VerifyEmail";
import CheckEmail from "./pages/CheckEmail";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import EmailAuthRoute from "./components/EmailAuthRoute";
import Dashboard from "./pages/Dashboard";
import CourseWorkspace from "./pages/CourseWorkspace";
import { CreateCourse } from "./components/CreateCourse";
import ScrollToTop from "./components/ScrollToTop";
import { ToastProvider } from "./components/ToastProvider";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <ToastProvider>
        <AuthProvider>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />

              <Route
                path="/verify-email"
                element={
                  <EmailAuthRoute>
                    <VerifyEmail />
                  </EmailAuthRoute>
                }
              ></Route>

              <Route
                path="/check-email"
                element={
                  <EmailAuthRoute>
                    <CheckEmail />
                  </EmailAuthRoute>
                }
              ></Route>

              <Route
                path="/forgot-password"
                element={
                  <EmailAuthRoute>
                    <ForgotPassword />
                  </EmailAuthRoute>
                }
              ></Route>

              <Route
                path="/reset-password"
                element={
                  <EmailAuthRoute>
                    <ResetPassword />
                  </EmailAuthRoute>
                }
              ></Route>

              <Route path="/courses" element={<Courses />} />
              <Route path="/courses/:courseId" element={<CourseDetails />} />

              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              ></Route>

              <Route
                path="/dashboard/courses/:courseId"
                element={
                  <ProtectedRoute>
                    <CourseWorkspace />
                  </ProtectedRoute>
                }
              ></Route>

              <Route
                path="/courses/create"
                element={
                  <ProtectedRoute>
                    <CreateCourse />
                  </ProtectedRoute>
                }
              ></Route>
            </Route>
          </Routes>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
