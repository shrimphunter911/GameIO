import { Button, HStack } from "@chakra-ui/react";
import ColorModeSwitch from "./ColorModeSwitch";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import { CirclePlus, House, Library, LogOut } from "lucide-react";
import { showToast } from "../Services/showToast";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../State/store";
import { logout } from "../State/userSlice";

const NavBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cookies = new Cookies();
  const user = useSelector((state: RootState) => state.user.token);
  const handleLogout = async () => {
    try {
      await cookies.remove("x-auth-token");
      dispatch(logout());
      showToast("success", "Successfully Logged Out", "Log Out");
      navigate("/");
    } catch (error: any) {
      showToast("error", error.message, "Logout");
    }
  };

  return (
    <HStack justifyContent="space-between" padding="20px">
      <Link to="/">
        <Button>
          <House />
        </Button>
      </Link>
      <HStack>
        <ColorModeSwitch />
        {user ? (
          <>
            <Link to="/games/mygames">
              <Button>
                <Library />
              </Button>
            </Link>
            <Link to="/games/post">
              <Button>
                <CirclePlus />
              </Button>
            </Link>
            <Button onClick={handleLogout}>
              <LogOut />
            </Button>
          </>
        ) : (
          <Link to="/login">
            <Button colorScheme="orange">Login</Button>
          </Link>
        )}
      </HStack>
    </HStack>
  );
};

export default NavBar;
