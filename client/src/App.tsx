import { Grid, GridItem } from "@chakra-ui/react";
import NavBar from "./Components/NavBar";
import { Outlet } from "react-router-dom";
import { useEffect, useReducer, useState } from "react";
import { UserContext } from "./Contexts/userContext";
import Cookies from "universal-cookie";
import { userReducer } from "./Reducers/userReducer";
import { gamesReducer } from "./Reducers/gamesReducer";
import { GamesContext } from "./Contexts/gamesContext";
import { genresReducer } from "./Reducers/genresReducer";
import fetchGenres from "./Services/fetchGenres";
import { GenresContext } from "./Contexts/genresContext";
import { Provider } from "react-redux";
import { store } from "./State/store";

const App = () => {
  const cookies = new Cookies();
  const [userState, userDispatch] = useReducer(userReducer, {
    token: "",
  });
  // const [gamesState, gamesDispatch] = useReducer(gamesReducer, { games: [] });
  const [genresState, genresDispatch] = useReducer(genresReducer, {
    genres: [],
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const getUserAndGenres = async () => {
      try {
        const token = await cookies.get("x-auth-token");
        if (token) {
          userDispatch({ type: "login", payload: token });
        }
        const genresData = await fetchGenres();
        genresDispatch({ type: "setGenres", payload: genresData });
      } catch (err: any) {
        if (err.message !== "Request canceled") setError(err.message);
      }
    };

    getUserAndGenres();
  }, []);

  return (
    <UserContext.Provider value={{ userState, userDispatch }}>
      <GenresContext.Provider value={{ genresState, genresDispatch }}>
        <Provider store={store}>
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
        </Provider>
      </GenresContext.Provider>
    </UserContext.Provider>
  );
};

export default App;
