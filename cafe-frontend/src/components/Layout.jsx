import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const footerHours = [
    { day: 'Sunday', hours: 'Closed' },
    { day: 'Monday', hours: 'Closed' },
    { day: 'Tuesday', hours: '9:00 AM - 4:00 PM' },
    { day: 'Wednesday', hours: '9:00 AM - 4:00 PM' },
    { day: 'Thursday', hours: '9:00 AM - 4:00 PM' },
    { day: 'Friday', hours: '9:00 AM - 4:00 PM' },
    { day: 'Saturday', hours: '9:00 AM - 4:00 PM' },
];

const footerNavItems = [
    { label: 'Home', to: '/' },
    { label: 'About Us', to: { pathname: '/', hash: '#about' } },
    { label: 'Drinks Experience', to: { pathname: '/', hash: '#drinks-experience' } },
    { label: 'Hours', to: { pathname: '/', hash: '#hours' } },
    { label: 'Menu', to: '/menu' },
    { label: 'Gift Shop', to: '/menu?tab=gift-shop' },
    { label: 'Order Online', href: 'https://order.online/store/the-green-witch-cafe-highland-1441314?pickup=true' },
];

export default function Layout({ children }) {
    const [scrolled, setScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isDrinksSectionActive, setIsDrinksSectionActive] = useState(false);
    const [isDesktop, setIsDesktop] = useState(false);
    const location = useLocation();
    const isHome = location.pathname === '/';
    const todayIndex = new Date().getDay();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change & scroll to top (or to hash target)
    useEffect(() => {
        setIsMobileMenuOpen(false);
        if (location.hash) {
            setTimeout(() => {
                const el = document.querySelector(location.hash);
                if (el) el.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } else {
            window.scrollTo(0, 0);
        }
    }, [location.pathname, location.hash]);

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; }
    }, [isMobileMenuOpen]);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(min-width: 768px)');
        const syncViewport = (event) => {
            setIsDesktop(event.matches);
        };

        setIsDesktop(mediaQuery.matches);
        mediaQuery.addEventListener('change', syncViewport);

        return () => {
            mediaQuery.removeEventListener('change', syncViewport);
        };
    }, []);

    useEffect(() => {
        if (!isHome) {
            setIsDrinksSectionActive(false);
            return;
        }

        let observer;
        let frame = requestAnimationFrame(() => {
            const drinksSection = document.getElementById('drinks-experience');
            if (!drinksSection) {
                setIsDrinksSectionActive(false);
                return;
            }

            observer = new IntersectionObserver(
                ([entry]) => {
                    setIsDrinksSectionActive(entry.isIntersecting);
                },
                {
                    root: null,
                    threshold: 0.15,
                    rootMargin: '-96px 0px -24% 0px',
                }
            );

            observer.observe(drinksSection);
        });

        return () => {
            cancelAnimationFrame(frame);
            if (observer) observer.disconnect();
        };
    }, [isHome]);

    const shouldHideHeader = isDesktop && isHome && isDrinksSectionActive && !isMobileMenuOpen;

    return (
        <div className="flex flex-col min-h-[100dvh]" style={{ overflowX: 'clip' }}>
            <header
                className={`fixed top-0 inset-x-0 transition-[padding,box-shadow,opacity,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex justify-between items-center px-6 md:px-12 bg-brand-primary z-[110] ${scrolled && !isMobileMenuOpen
                        ? 'shadow-[0_8px_30px_rgba(15,30,20,0.6)] py-4'
                        : 'py-6'
                    } ${shouldHideHeader ? 'opacity-0 -translate-y-4 pointer-events-none' : 'opacity-100 translate-y-0'}`}
            >
                {/* Desktop Left Nav */}
                <nav className="hidden md:flex flex-1 justify-start gap-10 text-sm font-medium tracking-widest text-brand-bg uppercase">
                    {location.pathname === '/menu' ? (
                        <Link to="/" className="[@media(hover:hover)]:hover:opacity-70 transition-opacity flex items-center gap-2">
                            <span>&larr;</span> Back to Home
                        </Link>
                    ) : (
                        <>
                            <Link to="/menu" className="[@media(hover:hover)]:hover:opacity-70 transition-opacity">Menu</Link>
                            <a href="#/" onClick={(e) => { e.preventDefault(); document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }); }} className="[@media(hover:hover)]:hover:opacity-70 transition-opacity cursor-pointer">About Us</a>
                        </>
                    )}
                </nav>

                {/* Title Name (Mobile Left, Desktop Center) */}
                <Link to="/" className={`flex-1 md:flex-none text-left md:text-center transition-transform duration-500 md:mx-4 ${isMobileMenuOpen ? 'opacity-0 invisible md:opacity-100 md:visible' : 'opacity-100 visible'}`}>
                    <h1 className={`font-serif font-bold tracking-widest leading-[1.1] text-brand-bg uppercase transition-all duration-300 ${scrolled && !isMobileMenuOpen ? 'text-xl md:text-3xl' : 'text-2xl md:text-4xl'}`}>
                        The Green<br className="md:hidden" /> Witch Cafe
                    </h1>
                </Link>

                {/* Desktop Right Nav & CTA */}
                <div className="hidden md:flex flex-1 justify-end items-center gap-10 text-sm font-medium tracking-widest text-brand-bg uppercase">
                    {location.pathname !== '/menu' && (
                        <a href="#/" onClick={(e) => { e.preventDefault(); document.getElementById('hours')?.scrollIntoView({ behavior: 'smooth' }); }} className="[@media(hover:hover)]:hover:opacity-70 transition-opacity cursor-pointer">Hours</a>
                    )}
                    <a href="https://order.online/store/the-green-witch-cafe-highland-1441314?pickup=true" target="_blank" rel="noopener noreferrer" className="border border-brand-accent bg-brand-accent text-brand-bg px-8 py-2.5 text-sm font-bold uppercase tracking-widest transition-[background-color,color,transform] duration-200 ease-out [@media(hover:hover)]:hover:bg-transparent [@media(hover:hover)]:hover:text-brand-accent active:scale-[0.97]">
                        Order Now
                    </a>
                </div>

                {/* Mobile Right: CTA + Toggle */}
                <div className="flex flex-1 justify-end items-center gap-4 md:hidden">
                    <a
                        href="https://order.online/store/the-green-witch-cafe-highland-1441314?pickup=true"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`text-sm font-medium tracking-widest text-brand-bg uppercase [@media(hover:hover)]:hover:opacity-70 transition-opacity ${isMobileMenuOpen ? 'opacity-0 invisible' : 'opacity-100 visible'}`}
                    >
                        Order
                    </a>
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="text-brand-bg transition-transform active:scale-95 p-2 -mr-2 relative z-50"
                        aria-label="Toggle Menu"
                    >
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <motion.line x1="3" y1="6" x2="21" y2="6" animate={{ rotate: isMobileMenuOpen ? 45 : 0, y: isMobileMenuOpen ? 6 : 0 }} transition={{ type: "spring", stiffness: 260, damping: 20 }} />
                            <motion.line x1="3" y1="12" x2="21" y2="12" animate={{ opacity: isMobileMenuOpen ? 0 : 1 }} transition={{ duration: 0.2 }} />
                            <motion.line x1="3" y1="18" x2="21" y2="18" animate={{ rotate: isMobileMenuOpen ? -45 : 0, y: isMobileMenuOpen ? -6 : 0 }} transition={{ type: "spring", stiffness: 260, damping: 20 }} />
                        </svg>
                    </button>
                </div>
            </header>

            {/* Premium Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        className="fixed inset-0 z-[100] bg-brand-primary flex flex-col items-center justify-center px-6"
                    >

                        <nav className="flex flex-col items-center justify-center gap-10 w-full text-center mt-[-8vh]">
                            {(location.pathname === '/menu' 
                                ? [{ path: '/', label: 'Home' }] 
                                : [
                                    { path: '/', label: 'Home' },
                                    { path: '/menu', label: 'Menu' },
                                    { path: '#about', label: 'About Us', isAnchor: true },
                                    { path: '#hours', label: 'Hours', isAnchor: true }
                                ]
                            ).map((item, index) => (
                                <motion.div
                                    key={item.path}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 120,
                                        damping: 18,
                                        delay: index * 0.1
                                    }}
                                >
                                    {item.isAnchor ? (
                                        <a
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setIsMobileMenuOpen(false);
                                                setTimeout(() => {
                                                    document.getElementById(item.path.replace('#', ''))?.scrollIntoView({ behavior: 'smooth' });
                                                }, 400);
                                            }}
                                            className={`font-serif text-5xl text-brand-bg tracking-wide block transition-opacity [@media(hover:hover)]:hover:opacity-70`}
                                        >
                                            {item.label}
                                        </a>
                                    ) : (
                                        <Link
                                            to={item.path}
                                            className={`font-serif text-5xl text-brand-bg tracking-wide block transition-opacity [@media(hover:hover)]:hover:opacity-70 ${location.pathname === item.path ? 'font-bold' : ''}`}
                                        >
                                            {item.label}
                                        </Link>
                                    )}
                                </motion.div>
                            ))}
                        </nav>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.4 }}
                            className="w-full flex flex-col items-center mt-16"
                        >
                            <a href="https://order.online/store/the-green-witch-cafe-highland-1441314?pickup=true" target="_blank" rel="noopener noreferrer" className="w-full max-w-sm border border-brand-accent bg-brand-accent text-brand-bg px-8 py-4 text-base font-bold uppercase tracking-widest transition-[background-color,color,transform] duration-200 ease-out active:bg-transparent active:text-brand-accent active:scale-[0.97] text-center block">
                                Order Online Now
                            </a>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <main className="flex-1 flex flex-col pt-20">
                {children}
            </main>

            <footer className="mt-24 border-t border-brand-secondary/20 bg-brand-primary px-4 py-16 text-brand-bg md:px-8 md:py-20">
                <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 md:grid-cols-3 md:gap-16 lg:gap-20">

                    <div className="flex flex-col gap-8 text-left">
                        <img
                            src={`${import.meta.env.BASE_URL}assets/logo-no-text.png`}
                            alt="Green Witch Cafe Logo"
                            className="h-28 w-auto object-contain self-start -ml-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] md:h-36 md:-ml-4 md:-mt-4 lg:h-40 lg:-ml-6 lg:-mt-6"
                        />

                        <div className="flex flex-col gap-6">
                            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-bg/55">
                                Explore
                            </p>
                            <div className="flex flex-col gap-2.5 text-sm sm:text-[15px] text-brand-bg/88">
                                {footerNavItems.map((item) => (
                                    item.href ? (
                                        <a
                                            key={item.label}
                                            href={item.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="transition-opacity [@media(hover:hover)]:hover:opacity-70"
                                        >
                                            {item.label}
                                        </a>
                                    ) : (
                                        <Link
                                            key={item.label}
                                            to={item.to}
                                            className="transition-opacity [@media(hover:hover)]:hover:opacity-70"
                                        >
                                            {item.label}
                                        </Link>
                                    )
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="hidden md:flex md:flex-col md:gap-6 md:text-left">
                        <div className="space-y-2">
                            <h3 className="font-serif text-3xl leading-none text-brand-bg">
                                Our Hours
                            </h3>
                        </div>

                        <div className="flex flex-col gap-2.5">
                            {footerHours.map((entry, index) => {
                                const isToday = index === todayIndex;

                                return (
                                    <div
                                        key={entry.day}
                                        className={`grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-6 px-4 py-3 text-sm transition-colors ${
                                            isToday ? 'text-brand-bg' : 'text-brand-bg/78'
                                        }`}
                                    >
                                        <span className={isToday ? 'font-semibold text-brand-bg' : ''}>
                                            {entry.day}
                                        </span>
                                        <span className={`text-right tabular-nums ${isToday ? 'font-semibold text-brand-bg' : ''}`}>
                                            {entry.hours}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="flex flex-col gap-6 text-left md:gap-10">
                        <div className="space-y-2">
                            <h3 className="font-serif text-3xl leading-none text-brand-bg">
                                Stay in Touch!
                            </h3>
                        </div>

                        <div className="flex items-center gap-3">
                            <a
                                href="https://www.facebook.com/TheGreenWitchCafe/"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Visit us on Facebook"
                                className="flex h-11 w-11 items-center justify-center rounded-full border border-brand-bg/18 bg-brand-bg/8 text-brand-bg transition-[transform,background-color,border-color] duration-200 ease-out [@media(hover:hover)]:hover:-translate-y-0.5 [@media(hover:hover)]:hover:border-brand-bg/32 [@media(hover:hover)]:hover:bg-brand-bg/14"
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                                </svg>
                            </a>
                            <a
                                href="https://www.instagram.com/green.witch.cafe/"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Visit us on Instagram"
                                className="flex h-11 w-11 items-center justify-center rounded-full border border-brand-bg/18 bg-brand-bg/8 text-brand-bg transition-[transform,background-color,border-color] duration-200 ease-out [@media(hover:hover)]:hover:-translate-y-0.5 [@media(hover:hover)]:hover:border-brand-bg/32 [@media(hover:hover)]:hover:bg-brand-bg/14"
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                                </svg>
                            </a>
                        </div>

                        <div className="flex flex-col gap-2.5 pt-3 text-sm sm:text-[15px] text-brand-bg/88 md:pt-6">
                            <a
                                href="https://www.google.com/maps/dir/?api=1&destination=2845+Highway+Ave,+Highland,+IN+46322"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-start gap-3 transition-opacity [@media(hover:hover)]:hover:opacity-70"
                            >
                                <svg className="mt-0.5 h-4 w-4 shrink-0 text-brand-bg/65" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 10c0 6-9 13-9 13S3 16 3 10a9 9 0 1 1 18 0z"></path>
                                    <circle cx="12" cy="10" r="3"></circle>
                                </svg>
                                <span>2845 Highway Ave, Highland, IN 46322</span>
                            </a>
                            <a
                                href="mailto:greenwitch2845@gmail.com"
                                className="flex items-start gap-3 transition-opacity [@media(hover:hover)]:hover:opacity-70"
                            >
                                <svg className="mt-0.5 h-4 w-4 shrink-0 text-brand-bg/65" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M4 4h16v16H4z"></path>
                                    <path d="m22 6-10 7L2 6"></path>
                                </svg>
                                <span>greenwitch2845@gmail.com</span>
                            </a>
                            <a
                                href="tel:+12199233800"
                                className="flex items-start gap-3 transition-opacity [@media(hover:hover)]:hover:opacity-70"
                            >
                                <svg className="mt-0.5 h-4 w-4 shrink-0 text-brand-bg/65" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                                </svg>
                                <span>(219) 923-3800</span>
                            </a>
                        </div>
                    </div>

                </div>
            </footer>
        </div>
    );
}
