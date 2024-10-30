import { Card, CardBody, Heading, Image, Text } from "@chakra-ui/react";
import { Game } from "../Interfaces/game";

interface Props {
  game: Game;
}

const GameCard = ({ game }: Props) => {
  return (
    <Card borderRadius={10} overflow="hidden">
      <Image objectFit="cover" boxSize="425px" src={game.imageUrl} />
      <CardBody>
        <Heading fontSize="2xl">{game.title}</Heading>
        <Text>{game.avg_rating}</Text>
      </CardBody>
    </Card>
  );
};

export default GameCard;
