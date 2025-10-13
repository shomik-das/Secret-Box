import {MarqueeDemo} from "@/components/home/marquee-demo";

export default function MessageCarousel() {
    return (
        <section id="confession" className="overflow-hidden pt-16 md:pt-32">
            <div className="mx-auto max-w-6xl space-y-8 px-6 md:space-y-12">
                <div className="relative z-10 max-w-2xl">
                    <h2 className="text-4xl font-bold lg:text-5xl">See what people are sharing</h2>
                    <p className="mt-6 text-lg">Share your honest thoughts, heartfelt confessions, and genuine feedback freely and anonymously with others.</p>
                </div>
                <div>
                    <MarqueeDemo />
                </div>
            </div>
        </section>
    )
}
