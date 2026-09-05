import type { Metadata } from "next";
import { SafetyClient } from "./SafetyClient";
import { generatePageMetadata } from "@/lib/seo";
import {
  buildMedicalWebPageJsonLd,
  buildFAQJsonLd,
  buildBreadcrumbJsonLd,
  serializeJsonLd,
} from "@/lib/json-ld";

export const metadata: Metadata = generatePageMetadata({
  title: "Mountain Altitude Safety & Medical Protocol — AMS, HAPE, HACE & Courses",
  description:
    "Authoritative clinical protocol for Acute Mountain Sickness (AMS), HAPE, HACE, Diamox dosages, acclimatization schedules, and IMF mountaineering courses (BMC, AMC).",
  path: "/safety",
  keywords: [
    "AMS symptoms high altitude",
    "Diamox dosage trekking Himalayas",
    "HAPE vs HACE clinical symptoms",
    "high altitude cerebral edema emergency protocol",
    "acclimatization schedule Indian Himalayas",
    "Basic Mountaineering Course NIM HMI syllabus",
  ],
});

export default function SafetyPage() {
  const medicalSchema = buildMedicalWebPageJsonLd();

  const faqSchema = buildFAQJsonLd([
    {
      question: "What is Acute Mountain Sickness (AMS) and what are the earliest symptoms?",
      answer:
        "Acute Mountain Sickness (AMS) is the body's physiological reaction to reduced atmospheric pressure and lower oxygen saturation at altitudes above 2,500m (8,200 ft). Early symptoms include a throbbing headache (typically behind the eyes or temples), fatigue, mild nausea, dizziness, loss of appetite, and insomnia. AMS must never be ignored — ascending higher with symptoms is the primary cause of life-threatening HAPE and HACE.",
    },
    {
      question: "What is the recommended dosage and timing for Diamox (Acetazolamide)?",
      answer:
        "The standard prophylactic dosage for Diamox (Acetazolamide) is 125mg to 250mg taken twice daily, starting 24 hours prior to ascending above 2,800m and continued until acclimatized at your highest camp. Diamox is a carbonic anhydrase inhibitor that mildly acidifies the blood to stimulate deeper breathing. It is not a substitute for proper gradual ascent or emergency descent. Anyone with a known sulfa allergy must not take Diamox.",
    },
    {
      question: "What is the critical difference between HAPE and HACE?",
      answer:
        "High-Altitude Pulmonary Edema (HAPE) is fluid accumulation in the lungs causing severe breathlessness at rest, persistent cough with frothy pink/white sputum, extreme lethargy, and bubbling chest sounds (rales). High-Altitude Cerebral Edema (HACE) is swelling of brain tissue causing ataxia (loss of physical coordination/drunk-like walk), confusion, hallucination, altered mental state, and coma. Both are acute medical emergencies requiring immediate descent of at least 1,000 meters and supplemental oxygen.",
    },
    {
      question: "What are the premier national mountaineering institutes in India for certified courses?",
      answer:
        "India's premier mountaineering institutes recognized by the Indian Mountaineering Foundation (IMF) and Ministry of Defence are: NIM (Nehru Institute of Mountaineering, Uttarkashi), HMI (Himalayan Mountaineering Institute, Darjeeling), ABVIMAS (Atal Bihari Vajpayee Institute, Manali), JIM&WS (Jawahar Institute, Pahalgam), and NIMAS (National Institute, Dirang). They conduct 28-day Basic Mountaineering Courses (BMC) and Advanced Mountaineering Courses (AMC).",
    },
  ]);

  const breadcrumbsSchema = buildBreadcrumbJsonLd([
    { label: "Home", href: "/" },
    { label: "Mountain Medicine & Safety", href: "/safety" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(medicalSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbsSchema) }}
      />
      <SafetyClient />
    </>
  );
}

