import ProblemsTable from "@/components/ProblemsTable/ProblemsTable";
import Topbar from "@/components/Topbar/Topbar";
import { firestore } from "@/firebase/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useRef, useState } from "react";

export default function Home() {
  const formRef = useRef(null);
  const [loadingProblems, setLoadingProblems] = useState(true);

  const onSubmit = async (event: any) => {
    event.preventDefault();

    const form: any = formRef.current;
    const input = {
      id: form.id.value,
      title: form.title.value,
      difficulty: form.difficulty.value,
      category: form.category.value,
      videoID: form.videoID.value,
      link: "",
      order: Number(form.order.value),
      likes: 0,
      dislikes: 0
    };

    // Save to Firestore
    const docRef = doc(firestore, "Problems", input.id);
    await setDoc(docRef, input);

    alert("Problem saved to DB");
  };

  return (
    <>
      <main className="bg-dark-layer-2 min-h-screen">
        <Topbar />

        <h1 className="text-2xl text-center text-gray-700 dark:text-gray-400 font-medium uppercase mt-10 mb-5">
          &ldquo; QUALITY OVER QUANTITY &rdquo; 👇
        </h1>

        <div className="relative overflow-x-auto mx-auto px-6 pb-10">
          {loadingProblems ? (
            <div className="max-w-[1200px] mx-auto sm:w-7/12 w-full animate-pulse">
              {[...Array(10)].map((_, idx) => (
                <LoadingSkeleton key={idx} />
              ))}
            </div>
          ) : null}

          <table className="text-sm text-left text-gray-500 dark:text-gray-400 sm:w-7/12 w-full max-w-[1200px] mx-auto none">
            {!loadingProblems ? (
              <thead className="text-xs text-gray-700 uppercase dark:text-gray-400 border-b ">
                <tr>
                  <th scope="col" className="px-1 py-3 w-0 font-medium">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 w-0 font-medium">
                    Title
                  </th>
                  <th scope="col" className="px-6 py-3 w-0 font-medium">
                    Difficulty
                  </th>

                  <th scope="col" className="px-6 py-3 w-0 font-medium">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3 w-0 font-medium">
                    Solution
                  </th>
                </tr>
              </thead>
            ) : null}

            <ProblemsTable setLoadingProblems={setLoadingProblems} />
          </table>
        </div>

        {/* Temp-form */}
        <form
          className="p-6 flex flex-col max-w-sm gap-3 hidden"
          ref={formRef}
          onSubmit={onSubmit}
        >
          <input
            type="text"
            placeholder="Problem ID"
            name="id"
            className="bg-transparent outline-none border-b border-white text-white"
          />
          <input
            type="text"
            placeholder="Problem Title"
            name="title"
            className="bg-transparent outline-none border-b border-white text-white"
          />
          <input
            type="text"
            placeholder="Problem Difficulty"
            name="difficulty"
            className="bg-transparent outline-none border-b border-white text-white"
          />
          <input
            type="text"
            placeholder="Problem Category"
            name="category"
            className="bg-transparent outline-none border-b border-white text-white"
          />
          <input
            type="text"
            placeholder="Problem Order"
            name="order"
            className="bg-transparent outline-none border-b border-white text-white"
          />
          <input
            type="text"
            placeholder="Problem Video ID?"
            name="videoID"
            className="bg-transparent outline-none border-b border-white text-white"
          />
          <input
            type="text"
            placeholder="Problem Link?"
            name="link"
            className="bg-transparent outline-none border-b border-white text-white"
          />

          <button type="submit" className="border-white text-white border">
            Save Problem
          </button>
        </form>
      </main>
    </>
  );
}

const LoadingSkeleton = () => {
  return (
    <div className="flex items-center space-x-12 mt-4 px-6">
      <div className="w-6 h-6 shrink-0 rounded-full bg-dark-layer-1"></div>
      <div className="h-4 sm:w-52  w-32  rounded-full bg-dark-layer-1"></div>
      <div className="h-4 sm:w-52  w-32 rounded-full bg-dark-layer-1"></div>
      <div className="h-4 sm:w-52 w-32 rounded-full bg-dark-layer-1"></div>
      <span className="sr-only">Loading...</span>
    </div>
  );
};
