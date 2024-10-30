import { Button, HStack } from "@chakra-ui/react";
import ColorModeSwitch from "./ColorModeSwitch";
import { Link } from "react-router-dom";
import { useUserContext } from "../Contexts/userContext";
import Cookies from "universal-cookie";

const NavBar = () => {
  const cookies = new Cookies();
  const { userState, userDispatch } = useUserContext();

  const handleLogout = () => {
    cookies.remove("x-auth-token");
    userDispatch({ type: "logout", payload: "" });
  };

  return (
    <HStack justifyContent="space-between" padding="20px">
      <Link to="/">
        <Button>Home</Button>
      </Link>
      <ColorModeSwitch />
      {userState.token ? (
        <Button onClick={handleLogout}>Logout</Button>
      ) : (
        <Link to="/login">
          <Button colorScheme="orange">Login</Button>
        </Link>
      )}
    </HStack>
  );
};

export default NavBar;
