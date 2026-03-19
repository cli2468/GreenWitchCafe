import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useInView, useReducedMotion } from 'framer-motion';

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
                <span
                    className="text-brand-text/50 text-xl font-light transition-transform duration-300 ease-out"
                    style={{ transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)' }}
                >+</span>
            </button>
            <div
                className="grid transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.04,0.62,0.23,0.98)]"
                style={{
                    gridTemplateRows: isOpen ? '1fr' : '0fr',
                    opacity: isOpen ? 1 : 0,
                }}
            >
                <div className="overflow-hidden">
                    <div className="pb-6 pl-6">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Infinite-scroll carousel: items are doubled, starts at the beginning, loops right seamlessly
const InfiniteCarousel = ({ items, count, renderFrame }) => {
    const scrollRef = useRef(null);
    const isJumping = useRef(false);

    // Start at position 0 — leftmost item, nothing on the left
    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;
        el.style.scrollBehavior = 'auto';
        el.scrollLeft = 0;
        el.style.scrollBehavior = '';
    }, [count]);

    // When user scrolls past the first set into the duplicate, jump back
    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;

        let scrollTimer = null;

        const checkBounds = () => {
            if (isJumping.current) return;
            const { scrollLeft, scrollWidth } = el;
            // First set ends at half the scroll width (since items are doubled)
            const oneSetWidth = scrollWidth / 2;

            if (scrollLeft >= oneSetWidth - 10) {
                // Scrolled into the duplicate set — jump back to equivalent spot in first set
                isJumping.current = true;
                el.style.scrollBehavior = 'auto';
                el.scrollLeft = scrollLeft - oneSetWidth;
                el.style.scrollBehavior = '';
                requestAnimationFrame(() => { isJumping.current = false; });
            }
        };

        const onScroll = () => {
            clearTimeout(scrollTimer);
            scrollTimer = setTimeout(checkBounds, 150);
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
    const cardsRef = useRef(null);
    const galleryRef = useRef(null);
    const drinksRef = useRef(null);
    const shouldReduceMotion = useReducedMotion();
    const cardsInView = useInView(cardsRef, { once: true, margin: '-80px' });
    const galleryInView = useInView(galleryRef, { once: true, margin: '-60px' });
    const aboutInView = useInView(storyRef, { once: true, margin: '-10% 0px -10% 0px' });
    const drinksInView = useInView(drinksRef, { once: true, margin: '-10% 0px -5% 0px' });
    const { scrollYProgress } = useScroll({
        target: storyRef,
        offset: ["start 85%", "start 15%"]
    });
    const revealEase = [0.23, 1, 0.32, 1];

    const line1 = "We believe in excellent food – ";
    const line2 = "that just happens to be vegan.";
    const totalChars = line1.length + line2.length;
    const openingHours = [
        { day: 'Sunday', hours: 'Closed' },
        { day: 'Monday', hours: 'Closed' },
        { day: 'Tuesday', hours: '9:00 AM - 4:00 PM' },
        { day: 'Wednesday', hours: '9:00 AM - 4:00 PM' },
        { day: 'Thursday', hours: '9:00 AM - 4:00 PM' },
        { day: 'Friday', hours: '9:00 AM - 4:00 PM' },
        { day: 'Saturday', hours: '9:00 AM - 4:00 PM' },
    ];
    const todayIndex = new Date().getDay();

    return (
        <div className="w-full" style={{ overflowX: 'clip' }}>
            {/* Dark Green Background Wrapper for Hero and Nav Area */}
            <div className="w-full bg-brand-primary pt-12 md:pt-10 pb-4">
                {/* Hero Section - Framed Image Layout without text */}
                <section className="px-2 md:px-8 pb-12 max-w-[1600px] mx-auto">
                    <motion.div
                        initial={{ clipPath: "polygon(0 0, 100% 0, 100% 3%, 0 3%)", opacity: 0 }}
                        animate={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)", opacity: 1 }}
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
            <section id="about" ref={storyRef} className="bg-brand-bg text-brand-text w-full py-16 md:py-20 px-6 md:px-12 border-t border-brand-text/10">
                <div className="max-w-[1400px] mx-auto">

                    {/* Desktop: 2-Column Grid (Text Left, Images Right) */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-20 md:items-center">

                        {/* ── LEFT COLUMN: Text ── */}
                        <div className="md:col-span-5 flex flex-col">

                            {/* Decorative Accent Line */}
                            <div className="w-24 h-[3px] bg-brand-accent mb-6"></div>

                            {/* Category Label */}
                            <p className="font-sans text-xs md:text-sm font-bold uppercase tracking-[0.25em] text-stone-900 mb-3">
                                {['Plant-Forward', 'Fare'].map((word, index) => (
                                    <motion.span
                                        key={word}
                                        className="inline-block mr-[0.25em]"
                                        initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
                                        animate={aboutInView ? { opacity: 1, y: 0 } : {}}
                                        transition={{ duration: 0.38, delay: 0.06 + (index * 0.06), ease: revealEase }}
                                    >
                                        {word}
                                    </motion.span>
                                ))}
                            </p>

                            {/* Headline */}
                            <h2 className="font-serif font-semibold text-3xl md:text-4xl leading-[1.3] tracking-wide text-stone-900 mb-8 md:mb-10">
                                {'Nourish your way through the day'.split('').map((char, index) => (
                                    <motion.span
                                        key={`${char}-${index}`}
                                        className="inline-block"
                                        initial={shouldReduceMotion ? { opacity: 1, filter: 'blur(0px)' } : { opacity: 0, filter: 'blur(8px)' }}
                                        animate={aboutInView ? { opacity: 1, filter: 'blur(0px)' } : {}}
                                        transition={{ duration: 0.36, delay: 0.14 + (index * 0.042), ease: revealEase }}
                                    >
                                        {char === ' ' ? '\u00A0' : char}
                                    </motion.span>
                                ))}
                            </h2>

                            {/* Body Paragraphs — Justified like Dishoom */}
                            <div className="font-serif font-semibold text-xl md:text-xl leading-[1.8] md:leading-[1.9] text-stone-900/95 text-justify space-y-6">
                                <p>
                                    Walk through our doors on Highway Ave and let the outside world dissolve. The scent of sage and fresh-ground espresso mingles in the air, soft music invites you to stay a while. This is The Green Witch Cafe — a plant-forward sanctuary in the heart of Highland.
                                </p>

                                {/* Mobile-only infinite carousel — inserted between paragraphs */}
                                <div className="md:hidden -mx-6">
                                    {(() => {
                                        const carouselItems = [
                                            { src: `${import.meta.env.BASE_URL}assets/food-sandwich.png`, caption: 'Portobello Pesto on focaccia', style: 'A' },
                                            { src: `${import.meta.env.BASE_URL}assets/food-combo.png`, caption: 'Hearty plant-forward plates', style: 'B' },
                                            { src: `${import.meta.env.BASE_URL}assets/Strawberry.png`, caption: 'Fresh juices pressed to order', style: 'C' },
                                            { src: `${import.meta.env.BASE_URL}assets/food-flatbread.png`, caption: 'Vegan flatbread with hummus', style: 'D' },
                                        ];
                                        // Double the items for seamless right-scroll loop
                                        const doubled = [...carouselItems, ...carouselItems];
                                        const renderFrame = (item, i) => {
                                            const img = <img src={item.src} alt={item.caption} className="w-full h-full object-cover" loading="lazy" />;

                                            {/* Style A — Thin double border, both spaced from image */}
                                            if (item.style === 'A') return (
                                                <div key={i} className="flex-shrink-0 w-[72%] snap-center">
                                                    <div className="border border-black p-1">
                                                        <div className="border border-black p-1">
                                                            <div className="aspect-square overflow-hidden">{img}</div>
                                                        </div>
                                                    </div>
                                                    <p className="font-sans text-xs tracking-wide text-brand-text/70 mt-2 text-left">{item.caption}</p>
                                                </div>
                                            );

                                            {/* Style B — Thick border, spaced from image */}
                                            if (item.style === 'B') return (
                                                <div key={i} className="flex-shrink-0 w-[72%] snap-center">
                                                    <div className="border-[3px] border-black p-1">
                                                        <div className="aspect-[4/5] overflow-hidden">{img}</div>
                                                    </div>
                                                    <p className="font-sans text-xs tracking-wide text-brand-text/70 mt-2 text-left">{item.caption}</p>
                                                </div>
                                            );

                                            {/* Style C — Accent bar left + borders (touches image) */}
                                            if (item.style === 'C') return (
                                                <div key={i} className="flex-shrink-0 w-[72%] snap-center">
                                                    <div className="flex">
                                                        <div className="w-2 bg-brand-accent flex-shrink-0"></div>
                                                        <div className="border-y-2 border-r-2 border-brand-accent flex-1">
                                                            <div className="aspect-square overflow-hidden">{img}</div>
                                                        </div>
                                                    </div>
                                                    <p className="font-sans text-xs tracking-wide text-brand-text/70 mt-2 text-left">{item.caption}</p>
                                                </div>
                                            );

                                            {/* Style D — No corners: edge borders with gaps at corners */}
                                            return (
                                                <div key={i} className="flex-shrink-0 w-[72%] snap-center">
                                                    <div className="relative p-2">
                                                        {/* Top edge */}
                                                        <div className="absolute top-0 left-2 right-2 border-t-2 border-black"></div>
                                                        {/* Bottom edge */}
                                                        <div className="absolute bottom-0 left-2 right-2 border-t-2 border-black"></div>
                                                        {/* Left edge */}
                                                        <div className="absolute left-0 top-2 bottom-2 border-l-2 border-black"></div>
                                                        {/* Right edge */}
                                                        <div className="absolute right-0 top-2 bottom-2 border-r-2 border-black"></div>
                                                        <div className="aspect-[4/5] overflow-hidden">{img}</div>
                                                    </div>
                                                    <p className="font-sans text-xs tracking-wide text-brand-text/70 mt-2 text-left">{item.caption}</p>
                                                </div>
                                            );
                                        };
                                        return (
                                            <InfiniteCarousel items={doubled} count={carouselItems.length} renderFrame={renderFrame} />
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
                                    className="border border-brand-text text-sm font-bold uppercase tracking-widest bg-brand-text text-brand-bg md:bg-transparent md:text-brand-text px-6 py-3 [@media(hover:hover)]:hover:bg-brand-text [@media(hover:hover)]:hover:text-brand-bg transition-[background-color,color,transform] duration-200 ease-out active:scale-[0.97]"
                                >
                                    View Menu
                                </a>
                                <a
                                    href="https://order.online/store/the-green-witch-cafe-highland-1441314?pickup=true"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="border border-brand-accent text-sm font-bold uppercase tracking-widest bg-brand-accent text-brand-bg md:bg-transparent md:text-brand-accent px-6 py-3 [@media(hover:hover)]:hover:bg-brand-accent [@media(hover:hover)]:hover:text-brand-bg transition-[background-color,color,transform] duration-200 ease-out active:scale-[0.97]"
                                >
                                    Order Online
                                </a>
                            </div>
                        </div>

                        {/* ── RIGHT COLUMN: Images (Desktop Only) ── */}
                        <div className="hidden md:flex md:col-span-7 flex-col gap-6">

                            {/* Large Hero Image — Thin double border, both spaced from image */}
                            <div className="group">
                                <div className="border border-black p-1">
                                    <div className="border border-black p-1">
                                        <div className="aspect-[4/3] overflow-hidden">
                                            <img src={`${import.meta.env.BASE_URL}assets/food-sandwich.png`} alt="Portobello Pesto Sandwich" className="w-full h-full object-cover" loading="lazy" />
                                        </div>
                                    </div>
                                </div>
                                <p className="font-sans text-xs tracking-widest uppercase mt-3 text-brand-text">
                                    <span className="font-extrabold">ABOVE:</span> Portobello Pesto Sandwich on focaccia
                                </p>
                            </div>

                            {/* Two Smaller Images Side-by-Side */}
                            <div className="grid grid-cols-2 gap-6">
                                {/* Small Image 1 — Thick border, spaced from image */}
                                <div>
                                    <div className="border-[3px] border-black p-1">
                                        <div className="aspect-square overflow-hidden">
                                            <img src={`${import.meta.env.BASE_URL}assets/food-combo.png`} alt="Plant-forward combo plate" className="w-full h-full object-cover" loading="lazy" />
                                        </div>
                                    </div>
                                    <p className="font-sans text-xs tracking-widest uppercase mt-3 text-brand-text">
                                        <span className="font-extrabold">ABOVE:</span> Hearty plant-forward plates
                                    </p>
                                </div>
                                {/* Small Image 2 — No corners: edge borders with gaps at corners */}
                                <div>
                                    <div className="relative p-2">
                                        {/* Top edge */}
                                        <div className="absolute top-0 left-2 right-2 border-t-2 border-black"></div>
                                        {/* Bottom edge */}
                                        <div className="absolute bottom-0 left-2 right-2 border-t-2 border-black"></div>
                                        {/* Left edge */}
                                        <div className="absolute left-0 top-2 bottom-2 border-l-2 border-black"></div>
                                        {/* Right edge */}
                                        <div className="absolute right-0 top-2 bottom-2 border-r-2 border-black"></div>
                                        <div className="aspect-square overflow-hidden">
                                            <img src={`${import.meta.env.BASE_URL}assets/Strawberry.png`} alt="Fresh strawberry drink" className="w-full h-full object-cover object-top" loading="lazy" />
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

            {/* ═══════ Photo Gallery / Ambiance Strip (hidden) ═══════ */}
            {false && <section className="bg-brand-primary text-brand-bg w-full py-16 md:py-24 overflow-hidden">
                <div ref={galleryRef} className="max-w-[1600px] mx-auto px-6 md:px-12">
                    {/* Section Label */}
                    <div className="flex items-center gap-4 mb-10 md:mb-14">
                        <div className="w-8 h-[2px] bg-brand-accent"></div>
                        <p className="font-sans text-xs font-bold uppercase tracking-[0.25em] text-brand-bg/70">Step Inside</p>
                    </div>

                    {/* Masonry-style image grid — asymmetric per restaurant-frontend-skill Rule 3 */}
                    <div className="grid grid-cols-2 md:grid-cols-12 gap-3 md:gap-4">
                        {/* Large left image */}
                        <motion.div
                            className="col-span-2 md:col-span-7 md:row-span-2 overflow-hidden"
                            initial={{ opacity: 0, transform: "translateY(30px)" }}
                            animate={galleryInView ? { opacity: 1, transform: "translateY(0px)" } : {}}
                            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                        >
                            <div className="aspect-[4/3] md:aspect-auto md:h-full relative overflow-hidden">
                                <img
                                    src={`${import.meta.env.BASE_URL}assets/GWCAmbiance2.jpg`}
                                    alt="The warm, inviting interior of The Green Witch Cafe — sage and crystals line the shelves"
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/30 via-transparent to-transparent pointer-events-none"></div>
                            </div>
                        </motion.div>

                        {/* Top right */}
                        <motion.div
                            className="col-span-1 md:col-span-5 overflow-hidden"
                            initial={{ opacity: 0, transform: "translateY(30px)" }}
                            animate={galleryInView ? { opacity: 1, transform: "translateY(0px)" } : {}}
                            transition={{ duration: 0.5, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
                        >
                            <div className="aspect-square relative overflow-hidden">
                                <img
                                    src={`${import.meta.env.BASE_URL}assets/food-drink.png`}
                                    alt="Fresh-pressed Glow Juice with turmeric and ginger"
                                    className="w-full h-full object-cover object-top"
                                    loading="lazy"
                                />
                            </div>
                        </motion.div>

                        {/* Bottom right */}
                        <motion.div
                            className="col-span-1 md:col-span-5 overflow-hidden"
                            initial={{ opacity: 0, transform: "translateY(30px)" }}
                            animate={galleryInView ? { opacity: 1, transform: "translateY(0px)" } : {}}
                            transition={{ duration: 0.5, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
                        >
                            <div className="aspect-square relative overflow-hidden">
                                <img
                                    src={`${import.meta.env.BASE_URL}assets/vibe2.png`}
                                    alt="Crystals, incense, and handmade candles in our retail boutique"
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>}

            {/* ═══════ Drinks Section — Sticky Left + Scrolling Right Photos ═══════ */}
            <section id="drinks-experience" ref={drinksRef} className="bg-brand-primary text-brand-bg w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 md:items-start max-w-[1600px] mx-auto">

                    {/* ── LEFT COLUMN: Sticky content ── */}
                    <div className="md:sticky md:self-start md:top-0 flex flex-col px-6 md:px-12 lg:px-16 py-16 md:pt-9 md:pb-4 md:min-h-screen md:justify-between">
                        <div>
                        <h2 className="font-serif font-semibold text-4xl md:text-5xl lg:text-[3.5rem] xl:text-[3.7rem] leading-[1.02] tracking-wide text-brand-bg uppercase mb-5">
                            <span className="block">
                                {'Drinks That'.split('').map((char, index) => (
                                    <motion.span
                                        key={`drinks-line-1-${char}-${index}`}
                                        className="inline-block"
                                        initial={shouldReduceMotion ? { opacity: 1, filter: 'blur(0px)' } : { opacity: 0, filter: 'blur(8px)' }}
                                        animate={drinksInView ? { opacity: 1, filter: 'blur(0px)' } : {}}
                                        transition={{ duration: 0.36, delay: 0.1 + (index * 0.042), ease: revealEase }}
                                    >
                                        {char === ' ' ? '\u00A0' : char}
                                    </motion.span>
                                ))}
                            </span>
                            <span className="block">
                                {'Complete'.split('').map((char, index) => (
                                    <motion.span
                                        key={`drinks-line-2-${char}-${index}`}
                                        className="inline-block"
                                        initial={shouldReduceMotion ? { opacity: 1, filter: 'blur(0px)' } : { opacity: 0, filter: 'blur(8px)' }}
                                        animate={drinksInView ? { opacity: 1, filter: 'blur(0px)' } : {}}
                                        transition={{ duration: 0.36, delay: 0.56 + (index * 0.042), ease: revealEase }}
                                    >
                                        {char === ' ' ? '\u00A0' : char}
                                    </motion.span>
                                ))}
                            </span>
                            <span className="block">
                                {'The Experience'.split('').map((char, index) => (
                                    <motion.span
                                        key={`drinks-line-3-${char}-${index}`}
                                        className="inline-block"
                                        initial={shouldReduceMotion ? { opacity: 1, filter: 'blur(0px)' } : { opacity: 0, filter: 'blur(8px)' }}
                                        animate={drinksInView ? { opacity: 1, filter: 'blur(0px)' } : {}}
                                        transition={{ duration: 0.36, delay: 0.94 + (index * 0.042), ease: revealEase }}
                                    >
                                        {char === ' ' ? '\u00A0' : char}
                                    </motion.span>
                                ))}
                            </span>
                        </h2>
                        <p className="font-sans text-base md:text-[1.05rem] leading-[1.6] text-brand-bg/70 max-w-md mb-6">
                            From signature elixirs to fresh-pressed juices, every drink is crafted to refresh, restore, and pair with your meal.
                        </p>
                        <div className="mb-8">
                            <a
                                href="#/menu?tab=drinks"
                                    className="inline-block border border-brand-bg bg-brand-bg text-sm font-bold uppercase tracking-widest text-brand-primary px-8 py-3 shadow-[0_10px_30px_rgba(12,22,8,0.18)] [@media(hover:hover)]:hover:bg-transparent [@media(hover:hover)]:hover:text-brand-bg transition-[background-color,color,transform,box-shadow] duration-200 ease-out [@media(hover:hover)]:hover:-translate-y-0.5 [@media(hover:hover)]:hover:shadow-[0_14px_36px_rgba(12,22,8,0.24)] active:scale-[0.97]"
                            >
                                Open Menu
                            </a>
                        </div>

                        {/* Drink list — 6 items */}
                        </div>
                        <div className="flex flex-col">
                            {[
                                { name: "Black Magic", price: "$5", desc: "Lemonade and activated charcoal." },
                                { name: "Fire Tonic", price: "$5", desc: "Cinnamon, cayenne, agave, apple cider vinegar." },
                                { name: "Morning Elixir", price: "$5", desc: "Fresh lemonade, agave, turmeric, ginger." },
                                { name: "Wicked Lemonade", price: "$5", desc: "Fresh lemonade with cold brew coffee." },
                                { name: "Witch's Brew", price: "$5", desc: "Iced white tea, fresh ginger, lime and agave." },
                            ].map((drink, i) => (
                                <div key={i} className={`py-4 md:py-3 ${i === 0 ? 'border-t' : ''} border-b border-brand-bg/15`}>
                                    <div className="flex justify-between items-baseline mb-1">
                                        <span className="font-serif text-lg text-brand-bg font-medium">{drink.name}</span>
                                        <span className="font-mono text-sm text-brand-bg/50">{drink.price}</span>
                                    </div>
                                    <p className="font-sans text-sm text-brand-bg/40 leading-relaxed">{drink.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── RIGHT COLUMN: Two stacked full-bleed photos ── */}
                    <div className="flex flex-col gap-2 px-2 pb-0 md:px-0 md:pb-0 md:gap-4 md:py-3 md:-mr-3 md:pr-3 lg:-mr-4 lg:pr-4 xl:-mr-6 xl:pr-6">
                        <div className="w-full aspect-square md:aspect-auto md:h-[108vh] overflow-hidden">
                            <img
                                src={`${import.meta.env.BASE_URL}assets/food-drink.png`}
                                alt="Fresh-pressed juice with turmeric, carrot, and ginger"
                                className="w-full h-full object-cover object-top"
                                loading="lazy"
                            />
                        </div>
                        <div className="w-full aspect-square md:aspect-auto md:h-[108vh] overflow-hidden">
                            <img
                                src={`${import.meta.env.BASE_URL}assets/Espresso.png`}
                                alt="Espresso drink in a glass mug"
                                className="w-full h-full object-cover"
                                loading="lazy"
                            />
                        </div>
                    </div>

                </div>
            </section>

            {/* Navigation Cards Section */}
            <section className="bg-brand-primary text-brand-bg w-full py-24 px-6 md:px-12">
                <div className="max-w-[1400px] mx-auto">
                    {/* Section Header */}
                    <h2 className="font-serif text-3xl md:text-5xl tracking-wide text-brand-bg text-center mb-12 md:mb-16 leading-[1.3] md:leading-[1.4]">
                        Browse Menus, Discover Specials, Explore Gifts
                    </h2>

                    {/* 3 Column Grid */}
                    <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 lg:gap-12">

                        {/* Card 1: Menu */}
                        <motion.a
                            href="#/menu"
                            className="group block relative w-full aspect-[3/2] md:aspect-[4/5]"
                            initial={{ opacity: 0, transform: "translateX(60px)" }}
                            animate={cardsInView ? { opacity: 1, transform: "translateX(0px)" } : {}}
                            transition={{ duration: 0.6, delay: 0, ease: [0.4, 0, 0.2, 1] }}
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
                            <motion.div
                                className="absolute bottom-6 -right-6 w-[88%] md:w-auto md:bottom-6 md:left-6 md:right-6 mix-blend-normal z-10 transition-transform duration-300 ease-out [@media(hover:hover)]:md:group-hover:-translate-y-2"
                                initial={{ opacity: 0, transform: "translateX(40px)" }}
                                animate={cardsInView ? { opacity: 1, transform: "translateX(0px)" } : {}}
                                transition={{ duration: 0.5, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
                            >
                                <div className="w-full bg-brand-bg border-y border-l border-r-0 md:border-r border-brand-text shadow-2xl relative p-1.5 pr-0 md:pr-1.5">
                                    <div className="border-y border-l border-r-0 md:border-r border-brand-text/30 py-3 md:py-6 pr-8 pl-4 md:px-6 flex flex-col justify-center text-center">
                                        <h3 className="font-serif font-bold text-xl md:text-2xl tracking-[0.2em] text-brand-text uppercase mb-1 md:mb-2">Menus</h3>
                                        <p className="font-serif font-bold italic text-base md:text-lg text-brand-text/90">Plant-forward food & beverages</p>

                                        {/* Mobile: Persistent Arrow, Desktop: Expandable Hover Arrow */}
                                        <div className="w-full flex justify-end md:justify-center mt-2 md:mt-0">
                                            <div className="grid grid-rows-[1fr] md:grid-rows-[0fr] [@media(hover:hover)]:md:group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-400 ease-[cubic-bezier(0.19,1,0.22,1)] w-full">
                                                <div className="overflow-hidden flex flex-col items-end md:items-center">
                                                    <div className="pt-1 md:pt-2 flex flex-col items-center opacity-100 md:opacity-0 [@media(hover:hover)]:md:group-hover:opacity-100 transition-opacity duration-300">
                                                        <div className="flex items-center justify-end md:justify-center py-1 mt-0 [@media(hover:hover)]:md:group-hover:mt-2 transition-[margin] duration-400 ease-out pr-2 md:pr-0">
                                                            <div className="h-[1px] w-12 md:w-0 [@media(hover:hover)]:md:group-hover:w-16 bg-brand-text transition-[width] duration-400 ease-[cubic-bezier(0.19,1,0.22,1)] relative flex items-center justify-end">
                                                                <svg className="w-4 h-4 text-brand-text translate-x-1/2 opacity-100 md:opacity-0 [@media(hover:hover)]:md:group-hover:opacity-100 transition-opacity duration-300 absolute right-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                            </motion.div>
                        </motion.a>

                        {/* Card 2: Specials */}
                        <motion.a
                            href="https://facebook.com/greenwitchcafe"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group block relative w-full aspect-[3/2] md:aspect-[4/5]"
                            initial={{ opacity: 0, transform: "translateX(60px)" }}
                            animate={cardsInView ? { opacity: 1, transform: "translateX(0px)" } : {}}
                            transition={{ duration: 0.6, delay: 0.15, ease: [0.4, 0, 0.2, 1] }}
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
                            <motion.div
                                className="absolute bottom-6 -right-6 w-[88%] md:w-auto md:bottom-6 md:left-6 md:right-6 mix-blend-normal z-10 transition-transform duration-300 ease-out [@media(hover:hover)]:md:group-hover:-translate-y-2"
                                initial={{ opacity: 0, transform: "translateX(40px)" }}
                                animate={cardsInView ? { opacity: 1, transform: "translateX(0px)" } : {}}
                                transition={{ duration: 0.5, delay: 0.25, ease: [0.4, 0, 0.2, 1] }}
                            >
                                <div className="w-full bg-brand-bg border-y border-l border-r-0 md:border-r border-brand-text shadow-2xl relative p-1.5 pr-0 md:pr-1.5">
                                    <div className="border-y border-l border-r-0 md:border-r border-brand-text/30 py-3 md:py-6 pr-8 pl-4 md:px-6 flex flex-col justify-center text-center">
                                        <h3 className="font-serif font-bold text-xl md:text-2xl tracking-[0.2em] text-brand-text uppercase mb-1 md:mb-2">Specials</h3>
                                        <p className="font-serif font-bold italic text-base md:text-lg text-brand-text/90">Rotating seasonal offerings via Facebook</p>

                                        {/* Mobile: Persistent Arrow, Desktop: Expandable Hover Arrow */}
                                        <div className="w-full flex justify-end md:justify-center mt-2 md:mt-0">
                                            <div className="grid grid-rows-[1fr] md:grid-rows-[0fr] [@media(hover:hover)]:md:group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-400 ease-[cubic-bezier(0.19,1,0.22,1)] w-full">
                                                <div className="overflow-hidden flex flex-col items-end md:items-center">
                                                    <div className="pt-1 md:pt-2 flex flex-col items-center opacity-100 md:opacity-0 [@media(hover:hover)]:md:group-hover:opacity-100 transition-opacity duration-300">
                                                        <div className="flex items-center justify-end md:justify-center py-1 mt-0 [@media(hover:hover)]:md:group-hover:mt-2 transition-[margin] duration-400 ease-out pr-2 md:pr-0">
                                                            <div className="h-[1px] w-12 md:w-0 [@media(hover:hover)]:md:group-hover:w-16 bg-brand-text transition-[width] duration-400 ease-[cubic-bezier(0.19,1,0.22,1)] relative flex items-center justify-end">
                                                                <svg className="w-4 h-4 text-brand-text translate-x-1/2 opacity-100 md:opacity-0 [@media(hover:hover)]:md:group-hover:opacity-100 transition-opacity duration-300 absolute right-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                            </motion.div>
                        </motion.a>

                        {/* Card 3: Gift Shop */}
                        <motion.a
                            href="#/menu?tab=gift-shop"
                            className="group block relative w-full aspect-[3/2] md:aspect-[4/5]"
                            initial={{ opacity: 0, transform: "translateX(60px)" }}
                            animate={cardsInView ? { opacity: 1, transform: "translateX(0px)" } : {}}
                            transition={{ duration: 0.6, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
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
                            <motion.div
                                className="absolute bottom-6 -right-6 w-[88%] md:w-auto md:bottom-6 md:left-6 md:right-6 mix-blend-normal z-10 transition-transform duration-300 ease-out [@media(hover:hover)]:md:group-hover:-translate-y-2"
                                initial={{ opacity: 0, transform: "translateX(40px)" }}
                                animate={cardsInView ? { opacity: 1, transform: "translateX(0px)" } : {}}
                                transition={{ duration: 0.5, delay: 0.4, ease: [0.4, 0, 0.2, 1] }}
                            >
                                <div className="w-full bg-brand-bg border-y border-l border-r-0 md:border-r border-brand-text shadow-2xl relative p-1.5 pr-0 md:pr-1.5">
                                    <div className="border-y border-l border-r-0 md:border-r border-brand-text/30 py-3 md:py-6 pr-8 pl-4 md:px-6 flex flex-col justify-center text-center">
                                        <h3 className="font-serif font-bold text-xl md:text-2xl tracking-[0.2em] text-brand-text uppercase mb-1 md:mb-2">Gift Shop</h3>
                                        <p className="font-serif font-bold italic text-base md:text-lg text-brand-text/90">Curated gifts, art, and sundries</p>

                                        {/* Mobile: Persistent Arrow, Desktop: Expandable Hover Arrow */}
                                        <div className="w-full flex justify-end md:justify-center mt-2 md:mt-0">
                                            <div className="grid grid-rows-[1fr] md:grid-rows-[0fr] [@media(hover:hover)]:md:group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-400 ease-[cubic-bezier(0.19,1,0.22,1)] w-full">
                                                <div className="overflow-hidden flex flex-col items-end md:items-center">
                                                    <div className="pt-1 md:pt-2 flex flex-col items-center opacity-100 md:opacity-0 [@media(hover:hover)]:md:group-hover:opacity-100 transition-opacity duration-300">
                                                        <div className="flex items-center justify-end md:justify-center py-1 mt-0 [@media(hover:hover)]:md:group-hover:mt-2 transition-[margin] duration-400 ease-out pr-2 md:pr-0">
                                                            <div className="h-[1px] w-12 md:w-0 [@media(hover:hover)]:md:group-hover:w-16 bg-brand-text transition-[width] duration-400 ease-[cubic-bezier(0.19,1,0.22,1)] relative flex items-center justify-end">
                                                                <svg className="w-4 h-4 text-brand-text translate-x-1/2 opacity-100 md:opacity-0 [@media(hover:hover)]:md:group-hover:opacity-100 transition-opacity duration-300 absolute right-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                            </motion.div>
                        </motion.a>

                    </div>
                </div>
            </section>

            {/* ═══════ Testimonials — Marquee Banner ═══════ */}
            <section className="bg-brand-bg text-brand-text w-full py-16 md:py-24 border-t border-brand-text/10 overflow-hidden">

                {/* Top row: heading left, Google badge right (desktop) */}
                <div className="px-4 md:px-8 mb-10 md:mb-14">
                    <div className="flex items-start justify-between">
                        <h2 className="font-serif font-semibold text-5xl md:text-8xl tracking-wide text-brand-text uppercase leading-[1.05]">
                            What Our<br />Guests Say
                        </h2>

                        {/* Google rating badge — desktop only */}
                        <div className="hidden md:flex flex-col border border-brand-text/20 min-w-[420px]">
                            {/* Row 1: stars left, logos right */}
                            <div className="flex items-center justify-between px-8 py-5">
                                <div className="flex gap-1.5">
                                    {[...Array(5)].map((_, i) => (
                                        <svg key={i} className="w-6 h-6 text-brand-accent" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>
                                <div className="flex items-center gap-3">
                                    {/* Facebook logo */}
                                    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
                                        <path d="M24 12c0-6.627-5.373-12-12-12S0 5.373 0 12c0 5.99 4.388 10.954 10.125 11.854V15.47H7.078V12h3.047V9.356c0-3.007 1.792-4.668 4.533-4.668 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874V12h3.328l-.532 3.47h-2.796v8.385C19.612 22.954 24 17.99 24 12z" fill="#1877F2"/>
                                    </svg>
                                    {/* Google logo */}
                                    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 001 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                                    </svg>
                                </div>
                            </div>
                            {/* Edge-to-edge divider */}
                            <div className="w-full h-[1px] bg-brand-text/20"></div>
                            {/* Row 2: 4.8/5 on left, Excellent + count on right */}
                            <div className="flex items-center justify-between px-8 py-5 gap-10">
                                <p className="font-serif text-7xl font-semibold text-brand-text leading-none" style={{ fontVariantNumeric: 'lining-nums' }}>
                                    4.8<span className="text-brand-text text-xl font-semibold align-super ml-0.5">/5</span>
                                </p>
                                <div className="flex flex-col">
                                    <span className="font-sans text-lg font-bold text-brand-text">Excellent</span>
                                    <span className="font-sans text-sm text-brand-text/50">Based on 500+ reviews</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Marquee — infinite horizontal scroll of review cards */}
                {(() => {
                    const reviews = [
                        { text: "I wish we would have taken pictures but it was too good to wait!", source: "Google", stars: 5, author: "Stephanie Z." },
                        { text: "Really fresh healthier options, and someone must be a kitchen witch because the juice just kicked my arthritis in the face. Recommended, 5 sage sticks!", source: "Facebook", stars: 5, author: "Cassandra N." },
                        { text: "Instantly feel the health benefit. The environment is calming.", source: "Google", stars: 5, author: "Sarah H." },
                        { text: "Tried this cafe today at the recommendation of another business owner in that area of downtown Highland. The food was amazing and so delicious. I ordered the chicken panini and chose the pasta salad as my side to go. The food was flavorful and cooked perfectly. The panini stayed hot and the pasta salad stayed cold until I got home. Will definitely go back to support this quaint small business.", source: "Facebook", stars: 5, author: "Klou M." },
                        { text: "Quaint place with a really cool atmosphere. Above-and-beyond friendly and attentive.", source: "Google", stars: 5, author: "Michael T." },
                        { text: "Awesome vegan dishes. Never disappoint. I'm there at least 3 times out of the week. My number one go-to now.", source: "Facebook", stars: 5, author: "Erica M." },
                        { text: "Placed an online order and my Sicilian panini was ready when I got there. You get an option of potato chips or pasta salad. I got the pasta salad and it was great. The panini was spectacular, but I had to try the banana bread loaf, which was the star of the show.", source: "Google", stars: 5, author: "Christopher B." },
                        { text: "A true gem right in my backyard I had no clue existed. Love the very healthy menu and vegan options. You won't be disappointed.", source: "Facebook", stars: 5, author: "Abiu F." },
                        { text: "One place I enjoy eating vegan meals and take my non-vegan friends who enjoy it too. Food is fresh, nutritious, delicious, well-prepared and with great service. I recommend this place.", source: "Google", stars: 5, author: "Kalpana C." },
                        { text: "I was there for the first time yesterday. I drank a smoothie. It was delicious and good for me, too. The ambience is unmistakable. Everything there is relaxing, and it's close to the Highland library. I'll definitely come back.", source: "Facebook", stars: 5, author: "Sandi S." },
                    ];

                    const ReviewCard = ({ review, index }) => (
                        <div
                            key={index}
                            className="flex-shrink-0 w-[340px] md:w-[440px] min-h-[440px] md:min-h-[500px] bg-brand-bg border border-brand-text/20 flex flex-col justify-between mx-3"
                        >
                            {/* Top: stars + source */}
                            <div className="flex-1 flex flex-col">
                                <div className="flex items-center justify-between px-6 md:px-8 pt-6 md:pt-8 pb-4">
                                    <div className="flex gap-1">
                                        {[...Array(review.stars)].map((_, i) => (
                                            <svg key={i} className="w-4 h-4 text-brand-accent" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                    <span className="font-sans text-sm tracking-wide text-brand-text/40">{review.source}</span>
                                </div>
                                <div className="w-full h-[1px] bg-brand-text/20"></div>
                                <div className="px-6 md:px-8 pt-6">
                                    <blockquote className="font-serif text-lg md:text-xl leading-[1.6] text-brand-text/90 flex-1">
                                        "{review.text}"
                                    </blockquote>
                                </div>
                            </div>
                            {/* Edge-to-edge divider */}
                            <div className="w-full h-[1px] bg-brand-text/12"></div>
                            {/* Bottom: author */}
                            <div className="px-6 md:px-8 py-5">
                                <p className="font-sans text-xs text-brand-text/40 uppercase tracking-wider">Author</p>
                                <p className="font-sans text-sm font-medium text-brand-text/70 mt-1">{review.author}</p>
                            </div>
                        </div>
                    );

                    // Double the array for seamless infinite loop
                    const doubled = [...reviews, ...reviews];

                    return (
                        <div className="w-full overflow-hidden">
                            <div className="marquee-track">
                                {doubled.map((review, i) => (
                                    <ReviewCard key={i} review={review} index={i} />
                                ))}
                            </div>
                        </div>
                    );
                })()}

                {/* Mobile bottom CTA — leave a review */}
                <div className="max-w-[1400px] mx-auto px-6 mt-10">
                    <p className="font-serif text-lg leading-[1.6] text-brand-text/80 text-center">
                        Have you visited our cafe and left with great memories?<br />
                        <a
                            href="https://www.google.com/search?q=The+Green+Witch+Cafe+Highland+IN+reviews"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold underline underline-offset-4 text-brand-text transition-opacity [@media(hover:hover)]:hover:opacity-70"
                        >
                            Be sure to leave us a review!
                        </a>
                    </p>
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
                                <motion.div
                                    initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
                                    animate={aboutInView ? { opacity: 1, y: 0 } : {}}
                                    transition={{ duration: 0.55, delay: 0.28, ease: revealEase }}
                                >
                                    <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-brand-text mb-3">Our Hours</h3>
                                    <div className="font-sans text-[15px] text-brand-text/90 space-y-1.5 max-w-md">
                                        {openingHours.map((entry, index) => {
                                            const isToday = index === todayIndex;
                                            return (
                                                <div
                                                    key={entry.day}
                                                    className={`grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-6 rounded-full px-4 py-2.5 ${isToday ? 'border border-brand-text/12 bg-brand-text/10' : ''}`}
                                                >
                                                    <span className={isToday ? 'font-semibold text-brand-text' : 'text-brand-text/90'}>
                                                        {entry.day}
                                                    </span>
                                                    <span className={`text-right tabular-nums ${isToday ? 'font-semibold text-brand-text' : 'text-brand-text/85'}`}>
                                                        {entry.hours}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </motion.div>

                                {/* Address */}
                                <div>
                                    <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-brand-text mb-3">Address</h3>
                                    <div className="font-sans text-[15px] text-brand-text/90 leading-relaxed">
                                        <p>The Green Witch Cafe</p>
                                        <p>2845 Highway Ave</p>
                                        <p>Highland, IN 46322</p>
                                    </div>
                                </div>


                            </div>
                        </div>

                        {/* Directions button — outside the grid, below the map */}
                        <div className="mt-6 flex items-center gap-4">
                            <a
                                href="https://www.google.com/maps/dir/?api=1&destination=2845+Highway+Ave,+Highland,+IN+46322"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block border border-brand-text bg-transparent text-brand-text px-8 py-2.5 text-sm font-bold uppercase tracking-widest transition-[background-color,color,transform] duration-200 ease-out [@media(hover:hover)]:hover:bg-brand-text [@media(hover:hover)]:hover:text-brand-bg active:scale-[0.97]"
                            >
                                Directions
                            </a>
                            <a
                                href="tel:+12199233800"
                                className="inline-block border border-brand-text bg-transparent text-brand-text px-8 py-2.5 text-sm font-bold uppercase tracking-widest transition-[background-color,color,transform] duration-200 ease-out [@media(hover:hover)]:hover:bg-brand-text [@media(hover:hover)]:hover:text-brand-bg active:scale-[0.97]"
                            >
                                Call
                            </a>
                        </div>
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
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Green Witch Cafe Location"
                            ></iframe>
                        </div>

                        {/* Actions */}
                        <div className="self-start flex items-center gap-3 mb-10">
                            <a
                                href="https://www.google.com/maps/dir/?api=1&destination=2845+Highway+Ave,+Highland,+IN+46322"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="border border-brand-text text-sm font-bold uppercase tracking-widest text-brand-text px-8 py-2.5 [@media(hover:hover)]:hover:bg-brand-text [@media(hover:hover)]:hover:text-brand-bg transition-[background-color,color,transform] duration-200 ease-out active:scale-[0.97]"
                            >
                                Directions
                            </a>
                            <a
                                href="tel:+12199233800"
                                className="border border-brand-text text-sm font-bold uppercase tracking-widest text-brand-text px-8 py-2.5 [@media(hover:hover)]:hover:bg-brand-text [@media(hover:hover)]:hover:text-brand-bg transition-[background-color,color,transform] duration-200 ease-out active:scale-[0.97]"
                            >
                                Call
                            </a>
                        </div>

                        {/* Accordion Sections */}
                        <div className="w-full flex flex-col border-t border-brand-text/15">

                            {/* Opening Times Accordion */}
                            {(() => {
                                const sections = [
                                    {
                                        key: 'times',
                                        title: 'Our Hours',
                                        content: (
                                            <div className="font-sans text-[15px] text-brand-text/90 space-y-1.5">
                                                {openingHours.map((entry, index) => {
                                                    const isToday = index === todayIndex;
                                                    return (
                                                        <div
                                                            key={entry.day}
                                                            className={`grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-4 rounded-full px-3 py-2.5 ${isToday ? 'border border-brand-text/12 bg-brand-text/10' : ''}`}
                                                        >
                                                            <span className={isToday ? 'font-semibold text-brand-text' : 'text-brand-text/90'}>
                                                                {entry.day}
                                                            </span>
                                                            <span className={`text-right tabular-nums ${isToday ? 'font-semibold text-brand-text' : 'text-brand-text/85'}`}>
                                                                {entry.hours}
                                                            </span>
                                                        </div>
                                                    );
                                                })}
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


