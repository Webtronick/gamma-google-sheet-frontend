import { createBrowserRouter } from "react-router";
import Login from "../screens/Login/Login";
import UsersList from "../screens/Users/UsersList";
import Dashboard from "../screens/Dashboard/Dashboard";
import SetPassword from "../screens/Login/SetPassword";
import Layout from "../components/Layout";  
import UserDetail from "../screens/Users/UserDetail";

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