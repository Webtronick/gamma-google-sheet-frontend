import { createBrowserRouter } from "react-router";
import Layout from "../components/Layout";  
import Login from "../screens/Login/Login";
import Setup2FA from "../screens/Login/Setup2FA";
import UsersList from "../screens/Users/UsersList";
import UserDetail from "../screens/Users/UserDetail";
import Dashboard from "../screens/Dashboard/Dashboard";
import SetPassword from "../screens/Login/SetPassword";

const router = createBrowserRouter([
    {
        path: "/login",
        Component: Login
    },
    {
        path: "/set-password",
        Component: SetPassword
    },
    {
        path: "/setup-2fa",
        Component: Setup2FA
    },
    {
        path: "/",
        element: <Layout />,
        errorElement: <h1>404</h1>,
        children: [
            {
                path: "/dashboard",
                element: <Dashboard />
            },
            {
                path: "/users",
                element: <UsersList />
            },
            {
                path: "/user/detail/:id",
                element: <UserDetail />
            }
        ]
    }
]);

export default router;