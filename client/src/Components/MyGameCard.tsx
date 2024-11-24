import {
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  Heading,
  HStack,
  Image,
  Text,
} from "@chakra-ui/react";
import { Game } from "../Interfaces/game";
import { Link, useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import ConfirmDeleteDialog from "./ConfirmDeleteDialog";
import { deleteGame } from "../Services/deleteGame";
import { useUserContext } from "../Contexts/userContext";
import { useGamesContext } from "../Contexts/gamesContext";
import { showToast } from "../Services/showToast";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../State/store";
import { removeGame } from "../State/gamesSlice";

interface Props {
  game: Game;
}

const MyGameCard = ({ game }: Props) => {
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { userState } = useUserContext();
  // const { gamesState, gamesDispatch } = useGamesContext();
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const releaseYear = new Date(game.releaseDate).getFullYear();

  const handleDelete = async () => {
    try {
      const response = await deleteGame(userState.token, game.id);
      dispatch(removeGame(game.id!));
      setDeleteDialogOpen(false);
      showToast("success", "Successfully removed", "Delete Game");
      navigate("/");
    } catch (error: any) {
      setError(error.message);
      showToast("error", error, "Delete Game");
    }
  };

  const handleTrashClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    setDeleteDialogOpen(true);
  };

  return (
    <Card borderRadius={10} overflow="hidden">
      <Flex position="relative">
        <Image objectFit="cover" boxSize="425px" src={game.imageUrl} />

        {/* Display Release Year */}
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

        {/* Display Rating */}
        {game.avg_rating ? (
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
        <Text fontSize="md" mb={4}>
          {game.publisher}
        </Text>

        {/* Edit and Trash buttons with original styles */}
        <HStack justify="space-between" align="center">
          <Link key={game.id} to={`/games/edit/${game.id}`}>
            <Button colorScheme="teal" variant="outline">
              Edit
            </Button>
          </Link>
          <Button
            onClick={handleTrashClick}
            colorScheme="red"
            variant="outline"
          >
            <Trash2 />
          </Button>
        </HStack>
      </CardBody>

      <ConfirmDeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onDelete={handleDelete}
      />
    </Card>
  );
};

export default MyGameCard;
