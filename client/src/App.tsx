import { Grid, GridItem } from "@chakra-ui/react";
import NavBar from "./Components/NavBar";
import { Outlet } from "react-router-dom";
import { useEffect, useReducer, useState } from "react";
import { UserContext } from "./Contexts/userContext";
import Cookies from "universal-cookie";
import { userReducer } from "./Reducers/userReducer";
import { gamesReducer } from "./Reducers/gamesReducer";
import fetchGames from "./Services/fetchGames";
import { GamesContext } from "./Contexts/gamesContext";

const App = () => {
  const cookies = new Cookies();
  const [userState, userDispatch] = useReducer(userReducer, {
    token: "",
  });
  const [gamesState, gamesDispatch] = useReducer(gamesReducer, { games: [] });
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const getGames = async () => {
      try {
        const data = await fetchGames(controller.signal);
        gamesDispatch({ type: "setGames", payload: data });
      } catch (err: any) {
        if (err.message !== "Request canceled") setError(err.message);
      }
    };

    getGames();

    return () => controller.abort();
  }, []);
  useEffect(() => {
    const token = cookies.get("x-auth-token");
    if (token) {
      userDispatch({ type: "login", payload: token });
    }
  }, []);

  return (
    <UserContext.Provider value={{ userState, userDispatch }}>
      <GamesContext.Provider value={{ gamesState, gamesDispatch }}>
        <Grid
          templateAreas={{
            base: `"nav" "main"`,
            // lg: `"nav nav" "aside main"`, //1024
          }}
        >
          <GridItem area="nav">
            <NavBar />
          </GridItem>
          <GridItem area="main">
            <Outlet />
          </GridItem>
        </Grid>
      </GamesContext.Provider>
    </UserContext.Provider>
  );
};

export default App;
