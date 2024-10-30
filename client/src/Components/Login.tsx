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
import { loginUser } from "../Services/authUser";
import { Link } from "react-router-dom";
import { useUserContext } from "../Contexts/userContext";
import Cookies from "universal-cookie";

const Login = () => {
  const cookies = new Cookies();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isError, setIsError] = useState(false);
  const { userDispatch } = useUserContext();

  const isEmailValid = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPasswordValid = (password: string) => password.length >= 8;

  const isFormValid =
    isEmailValid(formData.email) && isPasswordValid(formData.password);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();

    if (isFormValid) {
      try {
        const response = await loginUser(formData);
        userDispatch({ type: "login", payload: response });
        const date = new Date();
        date.setDate(date.getDate() + 3);
        cookies.set("x-auth-token", response, { expires: date });
        setFormData({ email: "", password: "" });
      } catch (err) {
        setError("Login failed. Please try again.");
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
      <form onSubmit={handleLogin}>
        <Heading padding="20px" fontSize="4xl">
          Login
        </Heading>
        <Stack padding="10px" spacing={7} boxSize={450}>
          {isError && (
            <Alert borderRadius={10} status="error">
              <AlertIcon />
              <AlertTitle>{error}</AlertTitle>
            </Alert>
          )}
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
            Login
          </Button>
          <HStack justify="center">
            <Text>Not a user?</Text>
            <Link to="/signup">
              <Button variant="link" colorScheme="blue">
                Sign up
              </Button>
            </Link>
          </HStack>
        </Stack>
      </form>
    </Flex>
  );
};

export default Login;
