"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  HeartPulse,
  Mountain,
  Compass,
  AlertTriangle,
  Search,
  CheckCircle,
  Thermometer,
  Activity,
  Flame,
  ArrowDownCircle,
  Award,
  GraduationCap,
  PhoneCall,
  ShieldAlert,
  Copy,
  Check,
} from "lucide-react";
import {
  ALTITUDE_LEVELS,
  FUNDAMENTALS_DATA,
  ALTITUDE_ILLNESSES,
  SAFETY_PROTOCOLS,
  GLOSSARY_TERMS,
  MOUNTAINEERING_OVERVIEW,
  MOUNTAINEERING_COURSES,
  EMERGENCY_SAR_CONTACTS,
} from "@/data/mountain-safety";

const TRANSITION_EASE = [0.23, 1, 0.32, 1] as const;

type ActiveTab = "glossary" | "mountaineering" | "medical" | "altitude" | "protocols" | "rescue";


export function SafetyClient() {
  // Mountain Terms is the primary and first default tab
  const [activeTab, setActiveTab] = useState<ActiveTab>("glossary");
  const [glossarySearch, setGlossarySearch] = useState("");
  const [selectedGlossaryCat, setSelectedGlossaryCat] = useState("all");
  const [copiedNumber, setCopiedNumber] = useState<string | null>(null);

  const copyToClipboard = (num: string) => {
    navigator.clipboard?.writeText(num);
    setCopiedNumber(num);
    setTimeout(() => setCopiedNumber(null), 2000);
  };

  const filteredGlossary = GLOSSARY_TERMS.filter((term) => {
    const matchesQuery =
      term.term.toLowerCase().includes(glossarySearch.toLowerCase()) ||
      term.definition.toLowerCase().includes(glossarySearch.toLowerCase()) ||
      (term.localTerm && term.localTerm.toLowerCase().includes(glossarySearch.toLowerCase()));

    const matchesCategory =
      selectedGlossaryCat === "all" || term.category === selectedGlossaryCat;

    return matchesQuery && matchesCategory;
  });

  return (
    <main className="min-h-screen bg-background pt-28 pb-24 relative overflow-hidden">
      {/* Ambient Radial Mesh */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-primary/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#0000000d_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none opacity-40" />

      <div className="relative z-20 container mx-auto px-6 max-w-7xl">
        {/* Header Title */}
        <div className="mb-12 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-muted/80 border border-border mb-4">
            <BookOpen className="w-4 h-4 text-primary" />
            <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
              Himalayan Dictionary &amp; Field Manual
            </span>
          </div>

          <h1 className="font-display tracking-tight text-3xl sm:text-5xl md:text-6xl font-semibold text-foreground mb-5">
            Mountain Terms &amp; Safety
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg font-light leading-relaxed">
            The definitive reference for Himalayan geography, core mountaineering terms, altitude physiology, AMS/HAPE/HACE warning protocols, and trail fundamentals.
          </p>
        </div>

        {/* Tab Navigation Navigation Bar */}
        <div className="flex flex-wrap gap-2 sm:gap-3 p-1.5 rounded-2xl bg-card border border-border mb-12 w-fit shadow-sm">
          <button
            onClick={() => setActiveTab("glossary")}
            className={`px-4 sm:px-5 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider transition-all duration-200 flex items-center gap-2 ${
              activeTab === "glossary"
                ? "bg-primary text-white font-semibold shadow-md shadow-primary/30"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            <BookOpen className="w-4 h-4" /> Mountain Terms
          </button>

          <button
            onClick={() => setActiveTab("mountaineering")}
            className={`px-4 sm:px-5 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider transition-all duration-200 flex items-center gap-2 ${
              activeTab === "mountaineering"
                ? "bg-primary text-white font-semibold shadow-md shadow-primary/30"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            <GraduationCap className="w-4 h-4" /> Mountaineering &amp; BMC/AMC
          </button>

          <button
            onClick={() => setActiveTab("medical")}
            className={`px-4 sm:px-5 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider transition-all duration-200 flex items-center gap-2 ${
              activeTab === "medical"
                ? "bg-primary text-white font-semibold shadow-md shadow-primary/30"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            <HeartPulse className="w-4 h-4" /> AMS, HAPE &amp; HACE
          </button>

          <button
            onClick={() => setActiveTab("altitude")}
            className={`px-4 sm:px-5 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider transition-all duration-200 flex items-center gap-2 ${
              activeTab === "altitude"
                ? "bg-primary text-white font-semibold shadow-md shadow-primary/30"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            <Mountain className="w-4 h-4" /> Altitude &amp; Oxygen
          </button>

          <button
            onClick={() => setActiveTab("protocols")}
            className={`px-4 sm:px-5 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider transition-all duration-200 flex items-center gap-2 min-h-[44px] ${
              activeTab === "protocols"
                ? "bg-primary text-white font-semibold shadow-md shadow-primary/30"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            <Thermometer className="w-4 h-4" /> Cold Injury &amp; Safety
          </button>

          <button
            onClick={() => setActiveTab("rescue")}
            className={`px-4 sm:px-5 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider transition-all duration-200 flex items-center gap-2 min-h-[44px] ${
              activeTab === "rescue"
                ? "bg-rose-600 text-white font-semibold shadow-md shadow-rose-600/30"
                : "text-rose-500/90 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-500/10 border border-rose-500/25"
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-rose-500" /> Emergency SAR &amp; Helplines
          </button>
        </div>

        {/* Tab Content Sections */}
        <AnimatePresence mode="wait">
          {/* TAB 1 (PRIMARY): MOUNTAIN TERMS & FUNDAMENTALS (HIKE VS TREK VS PEAK EMBEDDED) */}
          {activeTab === "glossary" && (
            <motion.div
              key="glossary"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: TRANSITION_EASE }}
              className="space-y-12"
            >
              {/* 1. Embedded Hike vs Trek vs Peak Comparison */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-primary uppercase tracking-widest block font-medium">
                    Core Himalayan Fundamentals
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Hike */}
                  <div className="p-7 rounded-3xl bg-card border border-border space-y-4 hover:border-border/80 transition-all shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
                      <Compass className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-display text-xl font-semibold text-foreground mb-0.5">
                        Day Hike
                      </h3>
                      <p className="text-muted-foreground text-xs font-mono uppercase">
                        Single Day Outing
                      </p>
                    </div>
                    <div className="space-y-3 text-xs font-light text-foreground/80 pt-2 border-t border-border/50">
                      <div>
                        <span className="font-mono uppercase text-muted-foreground block mb-0.5">Duration</span>
                        {FUNDAMENTALS_DATA[0].hike.duration}
                      </div>
                      <div>
                        <span className="font-mono uppercase text-muted-foreground block mb-0.5">Terrain</span>
                        {FUNDAMENTALS_DATA[0].hike.terrain}
                      </div>
                      <div>
                        <span className="font-mono uppercase text-muted-foreground block mb-0.5">Gear</span>
                        {FUNDAMENTALS_DATA[0].hike.gear}
                      </div>
                    </div>
                  </div>

                  {/* Trek */}
                  <div className="p-7 rounded-3xl bg-card border border-primary/40 shadow-lg shadow-primary/10 space-y-4 relative overflow-hidden">
                    <div className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30 font-mono text-[9px] uppercase tracking-wider font-semibold">
                      Core Focus
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-primary/20 text-primary flex items-center justify-center border border-primary/30">
                      <Mountain className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-display text-xl font-semibold text-foreground mb-0.5">
                        Multi-Day Trek
                      </h3>
                      <p className="text-muted-foreground text-xs font-mono uppercase">
                        Alpine Pass Crossings
                      </p>
                    </div>
                    <div className="space-y-3 text-xs font-light text-foreground/80 pt-2 border-t border-border/50">
                      <div>
                        <span className="font-mono uppercase text-primary font-medium block mb-0.5">Duration</span>
                        {FUNDAMENTALS_DATA[0].trek.duration}
                      </div>
                      <div>
                        <span className="font-mono uppercase text-primary font-medium block mb-0.5">Terrain</span>
                        {FUNDAMENTALS_DATA[0].trek.terrain}
                      </div>
                      <div>
                        <span className="font-mono uppercase text-primary font-medium block mb-0.5">Gear</span>
                        {FUNDAMENTALS_DATA[0].trek.gear}
                      </div>
                    </div>
                  </div>

                  {/* Peak Expedition */}
                  <div className="p-7 rounded-3xl bg-card border border-border space-y-4 hover:border-border/80 transition-all shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
                      <Flame className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-display text-xl font-semibold text-foreground mb-0.5">
                        Peak Expedition
                      </h3>
                      <p className="text-muted-foreground text-xs font-mono uppercase">
                        Technical Climbing
                      </p>
                    </div>
                    <div className="space-y-3 text-xs font-light text-foreground/80 pt-2 border-t border-border/50">
                      <div>
                        <span className="font-mono uppercase text-muted-foreground block mb-0.5">Duration</span>
                        {FUNDAMENTALS_DATA[0].expedition.duration}
                      </div>
                      <div>
                        <span className="font-mono uppercase text-muted-foreground block mb-0.5">Terrain</span>
                        {FUNDAMENTALS_DATA[0].expedition.terrain}
                      </div>
                      <div>
                        <span className="font-mono uppercase text-muted-foreground block mb-0.5">Gear</span>
                        {FUNDAMENTALS_DATA[0].expedition.gear}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Search & Category Filter Bar */}
              <div className="space-y-6 pt-4 border-t border-border">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                  <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      value={glossarySearch}
                      onChange={(e) => setGlossarySearch(e.target.value)}
                      placeholder="Search mountain terms (e.g. Mountain, Himalayas, Crevasse, Ridge)..."
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-card border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary font-light shadow-sm"
                    />
                  </div>

                  <div className="flex flex-wrap gap-2 w-full md:w-auto">
                    {[
                      { id: "all", label: "All Terms" },
                      { id: "basics", label: "Basics" },
                      { id: "nature", label: "Forest & Meadow" },
                      { id: "geology", label: "Geology & Ridge" },
                      { id: "glacier", label: "Glacier & Ice" },
                      { id: "mountaineering", label: "Mountaineering" },
                      { id: "medical", label: "AMS & Medical" },
                      { id: "weather", label: "Weather & Snow" },
                      { id: "gear", label: "Gear" },
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedGlossaryCat(cat.id)}
                        className={`px-3 py-1.5 rounded-full font-mono text-xs capitalize transition-all ${
                          selectedGlossaryCat === cat.id
                            ? "bg-primary text-white border border-primary shadow-sm"
                            : "bg-card text-muted-foreground border border-border hover:text-foreground hover:bg-muted"
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Glossary Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredGlossary.map((term) => (
                    <div
                      key={term.term}
                      className="p-6 rounded-2xl bg-card border border-border hover:border-primary/40 transition-all flex flex-col justify-between space-y-4 shadow-sm"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-display text-xl font-semibold text-foreground flex items-center gap-2">
                            {term.term}
                          </h3>
                          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                            {term.category}
                          </span>
                        </div>

                        {term.localTerm && (
                          <span className="text-xs font-mono text-primary/80 block mb-2 font-medium">
                            {term.localTerm}
                          </span>
                        )}

                        <p className="text-muted-foreground text-xs sm:text-sm font-light leading-relaxed mb-3">
                          {term.definition}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-border/50 text-xs text-muted-foreground font-light">
                        <strong className="text-foreground font-medium">Why it matters:</strong> {term.significance}
                      </div>
                    </div>
                  ))}
                </div>

                {filteredGlossary.length === 0 && (
                  <div className="p-12 text-center text-muted-foreground font-light">
                    No mountain terms matched your search &ldquo;{glossarySearch}&rdquo;.
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* TAB 2: MOUNTAINEERING & COURSES (BMC, AMC, MOI, S&R) */}
          {activeTab === "mountaineering" && (
            <motion.div
              key="mountaineering"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: TRANSITION_EASE }}
              className="space-y-12"
            >
              {/* Overview Card */}
              <div className="p-8 md:p-10 rounded-3xl bg-card border border-border space-y-6 shadow-sm">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary font-mono text-xs uppercase tracking-wider">
                  <Award className="w-3.5 h-3.5" /> High-Altitude Discipline
                </div>
                <div>
                  <h2 className="font-display text-3xl sm:text-4xl font-semibold text-foreground mb-3">
                    {MOUNTAINEERING_OVERVIEW.title}
                  </h2>
                  <p className="text-muted-foreground text-base sm:text-lg font-light leading-relaxed max-w-4xl">
                    {MOUNTAINEERING_OVERVIEW.definition}
                  </p>
                </div>

                {/* 4 Core Pillars */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-border/50">
                  {MOUNTAINEERING_OVERVIEW.coreDisciplines.map((craft) => (
                    <div key={craft.title} className="p-5 rounded-2xl bg-muted/40 border border-border/60 space-y-2">
                      <h4 className="font-display font-semibold text-foreground text-base">
                        {craft.title}
                      </h4>
                      <p className="text-muted-foreground text-xs font-light leading-relaxed">
                        {craft.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* National Mountaineering Courses (BMC, AMC, MOI, S&R) */}
              <div className="space-y-6">
                <div>
                  <span className="font-mono text-xs text-primary uppercase tracking-widest block mb-1 font-medium">
                    National Qualifications
                  </span>
                  <h3 className="font-display text-2xl sm:text-3xl font-semibold text-foreground">
                    Certified Mountaineering Courses in India
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {MOUNTAINEERING_COURSES.map((course) => (
                    <div
                      key={course.code}
                      className="p-8 rounded-3xl bg-card border border-border hover:border-primary/40 transition-all flex flex-col justify-between space-y-6 shadow-sm"
                    >
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="px-3.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 font-mono text-xs font-semibold tracking-wider">
                            {course.code}
                          </span>
                          <span className="font-mono text-xs text-muted-foreground">
                            Duration: {course.duration}
                          </span>
                        </div>

                        <div>
                          <h4 className="font-display text-2xl font-semibold text-foreground mb-1">
                            {course.name}
                          </h4>
                          <p className="text-primary/90 text-xs font-mono mb-3">
                            Eligibility: {course.eligibility}
                          </p>
                          <p className="text-muted-foreground text-sm font-light leading-relaxed">
                            {course.overview}
                          </p>
                        </div>

                        {/* Curriculum */}
                        <div className="space-y-2 pt-2">
                          <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground block">
                            Key Training Modules:
                          </span>
                          <ul className="space-y-1.5 text-xs text-foreground/80 font-light">
                            {course.curriculum.map((item, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-primary mt-0.5">•</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-border/50 text-xs font-mono text-muted-foreground">
                        {course.significance}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Premier Indian Institutes */}
              <div className="p-8 rounded-3xl bg-card border border-border space-y-4 shadow-sm">
                <h4 className="font-display text-xl font-semibold text-foreground mb-2">
                  Premier National Mountaineering Institutes
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {MOUNTAINEERING_OVERVIEW.institutes.map((inst) => (
                    <div key={inst.name} className="p-4 rounded-xl bg-muted/40 border border-border/60">
                      <div className="font-display font-medium text-foreground text-sm">{inst.name}</div>
                      <div className="font-mono text-xs text-primary/80 mt-1">{inst.location}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 3: AMS, HAPE & HACE */}
          {activeTab === "medical" && (
            <motion.div
              key="medical"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: TRANSITION_EASE }}
              className="space-y-12"
            >
              {/* Emergency Alert Banner */}
              <div className="p-6 md:p-8 rounded-3xl bg-red-500/10 dark:bg-red-950/25 border border-red-500/30 flex flex-col md:flex-row items-start gap-6">
                <div className="p-4 rounded-2xl bg-red-500/15 text-red-500 dark:text-red-400 border border-red-500/20 shrink-0">
                  <AlertTriangle className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-display text-xl font-semibold text-foreground">
                    The Immutable Laws of High-Altitude Safety
                  </h3>
                  <ul className="space-y-1.5 text-foreground/80 text-sm font-light leading-relaxed list-disc list-inside">
                    <li><strong className="text-foreground font-medium">Law 1:</strong> Any sickness or headache at altitude is Acute Mountain Sickness until proven otherwise.</li>
                    <li><strong className="text-foreground font-medium">Law 2:</strong> NEVER ascend to sleep at a higher altitude with active symptoms of altitude sickness.</li>
                    <li><strong className="text-foreground font-medium">Law 3:</strong> If symptoms worsen, or signs of HAPE/HACE appear, <strong className="text-red-600 dark:text-red-400 font-semibold">DESCEND IMMEDIATELY</strong>. Descent saves lives.</li>
                  </ul>
                </div>
              </div>

              {/* Cards Grid for AMS, HAPE, HACE */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {ALTITUDE_ILLNESSES.map((illness) => (
                  <div
                    key={illness.id}
                    className={`rounded-3xl p-7 md:p-8 flex flex-col justify-between border transition-all duration-300 shadow-lg ${
                      illness.id === "hace"
                        ? "bg-red-500/[0.04] dark:bg-[#0d0708] border-red-500/30 hover:border-red-500/60"
                        : illness.id === "hape"
                        ? "bg-blue-500/[0.04] dark:bg-[#080d12] border-blue-500/30 hover:border-blue-500/60"
                        : "bg-card border-border hover:border-primary/40"
                    }`}
                  >
                    <div className="space-y-6">
                      {/* Header Badge */}
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-[11px] font-mono px-3 py-1 rounded-full uppercase tracking-wider border ${
                            illness.id === "ams"
                              ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                              : illness.id === "hape"
                              ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
                              : "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20"
                          }`}
                        >
                          {illness.severity}
                        </span>
                        <span className="text-xs font-mono text-muted-foreground">
                          {illness.urgency}
                        </span>
                      </div>

                      {/* Title & Overview */}
                      <div>
                        <h3 className="font-display text-2xl font-semibold text-foreground mb-2">
                          {illness.name}
                        </h3>
                        <p className="text-muted-foreground text-sm leading-relaxed font-light">
                          {illness.overview}
                        </p>
                      </div>

                      {/* Symptoms */}
                      <div>
                        <h4 className="text-xs font-mono uppercase tracking-widest text-primary mb-3 flex items-center gap-1.5 font-medium">
                          <Activity className="w-3.5 h-3.5" /> Warning Symptoms
                        </h4>
                        <ul className="space-y-2 text-xs text-foreground/80 font-light">
                          {illness.symptoms.map((sym, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-red-500 dark:text-red-400 mt-0.5">•</span>
                              <span>{sym}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Treatment & Emergency Action */}
                      <div className="pt-4 border-t border-border/50">
                        <h4 className="text-xs font-mono uppercase tracking-widest text-foreground mb-3 flex items-center gap-1.5 font-medium">
                          <ArrowDownCircle className="w-3.5 h-3.5 text-primary" /> Emergency Action &amp; Cure
                        </h4>
                        <ul className="space-y-2 text-xs text-muted-foreground font-light">
                          {illness.treatment.map((tx, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-primary mt-0.5 font-bold">✓</span>
                              <span>{tx}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Golden Rule Footer */}
                    <div className="mt-6 pt-4 border-t border-border/60">
                      <p className="text-xs font-mono text-muted-foreground italic">
                        &ldquo;{illness.goldenRules[0]}&rdquo;
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* TAB 4: ALTITUDE ZONES & LOW OXYGEN */}
          {activeTab === "altitude" && (
            <motion.div
              key="altitude"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: TRANSITION_EASE }}
              className="space-y-10"
            >
              <div className="p-8 rounded-3xl bg-card border border-border space-y-4 shadow-sm">
                <h3 className="font-display text-2xl font-semibold text-foreground">
                  Why Low Oxygen Affects Us
                </h3>
                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed font-light max-w-4xl">
                  Contrary to popular belief, the percentage of oxygen in the air remains constant at <strong className="text-foreground font-medium">20.9%</strong> at all altitudes. However, as you ascend, <strong className="text-foreground font-medium">barometric atmospheric pressure drops</strong>. With less pressure pushing air into the alveoli, each breath delivers significantly fewer oxygen molecules, creating hypoxia in your blood, brain, and muscles.
                </p>
              </div>

              {/* Altitude Scale Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {ALTITUDE_LEVELS.map((zone, idx) => (
                  <div
                    key={zone.name}
                    className="p-7 rounded-3xl bg-card border border-border hover:border-primary/40 transition-all flex flex-col justify-between shadow-sm"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs text-primary px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                          Zone 0{idx + 1}
                        </span>
                        <span className="font-mono text-xs text-muted-foreground">
                          {zone.oxygenPct}
                        </span>
                      </div>

                      <div>
                        <h4 className="font-display text-xl font-semibold text-foreground mb-1">
                          {zone.name}
                        </h4>
                        <div className="text-xs font-mono text-primary font-medium mb-3">
                          {zone.elevation}
                        </div>
                        <p className="text-muted-foreground text-xs font-light leading-relaxed">
                          {zone.effects}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-border/50 text-xs font-mono text-muted-foreground">
                      Risk Profile: <span className="text-foreground">{zone.risk}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* TAB 5: SAFETY PROTOCOLS & COLD WEATHER */}
          {activeTab === "protocols" && (
            <motion.div
              key="protocols"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: TRANSITION_EASE }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {SAFETY_PROTOCOLS.map((protocol) => (
                  <div
                    key={protocol.id}
                    className="p-8 rounded-3xl bg-card border border-border space-y-6 shadow-sm"
                  >
                    <div>
                      <h3 className="font-display text-2xl font-semibold text-foreground mb-2">
                        {protocol.title}
                      </h3>
                      {protocol.overview && (
                        <p className="text-muted-foreground text-sm font-light leading-relaxed">
                          {protocol.overview}
                        </p>
                      )}
                    </div>

                    {/* Stages if available */}
                    {protocol.stages && (
                      <div className="space-y-3">
                        {protocol.stages.map((st, i) => (
                          <div key={i} className="p-4 rounded-xl bg-muted/40 border border-border/60 text-xs space-y-1">
                            <div className="font-mono text-primary font-semibold">{st.stage}</div>
                            <div className="text-foreground/80"><strong className="text-foreground">Signs:</strong> {st.signs}</div>
                            <div className="text-muted-foreground"><strong className="text-foreground">Action:</strong> {st.action}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Rules if available */}
                    {protocol.rules && (
                      <ul className="space-y-2.5 text-xs text-foreground/80 font-light">
                        {protocol.rules.map((rule, i) => (
                          <li key={i} className="flex items-start gap-2.5">
                            <CheckCircle className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                            <span>{rule}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Methods if available */}
                    {protocol.methods && (
                      <div className="space-y-3">
                        {protocol.methods.map((m, i) => (
                          <div key={i} className="p-4 rounded-xl bg-muted/40 border border-border/60 text-xs space-y-1">
                            <div className="font-mono text-primary font-semibold">{m.method}</div>
                            <div className="text-muted-foreground font-light">{m.details}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* TAB 6: EMERGENCY SEARCH & RESCUE (SAR) & HELPLINES */}
          {activeTab === "rescue" && (
            <motion.div
              key="rescue"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: TRANSITION_EASE }}
              className="space-y-12"
            >
              {/* Directive Alert Banner */}
              <div className="p-6 sm:p-8 rounded-3xl bg-rose-500/[0.06] border border-rose-500/30 relative overflow-hidden shadow-md">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                  <div className="space-y-3 max-w-3xl">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-500 font-mono text-xs uppercase font-bold tracking-widest">
                      <ShieldAlert className="w-4 h-4" /> Wilderness Medicine Emergency Protocol
                    </div>
                    <h3 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
                      Himalayan Search &amp; Rescue (SAR) Dispatch Directory
                    </h3>
                    <p className="text-foreground/80 text-sm font-light leading-relaxed">
                      If symptoms of <strong className="text-foreground">HAPE</strong> (pulmonary fluid, pink sputum, breathlessness at rest) or <strong className="text-foreground">HACE</strong> (ataxia, confusion, loss of balance) occur, initiate <span className="underline decoration-rose-500 underline-offset-4 font-semibold text-rose-600 dark:text-rose-400">immediate descent of 500m to 1,000m</span> without delay. Mobilize emergency search and rescue teams immediately.
                    </p>
                  </div>
                  <div className="shrink-0 p-5 rounded-2xl bg-card border border-rose-500/20 text-center w-full lg:w-auto shadow-sm">
                    <span className="font-mono text-xs text-muted-foreground uppercase tracking-wider block mb-1">
                      Pan-India Emergency Number
                    </span>
                    <a
                      href="tel:112"
                      className="font-display font-black text-4xl text-rose-500 hover:text-rose-600 transition-colors block"
                    >
                      112
                    </a>
                    <span className="text-[11px] font-mono text-muted-foreground">Toll-free / 24x7 Cellular Relay</span>
                  </div>
                </div>
              </div>

              {/* Verified SAR Contacts Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {EMERGENCY_SAR_CONTACTS.map((contact, idx) => (
                  <div
                    key={idx}
                    className="p-6 rounded-3xl bg-card border border-border/80 flex flex-col justify-between shadow-sm hover:border-rose-500/30 transition-all group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-mono font-bold uppercase tracking-widest text-primary">
                          {contact.region}
                        </span>
                        <span className="text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-muted border border-border text-foreground/70">
                          {contact.badge}
                        </span>
                      </div>

                      <h4 className="font-display text-lg font-bold text-foreground mb-2 group-hover:text-rose-500 transition-colors">
                        {contact.agency}
                      </h4>

                      <p className="text-muted-foreground text-xs font-light leading-relaxed mb-6">
                        {contact.description}
                      </p>
                    </div>

                    <div className="space-y-2.5 pt-4 border-t border-border">
                      {contact.numbers.map((num, nIdx) => {
                        const cleanNum = num.replace(/\s+/g, "");
                        const isCopied = copiedNumber === num;
                        return (
                          <div
                            key={nIdx}
                            className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-muted/50 border border-border/60"
                          >
                            <a
                              href={`tel:${cleanNum}`}
                              className="font-mono text-sm font-bold text-foreground hover:text-rose-500 transition-colors flex items-center gap-2"
                            >
                              <PhoneCall className="w-3.5 h-3.5 text-rose-500" />
                              <span>{num}</span>
                            </a>
                            <button
                              onClick={() => copyToClipboard(num)}
                              aria-label={`Copy ${num}`}
                              className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                              title="Copy number"
                            >
                              {isCopied ? (
                                <Check className="w-3.5 h-3.5 text-emerald-500" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Helicopter Evacuation & SOS Satellite Protocols */}
              <div className="p-6 sm:p-8 rounded-3xl bg-muted/40 border border-border space-y-4">
                <h4 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" /> High-Altitude Helicopter Evacuation Protocols
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-light text-muted-foreground">
                  <div className="p-4 rounded-2xl bg-card border border-border space-y-1.5">
                    <strong className="text-foreground block font-medium">1. Coordinates Transmission</strong>
                    <span>Transmit exact GPS coordinates in WGS-84 decimal degrees (Lat, Lng) with elevation and nearby landmarks.</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-card border border-border space-y-1.5">
                    <strong className="text-foreground block font-medium">2. Landing Zone (LZ) Preparation</strong>
                    <span>Secure a 25m × 25m flat zone clear of loose rocks, tents, and gear. Mark wind direction with a brightly colored fabric anchored down.</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-card border border-border space-y-1.5">
                    <strong className="text-foreground block font-medium">3. IMF &amp; Civil Aviation Clearances</strong>
                    <span>Civilian helicopter charters in high border zones (Ladakh, Spiti, Kumaon) require district magistrate and civil aviation airspace clearance.</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </main>
  );
}
