import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import menuData from '../data/menu.json';

export default function Menu() {
    const location = useLocation();
    const [activeTab, setActiveTab] = useState('Food');

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
            <div className="w-full pt-16 pb-6 md:pb-6 px-4 md:px-8">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="flex items-center justify-center gap-4 md:gap-8 mb-6">
                        <span className="w-12 md:w-24 h-[1px] bg-brand-primary"></span>
                        <h1 className="font-serif text-6xl md:text-8xl text-brand-primary tracking-wide uppercase">Menu</h1>
                        <span className="w-12 md:w-24 h-[1px] bg-brand-primary"></span>
                    </div>

                    {/* Menu Quote */}
                    <p className="font-serif text-2xl md:text-3xl text-brand-primary/90 italic tracking-wide max-w-2xl mx-auto mb-16 px-4">
                        "Wickedly good."
                    </p>

                    {/* Top Nav Categories */}
                    <div className="flex justify-center flex-wrap gap-6 md:gap-24 pb-4 w-fit mx-auto px-4 md:px-12">
                        {['Food', 'Drinks', 'Gift Shop'].map(tab => (
                            <motion.button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                animate={{
                                    scale: activeTab === tab ? 1.05 : 1,
                                    opacity: activeTab === tab ? 1 : 0.6,
                                }}
                                whileHover={{ opacity: 1 }}
                                transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                                className={`text-xl md:text-4xl font-sans tracking-[0.15em] uppercase text-brand-primary ${activeTab === tab ? 'font-medium' : ''}`}
                            >
                                {tab}
                            </motion.button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Menu Content Area */}
            <div className="max-w-6xl mx-auto min-h-[50vh] pt-6 md:pt-8 px-4 md:px-8">
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
                    className="inline-block border border-brand-primary bg-brand-primary text-brand-bg px-10 py-4 text-sm uppercase tracking-widest rounded-full transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:bg-transparent hover:text-brand-primary font-medium"
                >
                    Order Online Now
                </a>
            </div>

        </div>
    );
}
