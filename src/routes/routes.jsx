import { createBrowserRouter } from "react-router";
import Login from "../screens/Login/Login";
import UsersList from "../screens/Users/UsersList";
import Dashboard from "../screens/Dashboard/Dashboard";
import ProtectedRoute from "../components/ProtectedRoute";
  
const router = createBrowserRouter([
    {
        path: "/",
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