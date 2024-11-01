import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  Box,
  Container,
  Stack,
  Text,
  Image,
  Flex,
  VStack,
  Heading,
  SimpleGrid,
  StackDivider,
  useColorModeValue,
  List,
  ListItem,
  Alert,
  AlertIcon,
  AlertTitle,
} from "@chakra-ui/react";
import { Game } from "../Interfaces/game";
import fetchGame from "../Services/fetchGame";
import Rating from "./Rating";
import { useGenresContext } from "../Contexts/genresContext";
const GameView = () => {
  const { genresState } = useGenresContext();
  const params = useParams<{ gameId: string }>();
  const [game, setGame] = useState<Game>();
  const [err, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    const getGame = async () => {
      try {
        const data = await fetchGame(controller.signal, params);
        setGame(data);
      } catch (err: any) {
        if (err.message !== "Request canceled") setError(err.message);
      }
    };

    getGame();

    return () => controller.abort();
  }, []);

  const convertDate = (givenDate: string) => {
    const date = new Date(givenDate);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getGenres = (genreIds: number[]) => {
    const genreNames = genresState.genres.map((genre) => {
      if (genreIds.includes(genre.id)) {
        return genre.name;
      }
    });

    return genreNames;
  };

  return (
    <>
      {err && (
        <Alert borderRadius={10} status="error">
          <AlertIcon />
          <AlertTitle>{err}</AlertTitle>
        </Alert>
      )}
      {game ? (
        <Container maxW={"7xl"}>
          <SimpleGrid
            columns={{ base: 1, lg: 2 }}
            spacing={{ base: 8, md: 10 }}
            py={{ base: 18, md: 24 }}
          >
            <Flex>
              <Image
                rounded={"md"}
                alt={"product image"}
                src={game?.imageUrl}
                fit={"cover"}
                align={"center"}
                w={"100%"}
                h={{ base: "100%", sm: "400px", lg: "500px" }}
              />
            </Flex>
            <Stack spacing={{ base: 6, md: 10 }}>
              <Box as={"header"}>
                <Heading
                  lineHeight={1.1}
                  fontWeight={600}
                  fontSize={{ base: "2xl", sm: "4xl", lg: "5xl" }}
                >
                  {game?.title}
                </Heading>
                <Text
                  color={useColorModeValue("gray.900", "gray.400")}
                  fontWeight={300}
                  fontSize={"2xl"}
                >
                  {game?.publisher}
                </Text>
              </Box>

              <Stack
                spacing={{ base: 4, sm: 6 }}
                direction={"column"}
                divider={
                  <StackDivider
                    borderColor={useColorModeValue("gray.200", "gray.600")}
                  />
                }
              >
                <VStack spacing={{ base: 4, sm: 6 }}>
                  {game?.avg_rating ? (
                    <Rating value={game?.avg_rating}></Rating>
                  ) : (
                    <Text>Not rated yet</Text>
                  )}
                </VStack>
                <Box>
                  <Text
                    fontSize={{ base: "16px", lg: "18px" }}
                    color={useColorModeValue("yellow.500", "yellow.300")}
                    fontWeight={"500"}
                    textTransform={"uppercase"}
                    mb={"4"}
                  >
                    {convertDate(game?.releaseDate)}
                  </Text>

                  <List spacing={2}>
                    {getGenres(game?.genreIds).map((genre) => (
                      <ListItem>
                        <Text as={"span"} fontWeight={"bold"}>
                          {genre}
                        </Text>
                      </ListItem>
                    ))}
                    <ListItem>
                      <Text as={"span"} fontWeight={"bold"}>
                        Decription:
                      </Text>{" "}
                      {game?.description}
                    </ListItem>
                  </List>
                </Box>
              </Stack>
            </Stack>
          </SimpleGrid>
        </Container>
      ) : (
        <Alert borderRadius={10} status="error">
          <AlertIcon />
          <AlertTitle>No game found with the id</AlertTitle>
        </Alert>
      )}
    </>
  );
};

export default GameView;
