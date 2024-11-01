import {
  Button,
  Card,
  CardBody,
  Heading,
  HStack,
  Image,
  Text,
} from "@chakra-ui/react";
import { Game } from "../Interfaces/game";
import Rating from "./Rating";
import { Link } from "react-router-dom";

interface Props {
  game: Game;
}

const MyGameCard = ({ game }: Props) => {
  return (
    <Card borderRadius={10} overflow="hidden">
      <Image objectFit="cover" boxSize="425px" src={game.imageUrl} />
      <CardBody>
        <Heading fontSize="2xl">{game.title}</Heading>
        <HStack justifyContent="space-between">
          {game.avg_rating ? (
            <Rating value={game.avg_rating}></Rating>
          ) : (
            <Text> Not rated yet</Text>
          )}
          <Link key={game.id} to={`/games/edit/${game.id}`}>
            <Button>Edit</Button>
          </Link>
        </HStack>
      </CardBody>
    </Card>
  );
};

export default MyGameCard;
