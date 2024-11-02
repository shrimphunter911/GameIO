import { useState } from "react";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import { Box, HStack } from "@chakra-ui/react";

interface InteractiveRatingProps {
  initialRating?: number;
  max?: number;
  size?: number;
  color?: string;
}

export default function InteractiveRating({
  initialRating = 0,
  max = 5,
  size = 24,
  color = "gold",
}: InteractiveRatingProps) {
  const [rating, setRating] = useState(initialRating);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);

  const handleMouseEnter = (index: number) => setHoveredRating(index + 1);
  const handleMouseLeave = () => setHoveredRating(null);
  const handleClick = (index: number) => setRating(index + 1);

  const stars = Array.from({ length: max }, (_, index) => {
    const isFullStar = (hoveredRating ?? rating) >= index + 1;
    const isHalfStar = (hoveredRating ?? rating) >= index + 0.5 && !isFullStar;

    return (
      <Box
        key={index}
        onMouseEnter={() => handleMouseEnter(index)}
        onMouseLeave={handleMouseLeave}
        onClick={() => handleClick(index)}
        cursor="pointer"
        aria-label={`${rating} out of ${max} stars`}
      >
        {isFullStar ? (
          <FaStar size={size} color={color} />
        ) : isHalfStar ? (
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
