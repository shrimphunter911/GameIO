import { useEffect, useState } from "react";
import { useGenresContext } from "../Contexts/genresContext";
import { Game } from "../Interfaces/game";
import {
  Box,
  HStack,
  Input,
  SimpleGrid,
  Spinner,
  Center,
} from "@chakra-ui/react";
import AdvancedSearchDrawer from "./AdvancedSearch";
import { useUserContext } from "../Contexts/userContext";
import { Link } from "react-router-dom";
import MyGameCard from "./MyGameCard";
import { searchMyGames } from "../Services/searchMyGames";
import { useSelector } from "react-redux";
import { RootState } from "../State/store";

const MyGames = () => {
  // const { userState } = useUserContext();
  const user = useSelector((state: RootState) => state.user.token);
  const [myGames, setMyGames] = useState<Game[]>([]);
  const { genresState } = useGenresContext();
  const [error, setError] = useState("");
  const [page, setPage] = useState<number>(1);
  const [isBottom, setIsBottom] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const genres = genresState.genres;
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
        const result = await searchMyGames(debouncedInput, 1, user);
        setMyGames(result);
      } catch (error: any) {
        setError(error.message);
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
        setLoading(true); // Start loading
        const data = await searchMyGames(debouncedInput, page, user);
        const uniqueGames = [
          ...myGames,
          ...data.filter(
            (newGame) => !myGames.some((game) => game.id === newGame.id)
          ),
        ];
        setMyGames(uniqueGames);
      } catch (err: any) {
        if (err.message !== "Request canceled") setError(err.message);
      } finally {
        setLoading(false); // End loading
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
        <HStack maxW="1200px" mx="auto" mb="4" width="100%">
          <Box position="relative" width="100%">
            <Input
              placeholder="Search My Games"
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
        </HStack>
        <SimpleGrid
          columns={{ sm: 2, md: 2, lg: 3, xl: 3 }}
          spacing="20px"
          maxW="1200px"
          mx="auto"
        >
          {myGames.map((game) => (
            <Link key={game.id} to={`/games/${game.id}`}>
              <MyGameCard key={game.id} game={game}></MyGameCard>
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

export default MyGames;
