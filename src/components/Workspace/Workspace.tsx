import React, { useState } from "react";
import Split from "react-split";
import ProblemDescription from "./ProblemDescription/ProblemDescription";
import PlayGround from "./PlayGround/PlayGround";
import { Problem } from "@/utils/types/problem";
import Confetti from "react-confetti";
import useWindowSize from "@/hooks/useWindowSize";

type Props = {
  problem: Problem;
};

const Workspace = ({ problem }: Props) => {
  const [success, setSuccess] = useState(false);
  const { width, height } = useWindowSize();

  return (
    <Split className="split" minSize={0}>
      <ProblemDescription problem={problem} />

      <div className="bg-dark-fill-2">
        <PlayGround problem={problem} />
        {success ? (
          <Confetti
            gravity={0.3}
            tweenDuration={4000}
            width={width - 1}
            height={height - 1}
          />
        ) : null}
      </div>
    </Split>
  );
};

export default Workspace;
