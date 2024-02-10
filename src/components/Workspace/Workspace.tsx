import React from "react";
import Split from "react-split";
import ProblemDescription from "./ProblemDescription/ProblemDescription";
import PlayGround from "./PlayGround/PlayGround";

type Props = {};

const Workspace = (props: Props) => {
  return (
    <Split className="split" minSize={0}>
      <ProblemDescription />

      <PlayGround />
    </Split>
  );
};

export default Workspace;
