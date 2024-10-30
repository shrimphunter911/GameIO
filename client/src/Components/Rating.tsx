import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import { Box, HStack, Text } from "@chakra-ui/react";

interface RatingProps {
  value: number;
  max?: number;
  size?: number;
  color?: string;
}

export default function Rating({
  value,
  max = 5,
  size = 24,
  color = "gold",
}: RatingProps) {
  const stars = Array.from({ length: max }, (_, index) => {
    const number = index + 0.5;

    return (
      <Box key={index} aria-label={`${value} out of ${max} stars`}>
        {value >= index + 1 ? (
          <FaStar size={size} color={color} />
        ) : value >= number ? (
          <FaStarHalfAlt size={size} color={color} />
        ) : (
          <FaStar size={size} color="#e4e5e9" />
        )}
      </Box>
    );
  });

  return (
    <HStack spacing={1} align="center">
      {stars}
    </HStack>
  );
}
