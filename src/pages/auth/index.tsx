import Navbar from "@/components/Navbar";
import React from "react";

type AuthPageProps = {};

const AuthPage = (props: AuthPageProps) => {
  return (
    <>
      <div className="bg-gradient-to-b from-gray-600 to-black h-screen relative">
        <div className="max-w-7xl mx-auto">
          <Navbar />

          <div className="flex items-center justify-center h-[calc(100vh-5rem)] pointer-events-none select-none">
            <img src="/hero.png" alt="Hero Image" />
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthPage;
