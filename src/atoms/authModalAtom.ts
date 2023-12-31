import { atom } from "recoil";

export type TAuthModalState = {
  isOpen: boolean;
  type: "login" | "register" | "forgotPassword";
};

const initialAuthModalState: TAuthModalState = {
  isOpen: false,
  type: "login"
};

export const authModalState = atom<TAuthModalState>({
  key: "authModalState",
  default: initialAuthModalState
});
