import React, { FormEvent, useState } from "react";
import Select, { StylesConfig } from "react-select";
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
import { useGenresContext } from "../Contexts/genresContext";
import { Game } from "../Interfaces/game";
import { useGamesContext } from "../Contexts/gamesContext";
import { createGame } from "../Services/createGame";
import { useUserContext } from "../Contexts/userContext";
import UploadWidget from "./UploadWidget";
import { useNavigate } from "react-router-dom";
import { showToast } from "../Services/showToast";
import { useDispatch } from "react-redux";
import { addGames } from "../State/gamesSlice";

interface GenreOption {
  value: number;
  label: string;
}

const customSelectStyles: StylesConfig<GenreOption, true> = {
  option: (provided, state) => ({
    ...provided,
    color: "black",
    backgroundColor: state.isFocused ? "#f0f0f0" : "white",
  }),
};

export default function PostGame() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userState } = useUserContext();
  const { genresState } = useGenresContext();
  const [game, setGame] = useState<Game>({
    title: "",
    description: "",
    publisher: "",
    releaseDate: "",
    imageUrl: "",
    genreIds: [],
  });

  const [isUploaded, setIsUploaded] = useState(false);
  const [errorFields, setErrorFields] = useState<string[]>([]);

  const genreOptions: GenreOption[] = genresState.genres.map((genre) => ({
    value: genre.id,
    label: genre.name,
  }));

  const validateForm = () => {
    const requiredFields = [
      { id: "title", value: game.title },
      { id: "description", value: game.description },
      { id: "publisher", value: game.publisher },
      { id: "releaseDate", value: game.releaseDate },
      { id: "imageUrl", value: game.imageUrl },
    ];

    const invalidFields = requiredFields
      .filter((field) => field.value.trim() === "")
      .map((field) => field.id);

    if (game.genreIds.length === 0) invalidFields.push("genreIds");
    setErrorFields(invalidFields);

    return invalidFields.length === 0;
  };

  const handlePostGame = async (e: FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await createGame(game, userState.token);
        dispatch(addGames(response));
        setGame({
          title: "",
          description: "",
          publisher: "",
          releaseDate: "",
          imageUrl: "",
          genreIds: [],
        });
        setIsUploaded(false);
        showToast("success", "Game posted successfully!", "Success");
        navigate("/");
      } catch (error: any) {
        showToast("error", error.message, "Error");
      }
    } else {
      showToast("error", "Please fill all the fields properly.", "Error");
    }
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = event.target;
    setGame({ ...game, [id]: value });
    if (errorFields.includes(id)) {
      setErrorFields((prevFields) =>
        prevFields.filter((field) => field !== id)
      );
    }
  };

  const handleGenreChange = (selectedOptions: readonly GenreOption[]) => {
    const selectedIds = selectedOptions.map((option) => option.value);
    setGame({ ...game, genreIds: selectedIds });
    if (errorFields.includes("genreIds")) {
      setErrorFields((prevFields) =>
        prevFields.filter((field) => field !== "genreIds")
      );
    }
  };

  const handleImageUpload = (url: string) => {
    setGame((prevGame) => ({ ...prevGame, imageUrl: url }));
    setIsUploaded(true);
    if (errorFields.includes("imageUrl")) {
      setErrorFields((prevFields) =>
        prevFields.filter((field) => field !== "imageUrl")
      );
    }
  };

  const clearImageUrl = () => {
    setGame((prevGame) => ({ ...prevGame, imageUrl: "" }));
    setIsUploaded(false);
  };

  return (
    <Box>
      <Container maxW="6xl">
        <Heading as="h1" size="2xl" textAlign="center" mb={8}>
          Post a New Game
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
            <form onSubmit={handlePostGame}>
              <VStack spacing={4} align="stretch">
                <FormControl isInvalid={errorFields.includes("title")}>
                  <Input
                    id="title"
                    value={game.title}
                    onChange={handleChange}
                    placeholder="Title"
                  />
                  {errorFields.includes("title") && (
                    <FormErrorMessage>Title is required.</FormErrorMessage>
                  )}
                </FormControl>
                <FormControl isInvalid={errorFields.includes("description")}>
                  <Textarea
                    id="description"
                    value={game.description}
                    onChange={handleChange}
                    placeholder="Description"
                  />
                  {errorFields.includes("description") && (
                    <FormErrorMessage>
                      Description is required.
                    </FormErrorMessage>
                  )}
                </FormControl>
                <FormControl isInvalid={errorFields.includes("publisher")}>
                  <Input
                    id="publisher"
                    value={game.publisher}
                    onChange={handleChange}
                    placeholder="Publisher"
                  />
                  {errorFields.includes("publisher") && (
                    <FormErrorMessage>Publisher is required.</FormErrorMessage>
                  )}
                </FormControl>
                <FormControl isInvalid={errorFields.includes("releaseDate")}>
                  <Input
                    id="releaseDate"
                    value={game.releaseDate}
                    type="datetime-local"
                    onChange={handleChange}
                  />
                  {errorFields.includes("releaseDate") && (
                    <FormErrorMessage>
                      Release date is required.
                    </FormErrorMessage>
                  )}
                </FormControl>
                <FormControl isInvalid={errorFields.includes("genreIds")}>
                  <Select
                    isMulti
                    name="genres"
                    options={genreOptions}
                    onChange={handleGenreChange}
                    placeholder="Select Genres"
                    aria-label="Select Genres"
                    styles={customSelectStyles}
                    closeMenuOnSelect={false}
                  />
                  {errorFields.includes("genreIds") && (
                    <FormErrorMessage>
                      At least one genre is required.
                    </FormErrorMessage>
                  )}
                </FormControl>
                <UploadWidget
                  setImageUrl={handleImageUpload}
                  isUploaded={isUploaded}
                  setIsUploaded={setIsUploaded}
                />
                <Button type="submit">Post Game</Button>
              </VStack>
            </form>
          </Box>
        </Flex>
      </Container>
    </Box>
  );
}
