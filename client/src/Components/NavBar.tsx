import { Button, HStack, Input, Box } from "@chakra-ui/react";
import ColorModeSwitch from "./ColorModeSwitch";
import { Link, useNavigate } from "react-router-dom";
import { useUserContext } from "../Contexts/userContext";
import Cookies from "universal-cookie";
import { CirclePlus, House, LogOut, Search } from "lucide-react";
import { FormEvent, useState } from "react";
import { searchGames } from "../Services/searchGames";
import { useGamesContext } from "../Contexts/gamesContext";
import AdvancedSearchDrawer from "./AdvancedSearch";
import { useGenresContext } from "../Contexts/genresContext";

const NavBar = () => {
  const navigate = useNavigate();
  const cookies = new Cookies();
  const { userState, userDispatch } = useUserContext();
  const { genresState } = useGenresContext();
  const { gamesDispatch } = useGamesContext();
  const [error, setError] = useState("");
  const [input, setInput] = useState({
    search: "",
    genreId: "",
    publisher: "",
    releaseDate: "",
    sortByRating: "",
  });

  const genres = genresState.genres;

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

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setInput({ ...input, [event.target.id]: event.target.value });
  };

  const handleSortChange = (sort: "asc" | "desc") => {
    setInput({ ...input, sortByRating: sort });
  };

  const handleLogout = async () => {
    await cookies.remove("x-auth-token");
    userDispatch({ type: "logout", payload: "" });
    navigate("/");
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
      <Box position="relative" width="100%">
        <Input
          placeholder="Search"
          variant="outline"
          type="text"
          id="search"
          value={input.search}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          pr="40px"
        />
        <AdvancedSearchDrawer
          input={input}
          onChange={handleChange}
          onSortChange={handleSortChange}
          genres={genres}
        />
      </Box>
      <Button onClick={handleSearchButton}>
        <Search />
      </Button>
      <ColorModeSwitch />
      {userState.token ? (
        <>
          <Link to="/games/post">
            <Button>
              <CirclePlus />
            </Button>
          </Link>
          <Button onClick={handleLogout}>
            <LogOut />
          </Button>
        </>
      ) : (
        <Link to="/login">
          <Button colorScheme="orange">Login</Button>
        </Link>
      )}
    </HStack>
  );
};

export default NavBar;
