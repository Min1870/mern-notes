import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";

interface UserContextType {
  userInfo: UserContext | null;
  setUserInfo: React.Dispatch<React.SetStateAction<UserContext | null>>;
}

interface UserContext {
  _id: string;
  fullName: string;
  email: string;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserContextProvider = ({ children }: PropsWithChildren) => {
  const [userInfo, setUserInfo] = useState<UserContext | null>(null);
  // const navigate = useNavigate();

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const response = await axiosInstance.get("/api/user");
        if (response.data) {
          setUserInfo(response.data);
        }
      } catch (error: any) {
        if (error.response.status === 401) {
          localStorage.clear();
          // navigate("/login");
        }
      }
    };

    getUserInfo();
  }, []);

  return (
    <UserContext.Provider value={{ userInfo, setUserInfo }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserContextProvider");
  }
  return context;
};
