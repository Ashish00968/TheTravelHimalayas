"use client";

import Link from "next/link";
import { treks } from "@/data/treks";
import { peaks } from "@/data/peaks";
import { guides } from "@/data/guides";
import { CloudinaryImage } from "@/components/media/CloudinaryImage";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ChevronDown, ArrowRight, ArrowLeft, Mountain, Compass, Map, BookOpen, Activity } from "lucide-react";
import { ContentCard } from "@/components/content/ContentCard";

// The signature easing from Stitch's Ethereal Obsidian system
const TRANSITION_EASE = [0.23, 1, 0.32, 1];

function ParallaxHero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.1, 1.3]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <section ref={ref} className="relative h-[100dvh] min-h-[600px] flex items-center justify-center overflow-hidden bg-background">
      {/* Cinematic Parallax Background */}
      <motion.div className="absolute inset-0" style={{ y: imgY, scale: imgScale }}>
        <CloudinaryImage
          src="https://res.cloudinary.com/dehriwm1o/image/upload/v1777213099/Wallpaper.jpg"
          alt="Himalayan mountain panorama above the Kullu Valley"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-background" />
      </motion.div>

      {/* Foreground Content */}
      <motion.div
        className="relative z-10 text-center px-6 max-w-4xl mx-auto space-y-4 mt-12"
        style={{ opacity: contentOpacity, y: contentY }}
      >
        <motion.span 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: TRANSITION_EASE }}
          className="font-mono text-[10px] text-primary tracking-[0.3em] uppercase opacity-80 block mb-4"
        >
          Ascend to greatness
        </motion.span>
        
        <h1 className="font-heading text-5xl sm:text-6xl md:text-[80px] font-medium leading-[1.1] tracking-tighter text-white mb-6 drop-shadow-2xl flex flex-col items-center" style={{ perspective: "1000px" }}>
          <motion.span 
            initial={{ opacity: 0, y: 60, rotateX: -20 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 1.2, delay: 0.1, ease: TRANSITION_EASE }}
            className="block origin-bottom"
          >
            Beyond the Peaks.
          </motion.span>
          <motion.span 
            initial={{ opacity: 0, y: 60, rotateX: -20 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 1.2, delay: 0.25, ease: TRANSITION_EASE }}
            className="italic text-transparent bg-clip-text bg-gradient-to-br from-white via-white/90 to-white/30 block origin-bottom -mt-1 md:-mt-4"
          >
            Into the Soul.
          </motion.span>
        </h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: TRANSITION_EASE }}
          className="font-sans text-lg text-white/60 max-w-2xl mx-auto leading-relaxed font-light mb-12"
        >
          Embark on curated expeditions that transcend mere travel. Experience the silence of the highest altitudes and the warmth of mountain culture.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: TRANSITION_EASE }}
          className="flex flex-col md:flex-row gap-4 justify-center"
        >
          <button 
            onClick={() => document.getElementById('treks')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-primary text-primary-foreground px-10 py-4 rounded-full font-medium hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-[0_0_30px_rgba(249,115,22,0.3)]"
          >
            Start Exploring
          </button>
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-white/40 cursor-pointer hover:text-white transition-colors"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        onClick={() => document.getElementById('treks')?.scrollIntoView({ behavior: 'smooth' })}
      >
        <ChevronDown className="w-6 h-6 opacity-40" />
      </motion.div>
    </section>
  );
}

function FeaturedTreks() {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  return (
    <section id="treks" className="py-24 bg-background overflow-hidden relative z-10">
      <div className="max-w-7xl mx-auto px-6 mb-12 flex flex-col md:flex-row md:justify-between md:items-end gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: TRANSITION_EASE }}
        >
          <h2 className="font-heading text-4xl md:text-5xl text-white mb-2">Featured Treks</h2>
          <p className="text-white/60">Curated journeys through the roof of the world.</p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: TRANSITION_EASE }}
          className="flex gap-4"
        >
          <button 
            onClick={() => scrollRef.current?.scrollBy({ left: -400, behavior: 'smooth' })}
            className="w-12 h-12 rounded-full glass-card flex items-center justify-center hover:bg-white/10 transition-colors"
            aria-label="Scroll left"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <button 
            onClick={() => scrollRef.current?.scrollBy({ left: 400, behavior: 'smooth' })}
            className="w-12 h-12 rounded-full glass-card flex items-center justify-center hover:bg-white/10 transition-colors"
            aria-label="Scroll right"
          >
            <ArrowRight className="w-5 h-5 text-white" />
          </button>
        </motion.div>
      </div>

      <motion.div 
        ref={scrollRef}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, delay: 0.2, ease: TRANSITION_EASE }}
        className="flex gap-6 overflow-x-auto px-6 pb-12 snap-x scroll-smooth no-scrollbar max-w-7xl mx-auto"
      >
        {treks.map((trek) => (
          <div key={trek.slug} className="w-[85vw] sm:w-[320px] md:w-[400px] snap-start shrink-0">
            <ContentCard
              title={trek.title}
              slug={trek.slug}
              basePath="/treks"
              image={trek.heroImage}
              description={trek.description}
              badges={[trek.difficulty]}
              meta={[{ label: "Duration", value: trek.duration }]}
            />
          </div>
        ))}
      </motion.div>
    </section>
  );
}

function NotablePeaks() {
  return (
    <section className="py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: TRANSITION_EASE }}
          className="text-center mb-16"
        >
          <h2 className="font-heading text-4xl md:text-5xl text-white mb-4">The Giants</h2>
          <p className="text-white/60 max-w-xl mx-auto">Explore the peaks that define the Himalayan skyline. More than just mountains, they are legends of endurance.</p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {peaks.slice(0, 3).map((peak, idx) => (
            <motion.div
              key={peak.slug}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: idx * 0.1, ease: TRANSITION_EASE }}
            >
              <Link href={`/peaks/${peak.slug}`} className="block glass-card p-4 rounded-2xl transition-all duration-500 hover:bg-white/10 hover:-translate-y-2 border-white/10 group h-full">
                <div className="h-64 rounded-xl overflow-hidden mb-6 relative">
                  <CloudinaryImage 
                    src={peak.heroImage} 
                    alt={peak.title} 
                    fill 
                    className="object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                </div>
                <h3 className="font-heading text-2xl text-white mb-2 group-hover:text-primary transition-colors">{peak.title}</h3>
                <p className="text-white/60 text-sm mb-6 line-clamp-2">{peak.description}</p>
                <div className="flex items-center gap-4 text-primary font-mono text-[10px] tracking-widest uppercase">
                  <span className="flex items-center gap-1"><Mountain className="w-3 h-3" /> {peak.height}m</span>
                  <span className="flex items-center gap-1"><Map className="w-3 h-3" /> {peak.region}</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function EssentialGuides() {
  const iconMap: Record<string, React.ReactNode> = {
    'packing-list-himalayan-treks': <BookOpen className="w-6 h-6" />,
    'best-time-to-visit-manali': <Compass className="w-6 h-6" />,
    'how-to-reach-manali': <Map className="w-6 h-6" />,
    'trekking-permits-himachal': <Activity className="w-6 h-6" />,
  };

  return (
    <section className="py-24 bg-white/[0.02]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: TRANSITION_EASE }}
          >
            <span className="font-mono text-[10px] text-primary tracking-[0.3em] uppercase mb-4 block">Knowledge Base</span>
            <h2 className="font-heading text-4xl md:text-5xl text-white mb-8 leading-tight">Preparation is the Difference Between Success and Survival.</h2>
            
            <div className="space-y-4">
              {guides.slice(0, 3).map((guide) => (
                <Link key={guide.slug} href={`/guides/${guide.slug}`} className="flex gap-6 p-6 glass-card rounded-xl transition-all duration-300 hover:bg-white/10 group">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 border border-primary/20">
                    {iconMap[guide.slug] || <BookOpen className="w-6 h-6" />}
                  </div>
                  <div>
                    <h4 className="font-heading text-xl text-white mb-1 group-hover:text-primary transition-colors">{guide.title}</h4>
                    <p className="text-white/60 text-sm line-clamp-2">{guide.description}</p>
                  </div>
                </Link>
              ))}
            </div>
            
            <Link href="/guides" className="mt-8 inline-flex items-center gap-2 text-primary font-medium group text-sm uppercase tracking-widest hover:text-white transition-colors">
              View All Guides <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2, ease: TRANSITION_EASE }}
            className="relative hidden lg:block"
          >
            <div className="aspect-square glass-card rounded-3xl overflow-hidden p-4 border-white/5">
              <div className="relative w-full h-full rounded-2xl overflow-hidden bg-background">
                <CloudinaryImage 
                  src="https://res.cloudinary.com/dehriwm1o/image/upload/v1777212041/14SummitSelfie.jpg" 
                  alt="High altitude preparation" 
                  fill 
                  className="object-cover opacity-90" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
              </div>
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-6 -right-6 w-48 h-48 glass-card rounded-2xl p-6 backdrop-blur-3xl border border-white/10 flex flex-col justify-center">
              <div className="text-primary font-heading text-4xl mb-2">450+</div>
              <div className="text-white/60 font-mono text-[10px] tracking-widest uppercase">Successful Summits Completed</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="py-32 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-primary/5 rounded-full blur-[150px] -translate-y-1/2" />
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: TRANSITION_EASE }}
        className="max-w-4xl mx-auto px-6 text-center relative z-10"
      >
        <h2 className="font-heading text-4xl md:text-5xl text-white mb-6">Ready to write your mountain story?</h2>
        <p className="text-white/60 text-lg mb-10 max-w-2xl mx-auto">Our expedition season is now open for bookings. Join a small group of like-minded adventurers on the journey of a lifetime.</p>
        <Link href="/contact" className="inline-block bg-primary text-primary-foreground px-12 py-5 rounded-full font-medium text-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-[0_0_30px_rgba(249,115,22,0.3)]">
          Book Your Adventure
        </Link>
      </motion.div>
    </section>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      <ParallaxHero />
      <FeaturedTreks />
      <NotablePeaks />
      <EssentialGuides />
      <FinalCTA />
    </main>
  );
}
