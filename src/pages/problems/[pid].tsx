import Topbar from "@/components/Topbar/Topbar";
import Workspace from "@/components/Workspace/Workspace";
import { problems } from "@/utils/problems";
import { Problem } from "@/utils/types/problem";
import React from "react";

type Props = {
  problem: Problem;
};

const ProblemPage = ({ problem }: Props) => {
  console.log("problem: ", problem);
  return (
    <div>
      <Topbar problemPage={true} />

      <Workspace problem={problem} />
    </div>
  );
};

export default ProblemPage;

// SSG
export async function getStaticPaths() {
  const paths = Object.keys(problems).map((p) => ({
    params: {
      pid: p
    }
  }));

  return {
    paths,
    fallback: false
  };
}

export async function getStaticProps({
  params
}: {
  params: {
    pid: string;
  };
}) {
  const { pid } = params;
  const problem = problems[pid];
  if (!problem) {
    return {
      notFound: true
    };
  }

  problem.handlerFunction = problem.handlerFunction.toString();

  return {
    props: {
      problem
    }
  };
}
