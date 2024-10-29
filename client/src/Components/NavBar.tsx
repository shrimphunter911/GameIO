import { Button, HStack } from "@chakra-ui/react";
import ColorModeSwitch from "./ColorModeSwitch";
import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <HStack justifyContent="space-between" padding="20px">
      <Link to="/">
        <Button>Home</Button>
      </Link>
      <ColorModeSwitch />
      <Link to="/login">
        <Button colorScheme="orange">Login</Button>
      </Link>
    </HStack>
  );
};

export default NavBar;
