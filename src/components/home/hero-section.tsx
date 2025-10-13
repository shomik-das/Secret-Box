import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { TextEffect } from '@/components/ui/text-effect'
import { AnimatedGroup } from '@/components/ui/animated-group'
import { ArrowRight } from 'lucide-react'
import { FlipWords } from '../ui/flip-words'
import { WordRotate } from '../ui/word-rotate'


const transitionVariants = {
    item: {
        hidden: {
            opacity: 0,
            filter: 'blur(12px)',
            y: 12,
        },
        visible: {
            opacity: 1,
            filter: 'blur(0px)',
            y: 0,
            transition: {
                type: "spring" as const,
                bounce: 0.3,
                duration: 1.5,
            },
        },
    },
}

export default function HeroSection() {
    const words: string[] = ["Send", "Receive", "Share"];
    return (
        <>
            <main id="home" className="overflow-hidden">
                <div aria-hidden className="absolute inset-0 isolate hidden contain-strict lg:block">
                </div>
                <section>
                    <div className="relative">
                        <div className="absolute inset-0 -z-10 size-full"></div>
                        <div className="mx-auto max-w-6xl px-6">
                            <div className="sm:mx-auto lg:mr-auto lg:mt-0">
                                <TextEffect
                                    preset="fade-in-blur"
                                    speedSegment={0.3}
                                    as="h1"
                                    className="mt-8 max-w-2xl text-balance text-5xl font-bold md:text-6xl lg:mt-16">
                                    Send and Receive anonymous messages
                                </TextEffect>
                                <TextEffect
                                    per="line"
                                    preset="fade-in-blur"
                                    speedSegment={0.3}
                                    delay={0.5}
                                    as="p"
                                    className="mt-8 max-w-2xl text-pretty text-lg">
                                        Create your unique link and let people share their honest thoughts, feedback, or confessions without revealing their identity.                                </TextEffect>
                                <AnimatedGroup
                                    variants={{
                                        container: {
                                            visible: {
                                                transition: {
                                                    staggerChildren: 0.05,
                                                    delayChildren: 0.75,
                                                },
                                            },
                                        },
                                        ...transitionVariants,
                                    }}
                                    className="mt-12 flex items-center gap-2">
                                    <div>
                                        <Button
                                            key={1}
                                            size="lg"
                                            className="text-base font-semibold h-12 px-8 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all group"
                                            asChild
                                        >
                                            <Link href="/u/shomik_das" >
                                                Send messages
                                                <ArrowRight 
                                                className="ml-2 h-5 w-5 -me-1 opacity-60 transition-transform group-hover:translate-x-0.5"
                                                
                                                aria-hidden="true"
                                                />
                                            </Link>
                                        </Button>
                                    </div>
                                    <Button
                                        key={2}
                                        asChild
                                        size="lg"
                                        variant="outline"
                                        className="text-base font-semibold h-12 px-8 bg-transparent backdrop-blur-sm">
                                        <Link href="/auth/signin-signup">
                                            <span className="text-nowrap">Receive messages</span>
                                        </Link>
                                    </Button>
                                </AnimatedGroup>
                            </div>
                        </div>
                        <AnimatedGroup
                            variants={{
                                container: {
                                    visible: {
                                        transition: {
                                            staggerChildren: 0.05,
                                            delayChildren: 0.75,
                                        },
                                    },
                                },
                                ...transitionVariants,
                            }}>
                            <div className="mask-b-from-55% relative -mr-56 mt-8 overflow-hidden px-2 sm:mr-0 sm:mt-12 md:mt-20">
                                <div className="inset-shadow-2xs ring-background dark:inset-shadow-white/20 bg-background relative mx-auto max-w-6xl overflow-hidden rounded-2xl border p-4 shadow-lg shadow-zinc-950/15 ring-1">
                                    <Image
                                        className="bg-background aspect-15/8 relative hidden rounded-2xl dark:block"
                                        src="/dashboard_1.png"
                                        alt="app screen"
                                        width="2700"
                                        height="1440"
                                    />
                                    <Image
                                        className="z-2 border-border/25 aspect-15/8 relative rounded-2xl border dark:hidden"
                                        src="/dashboard_2.png"
                                        alt="app screen"
                                        width="2700"
                                        height="1440"
                                    />
                                </div>
                            </div>
                            
                        </AnimatedGroup>
                    </div>
                </section>
            </main>
        </>
    )
}
