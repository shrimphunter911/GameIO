import { Card, CardBody, Heading, Image } from "@chakra-ui/react";
import { Game } from "../Interfaces/game";
import Rating from "./Rating";

interface Props {
  game: Game;
}

const GameCard = ({ game }: Props) => {
  return (
    <Card borderRadius={10} overflow="hidden">
      <Image objectFit="cover" boxSize="425px" src={game.imageUrl} />
      <CardBody>
        <Heading fontSize="2xl">{game.title}</Heading>
        <Rating value={game.avg_rating}></Rating>
      </CardBody>
    </Card>
  );
};

export default GameCard;
