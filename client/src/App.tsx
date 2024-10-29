import { Grid, GridItem } from "@chakra-ui/react";
import NavBar from "./Components/NavBar";
import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { UserContext } from "./Contexts/userContext";
import Cookies from "universal-cookie";

const App = () => {
  const cookies = new Cookies();
  const [user, setUser] = useState("");

  useEffect(() => {
    setUser(cookies.get("x-auth-token"));
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
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
