import { cn } from "@/lib/utils"
import { Marquee } from "../ui/marquee"
import { UserIcon } from "lucide-react" 

const reviews = [
  {
    body: "Sometimes I replay our old chats just to feel that same energy again.",
  },
  {
    body: "I act chill around you, but my heart races every single time.",
  },
  {
    body: "You have no idea how many times I typed a message to you and deleted it.",
  },
  {
    body: "You looked really good yesterday… like unfairly good",
  },
  {
    body: "I still remember that one random compliment you gave me months ago.",
  },
  {
    body: "You make me nervous in the best way possible.",
  },
  {
    body: "You’re the reason my playlist went from chill to heartbreak mode",
  },
  {
    body: "I pretend I don’t care, but you cross my mind way too often.",
  },
  {
    body: "If only you knew how many screenshots I’ve taken of our conversations",
  },
  {
    body: "I once skipped a whole plan just because you weren’t coming.",
  },
  {
    body: "Sometimes I open your profile just to check if you’ve posted anything new.",
  },
  {
    body: "I know we don’t talk much anymore, but I still care more than I should.",
  },
  {
    body: "I wish I could tell you how I really feel… but this is safer",
  },
  {
    body: "Every time you text first, it makes my whole day.",
  },
  {
    body: "I still remember the first time we met — you were chaos, but good chaos.",
  },
  {
    body: "If only you knew how often I talk about you without saying your name.",
  },
]

const firstRow = reviews.slice(0, reviews.length / 2)
const secondRow = reviews.slice(reviews.length / 2)

const ReviewCard = ({
  body,
}: {
  body: string
}) => {
  return (
    <figure
      className={cn(
        "relative h-full w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
        // light styles
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        // dark styles
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]"
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
          <UserIcon className="h-4 w-4 text-gray-600 dark:text-gray-300" />
        </div>
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium dark:text-white">
            Anonymous
          </figcaption>
        </div>
      </div>
      <blockquote className="mt-2 text-sm">{body}</blockquote>
    </figure>
  )
}

export function MarqueeDemo() {
  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
      <Marquee pauseOnHover className="[--duration:30s]">
        {firstRow.map((review, index) => (
          <ReviewCard key={index} {...review} />
        ))}
      </Marquee>
      <Marquee reverse pauseOnHover className="[--duration:30s]">
        {secondRow.map((review, index) => (
          <ReviewCard key={index} {...review} />
        ))}
      </Marquee>
      <Marquee pauseOnHover className="[--duration:30s]">
        {firstRow.map((review, index) => (
          <ReviewCard key={index} {...review} />
        ))}
      </Marquee>
      <div className="from-background pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r"></div>
      <div className="from-background pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l"></div>
    </div>
  )
}
