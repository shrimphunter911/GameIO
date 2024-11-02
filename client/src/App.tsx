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
import { genresReducer } from "./Reducers/genresReducer";
import fetchGenres from "./Services/fetchGenres";
import { GenresContext } from "./Contexts/genresContext";

const App = () => {
  const cookies = new Cookies();
  const [userState, userDispatch] = useReducer(userReducer, {
    token: "",
  });
  const [gamesState, gamesDispatch] = useReducer(gamesReducer, { games: [] });
  const [genresState, genresDispatch] = useReducer(genresReducer, {
    genres: [],
  });
  const [error, setError] = useState("");
  const [page, setPage] = useState<number>(1);
  const [isBottom, setIsBottom] = useState<boolean>(false);
  let scrollTimeout: ReturnType<typeof setTimeout> | null = null;

  const handleScroll = () => {
    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }

    scrollTimeout = setTimeout(() => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 10
      ) {
        if (!isBottom) {
          setPage((prevPage) => prevPage + 1);
          setIsBottom(true);
        }
      } else {
        setIsBottom(false);
      }
    }, 100);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
    };
  }, []);

  useEffect(() => {
    const getGames = async () => {
      try {
        const data = await fetchGames(page);
        gamesDispatch({
          type: "setGames",
          payload: [...gamesState.games, ...data],
        });
      } catch (err: any) {
        if (err.message !== "Request canceled") setError(err.message);
      }
    };

    getGames();
  }, [page]);

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
      </GenresContext.Provider>
    </UserContext.Provider>
  );
};

export default App;
