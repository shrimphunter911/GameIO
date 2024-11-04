import {
  Box,
  Card,
  CardBody,
  Flex,
  Heading,
  Image,
  Text,
} from "@chakra-ui/react";
import { Game } from "../Interfaces/game";

interface Props {
  game: Game;
}

const GameCard = ({ game }: Props) => {
  return (
    <Card borderRadius={10} overflow="hidden">
      <Flex position="relative">
        <Image objectFit="cover" boxSize="425px" src={game.imageUrl} />
        {game?.avg_rating ? (
          <Box
            position="absolute"
            bottom={2}
            right={2}
            bg="red.500"
            color="white"
            px={2}
            py={2}
            borderRadius="md"
            fontSize="lg"
            fontWeight="bold"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            {Number(game.avg_rating).toFixed(1)}
          </Box>
        ) : null}
      </Flex>
      <CardBody>
        <Heading fontSize="2xl">{game.title}</Heading>
      </CardBody>
    </Card>
  );
};

export default GameCard;
