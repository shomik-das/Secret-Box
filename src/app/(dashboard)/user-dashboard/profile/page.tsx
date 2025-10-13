import { ProfileForm } from "@/components/dashboard/profileForm";
import { Suspense } from "react"


const Page = () => {
  return (
    <>
      <div className="min-h-[calc(100vh-4rem)] px-4 sm:px-4 lg:px-6 py-4 sm:py-4 lg:py-6">
        <Suspense fallback={<div>shomikkkkkkkkkkk...</div>}>
          <ProfileForm />
        </Suspense>
      </div>
    </>
  );
};

export default Page;
