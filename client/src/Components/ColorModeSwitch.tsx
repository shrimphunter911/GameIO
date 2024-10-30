import { Button, HStack, useColorMode } from "@chakra-ui/react";
import { SunMoon } from "lucide-react";

const ColorModeSwitch = () => {
  const { toggleColorMode } = useColorMode();

  return (
    <HStack>
      <Button onClick={toggleColorMode}>
        {" "}
        <SunMoon />
      </Button>
    </HStack>
  );
};

export default ColorModeSwitch;
