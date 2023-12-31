import { authModalState } from "@/atoms/authModalAtom";
import Link from "next/link";
import React from "react";
import { useSetRecoilState } from "recoil";

type NavbarProps = {};

const Navbar = (props: NavbarProps) => {
  const setAuthModalState = useSetRecoilState(authModalState);

  const handleClick = () => {
    setAuthModalState((prev) => ({ ...prev, isOpen: true }));
  };

  return (
    <>
      <div className="flex items-center justify-between sm:px-12 px-2 md:px-24">
        <Link href={"/"} className="flex items-center justify-center h-20">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="LeetCode Clone" className="h-full" />
        </Link>

        <div className="flex items-center">
          <button
            className="bg-brand-orange px-2 py-1 sm:px-4 rounded-md text-sm font-medium border-2 border-transparent hover:text-brand-orange hover:bg-white hover:border-2 hover:border-brand-orange transition duration-200 ease-in-out"
            onClick={handleClick}
          >
            Sign In
          </button>
        </div>
      </div>
    </>
  );
};

export default Navbar;
