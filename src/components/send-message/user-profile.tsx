import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface UserProfileProps {
  name: string 
  photo?: string
  headline?: string
  question?: string
}

export function UserProfile({ name, photo, headline, question }: UserProfileProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  return (
    <div className="flex flex-col items-center text-center space-y-4">
      <Avatar className="h-28 w-28 ring-4 ring-primary/20 shadow-xl">
        <AvatarImage src={photo || "/placeholder.svg"} alt={name} />
        <AvatarFallback className="text-2xl bg-primary/10 text-primary">{initials}</AvatarFallback>
      </Avatar>

      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-foreground">{name}</h2>
        <p className="text-base text-muted-foreground leading-relaxed max-w-md">{headline}</p>
      </div>

      {question && (
        <div className="mt-8 pt-6 border-t border-border/50 w-full max-w-2xl">
          <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-3">Question for you</p>
          <p className="text-lg text-foreground font-medium leading-relaxed">{question}</p>
        </div>
      )}
    </div>
  )
}
