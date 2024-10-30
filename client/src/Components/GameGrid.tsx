import { SimpleGrid } from "@chakra-ui/react";
import { useGamesContext } from "../Contexts/gamesContext";
import { Link } from "react-router-dom";
import GameCard from "./GameCard";

const GameGrid = () => {
  const { gamesState } = useGamesContext();
  const games = gamesState.games;
  return (
    <SimpleGrid
      columns={{ sm: 2, md: 2, lg: 3, xl: 3 }}
      padding="20px"
      spacing={20}
    >
      {games.map((game) => (
        <Link key={game.id} to={`/games/${game.id}`}>
          <GameCard key={game.id} game={game}></GameCard>
        </Link>
      ))}
    </SimpleGrid>
  );
};

export default GameGrid;
