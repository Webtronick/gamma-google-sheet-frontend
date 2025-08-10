import { createBrowserRouter } from "react-router";
import Login from "../screens/Login/Login";
import UsersList from "../screens/Users/UsersList";
import Dashboard from "../screens/Dashboard/Dashboard";
import ProtectedRoute from "../components/ProtectedRoute";
import Init from "../screens/Init";
  
const router = createBrowserRouter([
    {
        path: "/",
        Component: Init
    },
    {
        path: "/login",
        Component: Login
    },
    {
        path: "/users",
        element: (
            <ProtectedRoute requireAdmin={true}>
                <UsersList />
            </ProtectedRoute>
        )
    },
    {
        path: "/dashboard",
        element: (
            <ProtectedRoute requireAdmin={false}>
                <Dashboard />
            </ProtectedRoute>
        )
    }
]);
  
export default router;