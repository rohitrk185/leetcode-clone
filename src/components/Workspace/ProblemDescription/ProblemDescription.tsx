import CircleSkeleton from "@/components/Skeletons/CircleSkeleton";
import RectangleSkeleton from "@/components/Skeletons/RectangleSkeleton";
import { auth, firestore } from "@/firebase/firebase";
import { DBProblem, Problem } from "@/utils/types/problem";
import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  runTransaction,
  updateDoc
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  AiFillLike,
  AiFillDislike,
  AiOutlineLoading3Quarters
} from "react-icons/ai";
import { BsCheck2Circle } from "react-icons/bs";
import { TiStarOutline } from "react-icons/ti";
import { toast } from "react-toastify";

type ProblemDescriptionProps = {
  problem: Problem;
};

const ProblemDescription: React.FC<ProblemDescriptionProps> = ({ problem }) => {
  const [likesLoading, setLikesLoading] = useState(false);

  const [user] = useAuthState(auth);
  const { problemDifficultyClass, loading, currentProblem, setCurrentProblem } =
    useGetCurrentProblem(problem.id);

  const { liked, disliked, starred, solved, setData } =
    useGetUsersDataOnProblem(problem.id);

  const getUserAndProblemData = async (transaction: any) => {
    const userRef = doc(firestore, "Users", user!.uid);
    const problemRef = doc(firestore, "Problems", problem.id);

    const userDoc = await transaction.get(userRef);
    const problemDoc = await transaction.get(problemRef);

    return { userRef, problemRef, userDoc, problemDoc };
  };

  const handleLikeClick = async () => {
    if (!user) {
      toast.error("You must be logged-in to like a problem", {
        position: "top-center",
        theme: "dark"
      });
      return;
    }

    if (likesLoading) return;

    setLikesLoading(true);
    // if already liked, if already disliked, neither
    await runTransaction(firestore, async (transaction) => {
      const { userRef, problemRef, userDoc, problemDoc } =
        await getUserAndProblemData(transaction);
      if (userDoc.exists() && problemDoc.exists()) {
        if (liked) {
          // remove problem id from likedProblems for user
          transaction.update(userRef, {
            likedProblems: userDoc
              .data()
              .likedProblems.filter((id: string) => id !== problem.id)
          });
          transaction.update(problemRef, {
            likes: problemDoc.data().likes - 1
          });

          setCurrentProblem((prev) =>
            prev ? { ...prev, likes: prev!.likes - 1 } : null
          );
          setData((prev) => ({ ...prev, liked: false }));
        } else if (disliked) {
          transaction.update(userRef, {
            likedProblems: [...userDoc.data().likedProblems, problem.id],
            dislikedProblems: userDoc
              .data()
              .likedProblems.filter((id: string) => id !== problem.id)
          });
          transaction.update(problemRef, {
            likes: problemDoc.data().likes + 1,
            disliked: problemDoc.data().dislikes + 1
          });

          setCurrentProblem((prev) =>
            prev
              ? {
                  ...prev,
                  likes: prev!.likes + 1,
                  dislikes: prev!.dislikes - 1
                }
              : null
          );
          setData((prev) => ({ ...prev, liked: true, disliked: false }));
        } else {
          transaction.update(userRef, {
            likedProblems: [...userDoc.data().likedProblems, problem.id]
          });
          transaction.update(problemRef, {
            likes: problemDoc.data().likes + 1
          });

          setCurrentProblem(
            (prev) =>
              ({
                ...prev,
                likes: prev!.likes + 1
              }) as DBProblem
          );
          setData((prev) => ({ ...prev, liked: true }));
        }
      }
    });
    setLikesLoading(false);
  };

  const handleDislikeClick = async () => {
    if (!user) {
      toast.error("You must be logged-in to dislike a problem", {
        position: "top-center",
        theme: "dark"
      });
      return;
    }

    if (likesLoading) return;

    setLikesLoading(true);
    // if already liked, if already disliked, neither
    await runTransaction(firestore, async (transaction) => {
      const { userRef, problemRef, userDoc, problemDoc } =
        await getUserAndProblemData(transaction);
      if (userDoc.exists() && problemDoc.exists()) {
        if (liked) {
          // remove problem id from likedProblems for user
          transaction.update(userRef, {
            likedProblems: userDoc
              .data()
              .likedProblems.filter((id: string) => id !== problem.id),
            dislikedProblems: [...userDoc.data().dislikedProblems, problem.id]
          });
          transaction.update(problemRef, {
            likes: problemDoc.data().likes - 1,
            dislikes: problemDoc.data().dislikes + 1
          });

          setCurrentProblem((prev) =>
            prev
              ? {
                  ...prev,
                  likes: prev.likes - 1,
                  dislikes: prev.dislikes + 1
                }
              : null
          );
          setData((prev) => ({ ...prev, liked: false, disliked: true }));
        } else if (disliked) {
          transaction.update(userRef, {
            dislikedProblems: userDoc
              .data()
              .likedProblems.filter((id: string) => id !== problem.id)
          });
          transaction.update(problemRef, {
            dislikes: problemDoc.data().dislikes - 1
          });

          setCurrentProblem((prev) =>
            prev
              ? {
                  ...prev,
                  dislikes: prev.dislikes - 1
                }
              : null
          );
          setData((prev) => ({ ...prev, disliked: false }));
        } else {
          transaction.update(userRef, {
            dislikedProblems: [...userDoc.data().likedProblems, problem.id]
          });
          transaction.update(problemRef, {
            dislikes: problemDoc.data().dislikes + 1
          });

          setCurrentProblem((prev) =>
            prev
              ? {
                  ...prev,
                  dislikes: prev.dislikes + 1
                }
              : null
          );
          setData((prev) => ({ ...prev, disliked: true }));
        }
      }
    });
    setLikesLoading(false);
  };

  const handleStarProblem = async () => {
    if (!user) {
      toast.error("You must be logged-in to star a problem", {
        position: "top-center",
        theme: "dark"
      });
      return;
    }

    if (likesLoading) return;

    setLikesLoading(true);

    const userRef = doc(firestore, "Users", user.uid);
    try {
      await updateDoc(userRef, {
        starredProblems: starred
          ? arrayRemove(problem.id)
          : arrayUnion(problem.id)
      });
      setData((prev) => ({ ...prev, starred: !starred }));
    } catch (error) {
      console.error("Error while star click: ", error);
    }

    setLikesLoading(false);
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
                  {liked && !likesLoading ? (
                    <AiFillLike className="text-dark-blue-s" />
                  ) : likesLoading ? (
                    <AiOutlineLoading3Quarters className="animate-spin" />
                  ) : (
                    <AiFillLike />
                  )}

                  <span className="text-xs">{currentProblem.likes}</span>
                </div>
                <div
                  className="flex items-center cursor-pointer hover:bg-dark-fill-3 space-x-1 rounded p-[3px]  ml-4 text-lg transition-colors duration-200 text-green-s text-dark-gray-6"
                  onClick={handleDislikeClick}
                >
                  {disliked && !likesLoading ? (
                    <AiFillDislike className="text-dark-blue-s" />
                  ) : likesLoading ? (
                    <AiOutlineLoading3Quarters className="animate-spin" />
                  ) : (
                    <AiFillDislike />
                  )}
                  <span className="text-xs">{currentProblem.dislikes}</span>
                </div>
                <div
                  className="cursor-pointer hover:bg-dark-fill-3 rounded p-[3px] ml-4 text-xl transition-colors duration-200 text-green-s text-dark-gray-6"
                  onClick={handleStarProblem}
                >
                  {starred && !likesLoading ? (
                    <TiStarOutline className="text-dark-blue-s" />
                  ) : likesLoading ? (
                    <AiOutlineLoading3Quarters className="animate-spin" />
                  ) : (
                    <TiStarOutline />
                  )}
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

  return { loading, currentProblem, problemDifficultyClass, setCurrentProblem };
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
