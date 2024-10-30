import { Grid, GridItem } from "@chakra-ui/react";
import NavBar from "./Components/NavBar";
import { Outlet } from "react-router-dom";
import { useEffect, useReducer } from "react";
import { UserContext } from "./Contexts/userContext";
import Cookies from "universal-cookie";
import { userReducer } from "./Reducers/userReducer";

const App = () => {
  const cookies = new Cookies();
  const [userState, userDispatch] = useReducer(userReducer, {
    token: "",
  });

  useEffect(() => {
    const token = cookies.get("x-auth-token");
    if (token) {
      userDispatch({ type: "login", payload: token });
    }
  }, []);

  return (
    <UserContext.Provider value={{ userState, userDispatch }}>
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
    </UserContext.Provider>
  );
};

export default App;
