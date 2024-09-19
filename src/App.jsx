import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { PrimeReactProvider } from "primereact/api";
import { UserContextProvider } from "./contexts/UserContext";
import "/node_modules/primeflex/primeflex.css";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "primeicons/primeicons.css";

import SignUpForm from "./features/users/SignUpForm";
import LoginForm from "./features/users/LoginForm";
import AppLayout from "./ui/AppLayout";
import ProtectedRoute from "./ui/ProtectedRoute";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";
import Account from "./features/users/Account";
import ForgotPasswordForm from "./features/users/ForgotPasswordForm";
import ResetPassword from "./features/users/ResetPassword";
import PageNotFound from "./ui/PageNotFound";

const router = createBrowserRouter([
  {
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    errorElement: <PageNotFound />,
    children: [
      {
        path: "account",
        element: <Account />,
      },
      {
        path: "employee/dashboard",
        element: <EmployeeDashboard />,
      },
      {
        path: "manager/dashboard",
        element: <ManagerDashboard />,
      },
    ],
  },
  {
    path: "login",
    element: <LoginForm />,
  },
  {
    path: "/",
    element: <SignUpForm />,
  },
  {
    path: "forgot-password",
    element: <ForgotPasswordForm />,
  },
  {
    path: "reset-password",
    element: <ResetPassword />,
  },
]);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 10000,
      gcTime: 5 * 60 * 100000,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <UserContextProvider>
      <PrimeReactProvider>
        <QueryClientProvider client={queryClient}>
          <ReactQueryDevtools initialIsOpen={false} />
          <RouterProvider router={router} />
        </QueryClientProvider>
      </PrimeReactProvider>
    </UserContextProvider>
  );
}

export default App;
