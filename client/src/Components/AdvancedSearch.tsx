import React from "react";
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Input,
  VStack,
  Text,
  HStack,
  useDisclosure,
  Select,
} from "@chakra-ui/react";
import { SlidersHorizontal } from "lucide-react";

interface Genre {
  id: number;
  name: string;
}

interface AdvancedSearchDrawerProps {
  input: {
    publisher: string;
    releaseDate: string;
    sortByRating: string;
    genreId: string;
  };
  onChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  onSortChange: (sort: "asc" | "desc") => void;
  genres: Genre[];
}

export default function AdvancedSearchDrawer({
  input,
  onChange,
  onSortChange,
  genres,
}: AdvancedSearchDrawerProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button
        onClick={onOpen}
        size="sm"
        position="absolute"
        right="2"
        top="50%"
        transform="translateY(-50%)"
        zIndex="1"
      >
        <SlidersHorizontal />
      </Button>
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent maxWidth="300px" mt="0">
          <DrawerCloseButton />
          <DrawerHeader>Advanced Search</DrawerHeader>
          <DrawerBody>
            <VStack spacing={4} align="stretch">
              <Input
                placeholder="Publisher"
                id="publisher"
                value={input.publisher}
                onChange={onChange}
              />
              <Text>Release Year:</Text>
              <Select
                placeholder="Select year"
                id="releaseDate"
                value={input.releaseDate}
                onChange={onChange}
              >
                {Array.from({ length: 11 }, (_, i) => 2020 + i).map((year) => (
                  <option key={year} value={year.toString()}>
                    {year}
                  </option>
                ))}
              </Select>
              <Text>Sort by:</Text>
              <HStack>
                <Button
                  onClick={() => onSortChange("asc")}
                  colorScheme={input.sortByRating === "asc" ? "blue" : "gray"}
                >
                  Ascending
                </Button>
                <Button
                  onClick={() => onSortChange("desc")}
                  colorScheme={input.sortByRating === "desc" ? "blue" : "gray"}
                >
                  Descending
                </Button>
              </HStack>
              <Text>Genre:</Text>
              <Select
                placeholder="Select genre"
                id="genreId"
                value={input.genreId}
                onChange={onChange}
              >
                {genres.map((genre) => (
                  <option key={genre.id} value={genre.id.toString()}>
                    {genre.name}
                  </option>
                ))}
              </Select>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
