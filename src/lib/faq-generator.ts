import { HimalayaPlace } from "@/data/atlas/types";

export interface FAQItem {
  question: string;
  answer: string;
}

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *  HIMALAYAN TREK FAQ GENERATOR ENGINE
 *  Discover Himalayan Trails — Schema.org & Direct-Answer FAQ Standard
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Deterministically generates high-authority FAQ items strictly from verified
 * data fields present in each trek. Adheres strictly to the 40–55 word standard
 * where the first sentence delivers the definitive, direct answer.
 */
export function generateTrekFaqs(
  place: HimalayaPlace,
  subRegionName: string = "the region",
  stateName: string = "the Indian Himalayas"
): FAQItem[] {
  const generated: FAQItem[] = [];
  const name = place.name;
  const sLow = (place.bestSeason || "").toLowerCase();

  // 1. Summit Altitude / Elevation
  if (place.elevation) {
    generated.push({
      question: `What is the maximum altitude of the ${name}?`,
      answer: `${name} reaches a maximum altitude of ${place.elevation}. Hikers ascending above 3,000 meters must follow disciplined acclimatization protocols to prevent acute mountain sickness (AMS). Climb gradually, maintain daily hydration with at least 3 to 4 liters of water, and descend promptly if severe altitude headache or nausea develops.`,
    });
  }

  // 2. Trail Distance
  if (place.distance) {
    generated.push({
      question: `How long is the ${name} trail in total distance?`,
      answer: `The total trail distance for ${name} is approximately ${place.distance}. This mountain route traverses varied alpine topography including steep forest ascents, high meadow trails, and rocky moraine terrain. Hikers should maintain a steady, disciplined pacing, build cardiovascular endurance prior to departure, and start each morning stage early to safely complete daily distances.`,
    });
  }

  // 3. Duration & Days
  if (place.duration) {
    generated.push({
      question: `How many days are needed to complete ${name}?`,
      answer: `${name} typically requires ${place.duration} to complete safely at a standard alpine pace. This duration includes necessary high-altitude acclimatization stages and safe descent windows. Adhering to this recommended schedule helps prevent overexertion, reduces altitude sickness risk, and ensures you navigate challenging trail sections during optimal morning daylight hours.`,
    });
  }

  // 4. Best Season & Timing
  if (place.bestSeason) {
    generated.push({
      question: `When is the best time to visit or trek ${name}?`,
      answer: `The best time to undertake ${name} is during ${place.bestSeason}. During this seasonal window, mountain weather patterns are most reliable, trails remain accessible, and atmospheric visibility across the Himalayan peaks is at its clearest. Always check localized mountain forecasts before departure, as high-altitude conditions can change rapidly in any season.`,
    });
  }

  // 5. Trailhead Approach
  if (place.trailhead) {
    generated.push({
      question: `Where does the ${name} trail begin?`,
      answer: `${name} officially begins at the trailhead in ${place.trailhead}, located in the ${subRegionName} district of ${stateName}. Trekkers can reach this base via shared jeeps or private mountain taxis from major regional transport hubs. Arriving at the roadhead a day early is highly recommended to finalize logistics and commence preliminary altitude acclimatization.`,
    });
  }

  // 6. Winter Accessibility
  if (place.elevation) {
    const isWinterSnow = sLow.includes("winter") || (sLow.includes("dec") && (sLow.includes("jan") || sLow.includes("feb")));
    if (isWinterSnow) {
      generated.push({
        question: `Can ${name} be undertaken during winter?`,
        answer: `Yes, ${name} is an active winter snow route during the colder months. Trekkers encounter sub-zero temperatures and continuous snowpack, which requires microspikes, high-insulation thermal layers, waterproof gaiters, and sturdy mountain boots. Trekking with certified mountain guides is strongly advised to safely manage deep snowdrifts and sub-zero night conditions.`,
      });
    } else {
      generated.push({
        question: `Can ${name} be undertaken during winter?`,
        answer: `No, ${name} is generally inaccessible during peak winter from December to March due to heavy snowpack and sub-zero temperatures. High mountain passes and exposed upper slopes are buried in snow drifts with heightened avalanche hazard. The trail reopens reliably in late spring or summer once seasonal snow melts away.`,
      });
    }
  }

  // 7. Permits and Forestry Fees (only when field exists in data)
  if (place.permitsAndFees) {
    generated.push({
      question: `Are permits required for ${name}?`,
      answer: `${place.permitsAndFees} Trekkers should carry valid government identity cards, passport-sized photographs, and relevant medical self-declarations for inspection at checkpoints. Confirm all conservation and entry formalities prior to departure.`,
    });
  }

  // 8. How to Reach (only when field exists in data)
  if (place.howToReach) {
    generated.push({
      question: `How do I reach the base for ${name}?`,
      answer: `${place.howToReach} Ensure you arrive at the staging hub in daylight to coordinate local mountain transport and confirm current road conditions.`,
    });
  }

  // 9. Merge with existing custom place.faqs or trek.faqs
  const customFaqs = place.faqs || place.trekData?.faqs || [];
  const merged: FAQItem[] = [];

  function extractKeyTopic(q: string): string[] {
    const ql = q.toLowerCase();
    if (ql.includes("altitude") || ql.includes("height")) return ["altitude", "height"];
    if (ql.includes("distance") || ql.includes("how long")) return ["distance", "how long"];
    if (ql.includes("how many days") || ql.includes("duration")) return ["days", "duration"];
    if (ql.includes("best time") || ql.includes("best season") || ql.includes("when to")) return ["best time", "season"];
    if (ql.includes("where does") || ql.includes("trailhead") || ql.includes("begin") || ql.includes("start point")) return ["trailhead", "begin", "start"];
    if (ql.includes("winter") || ql.includes("snow")) return ["winter", "snow"];
    if (ql.includes("permit") || ql.includes("fee")) return ["permit", "fee"];
    if (ql.includes("how do i reach") || ql.includes("how to reach")) return ["how to reach", "reach the base"];
    return [];
  }

  // Add all generated FAQs (unless a custom FAQ already covers this exact topic)
  for (const g of generated) {
    const topics = extractKeyTopic(g.question);
    const duplicate = customFaqs.find((c) => {
      const cl = c.question.toLowerCase();
      return topics.length > 0 && topics.some((t) => cl.includes(t));
    });
    if (!duplicate) {
      merged.push(g);
    }
  }

  // Add all custom FAQs
  for (const c of customFaqs) {
    merged.push(c);
  }

  return merged;
}
