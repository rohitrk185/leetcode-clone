import Topbar from "@/components/Topbar/Topbar";
import Workspace from "@/components/Workspace/Workspace";
import { firestore } from "@/firebase/firebase";
import { useHasMounted } from "@/hooks/useHasMounted";
import { problems } from "@/utils/problems";
import { DBProblem, Problem } from "@/utils/types/problem";
import { collection, getDocs, query } from "firebase/firestore";
import React from "react";

type Props = {
  problem: Problem;
  // DBProblems: DBProblem[];
};

const ProblemPage = ({ problem }: Props) => {
  const hasMounted = useHasMounted();

  if (!hasMounted) {
    return null;
  }
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
  // const problemsCollectionQuery = query(collection(firestore, "Problems"));
  // const problemsSnap = await getDocs(problemsCollectionQuery);
  // const DBProblems = problemsSnap.docs.map((d) => d.data() as DBProblem);
  if (!problem) {
    return {
      notFound: true
    };
  }

  problem.handlerFunction = problem.handlerFunction.toString();

  return {
    props: {
      problem
      // DBProblems
    }
  };
}
