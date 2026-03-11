import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
    return (
        <div className="min-h-screen bg-brand-primary text-brand-bg px-4 md:px-8 bg-[url('/assets/paper-texture.png')]">
            <div className="max-w-4xl mx-auto py-24 md:py-32">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center"
                >
                    <h1 className="font-serif text-4xl md:text-6xl mb-8 uppercase tracking-widest text-brand-accent drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                        Our Story
                    </h1>
                    
                    <div className="prose prose-invert prose-lg mx-auto text-brand-bg/90 font-sans tracking-wide space-y-6">
                        <p className="lead text-xl italic font-serif">
                            Welcome to The Green Witch Cafe, where magic meets mindfulness in every cup.
                        </p>
                        <p>
                            Nestled in the heart of Highland, our cafe was born from a deep love for plant-based wellness and the belief that food should nourish both body and soul.
                        </p>
                        <p>
                            Our magical baristas craft each beverage with intention, using ethically sourced coffee beans, homemade syrups infused with botanical magic, and premium alternative milks. 
                        </p>
                        <p>
                            From our spellbinding signature lattes to our enchanting baked goods, every item on our menu is a celebration of the earth's bounty. We invite you to step into our cozy sanctuary, take a breath, and let the magic steep.
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default About;
