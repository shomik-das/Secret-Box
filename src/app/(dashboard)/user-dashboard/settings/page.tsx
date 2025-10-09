import SenderControl from "@/components/dashboard/senderControl";
import DeleteAccount from "@/components/dashboard/deleteAccount";


const page = () => {
  return (
    <>
      <div className="min-h-[calc(100vh-4rem)] px-2 sm:px-4 lg:px-6 pt-12 space-y-12">
        <SenderControl />
        <DeleteAccount />
      </div>
    </>
  );
};

export default page;
