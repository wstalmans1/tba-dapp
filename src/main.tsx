import React from "react";
import ReactDOM from "react-dom/client";
import { createHashRouter, RouterProvider } from "react-router-dom";
import HomePage from "./components/HomePage";
import Dashboard from "./components/Dashboard";
import NotFoundPage from "./components/NotFoundPage";
import PartySplit from "./components/PartySplit";
import PayWithMetamask from "./components/PayWithMetamask";
import PayWithSigner from "./components/PayWithSigner";
import './styles/main.css';
import { Web3Provider } from "./context/Web3Context";


const router = createHashRouter([ 
    { path: "/", element: <HomePage />, errorElement: <NotFoundPage />},
    { path: "/dashboard", element: <Dashboard />, children: [
        { path: "splitparty", element: <PartySplit />},
        { path: "paywithmetamask", element: <PayWithMetamask />},
        { path: "paywithsigner", element: <PayWithSigner />},

    ]},
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <Web3Provider>
            <RouterProvider router={router} />
        </Web3Provider>
    </React.StrictMode>,
);    
