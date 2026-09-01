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
} from "lucide-react";
import {
  ALTITUDE_LEVELS,
  FUNDAMENTALS_DATA,
  ALTITUDE_ILLNESSES,
  SAFETY_PROTOCOLS,
  GLOSSARY_TERMS,
  MOUNTAINEERING_OVERVIEW,
  MOUNTAINEERING_COURSES,
} from "@/data/mountain-safety";

const TRANSITION_EASE = [0.23, 1, 0.32, 1] as const;

type ActiveTab = "glossary" | "mountaineering" | "medical" | "altitude" | "protocols";

export function SafetyClient() {
  // Mountain Terms is the primary and first default tab
  const [activeTab, setActiveTab] = useState<ActiveTab>("glossary");
  const [glossarySearch, setGlossarySearch] = useState("");
  const [selectedGlossaryCat, setSelectedGlossaryCat] = useState("all");

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
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none opacity-40" />

      <div className="relative z-20 container mx-auto px-6 max-w-7xl">
        {/* Header Title */}
        <div className="mb-12 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-4">
            <BookOpen className="w-4 h-4 text-primary" />
            <span className="font-mono text-xs text-white/80 uppercase tracking-widest">
              Himalayan Dictionary &amp; Field Manual
            </span>
          </div>

          <h1 className="font-display tracking-tight text-3xl sm:text-5xl md:text-6xl font-semibold text-white mb-5">
            Mountain Terms &amp; Safety
          </h1>
          <p className="text-white/70 text-base sm:text-lg font-light leading-relaxed">
            The definitive reference for Himalayan geography, core mountaineering terms, altitude physiology, AMS/HAPE/HACE warning protocols, and trail fundamentals.
          </p>
        </div>

        {/* Tab Navigation Navigation Bar */}
        <div className="flex flex-wrap gap-2 sm:gap-3 p-1.5 rounded-2xl bg-surface border border-white/10 mb-12 w-fit">
          <button
            onClick={() => setActiveTab("glossary")}
            className={`px-4 sm:px-5 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider transition-all duration-200 flex items-center gap-2 ${
              activeTab === "glossary"
                ? "bg-primary text-white font-semibold shadow-md shadow-primary/30"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            <BookOpen className="w-4 h-4" /> Mountain Terms
          </button>

          <button
            onClick={() => setActiveTab("mountaineering")}
            className={`px-4 sm:px-5 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider transition-all duration-200 flex items-center gap-2 ${
              activeTab === "mountaineering"
                ? "bg-primary text-white font-semibold shadow-md shadow-primary/30"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            <GraduationCap className="w-4 h-4" /> Mountaineering &amp; BMC/AMC
          </button>

          <button
            onClick={() => setActiveTab("medical")}
            className={`px-4 sm:px-5 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider transition-all duration-200 flex items-center gap-2 ${
              activeTab === "medical"
                ? "bg-primary text-white font-semibold shadow-md shadow-primary/30"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            <HeartPulse className="w-4 h-4" /> AMS, HAPE &amp; HACE
          </button>

          <button
            onClick={() => setActiveTab("altitude")}
            className={`px-4 sm:px-5 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider transition-all duration-200 flex items-center gap-2 ${
              activeTab === "altitude"
                ? "bg-primary text-white font-semibold shadow-md shadow-primary/30"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            <Mountain className="w-4 h-4" /> Altitude &amp; Oxygen
          </button>

          <button
            onClick={() => setActiveTab("protocols")}
            className={`px-4 sm:px-5 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider transition-all duration-200 flex items-center gap-2 ${
              activeTab === "protocols"
                ? "bg-primary text-white font-semibold shadow-md shadow-primary/30"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            <Thermometer className="w-4 h-4" /> Cold Injury &amp; Safety
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
                  <span className="font-mono text-xs text-primary uppercase tracking-widest block">
                    Core Himalayan Fundamentals
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Hike */}
                  <div className="p-7 rounded-3xl bg-surface border border-white/10 space-y-4 hover:border-white/20 transition-all">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
                      <Compass className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-display text-xl font-semibold text-white mb-0.5">
                        Day Hike
                      </h3>
                      <p className="text-white/50 text-xs font-mono uppercase">
                        Single Day Outing
                      </p>
                    </div>
                    <div className="space-y-3 text-xs font-light text-white/80 pt-2 border-t border-white/5">
                      <div>
                        <span className="font-mono uppercase text-white/40 block mb-0.5">Duration</span>
                        {FUNDAMENTALS_DATA[0].hike.duration}
                      </div>
                      <div>
                        <span className="font-mono uppercase text-white/40 block mb-0.5">Terrain</span>
                        {FUNDAMENTALS_DATA[0].hike.terrain}
                      </div>
                      <div>
                        <span className="font-mono uppercase text-white/40 block mb-0.5">Gear</span>
                        {FUNDAMENTALS_DATA[0].hike.gear}
                      </div>
                    </div>
                  </div>

                  {/* Trek */}
                  <div className="p-7 rounded-3xl bg-surface border border-primary/40 shadow-lg shadow-primary/10 space-y-4 relative overflow-hidden">
                    <div className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30 font-mono text-[9px] uppercase tracking-wider">
                      Core Focus
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-primary/20 text-primary flex items-center justify-center border border-primary/30">
                      <Mountain className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-display text-xl font-semibold text-white mb-0.5">
                        Multi-Day Trek
                      </h3>
                      <p className="text-white/50 text-xs font-mono uppercase">
                        Alpine Pass Crossings
                      </p>
                    </div>
                    <div className="space-y-3 text-xs font-light text-white/80 pt-2 border-t border-white/5">
                      <div>
                        <span className="font-mono uppercase text-primary block mb-0.5">Duration</span>
                        {FUNDAMENTALS_DATA[0].trek.duration}
                      </div>
                      <div>
                        <span className="font-mono uppercase text-primary block mb-0.5">Terrain</span>
                        {FUNDAMENTALS_DATA[0].trek.terrain}
                      </div>
                      <div>
                        <span className="font-mono uppercase text-primary block mb-0.5">Gear</span>
                        {FUNDAMENTALS_DATA[0].trek.gear}
                      </div>
                    </div>
                  </div>

                  {/* Peak Expedition */}
                  <div className="p-7 rounded-3xl bg-surface border border-white/10 space-y-4 hover:border-white/20 transition-all">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
                      <Flame className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-display text-xl font-semibold text-white mb-0.5">
                        Peak Expedition
                      </h3>
                      <p className="text-white/50 text-xs font-mono uppercase">
                        Technical Climbing
                      </p>
                    </div>
                    <div className="space-y-3 text-xs font-light text-white/80 pt-2 border-t border-white/5">
                      <div>
                        <span className="font-mono uppercase text-white/40 block mb-0.5">Duration</span>
                        {FUNDAMENTALS_DATA[0].expedition.duration}
                      </div>
                      <div>
                        <span className="font-mono uppercase text-white/40 block mb-0.5">Terrain</span>
                        {FUNDAMENTALS_DATA[0].expedition.terrain}
                      </div>
                      <div>
                        <span className="font-mono uppercase text-white/40 block mb-0.5">Gear</span>
                        {FUNDAMENTALS_DATA[0].expedition.gear}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Search & Category Filter Bar */}
              <div className="space-y-6 pt-4 border-t border-white/10">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                  <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                    <input
                      type="text"
                      value={glossarySearch}
                      onChange={(e) => setGlossarySearch(e.target.value)}
                      placeholder="Search mountain terms (e.g. Mountain, Himalayas, Crevasse, Ridge)..."
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-surface border border-white/10 text-white text-sm placeholder:text-white/40 focus:outline-none focus:border-primary font-light"
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
                            : "bg-white/5 text-white/60 border border-white/10 hover:text-white"
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
                      className="p-6 rounded-2xl bg-surface hover:bg-[#121216] border border-white/10 hover:border-primary/40 transition-all flex flex-col justify-between space-y-4"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-display text-xl font-semibold text-white flex items-center gap-2">
                            {term.term}
                          </h3>
                          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-white/5 text-primary border border-white/10">
                            {term.category}
                          </span>
                        </div>

                        {term.localTerm && (
                          <span className="text-xs font-mono text-primary/80 block mb-2">
                            {term.localTerm}
                          </span>
                        )}

                        <p className="text-white/70 text-xs sm:text-sm font-light leading-relaxed mb-3">
                          {term.definition}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-white/5 text-xs text-white/50 font-light">
                        <strong className="text-white/80 font-medium">Why it matters:</strong> {term.significance}
                      </div>
                    </div>
                  ))}
                </div>

                {filteredGlossary.length === 0 && (
                  <div className="p-12 text-center text-white/50 font-light">
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
              <div className="p-8 md:p-10 rounded-3xl bg-surface border border-white/10 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary font-mono text-xs uppercase tracking-wider">
                  <Award className="w-3.5 h-3.5" /> High-Altitude Discipline
                </div>
                <div>
                  <h2 className="font-display text-3xl sm:text-4xl font-semibold text-white mb-3">
                    {MOUNTAINEERING_OVERVIEW.title}
                  </h2>
                  <p className="text-white/70 text-base sm:text-lg font-light leading-relaxed max-w-4xl">
                    {MOUNTAINEERING_OVERVIEW.definition}
                  </p>
                </div>

                {/* 4 Core Pillars */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-white/5">
                  {MOUNTAINEERING_OVERVIEW.coreDisciplines.map((craft) => (
                    <div key={craft.title} className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                      <h4 className="font-display font-semibold text-white text-base text-primary">
                        {craft.title}
                      </h4>
                      <p className="text-white/60 text-xs font-light leading-relaxed">
                        {craft.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* National Mountaineering Courses (BMC, AMC, MOI, S&R) */}
              <div className="space-y-6">
                <div>
                  <span className="font-mono text-xs text-primary uppercase tracking-widest block mb-1">
                    National Qualifications
                  </span>
                  <h3 className="font-display text-2xl sm:text-3xl font-semibold text-white">
                    Certified Mountaineering Courses in India
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {MOUNTAINEERING_COURSES.map((course) => (
                    <div
                      key={course.code}
                      className="p-8 rounded-3xl bg-surface border border-white/10 hover:border-primary/40 transition-all flex flex-col justify-between space-y-6"
                    >
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="px-3.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 font-mono text-xs font-semibold tracking-wider">
                            {course.code}
                          </span>
                          <span className="font-mono text-xs text-white/40">
                            Duration: {course.duration}
                          </span>
                        </div>

                        <div>
                          <h4 className="font-display text-2xl font-semibold text-white mb-1">
                            {course.name}
                          </h4>
                          <p className="text-white/65 text-xs font-mono text-primary/90 mb-3">
                            Eligibility: {course.eligibility}
                          </p>
                          <p className="text-white/70 text-sm font-light leading-relaxed">
                            {course.overview}
                          </p>
                        </div>

                        {/* Curriculum */}
                        <div className="space-y-2 pt-2">
                          <span className="font-mono text-xs uppercase tracking-wider text-white/40 block">
                            Key Training Modules:
                          </span>
                          <ul className="space-y-1.5 text-xs text-white/80 font-light">
                            {course.curriculum.map((item, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-primary mt-0.5">•</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-white/5 text-xs font-mono text-white/50">
                        {course.significance}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Premier Indian Institutes */}
              <div className="p-8 rounded-3xl bg-surface border border-white/10 space-y-4">
                <h4 className="font-display text-xl font-semibold text-white mb-2">
                  Premier National Mountaineering Institutes
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {MOUNTAINEERING_OVERVIEW.institutes.map((inst) => (
                    <div key={inst.name} className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                      <div className="font-display font-medium text-white text-sm">{inst.name}</div>
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
              <div className="p-6 md:p-8 rounded-3xl bg-red-950/20 border border-red-500/30 flex flex-col md:flex-row items-start gap-6">
                <div className="p-4 rounded-2xl bg-red-500/10 text-red-400 border border-red-500/20 shrink-0">
                  <AlertTriangle className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-display text-xl font-semibold text-white">
                    The Immutable Laws of High-Altitude Safety
                  </h3>
                  <ul className="space-y-1.5 text-white/80 text-sm font-light leading-relaxed list-disc list-inside">
                    <li><strong className="text-white font-medium">Law 1:</strong> Any sickness or headache at altitude is Acute Mountain Sickness until proven otherwise.</li>
                    <li><strong className="text-white font-medium">Law 2:</strong> NEVER ascend to sleep at a higher altitude with active symptoms of altitude sickness.</li>
                    <li><strong className="text-white font-medium">Law 3:</strong> If symptoms worsen, or signs of HAPE/HACE appear, <strong className="text-red-400">DESCEND IMMEDIATELY</strong>. Descent saves lives.</li>
                  </ul>
                </div>
              </div>

              {/* Cards Grid for AMS, HAPE, HACE */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {ALTITUDE_ILLNESSES.map((illness) => (
                  <div
                    key={illness.id}
                    className={`rounded-3xl p-7 md:p-8 flex flex-col justify-between border transition-all duration-300 shadow-xl ${
                      illness.id === "hace"
                        ? "bg-[#0d0708] border-red-500/30 hover:border-red-500/60"
                        : illness.id === "hape"
                        ? "bg-[#080d12] border-blue-500/30 hover:border-blue-500/60"
                        : "bg-surface border-white/10 hover:border-primary/40"
                    }`}
                  >
                    <div className="space-y-6">
                      {/* Header Badge */}
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-[11px] font-mono px-3 py-1 rounded-full uppercase tracking-wider border ${
                            illness.id === "ams"
                              ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                              : illness.id === "hape"
                              ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                              : "bg-red-500/10 text-red-400 border-red-500/20"
                          }`}
                        >
                          {illness.severity}
                        </span>
                        <span className="text-xs font-mono text-white/40">
                          {illness.urgency}
                        </span>
                      </div>

                      {/* Title & Overview */}
                      <div>
                        <h3 className="font-display text-2xl font-semibold text-white mb-2">
                          {illness.name}
                        </h3>
                        <p className="text-white/65 text-sm leading-relaxed font-light">
                          {illness.overview}
                        </p>
                      </div>

                      {/* Symptoms */}
                      <div>
                        <h4 className="text-xs font-mono uppercase tracking-widest text-primary mb-3 flex items-center gap-1.5">
                          <Activity className="w-3.5 h-3.5" /> Warning Symptoms
                        </h4>
                        <ul className="space-y-2 text-xs text-white/80 font-light">
                          {illness.symptoms.map((sym, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-red-400 mt-0.5">•</span>
                              <span>{sym}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Treatment & Emergency Action */}
                      <div className="pt-4 border-t border-white/5">
                        <h4 className="text-xs font-mono uppercase tracking-widest text-white/90 mb-3 flex items-center gap-1.5">
                          <ArrowDownCircle className="w-3.5 h-3.5 text-primary" /> Emergency Action &amp; Cure
                        </h4>
                        <ul className="space-y-2 text-xs text-white/70 font-light">
                          {illness.treatment.map((tx, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-primary mt-0.5">✓</span>
                              <span>{tx}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Golden Rule Footer */}
                    <div className="mt-6 pt-4 border-t border-white/10">
                      <p className="text-xs font-mono text-white/50 italic">
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
              <div className="p-8 rounded-3xl bg-surface border border-white/10 space-y-4">
                <h3 className="font-display text-2xl font-semibold text-white">
                  Why Low Oxygen Affects Us
                </h3>
                <p className="text-white/70 text-sm sm:text-base leading-relaxed font-light max-w-4xl">
                  Contrary to popular belief, the percentage of oxygen in the air remains constant at <strong className="text-white font-medium">20.9%</strong> at all altitudes. However, as you ascend, <strong className="text-white font-medium">barometric atmospheric pressure drops</strong>. With less pressure pushing air into the alveoli, each breath delivers significantly fewer oxygen molecules, creating hypoxia in your blood, brain, and muscles.
                </p>
              </div>

              {/* Altitude Scale Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {ALTITUDE_LEVELS.map((zone, idx) => (
                  <div
                    key={zone.name}
                    className="p-7 rounded-3xl bg-surface border border-white/10 hover:border-primary/40 transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs text-primary px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                          Zone 0{idx + 1}
                        </span>
                        <span className="font-mono text-xs text-white/40">
                          {zone.oxygenPct}
                        </span>
                      </div>

                      <div>
                        <h4 className="font-display text-xl font-semibold text-white mb-1">
                          {zone.name}
                        </h4>
                        <div className="text-xs font-mono text-primary font-medium mb-3">
                          {zone.elevation}
                        </div>
                        <p className="text-white/65 text-xs font-light leading-relaxed">
                          {zone.effects}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-white/5 text-xs font-mono text-white/50">
                      Risk Profile: <span className="text-white/80">{zone.risk}</span>
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
                    className="p-8 rounded-3xl bg-surface border border-white/10 space-y-6"
                  >
                    <div>
                      <h3 className="font-display text-2xl font-semibold text-white mb-2">
                        {protocol.title}
                      </h3>
                      {protocol.overview && (
                        <p className="text-white/65 text-sm font-light leading-relaxed">
                          {protocol.overview}
                        </p>
                      )}
                    </div>

                    {/* Stages if available */}
                    {protocol.stages && (
                      <div className="space-y-3">
                        {protocol.stages.map((st, i) => (
                          <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-xs space-y-1">
                            <div className="font-mono text-primary font-semibold">{st.stage}</div>
                            <div className="text-white/80"><strong>Signs:</strong> {st.signs}</div>
                            <div className="text-white/60"><strong>Action:</strong> {st.action}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Rules if available */}
                    {protocol.rules && (
                      <ul className="space-y-2.5 text-xs text-white/80 font-light">
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
                          <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-xs space-y-1">
                            <div className="font-mono text-primary font-semibold">{m.method}</div>
                            <div className="text-white/70 font-light">{m.details}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
