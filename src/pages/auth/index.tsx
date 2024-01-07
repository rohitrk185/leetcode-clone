import { authModalState } from "@/atoms/authModalAtom";
import AuthModal from "@/components/Modals/AuthModal";
import Navbar from "@/components/Navbar";
import { auth } from "@/firebase/firebase";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilValue } from "recoil";

type AuthPageProps = {};

const AuthPage = (props: AuthPageProps) => {
  const router = useRouter();

  const authModal = useRecoilValue(authModalState);
  const [user, loading, error] = useAuthState(auth);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    if (user) {
      router.push("/");
    } else if (!loading && !user) {
      setPageLoading(false);
    }
  }, [user, router, loading]);

  if (pageLoading) return null;

  return (
    <>
      <div className="bg-gradient-to-b from-gray-600 to-black h-screen relative">
        <div className="max-w-7xl mx-auto">
          <Navbar />

          <div className="flex items-center justify-center h-[calc(100vh-5rem)] pointer-events-none select-none">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/hero.png" alt="Hero Image" />
          </div>

          {authModal.isOpen ? <AuthModal /> : null}
        </div>
      </div>
    </>
  );
};

export default AuthPage;
