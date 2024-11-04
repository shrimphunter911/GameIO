import { createStandaloneToast } from "@chakra-ui/react";

const { toast } = createStandaloneToast();

export const showToast = (
  status: "success" | "error" | "loading",
  description: string,
  title: string
) => {
  toast({
    title: title,
    description: description,
    status: status,
    position: "top-right",
    duration: 3000,
    isClosable: true,
  });
};
