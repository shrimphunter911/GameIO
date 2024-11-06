import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";
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
  useColorModeValue,
  List,
  ListItem,
  Alert,
  AlertIcon,
  AlertTitle,
  HStack,
  Card,
  CardBody,
  Divider,
  Button,
  Textarea,
  Badge,
  Spinner,
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
  const [loading, setLoading] = useState(true);
  const [review, setReview] = useState<Review>({
    gameId: Number(params.gameId),
    review: "",
    rated: 0,
  });
  const [isEditing, setIsEditing] = useState(false);
  const { userState } = useUserContext();
  const navigate = useNavigate();

  const getDetails = async () => {
    const controller = new AbortController();
    const getGame = async () => {
      setLoading(true);
      try {
        const data = await fetchGame(controller.signal, params);
        setGame(data);
        setReviews(data.reviews || []);
      } catch (err: any) {
        if (err.message !== "Request canceled") setError(err.message);
      } finally {
        setLoading(false);
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
      getDetails();
      showToast("success", "Review posted", "Review");
    } catch (error: any) {
      setError(error.message);
      showToast("error", error, "Review");
    }
  };

  const handleUpdateReview = async () => {
    try {
      const result = await updateReview(userState.token, params, review);
      setReview(result);
      getDetails();
      showToast("success", "Review updated", "Review");
    } catch (error: any) {
      setError(error.message);
      showToast("error", error, "Review");
    }
  };

  const handleRatingChange = (newRating: number) => {
    setReview((prevReview) => ({ ...prevReview, rated: newRating }));
  };

  const handleReviewTextChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setReview((prevReview) => ({ ...prevReview, review: e.target.value }));
  };

  const convertDate = (givenDate: string) => {
    return format(new Date(givenDate), "MMM dd, yyyy");
  };

  const getGenres = (genreIds: number[]) => {
    const genreNames = genresState.genres
      .filter((genre) => genreIds.includes(genre.id))
      .map((genre) => genre.name);
    return genreNames;
  };

  function formatDateTime(dateString: string) {
    return format(new Date(dateString), "hh:mm a, dd MMM, yyyy");
  }

  const redirectNotLoggedIn = () => {
    showToast("error", "Please log in first", "Not Logged In");
    navigate("/login");
  };

  return (
    <>
      {loading ? (
        <Flex justify="center" align="center" minH="100vh">
          <Spinner size="xl" />
        </Flex>
      ) : err ? (
        <Alert borderRadius={10} status="error">
          <AlertIcon />
          <AlertTitle>{err}</AlertTitle>
        </Alert>
      ) : game ? (
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

              <Stack spacing={{ base: 4, sm: 6 }} direction={"column"}>
                <VStack spacing={{ base: 4, sm: 6 }}></VStack>
                <Box>
                  <Text
                    fontSize={{ base: "16px", lg: "18px" }}
                    color={useColorModeValue("yellow.500", "yellow.300")}
                    fontWeight={"500"}
                    mb={"4"}
                  >
                    {convertDate(game?.releaseDate)}
                  </Text>

                  <List spacing={2}>
                    <ListItem>
                      <Text as={"span"} fontWeight={"bold"}>
                        Description:
                      </Text>{" "}
                      {game?.description}
                    </ListItem>
                  </List>
                  <HStack
                    paddingTop={4}
                    spacing={2}
                    justifyContent="flex-start"
                  >
                    {getGenres(game?.genreIds).map((genre, index) => (
                      <Badge
                        key={index}
                        borderRadius="20rem"
                        px={4}
                        py={2}
                        bg="teal.500"
                        color="white"
                      >
                        <Text as={"span"}>{genre}</Text>
                      </Badge>
                    ))}
                  </HStack>
                </Box>
              </Stack>
            </Stack>
          </SimpleGrid>

          <Box mt={10}>
            <Heading size="md" mb={4}>
              Reviews
            </Heading>
            <Box
              maxH="500px"
              overflowY="auto"
              borderRadius="lg"
              borderWidth="1px"
            >
              <Stack spacing={4} p={4}>
                {reviews.length ? (
                  reviews.map((review) => (
                    <Card key={review.id} boxShadow="md" borderRadius="lg">
                      <CardBody>
                        <Flex>
                          <VStack align="start" width="30%" pr={4}>
                            <Text fontWeight="bold">{review.name}</Text>
                            <Rating value={review.rated} />
                          </VStack>
                          <VStack align="start" width="70%">
                            <Text>{review.review}</Text>
                          </VStack>
                        </Flex>
                      </CardBody>
                      <Divider />
                      <Box p={2} textAlign="right">
                        <Text fontSize="sm" color="gray.500">
                          {formatDateTime(review.createdAt!)}
                        </Text>
                      </Box>
                    </Card>
                  ))
                ) : (
                  <Text>No reviews yet</Text>
                )}
              </Stack>
            </Box>
          </Box>

          {userState.token ? (
            <Box mt={10}>
              <Heading size="md" mb={4}>
                Rate & Review
              </Heading>
              <InteractiveRating
                initialRating={review.rated || 0}
                onChange={handleRatingChange}
              />

              <Textarea
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
          ) : (
            <Box mt={10}>
              <Heading size="md" mb={4}>
                Rate & Review
              </Heading>
              <InteractiveRating initialRating={0} />

              <Textarea placeholder="Write your review here..." mt={4} />
              <Button mt={4} colorScheme="blue" onClick={redirectNotLoggedIn}>
                Submit Review
              </Button>
            </Box>
          )}
        </Container>
      ) : (
        <Alert borderRadius={10} status="error">
          <AlertIcon />
          <AlertTitle>No game found</AlertTitle>
        </Alert>
      )}
    </>
  );
};

export default GameView;
