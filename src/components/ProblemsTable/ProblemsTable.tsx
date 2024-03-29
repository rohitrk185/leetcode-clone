import React, { useEffect, useState } from "react";
import { problems } from "@/mockProblems/problems";
import { BsCheckCircle } from "react-icons/bs";
import { AiFillYoutube } from "react-icons/ai";
import { IoClose } from "react-icons/io5";
import Link from "next/link";
import YouTube from "react-youtube";
type Props = {};

const ProblemsTable = (props: Props) => {
  const [youtubePlayer, setYoutubePlayer] = useState({
    isOpen: false,
    videoId: ""
  });

  const handleYtPlayer = (open: boolean, ytVideoId?: string) => {
    if (typeof ytVideoId === "undefined") return;

    setYoutubePlayer({
      isOpen: open,
      videoId: ytVideoId
    });
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleYtPlayer(false, "");
      }
    };

    window.addEventListener("keydown", handleEsc);

    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <>
      <tbody className="text-white">
        {problems.map((problem, index) => {
          const difficultyColor =
            problem.difficulty.toLowerCase() === "easy"
              ? "text-dark-green-s"
              : problem.difficulty.toLowerCase() === "  medium"
              ? "text-dark-yellow"
              : "text-dark-pink";
          return (
            <tr
              key={problem.id}
              className={`${index % 2 === 1 ? "bg-dark-layer-1" : ""}`}
            >
              <th className="px-2 py-4 font-medium whitespace-nowrap text-dark-green-s">
                <BsCheckCircle fontSize={18} width={18} />
              </th>

              <td className="px-6 py-4">
                <Link
                  href={`/problems/${problem.id}`}
                  className="hover:text-blue-600 cursor-pointer"
                >
                  {problem.title}
                </Link>
              </td>

              <td className={`px-6 py-4 ${difficultyColor}`}>
                {problem.difficulty}
              </td>

              <td className="px-6 py-4">{problem.category}</td>

              <td className="px-6 py-4">
                {problem.videoId ? (
                  <AiFillYoutube
                    fontSize={25}
                    className="cursor-pointer hover:text-red-600"
                    onClick={() => handleYtPlayer(true, problem.videoId)}
                  />
                ) : (
                  <p className="text-gray-400">Coming soon...</p>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>

      {youtubePlayer.isOpen ? (
        <tfoot className="fixed top-0 left-0 h-screen w-screen flex items-center justify-center ">
          <div className="bg-black z-10 opacity-70 top-0 left-0 w-screen h-screen absolute"></div>
          <div className="w-full z-50 h-full px-6 relative max-w-4xl">
            <div className="w-full h-full flex items-center justify-center relative">
              <div className="w-full relative">
                <IoClose
                  fontSize={"35"}
                  className={`cursor-pointer absolute -top-10 right-0 hover:text-white`}
                  onClick={() => handleYtPlayer(false, "")}
                />
                <YouTube
                  videoId={youtubePlayer.videoId}
                  loading="lazy"
                  iframeClassName="w-full min-h-[500px]"
                />
              </div>
            </div>
          </div>
        </tfoot>
      ) : null}
    </>
  );
};

export default ProblemsTable;
