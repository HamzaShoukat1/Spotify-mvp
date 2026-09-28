import  {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type Gender = "Male" | "Female"  | "Prefer not to say" | "";

interface SignupData {
  email: string;
  password: string;
  gender: Gender;
  name: string;
}

interface SignupContextType {
  signupData: SignupData;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setGender: (gender: Gender) => void;
  setName: (name: string) => void;

  resetSignup: () => void;
}

const initialSignupData: SignupData = {
  email: "",
  password: "",
  gender: "",
  name: "",
};

const SignupContext = createContext<SignupContextType | undefined>(
  undefined
);

export function SignupProvider({ children }: { children: ReactNode }) {
  const [signupData, setSignupData] =
    useState<SignupData>(initialSignupData);

  const setEmail = (email: string) => {
    setSignupData((prev) => ({
      ...prev,
      email,
    }));
  };

  const setPassword = (password: string) => {
    setSignupData((prev) => ({
      ...prev,
      password,
    }));
  };

  const setGender = (gender: Gender) => {
    setSignupData((prev) => ({
      ...prev,
      gender,
    }));
  };

  const setName = (name: string) => {
    setSignupData((prev) => ({
      ...prev,
      name,
    }));
  };

  const resetSignup = () => {
    setSignupData(initialSignupData);
  };

  const value = useMemo(
    () => ({
      signupData,
      setEmail,
      setPassword,
      setGender,
      setName,
      resetSignup,
    }),
    [signupData]
  );
  return (
    <SignupContext.Provider value={value}>
      {children}
    </SignupContext.Provider>
  );
}

export function useSignup() {
  const context = useContext(SignupContext);

  if (!context) {
    throw new Error(
      "useSignup must be used inside SignupProvider"
    );
  }

  return context;
}