import { FormEvent, useEffect, useState } from "react";
import { useGenresContext } from "../Contexts/genresContext";
import { Game } from "../Interfaces/game";
import { Box, HStack, Input, SimpleGrid } from "@chakra-ui/react";
import AdvancedSearchDrawer from "./AdvancedSearch";
import { useUserContext } from "../Contexts/userContext";
import { Link } from "react-router-dom";
import MyGameCard from "./MyGameCard";
import { searchMyGames } from "../Services/searchMyGames";

const MyGames = () => {
  const { userState } = useUserContext();
  const [myGames, setMyGames] = useState<Game[]>([]);
  const { genresState } = useGenresContext();
  const [error, setError] = useState("");
  const [page, setPage] = useState<number>(1);
  const [isBottom, setIsBottom] = useState<boolean>(false);
  const genres = genresState.genres;
  const token = userState.token;
  let scrollTimeout: ReturnType<typeof setTimeout> | null = null;

  const [input, setInput] = useState({
    search: "",
    genreId: "",
    publisher: "",
    releaseDate: "",
    sortByRating: "",
  });
  const [debouncedInput, setDebouncedInput] = useState(input);

  useEffect(() => {
    setPage(1);
    const handleSearch = async () => {
      try {
        const result = await searchMyGames(debouncedInput, page, token);
        setMyGames(result);
      } catch (error: any) {
        setError(error.message);
      }
    };

    handleSearch();
  }, [debouncedInput]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedInput(input);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [input]);

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
        const data = await searchMyGames(debouncedInput, page, token);
        const uniqueGames = [
          ...myGames,
          ...data.filter(
            (newGame) => !myGames.some((game) => game.id === newGame.id)
          ),
        ];
        setMyGames(uniqueGames);
      } catch (err: any) {
        if (err.message !== "Request canceled") setError(err.message);
      }
    };

    getGames();
  }, [page]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setInput({ ...input, [event.target.id]: event.target.value });
  };

  const handleSortChange = (sort: "asc" | "desc") => {
    setInput({ ...input, sortByRating: sort });
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
            pr="40px"
          />
          <AdvancedSearchDrawer
            input={input}
            onChange={handleChange}
            onSortChange={handleSortChange}
            genres={genres}
          />
        </Box>
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
