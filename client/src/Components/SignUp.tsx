import {
  Button,
  Flex,
  Heading,
  HStack,
  Input,
  Stack,
  Text,
  FormControl,
  FormErrorMessage,
} from "@chakra-ui/react";
import { FormEvent, useState } from "react";
import { createUser } from "../Services/createUser";
import { Link } from "react-router-dom";
import { useUserContext } from "../Contexts/userContext";
import Cookies from "universal-cookie";
import { showToast } from "../Services/showToast";

const SignUp = () => {
  const cookies = new Cookies();
  const { userDispatch } = useUserContext();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isError, setIsError] = useState(false);

  const isEmailValid = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPasswordValid = (password: string) => password.length >= 8;

  const isFormValid =
    formData.name.trim() !== "" &&
    isEmailValid(formData.email) &&
    isPasswordValid(formData.password);

  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();

    if (isFormValid) {
      try {
        const response = await createUser(formData);
        const date = new Date();
        date.setDate(date.getDate() + 3);
        await cookies.set("x-auth-token", response, { expires: date });
        userDispatch({ type: "login", payload: response });
        setFormData({ name: "", email: "", password: "" });
        showToast("success", "Sign Up successful", "Sign UP");
      } catch (err: any) {
        setError(err.message);
        setIsError(true);
        showToast("error", error, "Sign Up");
      }
    } else {
      setError("Please fill in all fields correctly.");
      setIsError(true);
      showToast("error", "Please fill in all fields correctly.", "Sign Up");
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [event.target.id]: event.target.value });
    if (isError) {
      setError("");
      setIsError(false);
    }
  };

  return (
    <Flex alignItems="center" justifyContent="center">
      <form onSubmit={handleSignup}>
        <Heading padding="20px" fontSize="4xl">
          Create a user
        </Heading>
        <Stack padding="10px" spacing={7} boxSize={450}>
          <FormControl isInvalid={isError && formData.name.trim() === ""}>
            <Input
              id="name"
              value={formData.name}
              onChange={handleChange}
              variant="outline"
              placeholder="Name"
            />
            <FormErrorMessage>Name is required.</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={isError && !isEmailValid(formData.email)}>
            <Input
              id="email"
              value={formData.email}
              onChange={handleChange}
              variant="outline"
              placeholder="Email"
            />
            <FormErrorMessage>Valid email is required.</FormErrorMessage>
          </FormControl>
          <FormControl
            isInvalid={isError && !isPasswordValid(formData.password)}
          >
            <Input
              id="password"
              value={formData.password}
              onChange={handleChange}
              type="password"
              variant="outline"
              placeholder="Password"
            />
            <FormErrorMessage>
              Password must be at least 8 characters.
            </FormErrorMessage>
          </FormControl>
          <Button type="submit" colorScheme="blue">
            Sign Up
          </Button>
          <HStack justify="center">
            <Text>Already a user?</Text>
            <Link to="/login">
              <Button variant="link" colorScheme="blue">
                Login
              </Button>
            </Link>
          </HStack>
        </Stack>
      </form>
    </Flex>
  );
};

export default SignUp;
