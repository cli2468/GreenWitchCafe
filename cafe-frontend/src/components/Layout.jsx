import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function Layout({ children }) {
    const [scrolled, setScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();

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

    return (
        <div className="flex flex-col min-h-[100dvh]">
            <header
                className={`fixed top-0 inset-x-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex justify-between items-center px-6 md:px-12 bg-brand-primary ${isMobileMenuOpen ? 'z-[110]' : 'z-50'
                    } ${scrolled && !isMobileMenuOpen
                        ? 'shadow-[0_8px_30px_rgba(15,30,20,0.6)] py-4'
                        : 'py-8'
                    }`}
            >
                {/* Desktop Left Nav */}
                <nav className="hidden md:flex flex-1 justify-start gap-10 text-sm font-medium tracking-widest text-brand-bg uppercase">
                    <Link to="/menu" className="hover:opacity-70 transition-opacity">Menu</Link>
                    <a href="/#story" className="hover:opacity-70 transition-opacity">Our Story</a>
                </nav>

                {/* Title Name (Mobile Left, Desktop Center) */}
                <Link to="/" className="flex-1 md:flex-none text-left md:text-center transition-transform duration-500 md:mx-4">
                    <h1 className={`font-serif font-bold tracking-widest leading-[1.1] text-brand-bg uppercase transition-all duration-300 ${scrolled && !isMobileMenuOpen ? 'text-xl md:text-3xl' : 'text-2xl md:text-4xl'}`}>
                        The Green<br className="md:hidden" /> Witch Cafe
                    </h1>
                </Link>

                {/* Desktop Right Nav & CTA */}
                <div className="hidden md:flex flex-1 justify-end items-center gap-10 text-sm font-medium tracking-widest text-brand-bg uppercase">
                    <a href="/#hours" className="hover:opacity-70 transition-opacity">Hours</a>
                    <a href="https://order.online/store/the-green-witch-cafe-highland-1441314?pickup=true" target="_blank" rel="noopener noreferrer" className="border border-brand-accent bg-brand-accent text-brand-bg px-8 py-2.5 text-sm font-bold uppercase tracking-widest transition-colors duration-300 hover:bg-transparent hover:text-brand-accent">
                        Order Now
                    </a>
                </div>

                {/* Mobile Right Toggle */}
                <div className="flex flex-1 justify-end md:hidden">
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
                        className="fixed inset-0 z-[100] bg-brand-primary flex flex-col justify-between px-6 pb-8 pt-48"
                    >

                        <nav className="flex flex-col items-center justify-center gap-10 flex-1 w-full text-center">
                            {[
                                { path: '/', label: 'Home' },
                                { path: '/menu', label: 'Menu' },
                                { path: '/#story', label: 'Our Story', isAnchor: true },
                                { path: '/#hours', label: 'Hours', isAnchor: true }
                            ].map((item, index) => (
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
                                            href={item.path}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className={`font-serif text-5xl text-brand-bg tracking-wide block transition-opacity hover:opacity-70`}
                                        >
                                            {item.label}
                                        </a>
                                    ) : (
                                        <Link
                                            to={item.path}
                                            className={`font-serif text-5xl text-brand-bg tracking-wide block transition-opacity hover:opacity-70 ${location.pathname === item.path ? 'font-bold' : ''}`}
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
                            className="w-full flex flex-col items-center gap-6 pb-6"
                        >
                            <a href="https://order.online/store/the-green-witch-cafe-highland-1441314?pickup=true" target="_blank" rel="noopener noreferrer" className="w-full max-w-sm border border-brand-accent bg-brand-accent text-brand-bg px-8 py-4 text-base font-bold uppercase tracking-widest transition-colors active:bg-transparent active:text-brand-accent text-center block">
                                Order Online Now
                            </a>
                            <p className="text-brand-bg/60 text-xs tracking-widest uppercase">The Green Witch Cafe</p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <main className="flex-1 flex flex-col pt-24">
                {children}
            </main>

            <footer className="py-20 px-4 md:px-8 bg-brand-primary text-brand-bg mt-24 border-t border-brand-secondary/20">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8 items-center text-center">

                    {/* Left Column: Address & Contact */}
                    <div className="flex flex-col items-center gap-4 text-sm tracking-wide">
                        <p>2845 Highway Ave</p>
                        <p>Highland, IN 46322</p>
                        <p className="mt-2">(219) 923-3800</p>
                        <p>Tue - Sat: 9:00 AM - 4:00 PM</p>
                    </div>

                    {/* Middle Column: Name & Socials */}
                    <div className="flex flex-col items-center justify-center gap-6">
                        <img
                            src="/assets/logo-no-text.png"
                            alt="Green Witch Cafe Logo"
                            className="h-32 md:h-48 w-auto object-contain mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
                        />
                        <div className="flex items-center gap-6 mt-4">
                            {/* Facebook Icon */}
                            <a href="https://www.facebook.com/TheGreenWitchCafe/" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                                </svg>
                            </a>
                            {/* Instagram Icon */}
                            <a href="#" className="hover:opacity-70 transition-opacity">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                                </svg>
                            </a>
                            {/* TikTok Icon */}
                            <a href="#" className="hover:opacity-70 transition-opacity">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path>
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Right Column: CTA Links */}
                    <div className="flex flex-col items-center gap-6 text-sm tracking-wide">
                        <Link to="/menu" className="hover:opacity-80 transition-opacity">
                            View Our <span className="underline underline-offset-4">Menu!</span>
                        </Link>
                        <Link to="#" className="hover:opacity-80 transition-opacity">
                            Interested in Pickup? Order <span className="underline underline-offset-4">HERE</span>
                        </Link>
                        <Link to="#" className="hover:opacity-80 transition-opacity">
                            Purchase <span className="underline underline-offset-4">Gift Cards</span>
                        </Link>
                    </div>

                </div>
            </footer>
        </div>
    );
}
