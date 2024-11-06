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
  const releaseYear = new Date(game.releaseDate).getFullYear();

  return (
    <Card borderRadius={10} overflow="hidden">
      <Flex position="relative">
        <Image objectFit="cover" boxSize="425px" src={game.imageUrl} />
        {
          <Box
            position="absolute"
            top={2}
            left={2}
            bg="rgba(208, 50, 50, 0.9)"
            color="white"
            px={2}
            py={1}
            borderRadius="md"
            fontSize="md"
            fontWeight="bold"
          >
            {releaseYear}
          </Box>
        }
        {game?.avg_rating ? (
          <Box
            position="absolute"
            bottom={2}
            right={2}
            bg="rgba(255, 0, 0, 0.9)"
            color="white"
            px={2}
            py={2}
            borderRadius="lg"
            fontSize="lg"
            fontWeight="bold"
            display="flex"
            alignItems="center"
            justifyContent="center"
            style={{
              clipPath:
                "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
            }}
          >
            {Number(game.avg_rating).toFixed(1)}
          </Box>
        ) : null}
      </Flex>
      <CardBody>
        <Heading fontSize="2xl">{game.title}</Heading>
        <Text fontSize="md">{game.publisher}</Text>
      </CardBody>
    </Card>
  );
};

export default GameCard;
