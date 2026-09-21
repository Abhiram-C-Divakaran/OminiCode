import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import LoginPage from "./components/pages/auth/LoginPage";
import RegisterPage from "./components/pages/auth/RegisterPage";
import ForgotPasswordPage from "./components/pages/auth/ForgotPasswordPage";
import {
  Navigate,
  Route,
  HashRouter as Router,
  Routes,
} from "react-router-dom";
import { DashboardLayout } from "./components/layout/Dashboard";
import BugChecker from "./components/pages/BugChecker";
import { CodeWorkspace } from "./components/pages/CodeWorkspace";
import DevOpsPage from "./components/pages/DevOpsPage";
import DocsPage from "./components/pages/DocsPage";
import IssuesPage from "./components/pages/IssuesPage";
import LandingPage from "./components/pages/LandingPage";
import RepoAnalysisPage from "./components/pages/RepoAnalysisPage";
import SecurityCenterPage from "./components/pages/SecurityCenterPage";
import SnippetsPage from "./components/pages/SnippetsPage";
import StandupPage from "./components/pages/StandupPage";
import TasksPage from "./components/pages/TasksPage";
import TeamCollabPage from "./components/pages/TeamCollabPage";
import UtilitiesPage from "./components/pages/UtilitiesPage";
import { AuthProvider } from "./context/AuthContext";
import { ReviewProvider } from "./context/ReviewContext";

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route element={<ProtectedRoute />}>
            <Route
              element={
                <ReviewProvider>
                  <DashboardLayout />
                </ReviewProvider>
              }
            >
              <Route path="/review" element={<CodeWorkspace />} />
              <Route path="/review/scan" element={<BugChecker />} />
              <Route path="/repo" element={<RepoAnalysisPage />} />
              <Route path="/team" element={<TeamCollabPage />} />
              <Route
                path="/security"
                element={<SecurityCenterPage onNavigate={() => {}} />}
              />
              <Route path="/standup" element={<StandupPage />} />
              <Route path="/tasks" element={<TasksPage />} />
              <Route
                path="/issues"
                element={<IssuesPage onNavigate={() => {}} />}
              />
              <Route path="/devops" element={<DevOpsPage />} />
              <Route
                path="/docs"
                element={<DocsPage onNavigate={() => {}} />}
              />
              <Route path="/utilities" element={<UtilitiesPage />} />
              <Route path="/snippets" element={<SnippetsPage />} />
              <Route
                path="/dashboard"
                element={<Navigate to="/review" replace />}
              />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}
