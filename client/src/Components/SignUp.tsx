import {
  Alert,
  AlertIcon,
  AlertTitle,
  Button,
  Flex,
  Heading,
  HStack,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import { FormEvent, useState } from "react";
import { creatUser } from "../Services/createUser";
import { Link } from "react-router-dom";

const SignUp = () => {
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
        await creatUser(formData);
        setFormData({ name: "", email: "", password: "" });
      } catch (err: any) {
        setError(err.message);
        setIsError(true);
      }
    } else {
      setError("Please fill in all fields correctly.");
      setIsError(true);
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
          {isError && (
            <Alert borderRadius={10} status="error">
              <AlertIcon />
              <AlertTitle>{error}</AlertTitle>
            </Alert>
          )}
          <Input
            id="name"
            value={formData.name}
            onChange={handleChange}
            variant="outline"
            placeholder="Name"
          />
          <Input
            id="email"
            value={formData.email}
            onChange={handleChange}
            variant="outline"
            placeholder="Email"
          />
          <Input
            id="password"
            value={formData.password}
            onChange={handleChange}
            type="password"
            variant="outline"
            placeholder="Password"
          />
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
