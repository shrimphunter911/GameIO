import { FormEvent, useState } from "react";
import { useGenresContext } from "../Contexts/genresContext";
import { Game } from "../Interfaces/game";
import { useGamesContext } from "../Contexts/gamesContext";
import { createGame } from "../Services/createGame";
import { useUserContext } from "../Contexts/userContext";

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

  const isFormValid =
    game.title.trim() !== "" &&
    game.description.trim() !== "" &&
    game.publisher.trim() !== "" &&
    game.imageUrl.trim() !== "" &&
    game.releaseDate.trim() !== "" &&
    game.genreIds.length !== 0;

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
      } catch (error: any) {
        setError(error);
        setIsError(true);
      }
    } else {
      setError("Please fill all the fields properly");
      setIsError(true);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGame({ ...game, [event.target.id]: event.target.value });
    if (isError) {
      setError("");
      setIsError(false);
    }
  };
  return <div>PostGame</div>;
};

export default PostGame;
