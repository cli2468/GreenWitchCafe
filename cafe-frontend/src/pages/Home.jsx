import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

const AnimatedChar = ({ children, progress, range }) => {
    const opacity = useTransform(progress, range, [0.2, 1]);
    return <motion.span style={{ opacity }}>{children}</motion.span>;
};

const AccordionItem = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(true);
    return (
        <div className="border-b border-brand-text/15">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between py-5 w-full text-left select-none"
            >
                <div className="flex items-center gap-3">
                    <div className="w-1 h-5 bg-brand-accent"></div>
                    <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-brand-text">{title}</h3>
                </div>
                <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-brand-text/50 text-xl font-light"
                >+</motion.span>
            </button>
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                        className="overflow-hidden"
                    >
                        <div className="pb-6 pl-6">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// Infinite-scroll carousel: items are tripled, starts in middle set, jumps back seamlessly
const InfiniteCarousel = ({ items, count, renderFrame }) => {
    const scrollRef = useRef(null);
    const isJumping = useRef(false);

    // On mount, scroll to first item of the middle set (no left peek)
    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;
        requestAnimationFrame(() => {
            const children = el.children;
            if (children.length > count) {
                const target = children[count];
                // Position so the first middle-set item is centered
                el.style.scrollBehavior = 'auto';
                el.scrollLeft = target.offsetLeft - (el.offsetWidth - target.offsetWidth) / 2;
                el.style.scrollBehavior = '';
            }
        });
    }, [count]);

    // Use scrollend (with timeout fallback) for seamless looping
    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;

        let scrollTimer = null;

        const checkBounds = () => {
            if (isJumping.current) return;
            const { scrollLeft, scrollWidth } = el;
            const oneSetWidth = scrollWidth / 3;
            const tolerance = 50;

            if (scrollLeft >= oneSetWidth * 2 - tolerance) {
                isJumping.current = true;
                el.style.scrollBehavior = 'auto';
                el.scrollLeft = scrollLeft - oneSetWidth;
                el.style.scrollBehavior = '';
                requestAnimationFrame(() => { isJumping.current = false; });
            } else if (scrollLeft <= tolerance) {
                isJumping.current = true;
                el.style.scrollBehavior = 'auto';
                el.scrollLeft = scrollLeft + oneSetWidth;
                el.style.scrollBehavior = '';
                requestAnimationFrame(() => { isJumping.current = false; });
            }
        };

        const onScroll = () => {
            clearTimeout(scrollTimer);
            scrollTimer = setTimeout(checkBounds, 120);
        };

        el.addEventListener('scroll', onScroll, { passive: true });
        return () => {
            el.removeEventListener('scroll', onScroll);
            clearTimeout(scrollTimer);
        };
    }, []);

    return (
        <div
            ref={scrollRef}
            className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-4 px-[14%]"
            style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
        >
            {items.map((item, i) => renderFrame(item, i))}
        </div>
    );
};

export default function Home() {
    const storyRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: storyRef,
        offset: ["start 85%", "start 15%"]
    });

    const line1 = "We believe in excellent food – ";
    const line2 = "that just happens to be vegan.";
    const totalChars = line1.length + line2.length;

    return (
        <div className="w-full overflow-x-hidden">
            {/* Dark Green Background Wrapper for Hero and Nav Area */}
            <div className="w-full bg-brand-primary pt-0 md:pt-10 pb-0 md:pb-4">
                {/* Hero Section - Framed Image Layout without text */}
                <section className="px-0 md:px-8 pb-0 md:pb-12 max-w-[1600px] mx-auto">
                    <motion.div
                        initial={{ clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)" }}
                        animate={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}
                        transition={{ duration: 0.8, delay: 0.1, ease: [0.66, 0, 0.33, 1] }}
                        className="w-full relative rounded-none md:rounded-[2rem] overflow-hidden bg-stone-200 aspect-[3/4] md:aspect-video lg:aspect-[21/9]"
                    >
                        <img
                            src={`${import.meta.env.BASE_URL}assets/vibe1.png`}
                            alt="Green Witch Cafe Interior"
                            className="absolute inset-0 w-full h-full object-cover"
                            loading="eager"
                        />
                        {/* Subtle contrast gradient for framing */}
                        <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/40 via-transparent to-transparent pointer-events-none"></div>
                    </motion.div>
                </section>
            </div>

            {/* Original Story Section (Hidden per user request, prefer Variant B) */}
            {false && (
                <section className="bg-brand-secondary/10 text-brand-text w-full pt-16 pb-32 px-6 md:px-12 border-t border-brand-text/10">
                    <div className="max-w-[1400px] mx-auto">

                    {/* Big Quote Headline */}
                    <div className="mb-24 max-w-5xl">
                        <h2
                            className="font-serif text-3xl md:text-5xl leading-[1.3] md:leading-[1.4] tracking-wide"
                        >
                            <span className="whitespace-pre-wrap">
                                {line1.split("").map((char, i) => {
                                    const start = (i / totalChars) * 0.85;
                                    return (
                                        <AnimatedChar key={`l1-${i}`} progress={scrollYProgress} range={[start, start + 0.15]}>
                                            {char}
                                        </AnimatedChar>
                                    );
                                })}
                            </span>
                            <br className="hidden md:block" />
                            <span className="whitespace-pre-wrap">
                                {line2.split("").map((char, i) => {
                                    const start = ((line1.length + i) / totalChars) * 0.85;
                                    return (
                                        <AnimatedChar key={`l2-${i}`} progress={scrollYProgress} range={[start, start + 0.15]}>
                                            {char}
                                        </AnimatedChar>
                                    );
                                })}
                            </span>
                        </h2>
                    </div>

                    {/* Asymmetric 2-Column Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-24 items-start">

                        {/* Left Column: Vertical Image 1 */}
                        <div className="md:col-span-5 relative group">
                            {/* Inner double border effect via padding and outer border */}
                            <div className="w-full relative border border-brand-text/40 p-1.5 bg-brand-secondary/10">
                                <div className="aspect-[4/5] w-full relative overflow-hidden">
                                    <img
                                        src={`${import.meta.env.BASE_URL}assets/vibe2.png`}
                                        alt="Green Witch Cafe Boutique"
                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                        loading="lazy"
                                    />
                                </div>
                            </div>
                            <p className="font-sans text-xs tracking-widest uppercase mt-4 text-brand-text">
                                <span className="font-extrabold">ABOVE:</span> Crystals, incense, and local art inside our metaphysical boutique.
                            </p>
                        </div>

                        {/* Right Column: Text & Image 2 */}
                        <div className="md:col-span-7 flex flex-col gap-16 md:pt-8 w-full">

                            {/* Text Descriptor */}
                            <div className="font-serif text-xl md:text-2xl leading-relaxed md:leading-[1.8] max-w-2xl text-brand-text">
                                <p>
                                    A relaxing, plant-forward sanctuary right in the heart of downtown Highland. We've curated an intentional experience that nourishes both your body and your spirit.
                                </p>
                                <p className="mt-8">
                                    Step inside and instantly feel the peace as the aroma of sage, incense, and fresh espresso wraps around you. From our made-to-order juices packed with fresh ingredients to our cozy retail boutique, you'll leave feeling completely refreshed.
                                </p>
                            </div>

                            {/* Second Image (Offset to the right) — Desktop only */}
                            <div className="hidden md:block relative w-[75%] md:w-[60%] lg:w-[50%] self-end group">
                                <div className="w-full relative border border-brand-text/40 p-1.5 bg-brand-secondary/10">
                                    <div className="aspect-square w-full relative overflow-hidden">
                                        <img
                                            src={`${import.meta.env.BASE_URL}assets/sandwich.png`}
                                            alt="Signature Sandwich"
                                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                            loading="lazy"
                                        />
                                    </div>
                                </div>
                                {/* Vertical side-caption similar to Dishoom reference */}
                                <div className="hidden md:block absolute -left-10 lg:-left-12 bottom-0 h-full w-6">
                                    <p className="font-sans text-xs tracking-widest uppercase text-brand-text absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-90 whitespace-nowrap origin-center">
                                        <span className="font-extrabold">RIGHT:</span> Portobello Pesto Sandwich
                                    </p>
                                </div>
                                <p className="md:hidden font-sans text-xs tracking-widest uppercase mt-4 text-brand-text">
                                    <span className="font-extrabold">ABOVE:</span> Portobello Pesto Sandwich
                                </p>
                            </div>

                        </div>

                    </div>
                </div>
                </section>
            )}

            {/* ═══════ Story Variant B — Dishoom "Bombay Comfort Food" Style ═══════ */}
            <section id="story" ref={storyRef} className="bg-brand-bg text-brand-text w-full py-16 md:py-20 px-6 md:px-12 border-t border-brand-text/10">
                <div className="max-w-[1400px] mx-auto">

                    {/* Desktop: 2-Column Grid (Text Left, Images Right) */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-20">

                        {/* ── LEFT COLUMN: Text ── */}
                        <div className="md:col-span-5 flex flex-col">

                            {/* Decorative Accent Line */}
                            <div className="w-24 h-[3px] bg-brand-accent mb-6"></div>

                            {/* Category Label */}
                            <p className="font-sans text-xs md:text-sm font-bold uppercase tracking-[0.25em] text-brand-text mb-3">
                                Plant-Forward Fare
                            </p>

                            {/* Headline */}
                            <h2 className="font-serif text-3xl md:text-4xl leading-[1.3] tracking-wide text-brand-text mb-8 md:mb-10">
                                Nourish your way through the day
                            </h2>

                            {/* Body Paragraphs — Justified like Dishoom */}
                            <div className="font-serif text-xl md:text-xl leading-[1.8] md:leading-[1.9] text-brand-text/90 text-justify space-y-6">
                                <p>
                                    Walk through our doors on Highway Ave and let the outside world dissolve. The scent of sage and fresh-ground espresso mingles in the air, soft music invites you to stay a while. This is The Green Witch Cafe — a plant-forward sanctuary in the heart of Highland.
                                </p>

                                {/* Mobile-only infinite carousel — inserted between paragraphs */}
                                <div className="md:hidden -mx-6">
                                    {(() => {
                                        const carouselItems = [
                                            { src: `${import.meta.env.BASE_URL}assets/food-sandwich.png`, caption: 'Portobello Pesto on focaccia', style: 'A' },
                                            { src: `${import.meta.env.BASE_URL}assets/food-combo.png`, caption: 'Hearty plant-forward plates', style: 'B' },
                                            { src: `${import.meta.env.BASE_URL}assets/food-drink.png`, caption: 'Fresh juices pressed to order', style: 'C' },
                                            { src: `${import.meta.env.BASE_URL}assets/food-flatbread.png`, caption: 'Vegan flatbread with hummus', style: 'A' },
                                        ];
                                        // Triple the items for infinite illusion
                                        const tripled = [...carouselItems, ...carouselItems, ...carouselItems];
                                        const renderFrame = (item, i) => {
                                            const img = <img src={item.src} alt={item.caption} className="w-full h-full object-cover" loading="lazy" />;
                                            if (item.style === 'A') return (
                                                <div key={i} className="flex-shrink-0 w-[72%] snap-center">
                                                    <div className="border border-brand-text/30">
                                                        <div className="aspect-square overflow-hidden">{img}</div>
                                                    </div>
                                                    <p className="font-sans text-xs tracking-wide text-brand-text/70 mt-2 text-left">{item.caption}</p>
                                                </div>
                                            );
                                            if (item.style === 'B') return (
                                                <div key={i} className="flex-shrink-0 w-[72%] snap-center">
                                                    <div className="border border-brand-text/30 p-1.5">
                                                        <div className="border border-brand-text/15">
                                                            <div className="aspect-[4/5] overflow-hidden">{img}</div>
                                                        </div>
                                                    </div>
                                                    <p className="font-sans text-xs tracking-wide text-brand-text/70 mt-2 text-left">{item.caption}</p>
                                                </div>
                                            );
                                            return (
                                                <div key={i} className="flex-shrink-0 w-[72%] snap-center">
                                                    <div className="flex">
                                                        <div className="w-1.5 bg-brand-accent flex-shrink-0"></div>
                                                        <div className="border-y border-r border-brand-text/30 flex-1">
                                                            <div className="aspect-square overflow-hidden">{img}</div>
                                                        </div>
                                                    </div>
                                                    <p className="font-sans text-xs tracking-wide text-brand-text/70 mt-2 text-left">{item.caption}</p>
                                                </div>
                                            );
                                        };
                                        return (
                                            <InfiniteCarousel items={tripled} count={carouselItems.length} renderFrame={renderFrame} />
                                        );
                                    })()}
                                </div>

                                <p>
                                    Begin with a Glow juice — turmeric, carrot, apple and ginger pressed to order — or a Golden Milk latte steamed with cinnamon. Our Portobello Pesto Sandwich layers grilled portobello, spinach and provolone on focaccia, while the Buddha Bowl brings mixed greens, grains, and seasonal vegetables.
                                </p>
                                <p>
                                    Linger over a Blind Date smoothie of raw cacao and banana, or our vegan Banana Bread. Before you leave, browse sage bundles, incense, crystals, and candles in our retail nook. Every visit is an invitation to slow down.
                                </p>
                            </div>

                            {/* CTA Buttons */}
                            <div className="flex gap-4 mt-8">
                                <a
                                    href="#/menu"
                                    className="border border-brand-text text-sm font-bold uppercase tracking-widest text-brand-text px-6 py-3 hover:bg-brand-text hover:text-brand-bg transition-colors duration-300"
                                >
                                    View Menu
                                </a>
                                <a
                                    href="https://order.online/store/the-green-witch-cafe-highland-1441314?pickup=true"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="border border-brand-text text-sm font-bold uppercase tracking-widest text-brand-text px-6 py-3 hover:bg-brand-text hover:text-brand-bg transition-colors duration-300"
                                >
                                    Order Online
                                </a>
                            </div>
                        </div>

                        {/* ── RIGHT COLUMN: Images (Desktop Only) ── */}
                        <div className="hidden md:flex md:col-span-7 flex-col gap-6">

                            {/* Large Hero Image — Style B: Double border */}
                            <div className="group">
                                <div className="border border-brand-text/30 p-1.5 bg-brand-secondary/10">
                                    <div className="aspect-[4/3] overflow-hidden">
                                        <img src={`${import.meta.env.BASE_URL}assets/food-sandwich.png`} alt="Portobello Pesto Sandwich" className="w-full h-full object-cover" loading="lazy" />
                                    </div>
                                </div>
                                <p className="font-sans text-xs tracking-widest uppercase mt-3 text-brand-text">
                                    <span className="font-extrabold">ABOVE:</span> Portobello Pesto Sandwich on focaccia
                                </p>
                            </div>

                            {/* Two Smaller Images Side-by-Side */}
                            <div className="grid grid-cols-2 gap-6">
                                {/* Small Image 1 */}
                                <div>
                                    <div className="border border-brand-text/30">
                                        <div className="aspect-[4/3] overflow-hidden">
                                            <img src={`${import.meta.env.BASE_URL}assets/food-combo.png`} alt="Plant-forward combo plate" className="w-full h-full object-cover" loading="lazy" />
                                        </div>
                                    </div>
                                    <p className="font-sans text-xs tracking-widest uppercase mt-3 text-brand-text">
                                        <span className="font-extrabold">ABOVE:</span> Hearty plant-forward plates
                                    </p>
                                </div>
                                {/* Small Image 2 */}
                                <div>
                                    <div className="border border-brand-text/30">
                                        <div className="aspect-[4/3] overflow-hidden">
                                            <img src={`${import.meta.env.BASE_URL}assets/food-drink.png`} alt="Fresh pressed juice" className="w-full h-full object-cover object-top" loading="lazy" />
                                        </div>
                                    </div>
                                    <p className="font-sans text-xs tracking-widest uppercase mt-3 text-brand-text">
                                        <span className="font-extrabold">ABOVE:</span> Fresh juices pressed to order
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* Navigation Cards Section */}
            <section className="bg-brand-bg text-brand-text w-full py-24 px-6 md:px-12 border-t border-brand-text/10">
                <div className="max-w-[1400px] mx-auto">
                    {/* Section Header */}
                    <h2 className="font-serif text-3xl md:text-5xl tracking-wide text-brand-text text-center mb-12 md:mb-16 leading-[1.3] md:leading-[1.4]">
                        Browse Menus, Discover Specials, Explore Gifts
                    </h2>

                    {/* 3 Column Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 lg:gap-12">

                        {/* Card 1: Menu */}
                        <motion.a
                            href="#/menu"
                            className="group block relative w-full aspect-[3/2] md:aspect-[4/5]"
                            initial={{ opacity: 0, x: 80 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: '-50px' }}
                            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <div className="absolute inset-0 overflow-hidden bg-stone-800">
                                <img
                                    src={`${import.meta.env.BASE_URL}assets/menu.png`}
                                    alt="Our Menus"
                                    className="absolute inset-0 w-full h-full object-cover opacity-90 transition-transform duration-[1.5s] ease-out"
                                    loading="lazy"
                                />
                            </div>
                            {/* Inner Box */}
                            <div className="absolute bottom-6 -right-6 w-[88%] md:w-auto md:bottom-6 md:left-6 md:right-6 mix-blend-normal z-10 transition-transform duration-500 ease-out md:group-hover:-translate-y-2">
                                <div className="w-full bg-brand-bg border-y border-l border-r-0 md:border-r border-brand-text shadow-2xl relative p-1.5 pr-0 md:pr-1.5">
                                    <div className="border-y border-l border-r-0 md:border-r border-brand-text/30 py-3 md:py-6 pr-8 pl-4 md:px-6 flex flex-col justify-center text-center">
                                        <h3 className="font-serif font-bold text-xl md:text-2xl tracking-[0.2em] text-brand-text uppercase mb-1 md:mb-2">Menus</h3>
                                        <p className="font-serif font-bold italic text-base md:text-lg text-brand-text/90">Plant-forward food & beverages</p>

                                        {/* Mobile: Persistent Arrow, Desktop: Expandable Hover Arrow */}
                                        <div className="w-full flex justify-end md:justify-center mt-2 md:mt-0">
                                            <div className="grid grid-rows-[1fr] md:grid-rows-[0fr] md:group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] w-full">
                                                <div className="overflow-hidden flex flex-col items-end md:items-center">
                                                    <div className="pt-1 md:pt-2 flex flex-col items-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500">
                                                        <div className="flex items-center justify-end md:justify-center py-1 mt-0 md:group-hover:mt-2 transition-[margin] duration-700 ease-out pr-2 md:pr-0">
                                                            <div className="h-[1px] w-12 md:w-0 md:group-hover:w-16 bg-brand-text transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] relative flex items-center justify-end">
                                                                <svg className="w-4 h-4 text-brand-text translate-x-1/2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500 absolute right-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5l7 7-7 7" />
                                                                </svg>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.a>

                        {/* Card 2: Specials */}
                        <motion.a
                            href="https://facebook.com/greenwitchcafe"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group block relative w-full aspect-[3/2] md:aspect-[4/5]"
                            initial={{ opacity: 0, x: 80 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: '-50px' }}
                            transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <div className="absolute inset-0 overflow-hidden bg-stone-800">
                                <img
                                    src={`${import.meta.env.BASE_URL}assets/Specials.jpg`}
                                    alt="Daily Specials"
                                    className="absolute inset-0 w-full h-full object-cover opacity-90 transition-transform duration-[1.5s] ease-out"
                                    loading="lazy"
                                />
                            </div>
                            {/* Inner Box */}
                            <div className="absolute bottom-6 -right-6 w-[88%] md:w-auto md:bottom-6 md:left-6 md:right-6 mix-blend-normal z-10 transition-transform duration-500 ease-out md:group-hover:-translate-y-2">
                                <div className="w-full bg-brand-bg border-y border-l border-r-0 md:border-r border-brand-text shadow-2xl relative p-1.5 pr-0 md:pr-1.5">
                                    <div className="border-y border-l border-r-0 md:border-r border-brand-text/30 py-3 md:py-6 pr-8 pl-4 md:px-6 flex flex-col justify-center text-center">
                                        <h3 className="font-serif font-bold text-xl md:text-2xl tracking-[0.2em] text-brand-text uppercase mb-1 md:mb-2">Specials</h3>
                                        <p className="font-serif font-bold italic text-base md:text-lg text-brand-text/90">Rotating seasonal offerings via Facebook</p>

                                        {/* Mobile: Persistent Arrow, Desktop: Expandable Hover Arrow */}
                                        <div className="w-full flex justify-end md:justify-center mt-2 md:mt-0">
                                            <div className="grid grid-rows-[1fr] md:grid-rows-[0fr] md:group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] w-full">
                                                <div className="overflow-hidden flex flex-col items-end md:items-center">
                                                    <div className="pt-1 md:pt-2 flex flex-col items-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500">
                                                        <div className="flex items-center justify-end md:justify-center py-1 mt-0 md:group-hover:mt-2 transition-[margin] duration-700 ease-out pr-2 md:pr-0">
                                                            <div className="h-[1px] w-12 md:w-0 md:group-hover:w-16 bg-brand-text transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] relative flex items-center justify-end">
                                                                <svg className="w-4 h-4 text-brand-text translate-x-1/2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500 absolute right-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5l7 7-7 7" />
                                                                </svg>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.a>

                        {/* Card 3: Gift Shop */}
                        <motion.a
                            href="#/menu?tab=gift-shop"
                            className="group block relative w-full aspect-[3/2] md:aspect-[4/5]"
                            initial={{ opacity: 0, x: 80 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: '-50px' }}
                            transition={{ duration: 0.6, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <div className="absolute inset-0 overflow-hidden bg-stone-800">
                                <img
                                    src={`${import.meta.env.BASE_URL}assets/vibe4.png`}
                                    alt="Our Gift Shop"
                                    className="absolute inset-0 w-full h-full object-cover opacity-90 transition-transform duration-[1.5s] ease-out"
                                    loading="lazy"
                                />
                            </div>
                            {/* Inner Box */}
                            <div className="absolute bottom-6 -right-6 w-[88%] md:w-auto md:bottom-6 md:left-6 md:right-6 mix-blend-normal z-10 transition-transform duration-500 ease-out md:group-hover:-translate-y-2">
                                <div className="w-full bg-brand-bg border-y border-l border-r-0 md:border-r border-brand-text shadow-2xl relative p-1.5 pr-0 md:pr-1.5">
                                    <div className="border-y border-l border-r-0 md:border-r border-brand-text/30 py-3 md:py-6 pr-8 pl-4 md:px-6 flex flex-col justify-center text-center">
                                        <h3 className="font-serif font-bold text-xl md:text-2xl tracking-[0.2em] text-brand-text uppercase mb-1 md:mb-2">Gift Shop</h3>
                                        <p className="font-serif font-bold italic text-base md:text-lg text-brand-text/90">Curated gifts, art, and sundries</p>

                                        {/* Mobile: Persistent Arrow, Desktop: Expandable Hover Arrow */}
                                        <div className="w-full flex justify-end md:justify-center mt-2 md:mt-0">
                                            <div className="grid grid-rows-[1fr] md:grid-rows-[0fr] md:group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] w-full">
                                                <div className="overflow-hidden flex flex-col items-end md:items-center">
                                                    <div className="pt-1 md:pt-2 flex flex-col items-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500">
                                                        <div className="flex items-center justify-end md:justify-center py-1 mt-0 md:group-hover:mt-2 transition-[margin] duration-700 ease-out pr-2 md:pr-0">
                                                            <div className="h-[1px] w-12 md:w-0 md:group-hover:w-16 bg-brand-text transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] relative flex items-center justify-end">
                                                                <svg className="w-4 h-4 text-brand-text translate-x-1/2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500 absolute right-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5l7 7-7 7" />
                                                                </svg>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.a>

                    </div>
                </div>
            </section>

            {/* Hours & Visit Us Section */}
            <section id="hours" className="bg-brand-bg text-brand-text w-full py-24 md:py-32 px-6 md:px-12 border-t border-brand-text/10">
                <div className="max-w-[1200px] mx-auto">

                    {/* Section Title */}
                    <h2 className="font-serif text-4xl md:text-5xl tracking-wide text-brand-text text-center mb-16 md:mb-20">Visit Us</h2>

                    {/* === DESKTOP LAYOUT === */}
                    <div className="hidden md:block">
                        <div className="grid grid-cols-[1fr_auto_1fr] gap-0 items-start">

                            {/* Left: Map Only */}
                            <div className="pr-12">
                                <div className="w-full aspect-square overflow-hidden border border-brand-text/20">
                                    <iframe
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2979.3!2d-87.4547!3d41.5536!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8811c1e7b67ade7b%3A0x4b4a1a0a1a1a1a1a!2s2845%20Highway%20Ave%2C%20Highland%2C%20IN%2046322!5e0!3m2!1sen!2sus!4v1"
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0 }}
                                        allowFullScreen=""
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                        title="Green Witch Cafe Location"
                                    ></iframe>
                                </div>
                            </div>

                            {/* Center: Vertical Divider */}
                            <div className="flex justify-center self-stretch">
                                <div className="w-[3px] bg-brand-accent h-full"></div>
                            </div>

                            {/* Right: Info — vertically centered to map */}
                            <div className="pl-12 flex flex-col justify-center gap-10 self-stretch">

                                {/* Opening Times */}
                                <div>
                                    <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-brand-text mb-3">Opening Times</h3>
                                    <div className="font-sans text-[15px] text-brand-text/90 space-y-1">
                                        <div className="flex justify-between max-w-sm">
                                            <span>Tuesday – Saturday</span>
                                            <span>9:00 AM – 4:00 PM</span>
                                        </div>
                                        <div className="flex justify-between max-w-sm">
                                            <span>Sunday – Monday</span>
                                            <span>Closed</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Address */}
                                <div>
                                    <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-brand-text mb-3">Address</h3>
                                    <div className="font-sans text-[15px] text-brand-text/90 leading-relaxed">
                                        <p>The Green Witch Cafe</p>
                                        <p>2845 Highway Ave</p>
                                        <p>Highland, IN 46322</p>
                                    </div>
                                </div>

                                {/* Contact */}
                                <div>
                                    <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-brand-text mb-3">Contact</h3>
                                    <div className="font-sans text-[15px] text-brand-text/90">
                                        <p>Tel: <a href="tel:+12199233800" className="hover:text-brand-accent transition-colors">(219) 923-3800</a></p>
                                    </div>
                                </div>

                            </div>
                        </div>

                        {/* Directions button — outside the grid, below the map */}
                        <a
                            href="https://www.google.com/maps/dir/?api=1&destination=2845+Highway+Ave,+Highland,+IN+46322"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block mt-6 border border-brand-text bg-transparent text-brand-text px-8 py-2.5 text-sm font-bold uppercase tracking-widest transition-colors duration-300 hover:bg-brand-text hover:text-brand-bg"
                        >
                            Directions
                        </a>
                    </div>

                    {/* === MOBILE LAYOUT === */}
                    <div className="md:hidden flex flex-col items-center">

                        {/* Map */}
                        <div className="w-full aspect-[4/3] overflow-hidden border border-brand-text/20 mb-4">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2979.3!2d-87.4547!3d41.5536!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8811c1e7b67ade7b%3A0x4b4a1a0a1a1a1a1a!2s2845%20Highway%20Ave%2C%20Highland%2C%20IN%2046322!5e0!3m2!1sen!2sus!4v1"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Green Witch Cafe Location"
                            ></iframe>
                        </div>

                        {/* Directions Button */}
                        <a
                            href="https://www.google.com/maps/dir/?api=1&destination=2845+Highway+Ave,+Highland,+IN+46322"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="self-start border border-brand-text text-sm font-bold uppercase tracking-widest text-brand-text px-8 py-2.5 mb-10 hover:bg-brand-text hover:text-brand-bg transition-colors duration-300"
                        >
                            Directions
                        </a>

                        {/* Accordion Sections */}
                        <div className="w-full flex flex-col border-t border-brand-text/15">

                            {/* Opening Times Accordion */}
                            {(() => {
                                const sections = [
                                    {
                                        key: 'times',
                                        title: 'Opening Times',
                                        content: (
                                            <div className="font-sans text-[15px] text-brand-text/90 space-y-1.5">
                                                <div className="flex justify-between max-w-xs">
                                                    <span>Tuesday – Saturday</span>
                                                    <span>9:00 AM – 4:00 PM</span>
                                                </div>
                                                <div className="flex justify-between max-w-xs">
                                                    <span>Sunday – Monday</span>
                                                    <span>Closed</span>
                                                </div>
                                            </div>
                                        )
                                    },
                                    {
                                        key: 'address',
                                        title: 'Address',
                                        content: (
                                            <div className="font-sans text-[15px] text-brand-text/90 leading-relaxed">
                                                <p>The Green Witch Cafe</p>
                                                <p>2845 Highway Ave</p>
                                                <p>Highland, IN 46322</p>
                                            </div>
                                        )
                                    },
                                    {
                                        key: 'contact',
                                        title: 'Contact',
                                        content: (
                                            <div className="font-sans text-[15px] text-brand-text/90">
                                                <p>Tel: <a href="tel:+12199233800" className="hover:text-brand-accent transition-colors">(219) 923-3800</a></p>
                                            </div>
                                        )
                                    }
                                ];
                                return sections.map(section => (
                                    <AccordionItem key={section.key} title={section.title}>
                                        {section.content}
                                    </AccordionItem>
                                ));
                            })()}

                        </div>
                    </div>

                </div>
            </section>
        </div>
    );
}
