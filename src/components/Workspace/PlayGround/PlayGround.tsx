import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import PreferenceNav from "./PreferenceNav/PreferenceNav";
import Split from "react-split";
import CodeMirror from "@uiw/react-codemirror";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { javascript } from "@codemirror/lang-javascript";
import EditorFooter from "./EditorFooter";
import { Problem } from "@/utils/types/problem";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore } from "@/firebase/firebase";
import { toast } from "react-toastify";
import { problems } from "@/utils/problems";
import { useRouter } from "next/router";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import useLocalStorage from "@/hooks/useLocalStorage";

export interface ISettings {
  fontSize: string;
  settingsModalIsOpen: boolean;
  dropdownIsOpen: boolean;
}

type Props = {
  problem: Problem;
  setSuccess: Dispatch<SetStateAction<boolean>>;
  setSolved: Dispatch<SetStateAction<boolean>>;
};

const PlayGround = ({ problem, setSuccess, setSolved }: Props) => {
  const router = useRouter();
  const [user] = useAuthState(auth);

  const [activeTestCaseId, setActiveTestCaseId] = useState<number>(0);
  const [userCode, setUserCode] = useState<string>(problem.starterCode);
  const [fontSize, setFontSize] = useLocalStorage("lcc-fontSize", "16px");
  const [settings, setSettings] = useState<ISettings>({
    fontSize: fontSize || "16px",
    settingsModalIsOpen: false,
    dropdownIsOpen: false
  });

  const { pid } = router.query;

  useEffect(() => {
    const localStorageCode = localStorage.getItem(`code-${pid}`);
    const savedCode = localStorageCode ? JSON.parse(localStorageCode) : null;
    if (savedCode && user && user?.uid === savedCode.user) {
      setUserCode((prev) => {
        return savedCode ? savedCode.code : prev;
      });
    } else {
      setUserCode(problem.starterCode);
    }
  }, [pid, problem.starterCode, user]);

  const handleSubmit = async () => {
    if (!user) {
      toast.error("Please login to submit your code", {
        position: "top-center",
        autoClose: 3000,
        theme: "dark"
      });
      return;
    }

    try {
      const slicedUserCode = userCode.slice(
        userCode.indexOf(problem.starterFunctionName)
      );
      const cb = new Function(`return ${slicedUserCode}`)();
      const handlerFunction = problems[pid as string].handlerFunction;
      if (typeof handlerFunction !== "function") {
        return;
      }
      const success = handlerFunction(cb);
      if (success) {
        toast.success("Congrats! All tests passed!", {
          position: "top-center",
          autoClose: 4000,
          theme: "dark"
        });
        setSuccess(true);
        setSolved(true);
        setTimeout(() => {
          setSuccess(false);
        }, 4000);

        // Save to DB
        const userRef = doc(firestore, "Users", user.uid);
        await updateDoc(userRef, {
          solvedProblems: arrayUnion(pid)
        });
      }
    } catch (error: any) {
      if (
        error?.message?.startsWith(
          `AssertionError [ERR_ASSERTION]: Expected values to be strictly deep-equal:`
        )
      ) {
        toast.error("Oops! One or more test cases failed", {
          position: "top-center",
          autoClose: 4000,
          theme: "dark"
        });
      } else {
        toast.error(error.message, {
          position: "top-center",
          autoClose: 4000,
          theme: "dark"
        });
      }
    }
  };

  const onCodeMirrorChange = async (value: string) => {
    setUserCode(value);
    const obj = {
      user: user?.uid,
      code: userCode
    };
    localStorage.setItem(`code-${pid}`, JSON.stringify(obj));
  };

  return (
    <div className="flex flex-col bg-dark-layer-1 relative overflow-x-hidden">
      <PreferenceNav settings={settings} setSettings={setSettings} />

      <Split
        className="h-[calc(100vh-94px)]"
        direction="vertical"
        sizes={[60, 40]}
        minSize={60}
      >
        <div className="w-full overflow-auto">
          <CodeMirror
            value={userCode}
            theme={vscodeDark}
            onChange={onCodeMirrorChange}
            extensions={[javascript()]}
            style={{ fontSize: settings.fontSize }}
          />
        </div>

        <div className="w-full px-5 overflow-auto">
          {/* Testcase heading */}
          <div className="flex h-10 items-center space-x-6">
            <div className="relative flex h-full flex-col justify-center cursor-pointer">
              <div className="text-sm font-medium leading-5 text-white">
                Testcases
              </div>
              <hr className="absolute bottom-0 h-0.5 w-16 rounded-full border-none bg-white" />
            </div>
          </div>

          <div className="flex">
            {problem.examples.map((example) => (
              <div
                className="flex mr-2 items-start mt-2 text-white"
                key={example.id}
                onClick={() => {
                  setActiveTestCaseId(example.id);
                }}
              >
                <div className="flex flex-wrap items-center gap-y-4">
                  <div
                    className={`font-medium items-center transition-all focus:outline-none inline-flex bg-dark-fill-3 hover:bg-dark-fill-2 relative rounded-lg px-4 py-1 cursor-pointer whitespace-nowrap ${
                      activeTestCaseId == example.id
                        ? "text-white"
                        : "text-gray-500"
                    }`}
                  >
                    Case {example.id + 1}
                  </div>
                </div>
              </div>
            ))}
            {/* Case 1 */}
            {/* <div className="flex mr-2 items-start mt-2 text-white">
              <div className="flex flex-wrap items-center gap-y-4">
                <div className="font-medium items-center transition-all focus:outline-none inline-flex bg-dark-fill-3 hover:bg-dark-fill-2 relative rounded-lg px-4 py-1 cursor-pointer whitespace-nowrap">
                  Case 1
                </div>
              </div>
            </div> */}

            {/* Case 2 */}
            {/* <div className="flex mr-2 items-start mt-2 text-white">
              <div className="flex flex-wrap items-center gap-y-4">
                <div className="font-medium items-center transition-all focus:outline-none inline-flex bg-dark-fill-3 hover:bg-dark-fill-2 relative rounded-lg px-4 py-1 cursor-pointer whitespace-nowrap">
                  Case 2
                </div>
              </div>
            </div> */}

            {/* Case 3 */}
            {/* <div className="flex mr-2 items-start mt-2 text-white">
              <div className="flex flex-wrap items-center gap-y-4">
                <div className="font-medium items-center transition-all focus:outline-none inline-flex bg-dark-fill-3 hover:bg-dark-fill-2 relative rounded-lg px-4 py-1 cursor-pointer whitespace-nowrap">
                  Case 3
                </div>
              </div>
            </div> */}
          </div>

          <div className="font-semibold">
            <p className="text-sm font-medium mt-4 text-white">Input:</p>
            <div className="w-full cursor-text rounded-lg border px-3 py-[10px] bg-dark-fill-3 border-transparent text-white mt-2">
              {problem.examples[activeTestCaseId].inputText}
              {/* nums = [2,7,11,15], target = 9 */}
            </div>
            <p className="text-sm font-medium mt-4 text-white">Output:</p>
            <div className="w-full cursor-text rounded-lg border px-3 py-[10px] bg-dark-fill-3 border-transparent text-white mt-2">
              {problem.examples[activeTestCaseId].outputText}
              {/* [0,1] */}
            </div>
          </div>
        </div>
      </Split>

      <EditorFooter handleSubmit={handleSubmit} />
    </div>
  );
};

export default PlayGround;
