import {
  Button,
  HStack,
  Input,
  Box,
  VStack,
  Text,
  Image,
} from "@chakra-ui/react";
import ColorModeSwitch from "./ColorModeSwitch";
import { Link, useNavigate } from "react-router-dom";
import { useUserContext } from "../Contexts/userContext";
import Cookies from "universal-cookie";
import { CirclePlus, House, Library, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { searchGames } from "../Services/searchGames";
import { useGenresContext } from "../Contexts/genresContext";
import AdvancedSearchDrawer from "./AdvancedSearch";
import { Game } from "../Interfaces/game";

const NavBar = () => {
  const navigate = useNavigate();
  const cookies = new Cookies();
  const { userState, userDispatch } = useUserContext();
  const { genresState } = useGenresContext();
  const [error, setError] = useState("");
  const [games, setGames] = useState<Game[]>([]);
  const [input, setInput] = useState({
    search: "",
    genreId: "",
    publisher: "",
    releaseDate: "",
    sortByRating: "",
  });

  const genres = genresState.genres;
  const [debouncedInput, setDebouncedInput] = useState(input);

  useEffect(() => {
    const handleSearch = async () => {
      if (debouncedInput.search.trim() === "") {
        setGames([]);
      } else {
        try {
          const result = await searchGames(debouncedInput);
          setGames(result);
        } catch (error: any) {
          setError(error.message);
        }
      }
    };

    handleSearch();
  }, [debouncedInput]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedInput(input);
    }, 1000);

    return () => {
      clearTimeout(handler);
    };
  }, [input]);

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
          pr="40px"
        />
        <AdvancedSearchDrawer
          input={input}
          onChange={handleChange}
          onSortChange={handleSortChange}
          genres={genres}
        />
        {games.length > 0 && (
          <Box
            position="absolute"
            top="100%"
            left="0"
            width="100%"
            bg="white"
            boxShadow="md"
            borderRadius="md"
            maxHeight="200px"
            overflowY="auto"
            zIndex="1"
            p="10px"
          >
            <VStack align="start" spacing="5px">
              {games.map((game) => (
                <Box
                  key={game.id}
                  p="10px"
                  width="100%"
                  borderRadius="md"
                  cursor="pointer"
                  onClick={() => navigate(`/games/${game.id}`)}
                  _hover={{ bg: "gray.100" }}
                  display="flex"
                  alignItems="center"
                >
                  <Image
                    src={game.imageUrl}
                    alt={game.title}
                    boxSize="40px"
                    borderRadius="md"
                    mr="10px"
                    objectFit="cover"
                  />
                  <Box>
                    <Text fontWeight="bold" color="black">
                      {game.title}
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      {game.publisher} - {game.releaseDate.split("T")[0]}
                    </Text>
                  </Box>
                </Box>
              ))}
            </VStack>
          </Box>
        )}
      </Box>
      <ColorModeSwitch />
      {userState.token ? (
        <>
          <Link to="/games/mygames">
            <Button>
              <Library />
            </Button>
          </Link>
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
