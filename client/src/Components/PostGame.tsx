import React, { FormEvent, useState } from "react";
import Select from "react-select";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  Heading,
  Input,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { useGenresContext } from "../Contexts/genresContext";
import { Game } from "../Interfaces/game";
import { useGamesContext } from "../Contexts/gamesContext";
import { createGame } from "../Services/createGame";
import { useUserContext } from "../Contexts/userContext";
import UploadWidget from "./UploadWidget";

interface GenreOption {
  value: number;
  label: string;
}

export default function PostGame() {
  const { userState } = useUserContext();
  const { genresState } = useGenresContext();
  const { gamesState, gamesDispatch } = useGamesContext();
  const [game, setGame] = useState<Game>({
    title: "",
    description: "",
    publisher: "",
    releaseDate: "",
    imageUrl: "",
    genreIds: [],
  });

  const [error, setError] = useState("");
  const [isError, setIsError] = useState(false);

  const genreOptions: GenreOption[] = genresState.genres.map((genre) => ({
    value: genre.id,
    label: genre.name,
  }));

  const isFormValid =
    game.title.trim() !== "" &&
    game.description.trim() !== "" &&
    game.publisher.trim() !== "" &&
    game.imageUrl.trim() !== "" &&
    game.releaseDate.trim() !== "" &&
    game.genreIds.length > 0;

  const handleNewGame = (item: Game) => {
    gamesDispatch({ type: "setGames", payload: [...gamesState.games, item] });
  };

  const handlePostGame = async (e: FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      try {
        const response = await createGame(game, userState.token);
        handleNewGame(response);
        setGame({
          title: "",
          description: "",
          publisher: "",
          releaseDate: "",
          imageUrl: "",
          genreIds: [],
        });
        setIsError(false);
      } catch (error: any) {
        setError(error.message);
        setIsError(true);
      }
    } else {
      setError("Please fill all the fields properly.");
      setIsError(true);
    }
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = event.target;
    setGame({ ...game, [id]: value });
    if (isError) {
      setError("");
      setIsError(false);
    }
  };

  const handleGenreChange = (selectedOptions: readonly GenreOption[]) => {
    const selectedIds = selectedOptions.map((option) => option.value);
    setGame({ ...game, genreIds: selectedIds });
  };

  const handleImageUpload = (url: string) => {
    setGame((prevGame) => ({ ...prevGame, imageUrl: url }));
  };

  return (
    <Box>
      <Container maxW="6xl">
        <Heading as="h1" size="2xl" textAlign="center" mb={8}>
          Post a New Game
        </Heading>
        <Flex gap={8} alignItems="stretch">
          <Box>
            {game.imageUrl ? (
              <Box as="img" src={game.imageUrl} alt="Game Preview" />
            ) : (
              <Box />
            )}
          </Box>
          <Box flex="1">
            <form onSubmit={handlePostGame}>
              <VStack spacing={4} align="stretch">
                {isError && (
                  <Alert status="error" borderRadius={10}>
                    <AlertIcon />
                    <AlertTitle>{error}</AlertTitle>
                  </Alert>
                )}
                <FormControl>
                  <Input
                    id="title"
                    value={game.title}
                    onChange={handleChange}
                    placeholder="Title"
                  />
                </FormControl>
                <FormControl>
                  <Textarea
                    id="description"
                    value={game.description}
                    onChange={handleChange}
                    placeholder="Description"
                  />
                </FormControl>
                <FormControl>
                  <Input
                    id="publisher"
                    value={game.publisher}
                    onChange={handleChange}
                    placeholder="Publisher"
                  />
                </FormControl>
                <FormControl>
                  <Input
                    id="releaseDate"
                    value={game.releaseDate}
                    type="datetime-local"
                    onChange={handleChange}
                  />
                </FormControl>
                <FormControl>
                  <Select
                    isMulti
                    name="genres"
                    options={genreOptions}
                    onChange={handleGenreChange}
                    placeholder="Select Genres"
                    aria-label="Select Genres"
                  />
                </FormControl>
                <UploadWidget setImageUrl={handleImageUpload} />
                <Button type="submit">Post Game</Button>
              </VStack>
            </form>
          </Box>
        </Flex>
      </Container>
    </Box>
  );
}
