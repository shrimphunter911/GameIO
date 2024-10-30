import React from "react";
import ReactDOM from "react-dom/client";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  ChakraProvider,
  ColorModeScript,
} from "@chakra-ui/react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import theme from "./theme";
import "./index.css";
import Login from "./Components/Login";
import SignUp from "./Components/SignUp";
import ProtectedRoute from "./Routes/protectedRoute";
import GameGrid from "./Components/GameGrid";
import GameView from "./Components/GameView";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: (
      <Alert borderRadius={10} status="error">
        <AlertIcon />
        <AlertTitle>404 Not Found</AlertTitle>
      </Alert>
    ),
    children: [
      {
        path: "/",
        element: <GameGrid />,
      },
      {
        path: "/games/:gameId",
        element: <GameView />,
      },
      {
        path: "/login",
        element: <ProtectedRoute />,
        children: [
          {
            path: "/login",
            element: <Login />,
          },
        ],
      },
      {
        path: "/signup",
        element: <ProtectedRoute />,
        children: [
          {
            path: "/signup",
            element: <SignUp />,
          },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <RouterProvider router={router} />
    </ChakraProvider>
  </React.StrictMode>
);
