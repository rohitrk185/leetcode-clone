import { TAuthModalState, authModalState } from "@/atoms/authModalAtom";
import React, { useRef, useState } from "react";
import { useSetRecoilState } from "recoil";

type Props = {};

function Signup({}: Props) {
  const setAuthModalState = useSetRecoilState(authModalState);

  //   const [inputs, setInputs] = useState({
  //     email: "",
  //     displayName: "",
  //     password: ""
  //   });
  const inputEmailRef: any = useRef(null);
  const inputDisplayNameRef: any = useRef(null);
  const inputPasswordRef: any = useRef(null);

  const handleClick = (type: TAuthModalState["type"]) => {
    setAuthModalState((prev) => ({ ...prev, type }));
  };

  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log({
      email: inputEmailRef?.current?.value,
      displayName: inputDisplayNameRef?.current?.value,
      password: inputPasswordRef?.current?.value
    });
  };

  return (
    <>
      <form className="space-y-6 px-6 py-4" onSubmit={handleRegister}>
        <h3 className="text-xl font-medium text-white">
          Register to LeetClone
        </h3>

        <div>
          <label
            htmlFor="email"
            className="text-sm font-medium block mb-2 text-gray-300"
          >
            Email
          </label>
          <input
            ref={inputEmailRef}
            type="email"
            name="email"
            id="email"
            className="border-2 outline-none sm:text-sm rounded-lg focus:ring-blue-500 focus:bg-blue-500 block w-full p-2.5 bg-gray-600 border-gray-500 placeholder-gray-400 text-white"
            placeholder="name@company.com"
          />
        </div>

        <div>
          <label
            htmlFor="name"
            className="text-sm font-medium block mb-2 text-gray-300"
          >
            Display Name
          </label>
          <input
            ref={inputDisplayNameRef}
            type="text"
            name="name"
            id="name"
            className="border-2 outline-none sm:text-sm rounded-lg focus:ring-blue-500 focus:bg-blue-500 block w-full p-2.5 bg-gray-600 border-gray-500 placeholder-gray-400 text-white"
            placeholder="John Doe"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="text-sm font-medium block mb-2 text-gray-300"
          >
            Password
          </label>
          <input
            ref={inputPasswordRef}
            type="password"
            name="password"
            id="password"
            className="border-2 outline-none sm:text-sm rounded-lg focus:ring-blue-500 focus:bg-blue-500 block w-full p-2.5 bg-gray-600 border-gray-500 placeholder-gray-400 text-white"
            placeholder="********"
          />
        </div>

        <button
          type="submit"
          className="w-full text-white focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-brand-orange hover:bg-brand-orange-s"
        >
          Register
        </button>
        {/* <button className="flex w-full justify-end">
          <a
            href="#"
            className="text-sm block text-brand-orange hover:underlinew-full text-right"
          >
            Forgot Password?
          </a>
        </button> */}

        <div className="text-sm font-medium text-gray-300">
          Already have an Account?{" "}
          <a
            className="text-blue-700 hover:underline cursor-pointer"
            onClick={() => handleClick("login")}
          >
            Login
          </a>
        </div>
      </form>
    </>
  );
}

export default Signup;
