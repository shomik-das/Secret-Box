import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export function CTASection() {
  return (
    <section id="get-started" className="pt-16 md:pt-32">
      <div className="container mx-auto max-w-5xl px-4">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/10 via-accent/5 to-background p-12 md:p-16 lg:p-20">
          <div className="relative z-10 flex flex-col items-center gap-8 text-center">
            <h2 className="text-4xl font-bold text-foreground lg:text-5xl text-balance max-w-2xl">
              Are You Ready to Hear What People Really Think?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl text-pretty">
              Create your Secret Box in seconds and start receiving honest, anonymous messages from friends, followers,
              or anyone you share your link with.
            </p>
            <Button size="lg" className="text-base font-semibold group" asChild>
              <Link href="/auth/signin-signup">
                Create Your Secret Box Now
                <ArrowRight className="ml-2 h-5 w-5 -me-1 opacity-60 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </Link>
            </Button>
            <p className="text-sm text-muted-foreground">
              Free to start • No credit card required • Takes less than 60 seconds
            </p>
          </div>

          {/* Decorative elements */}
          <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
        </div>
      </div>
    </section>
  )
}
