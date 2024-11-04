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
  HStack,
  Card,
  CardBody,
  CardFooter,
  Divider,
  Button,
  Input,
} from "@chakra-ui/react";
import { Game } from "../Interfaces/game";
import fetchGame from "../Services/fetchGame";
import InteractiveRating from "./InteractiveRating";
import { useGenresContext } from "../Contexts/genresContext";
import { Review } from "../Interfaces/review";
import { getIndividualReview } from "../Services/getIndividualReview";
import { useUserContext } from "../Contexts/userContext";
import { postReview } from "../Services/postReview";
import { updateReview } from "../Services/updateReview";
import Rating from "./Rating";
import { showToast } from "../Services/showToast";

const GameView = () => {
  const { genresState } = useGenresContext();
  const params = useParams<{ gameId: string }>();
  const [game, setGame] = useState<Game>();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [err, setError] = useState("");
  const [review, setReview] = useState<Review>({
    gameId: Number(params.gameId),
    review: "",
    rated: 0,
  });
  const [isEditing, setIsEditing] = useState(false);
  const { userState } = useUserContext();

  const getDetails = async () => {
    const controller = new AbortController();
    const getGame = async () => {
      try {
        const data = await fetchGame(controller.signal, params);
        setGame(data);
        setReviews(data.reviews || []);
      } catch (err: any) {
        if (err.message !== "Request canceled") setError(err.message);
      }
    };

    getGame();
    return () => controller.abort();
  };

  useEffect(() => {
    const fetchReview = async () => {
      if (userState.token) {
        try {
          const response = await getIndividualReview(userState.token, params);
          if (response && response.review) {
            setReview(response);
            setIsEditing(true);
          } else {
            setIsEditing(false);
          }
        } catch (err: any) {
          setError(err.message);
        }
      }
    };

    fetchReview();
  }, [userState.token, params]);

  useEffect(() => {
    getDetails();
  }, []);

  const handlePostReview = async () => {
    try {
      const result = await postReview(userState.token, params, review);
      setReview(result);
      setIsEditing(true);
    } catch (error: any) {
      setError(error.message);
      showToast("error", error, "Review");
    } finally {
      getDetails();
      showToast("success", "Review posted", "Review");
    }
  };

  const handleUpdateReview = async () => {
    try {
      const result = await updateReview(userState.token, params, review);
      setReview(result);
    } catch (error: any) {
      setError(error.message);
      showToast("error", error, "Review");
    } finally {
      getDetails();
      showToast("success", "Review updated", "Review");
    }
  };

  const handleRatingChange = (newRating: number) => {
    setReview((prevReview) => ({ ...prevReview, rated: newRating }));
  };

  const handleReviewTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReview((prevReview) => ({ ...prevReview, review: e.target.value }));
  };

  const convertDate = (givenDate: string) => {
    const date = new Date(givenDate);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
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
            <Flex position="relative">
              <Image
                rounded={"md"}
                alt={"product image"}
                src={game?.imageUrl}
                fit={"cover"}
                align={"center"}
                w={"100%"}
                h={{ base: "100%", sm: "400px", lg: "500px" }}
              />
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
                <VStack spacing={{ base: 4, sm: 6 }}></VStack>
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
                    {getGenres(game?.genreIds).map((genre, index) => (
                      <ListItem key={index}>
                        <Text as={"span"} fontWeight={"bold"}>
                          {genre}
                        </Text>
                      </ListItem>
                    ))}
                    <ListItem>
                      <Text as={"span"} fontWeight={"bold"}>
                        Description:
                      </Text>{" "}
                      {game?.description}
                    </ListItem>
                  </List>
                </Box>
              </Stack>
            </Stack>
          </SimpleGrid>

          <Box mt={10}>
            <Heading size="md" mb={4}>
              Reviews
            </Heading>
            <Box maxH="300px" overflowY="auto">
              <Stack spacing={4}>
                {reviews.length ? (
                  reviews.map((review, index) => (
                    <Card key={index} border="1px" borderColor="gray.200">
                      <CardBody>
                        <HStack justifyContent="space-between">
                          <Rating value={review.rated}></Rating>
                          <Text>{review.review}</Text>
                        </HStack>
                      </CardBody>
                      <Divider />
                      <CardFooter justifyContent="end">
                        <Text fontSize="sm" color="gray.500">
                          {`by ${review.name}`}
                        </Text>
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <Text>No reviews yet</Text>
                )}
              </Stack>
            </Box>
          </Box>

          {userState.token && (
            <Box mt={10}>
              <Heading size="md" mb={4}>
                Rate & Review
              </Heading>
              <InteractiveRating
                initialRating={review.rated || 0}
                onChange={handleRatingChange}
              />

              <Input
                placeholder="Write your review here..."
                value={review.review}
                onChange={handleReviewTextChange}
                mt={4}
              />
              <Button
                mt={4}
                colorScheme="blue"
                onClick={isEditing ? handleUpdateReview : handlePostReview}
              >
                {isEditing ? "Update Review" : "Submit Review"}
              </Button>
            </Box>
          )}
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
