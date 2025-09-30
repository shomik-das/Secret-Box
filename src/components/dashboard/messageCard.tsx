"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardAction, CardFooter} from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "../ui/button"
import { TrashIcon } from "lucide-react"
import { Message } from "@/model/Message"
import { toast } from "sonner"
type Props = {
    message: Message;
    onMessageDelete: (messageId: string) => void;
}
const messageCard = () => {
    const handleDelete = () => {
        try{
            const res = fetch(`/api/message-delete`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                //body: JSON.stringify({id: message._id}),
            })
            // if(!res.success){
            //     toast.error("Failed to delete message")
            // }
            //onMessageDelete(message.id);
            toast.success("Message deleted successfully")
        }
        catch(err){
            console.error("Error deleting message: ", err)
            toast.error("Something went wrong")
        }
    }
    return (
    <Card>
        <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card Description</CardDescription>
            <CardAction>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="icon">
                            <TrashIcon className="h-4 w-4"/>
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>Delete Card</AlertDialogHeader>
                        <AlertDialogDescription>Are you sure you want to delete this card?</AlertDialogDescription>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction className="bg-red-600 hover:bg-red-700 focus:ring-red-600" onClick={handleDelete}>
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </CardAction>
        </CardHeader>
        <CardContent>
            <p>Card Content</p>
        </CardContent>
        <CardFooter>
            <p>Card Footer dfskdfkjskdfj lksjfkljslkjdflkjs</p>
        </CardFooter>
    </Card>
    )
}

export default messageCard;