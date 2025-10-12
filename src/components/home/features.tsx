import { Cpu, Lock, Sparkles, Link2, Mail, } from 'lucide-react'
import Image from 'next/image'

export default function FeaturesSection() {
    return (
        <section className="pt-16 md:pt-32">
            <div className="mx-auto max-w-6xl space-y-12 px-6">
                <div className="relative z-10 max-w-2xl">
                    <h2 className="text-4xl font-bold lg:text-5xl">Why Choose Secret Box</h2>
                    <p className="mt-6 text-lg">Built with privacy and security at its core, Secret Box gives you complete control over your anonymous messages</p>
                </div>
                <div className="px-3 pt-3 md:-mx-8 flex justify-center">
                    <div className="aspect-88/36 mask-b-from-75% mask-b-to-95% relative max-w-5xl w-full">
                    <Image
                    src="/profile_light.png"
                    alt="Feature illustration light"
                    width={2797}
                    height={1137}
                    className="rounded-2xl dark:hidden"
                    priority
                    />

                        {/* Dark mode image */}
                    <Image
                    src="/profile_dark.png"
                    alt="Feature illustration dark"
                    width={2797}
                    height={1137}
                    className="hidden dark:block rounded-2xl"
                    priority
                    />
                    </div>
                </div>
                {/* <div className="mask-b-from-75% mask-l-from-75% mask-b-to-95% mask-l-to-95% relative -mx-4 pr-3 pt-3 md:-mx-12">
                    <div className="perspective-midrange">
                        <div className="rotate-x-6 -skew-2">
                            <div className="aspect-88/36 relative">
                                <Image
                                    src="/demo.jpg"
                                    className="absolute inset-0 z-10 rounded-2xl"
                                    alt="payments illustration dark"
                                    width={2797}
                                    height={1137}
                                />
                                <Image
                                    src="/demo.jpg"
                                    className="hidden dark:block rounded-2xl"
                                    alt="payments illustration dark"
                                    width={2797}
                                    height={1137}
                                />
                                <Image
                                    src="/demo.jpg"
                                    className="dark:hidden rounded-2xl"
                                    alt="payments illustration light"
                                    width={2797}
                                    height={1137}
                                />
                            </div>
                        </div>
                    </div>
                </div> */}
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
