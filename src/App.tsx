import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { useState } from "react";
import Verify from "./pages/Verify";
import Welcome from "./pages/Welcome";
import Question from "./pages/Question";
import Celebration from "./pages/Celebration";
import Bonus from "./pages/Bonus";

type RequireVerifiedProps = {
  verified: boolean;
  children: JSX.Element;
};

const RequireVerified = ({ verified, children }: RequireVerifiedProps) => {
  if (!verified) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const App = () => {
  const [verified, setVerified] = useState(
    () => localStorage.getItem("verified") === "true"
  );

  const handleVerified = () => {
    localStorage.setItem("verified", "true");
    setVerified(true);
  };

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Verify onVerified={handleVerified} />} />
        <Route
          path="/welcome"
          element={
            <RequireVerified verified={verified}>
              <Welcome />
            </RequireVerified>
          }
        />
        <Route
          path="/question"
          element={
            <RequireVerified verified={verified}>
              <Question />
            </RequireVerified>
          }
        />
        <Route
          path="/celebration"
          element={
            <RequireVerified verified={verified}>
              <Celebration />
            </RequireVerified>
          }
        />
        <Route
          path="/bonus"
          element={
            <RequireVerified verified={verified}>
              <Bonus />
            </RequireVerified>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
