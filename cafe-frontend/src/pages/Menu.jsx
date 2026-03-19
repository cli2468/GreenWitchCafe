import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import menuData from '../data/menu.json';

export default function Menu() {
    const location = useLocation();
    const [activeTab, setActiveTab] = useState('Food');
    const shouldReduceMotion = useReducedMotion();
    const heroEase = [0.16, 1, 0.3, 1];
    const menuTitleChars = ['M', 'E', 'N', 'U'];

    // Handle deep linking to specific tabs
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const tabParam = params.get('tab');
        if (tabParam === 'gift-shop') {
            setActiveTab('Gift Shop');
        } else if (tabParam === 'drinks') {
            setActiveTab('Drinks');
        } else if (tabParam === 'food') {
            setActiveTab('Food');
        }
    }, [location]);

    // Grouping the raw categories into logic Super Categories
    const menuGroups = useMemo(() => {
        const groups = {
            Food: [],
            Drinks: [],
            'Gift Shop': []
        };

        const foodOrder = ['Sandwiches', 'Salads', 'Soups', 'Gnocchi', 'Sweets', 'Add Ons'];
        const drinkOrder = ['Signature Drinks', 'Coffee & Tea', 'Juices', 'Smoothies', 'Protein Shakes', 'Power Shots'];

        menuData.menu.forEach(category => {
            if (foodOrder.includes(category.category)) {
                groups.Food.push(category);
            } else if (drinkOrder.includes(category.category)) {
                groups.Drinks.push(category);
            } else {
                // Anything else goes to Gift Shop
                groups['Gift Shop'].push(category);
            }
        });

        // Ensure proper layout order instead of relying on JSON position
        groups.Food.sort((a, b) => foodOrder.indexOf(a.category) - foodOrder.indexOf(b.category));
        groups.Drinks.sort((a, b) => drinkOrder.indexOf(a.category) - drinkOrder.indexOf(b.category));

        return groups;
    }, []);

    const activeCategories = menuGroups[activeTab] || [];

    return (
        <div className="w-full min-h-[100dvh] bg-brand-bg text-brand-text pb-32">

            {/* Hero Header Area */}
            <div className="w-full pt-24 md:pt-36 pb-10 md:pb-14 px-4 md:px-8">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="flex items-center justify-center gap-4 md:gap-10 mb-8 md:mb-10">
                        <motion.span
                            initial={shouldReduceMotion ? { opacity: 1, scaleX: 1 } : { opacity: 0, scaleX: 0.35 }}
                            animate={{ opacity: 1, scaleX: 1 }}
                            transition={{ duration: 0.45, delay: 0.05, ease: heroEase }}
                            className="w-10 md:w-20 h-[1px] bg-brand-primary/80 origin-right"
                        ></motion.span>
                        <h1 className="font-serif text-6xl md:text-8xl lg:text-9xl text-brand-primary tracking-wide uppercase leading-none">
                            {menuTitleChars.map((char, index) => (
                                <motion.span
                                    key={char}
                                    initial={shouldReduceMotion ? { opacity: 1, filter: 'blur(0px)' } : { opacity: 0, filter: 'blur(8px)' }}
                                    animate={{ opacity: 1, filter: 'blur(0px)' }}
                                    transition={{ duration: 0.28, delay: 0.12 + (index * 0.08), ease: heroEase }}
                                    className="inline-block"
                                >
                                    {char}
                                </motion.span>
                            ))}
                        </h1>
                        <motion.span
                            initial={shouldReduceMotion ? { opacity: 1, scaleX: 1 } : { opacity: 0, scaleX: 0.35 }}
                            animate={{ opacity: 1, scaleX: 1 }}
                            transition={{ duration: 0.45, delay: 0.05, ease: heroEase }}
                            className="w-10 md:w-20 h-[1px] bg-brand-primary/80 origin-left"
                        ></motion.span>
                    </div>

                    {/* Menu Quote */}
                    <motion.p
                        initial={shouldReduceMotion ? { opacity: 1, y: 0, filter: 'blur(0px)' } : { opacity: 0, y: 24, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        transition={{ duration: 0.65, delay: 0.42, ease: heroEase }}
                        className="font-serif text-2xl md:text-3xl text-brand-primary/90 italic tracking-wide max-w-2xl mx-auto mb-20 md:mb-28 px-4"
                    >
                        "Wickedly good."
                    </motion.p>

                    {/* Top Nav Categories */}
                    <div className="flex justify-center flex-wrap gap-x-8 gap-y-4 md:gap-x-24 md:gap-y-6 pb-4 w-fit mx-auto px-4 md:px-12">
                        {['Food', 'Drinks', 'Gift Shop'].map((tab, index) => (
                            <div key={tab} className="overflow-hidden">
                                <motion.button
                                    onClick={() => setActiveTab(tab)}
                                    initial={shouldReduceMotion ? { opacity: activeTab === tab ? 1 : 0.6, y: 0 } : { opacity: 0, y: '115%' }}
                                    animate={{
                                        transform: activeTab === tab ? 'scale(1.05)' : 'scale(1)',
                                        opacity: activeTab === tab ? 1 : 0.6,
                                        y: 0,
                                    }}
                                    whileHover={{ opacity: 1 }}
                                    transition={{
                                        duration: 0.45,
                                        delay: shouldReduceMotion ? 0 : 0.62 + (index * 0.08),
                                        ease: heroEase
                                    }}
                                    className={`text-lg md:text-4xl font-sans tracking-[0.15em] uppercase text-brand-primary active:scale-[0.97] transition-transform duration-150 ease-out ${activeTab === tab ? 'font-medium' : ''}`}
                                >
                                    {tab}
                                </motion.button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Menu Content Area */}
            <div className="max-w-6xl mx-auto min-h-[50vh] pt-4 md:pt-6 px-4 md:px-8">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="flex flex-col gap-20"
                    >
                        {activeCategories.map((cat) => (
                            <section key={cat.category} className="w-full">
                                {/* Category Header */}
                                <div className="flex items-center gap-4 mb-10 w-full min-h-[40px]">
                                    {activeTab !== 'Gift Shop' && (
                                        <h3 className="font-serif text-3xl md:text-4xl text-brand-text shrink-0 uppercase tracking-widest">
                                            {cat.category}
                                        </h3>
                                    )}
                                    <div className="h-[1px] bg-brand-text/30 w-full"></div>
                                </div>

                                {/* 2-Column Dish Layout */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
                                    {cat.items.map((item, idx) => (
                                        <div key={idx} className="flex flex-col group">
                                            {/* Top Line: Name and Price */}
                                            <div className="flex justify-between items-baseline gap-4 mb-2">
                                                <h4 className="font-serif font-bold text-lg md:text-2xl text-brand-text leading-tight tracking-wide">
                                                    {item.name}
                                                </h4>
                                                <span className="shrink-0 font-medium text-brand-primary group-hover:text-brand-primary transition-colors duration-300">
                                                    {item.price}
                                                </span>
                                            </div>

                                            {/* Bottom Line: Description in softer color */}
                                            {item.description && (
                                                <p className="text-sm md:text-base font-sans text-brand-text/80 leading-relaxed max-w-[95%]">
                                                    {item.description}
                                                </p>
                                            )}

                                            {/* Dietary Tags */}
                                            {item.dietary && item.dietary.length > 0 && (
                                                <div className="flex flex-wrap gap-2 mt-3">
                                                    {item.dietary.map(diet => (
                                                        <span key={diet} className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-sm border border-brand-primary/40 text-brand-primary/80 font-medium">
                                                            {diet}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        ))}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Bottom Call to Action */}
            <div className="max-w-4xl mx-auto mt-32 text-center px-4">
                <p className="font-serif text-2xl text-brand-text mb-6 italic">Ready to place a pickup order?</p>
                <a
                    href="https://order.online/store/the-green-witch-cafe-highland-1441314?pickup=true"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block border border-brand-primary bg-brand-primary text-brand-bg px-10 py-4 text-sm uppercase tracking-widest rounded-full transition-[transform,box-shadow,background-color,color] duration-200 ease-out [@media(hover:hover)]:hover:-translate-y-1 [@media(hover:hover)]:hover:shadow-lg [@media(hover:hover)]:hover:bg-transparent [@media(hover:hover)]:hover:text-brand-primary active:scale-[0.97] font-medium"
                >
                    Order Online Now
                </a>
            </div>

        </div>
    );
}
