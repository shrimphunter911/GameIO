import { FormEvent, useEffect, useState } from "react";
import { useGenresContext } from "../Contexts/genresContext";
import { Game } from "../Interfaces/game";
import { Box, Button, HStack, Input, SimpleGrid } from "@chakra-ui/react";
import AdvancedSearchDrawer from "./AdvancedSearch";
import { Search } from "lucide-react";
import { useUserContext } from "../Contexts/userContext";
import { searchMyGames } from "../Services/searchMyGames";
import { Link } from "react-router-dom";
import { getMyGames } from "../Services/getMyGames";
import MyGameCard from "./MyGameCard";

const MyGames = () => {
  const { userState } = useUserContext();
  const [myGames, setMyGames] = useState<Game[]>([]);
  const { genresState } = useGenresContext();
  const [error, setError] = useState("");
  const [input, setInput] = useState({
    search: "",
    genreId: "",
    publisher: "",
    releaseDate: "",
    sortByRating: "",
  });

  useEffect(() => {
    const getGames = async () => {
      try {
        const response = await getMyGames(token);
        setMyGames(response);
      } catch (error: any) {
        setError(error.message);
      }
    };

    getGames();
  }, []);

  const genres = genresState.genres;
  const token = userState.token;
  const handleSearchButton = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await searchMyGames(input, token);
      setMyGames(response);
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

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearchButton(event);
    }
  };

  return (
    <>
      <HStack>
        <Box position="relative" width="100%">
          <Input
            placeholder="Search My Games"
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
      </HStack>
      <SimpleGrid
        columns={{ sm: 2, md: 2, lg: 3, xl: 3 }}
        padding="20px"
        spacing={20}
      >
        {myGames.map((game) => (
          <Link key={game.id} to={`/games/${game.id}`}>
            <MyGameCard key={game.id} game={game}></MyGameCard>
          </Link>
        ))}
      </SimpleGrid>
    </>
  );
};

export default MyGames;
