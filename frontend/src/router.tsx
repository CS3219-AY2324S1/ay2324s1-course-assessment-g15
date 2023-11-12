import { createBrowserRouter } from "react-router-dom";
import UserAuthentication from './pages/UserAuthentication.js';
import QuestionPage from './pages/QuestionPage.js';
import UserProfilePage from './pages/UserProfilePage.js';
import LoadingPage from "./pages/LoadingPage.js";

const router = createBrowserRouter([
  {
    path: "/",
    element: <UserAuthentication />,
    errorElement: <LoadingPage />
  },
  {
    path: "home",
    element: <QuestionPage />
  },
  {
    path: "profile",
    element: <UserProfilePage />
  },
]);

export default router;
