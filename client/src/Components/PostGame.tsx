import React, { FormEvent, useState } from "react";
import Select from "react-select";
import { Alert, AlertIcon, AlertTitle } from "@chakra-ui/react";
import { useGenresContext } from "../Contexts/genresContext";
import { Game } from "../Interfaces/game";
import { useGamesContext } from "../Contexts/gamesContext";
import { createGame } from "../Services/createGame";
import { useUserContext } from "../Contexts/userContext";
import "./PostGame.css";

interface GenreOption {
  value: number;
  label: string;
}

const PostGame = () => {
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

  return (
    <div className="post-game-container">
      <form onSubmit={handlePostGame} className="post-game-form">
        <h1 className="post-game-heading">Post a New Game</h1>
        {isError && (
          <Alert status="error" borderRadius={10} marginBottom={4}>
            <AlertIcon />
            <AlertTitle>{error}</AlertTitle>
          </Alert>
        )}
        <input
          id="title"
          className="post-game-input"
          value={game.title}
          onChange={handleChange}
          placeholder="Title"
        />
        <textarea
          id="description"
          className="post-game-input post-game-textarea"
          value={game.description}
          onChange={handleChange}
          placeholder="Description"
        />
        <input
          id="publisher"
          className="post-game-input"
          value={game.publisher}
          onChange={handleChange}
          placeholder="Publisher"
        />
        <input
          id="releaseDate"
          className="post-game-input"
          value={game.releaseDate}
          type="datetime-local"
          onChange={handleChange}
          placeholder="Release Date (YYYY-MM-DD)"
        />
        <input
          id="imageUrl"
          className="post-game-input"
          value={game.imageUrl}
          onChange={handleChange}
          placeholder="Image URL"
        />
        <Select
          isMulti
          name="genres"
          options={genreOptions}
          className="post-game-select"
          classNamePrefix="select"
          onChange={handleGenreChange}
          placeholder="Select Genres"
          aria-label="Select Genres"
        />
        <button type="submit" className="post-game-button">
          Post Game
        </button>
      </form>
    </div>
  );
};

export default PostGame;
