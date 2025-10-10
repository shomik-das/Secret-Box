import { Cpu, Lock, Sparkles, Link2, Mail, } from 'lucide-react'
import Image from 'next/image'

export default function FeaturesSection() {
    return (
        <section className="pt-16 md:pt-32">
            <div className="mx-auto max-w-5xl space-y-12 px-6">
                <div className="relative z-10 grid items-center gap-4 md:grid-cols-2 md:gap-12">
                    <h2 className="text-4xl font-semibold">Everything you need for anonymous messaging</h2>
                    <p className="max-w-sm sm:ml-auto">Built with privacy and security at its core, Secret Box gives you complete control over your anonymous messages</p>
                </div>
                <div className="px-3 pt-3 md:-mx-8">
                    <div className="aspect-88/36 mask-b-from-75% mask-b-to-95% relative">
                        <Image
                            src="/mail-upper.png"
                            className="absolute inset-0 z-10"
                            alt="payments illustration dark"
                            width={2797}
                            height={1137}
                        />
                        <Image
                            src="/mail-back.png"
                            className="hidden dark:block"
                            alt="payments illustration dark"
                            width={2797}
                            height={1137}
                        />
                        <Image
                            src="/mail-back-light.png"
                            className="dark:hidden"
                            alt="payments illustration light"
                            width={2797}
                            height={1137}
                        />
                    </div>
                </div>
                <div className="relative mx-auto grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-8 lg:grid-cols-4">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Lock className="size-4" />
                            <h3 className="text-sm font-medium">Complete Anonymity</h3>
                        </div>
                        <p className="text-muted-foreground text-sm">Send messages anonymously without revealing your identity</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Link2 className="size-4" />
                            <h3 className="text-sm font-medium">Shareable Link</h3>
                        </div>
                        <p className="text-muted-foreground text-sm">Get your personal link to share anywhere for receiving messages</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Mail className="size-4" />
                            <h3 className="text-sm font-medium">Email Notifications</h3>
                        </div>
                        <p className="text-muted-foreground text-sm">Get notified instantly when someone sends you a message</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Sparkles className="size-4" />
                            <h3 className="text-sm font-medium">Personalized Questions</h3>
                        </div>
                        <p className="text-muted-foreground text-sm">Create questions to guide senders and get the feedback you need</p>
                    </div>
                </div>
            </div>
        </section>
    )
}
