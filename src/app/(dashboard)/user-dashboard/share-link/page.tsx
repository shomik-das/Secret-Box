import ShareLink from "@/components/dashboard/shareLink";
import { Suspense } from "react"


const Page = () => {
  return (
    <>
      <div className="min-h-[calc(100vh-4rem)] px-2 sm:px-4 lg:px-6 py-4 sm:py-4 lg:py-6 ">
        <Suspense fallback={<div>shomikkkkkkkkkkk...</div>}>
          <ShareLink />
        </Suspense>
      </div>
    </>
  );
};

export default Page;
