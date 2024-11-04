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
import Rating from "./Rating";
import { Link, useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import ConfirmDeleteDialog from "./ConfirmDeleteDialog";
import { deleteGame } from "../Services/deleteGame";
import { useUserContext } from "../Contexts/userContext";
import { useGamesContext } from "../Contexts/gamesContext";
import { showToast } from "../Services/showToast";

interface Props {
  game: Game;
}

const MyGameCard = ({ game }: Props) => {
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { userState } = useUserContext();
  const { gamesState, gamesDispatch } = useGamesContext();
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      const response = await deleteGame(userState.token, game.id);
      gamesDispatch({
        type: "setGames",
        payload: gamesState.games.filter((item) => item.id !== game.id),
      });
      setDeleteDialogOpen(false);
    } catch (error: any) {
      setError(error.message);
      showToast("error", error, "Delete Game");
    } finally {
      showToast("success", "Successfully removed", "Delete Game");
      navigate("/");
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
        {game.avg_rating ? (
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
        <HStack justifyContent="space-between">
          <HStack>
            <Link key={game.id} to={`/games/edit/${game.id}`}>
              <Button>Edit</Button>
            </Link>
            <Button onClick={handleTrashClick}>
              <Trash2 />
            </Button>
          </HStack>
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
