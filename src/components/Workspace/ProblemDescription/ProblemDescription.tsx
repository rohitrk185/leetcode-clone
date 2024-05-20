import CircleSkeleton from "@/components/Skeletons/CircleSkeleton";
import RectangleSkeleton from "@/components/Skeletons/RectangleSkeleton";
import { auth, firestore } from "@/firebase/firebase";
import { DBProblem, Problem } from "@/utils/types/problem";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { AiFillLike, AiFillDislike } from "react-icons/ai";
import { BsCheck2Circle } from "react-icons/bs";
import { TiStarOutline } from "react-icons/ti";
import { toast } from "react-toastify";

type ProblemDescriptionProps = {
  problem: Problem;
};

const ProblemDescription: React.FC<ProblemDescriptionProps> = ({ problem }) => {
  const [user] = useAuthState(auth);
  const { problemDifficultyClass, loading, currentProblem } =
    useGetCurrentProblem(problem.id);

  const { liked, disliked, starred, solved, setData } =
    useGetUsersDataOnProblem(problem.id);

  const handleLikeClick = async () => {
    if (!user) {
      toast.error("You must be logged-in to like a problem", {
        position: "top-center",
        theme: "dark"
      });
      return;
    }
  };

  return (
    <div className="bg-dark-layer-1">
      {/* TAB */}
      <div className="flex h-11 w-full items-center pt-2 bg-dark-layer-2 text-white overflow-x-hidden">
        <div
          className={
            "bg-dark-layer-1 rounded-t-[5px] px-5 py-[10px] text-xs cursor-pointer"
          }
        >
          Description
        </div>
      </div>

      <div className="flex px-0 py-4 h-[calc(100vh-94px)] overflow-y-auto">
        <div className="px-5">
          {/* Problem heading */}
          <div className="w-full">
            <div className="flex space-x-4">
              <div className="flex-1 mr-2 text-lg text-white font-medium">
                {problem.title}
              </div>
            </div>

            {!loading && currentProblem ? (
              <div className="flex items-center mt-3">
                <div
                  className={`${problemDifficultyClass} inline-block rounded-[21px] bg-opacity-[.15] px-2.5 py-1 text-xs font-medium capitalize`}
                >
                  {currentProblem.difficulty}
                </div>
                <div className="rounded p-[3px] ml-4 text-lg transition-colors duration-200 text-green-s text-dark-green-s">
                  <BsCheck2Circle />
                </div>
                <div
                  className="flex items-center cursor-pointer hover:bg-dark-fill-3 space-x-1 rounded p-[3px]  ml-4 text-lg transition-colors duration-200 text-dark-gray-6"
                  onClick={handleLikeClick}
                >
                  {liked ? (
                    <AiFillLike className="text-dark-blue-s" />
                  ) : (
                    <AiFillLike />
                  )}

                  <span className="text-xs">{currentProblem.likes}</span>
                </div>
                <div className="flex items-center cursor-pointer hover:bg-dark-fill-3 space-x-1 rounded p-[3px]  ml-4 text-lg transition-colors duration-200 text-green-s text-dark-gray-6">
                  <AiFillDislike />
                  <span className="text-xs">{currentProblem.dislikes}</span>
                </div>
                <div className="cursor-pointer hover:bg-dark-fill-3  rounded p-[3px]  ml-4 text-xl transition-colors duration-200 text-green-s text-dark-gray-6 ">
                  <TiStarOutline />
                </div>
              </div>
            ) : (
              <div className="mt-3 flex space-x-2">
                <RectangleSkeleton />
                <CircleSkeleton />
                <RectangleSkeleton />
                <RectangleSkeleton />
                <CircleSkeleton />
              </div>
            )}

            {/* Problem Statement(paragraphs) */}
            <div className="text-white text-sm">
              <div
                dangerouslySetInnerHTML={{
                  __html: problem.problemStatement
                }}
              />
            </div>

            {/* Examples */}
            <div className="mt-4">
              {problem.examples.map((example) => (
                <div key={example.id}>
                  <p className="font-medium text-white">Example {example.id}</p>
                  {example.img ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={example.img}
                      alt={problem.title}
                      className="mt-3"
                    />
                  ) : null}
                  <div className="example-card">
                    <pre>
                      <strong className="text-white">Input:</strong>
                      <span>{example.inputText}</span>

                      <br />

                      <strong>Output: </strong>
                      <span>{example.outputText}</span>

                      <br />

                      {example.explanation ? (
                        <>
                          <strong>Explanation: </strong>
                          <span>{example.explanation}</span>
                        </>
                      ) : null}
                    </pre>
                  </div>
                </div>
              ))}
              {/* Example 1 */}
              {/* <div>
                <p className="font-medium text-white ">Example 1: </p>
                <div className="example-card">
                  <pre>
                    <strong className="text-white">Input: </strong> nums =
                    [2,7,11,15], target = 9 <br />
                    <strong>Output:</strong> [0,1] <br />
                    <strong>Explanation:</strong>Because nums[0] + nums[1] == 9,
                    we return [0, 1].
                  </pre>
                </div>
              </div> */}

              {/* Example 2 */}
              {/* <div>
                <p className="font-medium text-white ">Example 2: </p>
                <div className="example-card">
                  <pre>
                    <strong className="text-white">Input: </strong> nums =
                    [3,2,4], target = 6 <br />
                    <strong>Output:</strong> [1,2] <br />
                    <strong>Explanation:</strong>Because nums[1] + nums[2] == 6,
                    we return [1, 2].
                  </pre>
                </div>
              </div> */}
              {/* Example 3 */}
              {/* <div>
                <p className="font-medium text-white ">Example 3: </p>
                <div className="example-card">
                  <pre>
                    <strong className="text-white">Input: </strong> nums =
                    [3,3], target = 6
                    <br />
                    <strong>Output:</strong> [0,1] <br />
                  </pre>
                </div>
              </div> */}
            </div>

            {/* Constraints */}
            <div className="mb-8 pb-5">
              <div className="text-white text-sm font-medium">Constraints:</div>
              <ul className="text-white ml-5 list-disc">
                <div
                  dangerouslySetInnerHTML={{
                    __html: problem.constraints
                  }}
                />
                {/* <li className="mt-2">
                  <code>2 ≤ nums.length ≤ 10</code>
                </li>

                <li className="mt-2">
                  <code>-10 ≤ nums[i] ≤ 10</code>
                </li>
                <li className="mt-2">
                  <code>-10 ≤ target ≤ 10</code>
                </li>
                <li className="mt-2 text-sm">
                  <strong>Only one valid answer exists.</strong>
                </li> */}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProblemDescription;

function useGetCurrentProblem(problemID: string) {
  const [currentProblem, setCurrentProblem] = useState<DBProblem | null>(null);
  const [loading, setLoading] = useState(true);
  const [problemDifficultyClass, setProblemDifficultyClass] = useState("");

  useEffect(() => {
    if (!problemID) {
      return;
    }
    const getCurrentProblem = async () => {
      setLoading(true);

      const docRef = doc(firestore, `Problems/${problemID}`);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const problem = docSnap.data() as DBProblem;
        setCurrentProblem(docSnap.data() as DBProblem);
        setProblemDifficultyClass(
          problem.difficulty.toLowerCase() === "easy"
            ? "bg-olive text-olive"
            : problem.difficulty.toLowerCase() === "medium"
            ? "bg-dark-yellow text-dark-yellow"
            : "bg-dark-pink text-dark-pink"
        );
      }
      setLoading(false);
    };

    getCurrentProblem();
  }, [problemID]);

  return { loading, currentProblem, problemDifficultyClass };
}

function useGetUsersDataOnProblem(problemID: string) {
  const [data, setData] = useState({
    liked: false,
    disliked: false,
    starred: false,
    solved: false
  });
  const [user] = useAuthState(auth);

  useEffect(() => {
    const getUserDataOnProblem = async () => {
      if (!problemID) return;

      const userRef = doc(firestore, "Users", user!.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const d = userSnap.data();
        const {
          likedProblems,
          dislikedProblems,
          starredProblems,
          solvedProblems
        } = d;

        setData({
          liked: likedProblems.includes(problemID),
          disliked: dislikedProblems.includes(problemID),
          starred: starredProblems.includes(problemID),
          solved: solvedProblems.includes(problemID)
        });
      }
    };

    if (user) {
      getUserDataOnProblem();
    }

    return () => {
      setData({
        liked: false,
        disliked: false,
        starred: false,
        solved: false
      });
    };
  }, [problemID, user]);

  return {
    ...data,
    setData
  };
}
