import {
  Box,
  Input,
  SimpleGrid,
  Spinner,
  Center,
  Heading,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import GameCard from "./GameCard";
import { useEffect, useState } from "react";
import { useGamesContext } from "../Contexts/gamesContext";
import AdvancedSearchDrawer from "./AdvancedSearch";
import { useGenresContext } from "../Contexts/genresContext";
import { searchGames } from "../Services/searchGames";
import { showToast } from "../Services/showToast";

const GameGrid = () => {
  const [error, setError] = useState("");
  const [page, setPage] = useState<number>(1);
  const [isBottom, setIsBottom] = useState<boolean>(false);
  const { gamesState, gamesDispatch } = useGamesContext();
  const { genresState } = useGenresContext();
  const genres = genresState.genres;
  const games = gamesState.games;
  const [loading, setLoading] = useState(false);
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
    const handleSearch = async () => {
      try {
        setLoading(true);
        setPage(1);
        const result = await searchGames(debouncedInput, 1);
        gamesDispatch({ type: "setGames", payload: result });
      } catch (error: any) {
        setError(error.message);
        showToast("error", error, "Error");
      } finally {
        setLoading(false);
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
        setLoading(true);
        const data = await searchGames(debouncedInput, page);
        const uniqueGames = [
          ...gamesState.games,
          ...data.filter(
            (newGame) =>
              !gamesState.games.some((game) => game.id === newGame.id)
          ),
        ];
        gamesDispatch({
          type: "setGames",
          payload: uniqueGames,
        });
      } catch (err: any) {
        if (err.message !== "Request canceled") setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (page !== 1) {
      getGames();
    }
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
      <Box width="100%" padding="20px">
        <Box position="relative" maxW="1200px" mx="auto" mb="4">
          {" "}
          <Input
            placeholder="Search"
            variant="outline"
            type="text"
            id="search"
            value={input.search}
            onChange={handleChange}
            pr="40px"
            width="100%"
          />
          <AdvancedSearchDrawer
            input={input}
            onChange={handleChange}
            onSortChange={handleSortChange}
            genres={genres}
          />
        </Box>
        <SimpleGrid
          columns={{ sm: 2, md: 2, lg: 3, xl: 3 }}
          spacing="50px"
          maxW="1200px"
          mx="auto"
        >
          {games.map((game) => (
            <Link key={game.id} to={`/games/${game.id}`}>
              <GameCard key={game.id} game={game} />
            </Link>
          ))}
        </SimpleGrid>
        {loading && (
          <Center mt={4} mb={4}>
            <Spinner size="lg" color="blue.500" />
          </Center>
        )}
      </Box>
    </>
  );
};

export default GameGrid;
