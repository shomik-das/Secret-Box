import SenderControl from "@/components/dashboard/senderControl";
import DeleteAccount from "@/components/dashboard/deleteAccount";


const Page = () => {
  return (
    <>
      <div className="min-h-[calc(100vh-4rem)] px-2 sm:px-4 lg:px-6 sm:py-4 lg:py-6 space-y-6">
        <SenderControl />
        <DeleteAccount />
      </div>
    </>
  );
};

export default Page;
