import { TAuthModalState, authModalState } from "@/atoms/authModalAtom";
import { auth } from "@/firebase/firebase";
import { useRouter } from "next/router";
import React, { useEffect, useRef } from "react";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { useSetRecoilState } from "recoil";

type Props = {};

function Login({}: Props) {
  const setAuthModalState = useSetRecoilState(authModalState);

  const router = useRouter();
  const [signInWithEmailAndPassword, user, loading, error] =
    useSignInWithEmailAndPassword(auth);

  const inputEmailRef: any = useRef(null);
  const inputPasswordRef: any = useRef(null);

  const handleClick = (type: TAuthModalState["type"]) => {
    setAuthModalState((prev) => ({ ...prev, type }));
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const email = inputEmailRef?.current?.value;
      const password = inputPasswordRef?.current?.value;

      if (!email || !password) return alert("Please fill all the fields");

      const newUser = signInWithEmailAndPassword(email, password);
      if (!newUser) return;

      router.push("/");
    } catch (error: any) {
      alert(error.message);
    }
  };

  useEffect(() => {
    if (!error) return;

    alert(error.message);
  }, [error]);

  return (
    <>
      <form className="space-y-6 px-6 py-4" onSubmit={handleLogin}>
        <h3 className="text-xl font-medium text-white">Sign in to LeetClone</h3>

        <div>
          <label
            htmlFor="email"
            className="text-sm font-medium block mb-2 text-gray-300"
          >
            Your Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            ref={inputEmailRef}
            className="border-2 outline-none sm:text-sm rounded-lg focus:ring-blue-500 focus:bg-blue-500 block w-full p-2.5 bg-gray-600 border-gray-500 placeholder-gray-400 text-white"
            placeholder="name@company.com"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="text-sm font-medium block mb-2 text-gray-300"
          >
            Your Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            ref={inputPasswordRef}
            className="border-2 outline-none sm:text-sm rounded-lg focus:ring-blue-500 focus:bg-blue-500 block w-full p-2.5 bg-gray-600 border-gray-500 placeholder-gray-400 text-white"
            placeholder="********"
          />
        </div>

        <button
          type="submit"
          className="w-full text-white focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-brand-orange hover:bg-brand-orange-s disabled:bg-brand-orange-s"
          disabled={loading}
        >
          {loading ? "Logging you in..." : "Login"}
        </button>
        <button
          className="flex w-full justify-end"
          onClick={() => handleClick("forgotPassword")}
        >
          <a
            href="#"
            className="text-sm block text-brand-orange hover:underlinew-full text-right"
          >
            Forgot Password?
          </a>
        </button>

        <div className="text-sm font-medium text-gray-300">
          Not Registered?{" "}
          <a
            href="#"
            className="text-blue-700 hover:underline cursor-pointer"
            onClick={() => handleClick("register")}
          >
            Create Account
          </a>
        </div>
      </form>
    </>
  );
}

export default Login;
