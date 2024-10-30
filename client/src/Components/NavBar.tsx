import { Button, HStack, Input } from "@chakra-ui/react";
import ColorModeSwitch from "./ColorModeSwitch";
import { Link } from "react-router-dom";
import { useUserContext } from "../Contexts/userContext";
import Cookies from "universal-cookie";
import { House, LogOut, Search } from "lucide-react";
import { FormEvent, useState } from "react";
import { searchGames } from "../Services/searchGames";
import { useGamesContext } from "../Contexts/gamesContext";

const NavBar = () => {
  const cookies = new Cookies();
  const { userState, userDispatch } = useUserContext();
  const { gamesDispatch } = useGamesContext();
  const [error, setError] = useState("");
  const [input, setInput] = useState({
    search: "",
    genreId: "",
    publisher: "",
    releaseDate: "",
    sortByRating: "",
  });

  const handleSearchButton = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await searchGames(input);
      gamesDispatch({ type: "setGames", payload: response });
      setInput({
        search: "",
        genreId: "",
        publisher: "",
        releaseDate: "",
        sortByRating: "",
      });
    } catch (error: any) {
      setError(error);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput({ ...input, [event.target.id]: event.target.value });
  };

  const handleLogout = () => {
    cookies.remove("x-auth-token");
    userDispatch({ type: "logout", payload: "" });
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearchButton(event);
    }
  };

  return (
    <HStack justifyContent="space-between" padding="20px">
      <Link to="/">
        <Button>
          <House />
        </Button>
      </Link>
      <Input
        placeholder="Search"
        variant="outline"
        type="text"
        id="search"
        value={input.search}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      <Button onClick={handleSearchButton}>
        <Search />
      </Button>
      <ColorModeSwitch />
      {userState.token ? (
        <Button onClick={handleLogout}>
          <LogOut />
        </Button>
      ) : (
        <Link to="/login">
          <Button colorScheme="orange">Login</Button>
        </Link>
      )}
    </HStack>
  );
};

export default NavBar;
