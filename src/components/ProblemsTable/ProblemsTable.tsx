import React from "react";
import { problems } from "@/mockProblems/problems";
import { BsCheckCircle } from "react-icons/bs";
import { AiFillYoutube } from "react-icons/ai";
import Link from "next/link";
type Props = {};

const ProblemsTable = (props: Props) => {
  return (
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
                />
              ) : (
                <p className="text-gray-400">Coming soon...</p>
              )}
            </td>
          </tr>
        );
      })}
    </tbody>
  );
};

export default ProblemsTable;
