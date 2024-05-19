import React from "react";
import Split from "react-split";
import ProblemDescription from "./ProblemDescription/ProblemDescription";
import PlayGround from "./PlayGround/PlayGround";
import { Problem } from "@/utils/types/problem";

type Props = {
  problem: Problem;
};

const Workspace = ({ problem }: Props) => {
  return (
    <Split className="split" minSize={0}>
      <ProblemDescription problem={problem} />

      <div className="bg-dark-fill-2">
        <PlayGround />
      </div>
    </Split>
  );
};

export default Workspace;
