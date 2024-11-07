import React, { FormEvent, useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormErrorMessage,
  Heading,
  Input,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { useUserContext } from "../Contexts/userContext";
import { Game } from "../Interfaces/game";
import fetchGame from "../Services/fetchGame";
import UploadWidget from "./UploadWidget";
import { updateGame } from "../Services/updateGame";
import { useGamesContext } from "../Contexts/gamesContext";
import { showToast } from "../Services/showToast";

export default function EditGame() {
  const navigate = useNavigate();
  const { userState } = useUserContext();
  const { gamesState, gamesDispatch } = useGamesContext();
  const params = useParams();
  const gameId = params.gameId;
  const [game, setGame] = useState<Game>({
    title: "",
    description: "",
    publisher: "",
    releaseDate: "",
    imageUrl: "",
    genreIds: [],
  });

  const [isUploaded, setIsUploaded] = useState(false);
  const [error, setError] = useState("");
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const getGame = async () => {
      try {
        const data = await fetchGame(controller.signal, params);
        const formattedReleaseDate = data.releaseDate
          ? new Date(data.releaseDate).toISOString().slice(0, 16)
          : "";
        setGame({ ...data, releaseDate: formattedReleaseDate });
        setIsUploaded(!!data.imageUrl);
      } catch (err: any) {
        if (err.message !== "Request canceled") setError(err.message);
      }
    };

    getGame();
    return () => controller.abort();
  }, [params]);

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

  const handleImageUpload = (url: string) => {
    setGame((prevGame) => ({ ...prevGame, imageUrl: url }));
    setIsUploaded(true);
  };

  const clearImageUrl = () => {
    setGame((prevGame) => ({ ...prevGame, imageUrl: "" }));
    setIsUploaded(false);
  };

  const isFormValid =
    game.title.trim() !== "" &&
    game.description.trim() !== "" &&
    game.publisher.trim() !== "" &&
    game.imageUrl.trim() !== "" &&
    game.releaseDate.trim() !== "";

  const handleUpdatedGame = (item: Game) => {
    gamesDispatch({
      type: "setGames",
      payload: gamesState.games.map((game) => {
        if (game.id === item.id) {
          return item;
        }
        return game;
      }),
    });
  };

  const handleUpdateGame = async (e: FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      try {
        const response = await updateGame(game, userState.token, gameId);
        handleUpdatedGame(response);
        setIsError(false);
        showToast("success", "Updated successfully", "Success");
        navigate("/");
      } catch (error: any) {
        setError(error.message);
        setIsError(true);
        showToast("error", error.message, "Error");
      }
    } else {
      setError("Please fill all the fields properly.");
      setIsError(true);
      showToast("error", "Please fill all the fields properly.", "Error");
    }
  };

  return (
    <Box>
      <Container maxW="6xl">
        <Heading as="h1" size="2xl" textAlign="center" mb={8}>
          Edit Game
        </Heading>
        <Flex gap={8} alignItems="stretch">
          <Box position="relative">
            {game.imageUrl ? (
              <>
                <Box
                  as="img"
                  src={game.imageUrl}
                  alt="Game Preview"
                  borderRadius="md"
                />
                <Button
                  onClick={clearImageUrl}
                  position="absolute"
                  top={2}
                  right={2}
                  colorScheme="red"
                  size="sm"
                  variant="outline"
                >
                  &times;
                </Button>
              </>
            ) : (
              <Box />
            )}
          </Box>
          <Box flex="1">
            <form onSubmit={handleUpdateGame}>
              <VStack spacing={4} align="stretch">
                <FormControl isInvalid={isError && game.title.trim() === ""}>
                  <Input
                    id="title"
                    value={game.title}
                    onChange={handleChange}
                    placeholder="Title"
                  />
                  <FormErrorMessage>Title is required.</FormErrorMessage>
                </FormControl>
                <FormControl
                  isInvalid={isError && game.description.trim() === ""}
                >
                  <Textarea
                    id="description"
                    value={game.description}
                    onChange={handleChange}
                    placeholder="Description"
                  />
                  <FormErrorMessage>Description is required.</FormErrorMessage>
                </FormControl>
                <FormControl
                  isInvalid={isError && game.publisher.trim() === ""}
                >
                  <Input
                    id="publisher"
                    value={game.publisher}
                    onChange={handleChange}
                    placeholder="Publisher"
                  />
                  <FormErrorMessage>Publisher is required.</FormErrorMessage>
                </FormControl>
                <FormControl
                  isInvalid={isError && game.releaseDate.trim() === ""}
                >
                  <Input
                    id="releaseDate"
                    value={game.releaseDate}
                    type="datetime-local"
                    onChange={handleChange}
                  />
                  <FormErrorMessage>Release date is required.</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={isError && game.imageUrl.trim() === ""}>
                  <UploadWidget
                    setImageUrl={handleImageUpload}
                    isUploaded={isUploaded}
                    setIsUploaded={setIsUploaded}
                  />
                  <FormErrorMessage>Image is required.</FormErrorMessage>
                </FormControl>
                <Button type="submit">Update Game</Button>
              </VStack>
            </form>
          </Box>
        </Flex>
      </Container>
    </Box>
  );
}
