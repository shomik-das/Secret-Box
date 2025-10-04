import MessagesTable from "@/components/dashboard/massagesTable"
import Container from "@/components/common/container"

const page = () =>{
    return(
        <>
        <div className="min-h-[calc(100vh-4rem)] px-2 sm:px-4 lg:px-6 py-12 ">
                <MessagesTable />
        </div>
        </>
    )
}

export default page