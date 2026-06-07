import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About TheHimalayanTrails",
  description:
    "Learn about TheHimalayanTrails — the Himalayan trekking authority. Our mission, our story, and the team behind the platform.",
};

const teamMembers = [
  { name: "Team Member", role: "Founder & Lead Guide" },
  { name: "Team Member", role: "Content Strategist" },
  { name: "Team Member", role: "Mountain Photographer" },
  { name: "Team Member", role: "Trail Researcher" },
];

export default function AboutPage() {
  return (
    <section className="container mx-auto px-4 py-16">
      {/* Page Title */}
      <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-12 text-center">
        About TheHimalayanTrails
      </h1>

      {/* Mission Statement */}
      <div className="max-w-3xl mx-auto space-y-6 mb-16">
        <p className="text-lg text-foreground/80 leading-relaxed">
          TheHimalayanTrails is the definitive authority on Himalayan trekking
          and mountaineering. Born from a deep passion for the mountains, we
          exist to connect adventurers with the most spectacular trails, peaks,
          and experiences the Himalayas have to offer.
        </p>
        <p className="text-lg text-foreground/80 leading-relaxed">
          Our team of experienced trekkers, climbers, and local experts has
          spent years exploring every corner of the Himalayan range — from the
          lush valleys of Himachal Pradesh to the rugged passes of Ladakh. We
          bring this first-hand knowledge to every guide, route description, and
          recommendation on our platform.
        </p>
        <p className="text-lg text-foreground/80 leading-relaxed">
          Whether you are planning your first day hike near Manali or preparing
          for a high-altitude expedition, TheHimalayanTrails provides the
          detailed, trustworthy information you need to make your adventure safe
          and unforgettable.
        </p>
      </div>

      {/* Team Section */}
      <div className="mb-16">
        <h2 className="font-heading text-3xl font-bold text-foreground mb-8 text-center">
          Our Team
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="glass-card rounded-xl p-6 text-center"
            >
              <div className="w-20 h-20 rounded-full bg-white/10 mx-auto mb-4 flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-foreground/40"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                </svg>
              </div>
              <h3 className="font-semibold text-foreground">{member.name}</h3>
              <p className="text-sm text-foreground/60 mt-1">{member.role}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Platform Story */}
      <div className="max-w-3xl mx-auto">
        <h2 className="font-heading text-3xl font-bold text-foreground mb-6 text-center">
          Our Story
        </h2>
        <div className="glass-card rounded-xl p-8 space-y-4">
          <p className="text-foreground/80 leading-relaxed">
            TheHimalayanTrails started as a simple blog — a place to document
            trails and share route notes with fellow trekkers. Over time, we
            realized that accurate, comprehensive trekking information for the
            Himalayas was surprisingly hard to find. Existing resources were
            often outdated, incomplete, or buried in forums.
          </p>
          <p className="text-foreground/80 leading-relaxed">
            We set out to build something better: a single, beautifully designed
            platform that combines detailed trail guides, peak profiles, day
            hike recommendations, regional travel information, and practical
            gear advice — all in one place.
          </p>
          <p className="text-foreground/80 leading-relaxed">
            Today, TheHimalayanTrails serves thousands of adventurers each
            month, helping them discover new routes, plan their expeditions, and
            experience the magic of the Himalayas with confidence.
          </p>
        </div>
      </div>
    </section>
  );
}
