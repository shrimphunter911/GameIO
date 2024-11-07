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
import { loginUser } from "../Services/authUser";
import { Link } from "react-router-dom";
import { useUserContext } from "../Contexts/userContext";
import Cookies from "universal-cookie";
import { showToast } from "../Services/showToast";

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
        const date = new Date();
        date.setDate(date.getDate() + 3);
        await cookies.set("x-auth-token", response, { expires: date });
        userDispatch({ type: "login", payload: response });
        setFormData({ email: "", password: "" });
        showToast("success", "Login successful", "Login");
      } catch (err: any) {
        setError(err.message);
        setIsError(true);
        showToast("error", err.message, "Login");
      }
    } else {
      setError("Please fill in all fields correctly.");
      setIsError(true);
      showToast("error", "Please fill in all fields correctly.", "Login");
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
