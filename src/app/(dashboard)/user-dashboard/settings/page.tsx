import SenderControl from "@/components/dashboard/senderControl";
import DeleteAccount from "@/components/dashboard/deleteAccount";
import { Suspense } from "react"


const Page = () => {
  return (
    <>
      <div className="min-h-[calc(100vh-4rem)] px-2 sm:px-4 lg:px-6 py-4 sm:py-4 lg:py-6 space-y-6">
        <Suspense fallback={<div>shomikkkkkkkkkkk...</div>}>
          <SenderControl />
          <DeleteAccount />
        </Suspense>
      </div>
    </>
  );
};

export default Page;
