import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "../components/Navbar";

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: "🤖",
    title: "AI-Powered Planning",
    desc: "Get intelligent event suggestions tailored to your preferences and budget.",
  },
  {
    icon: "🎟️",
    title: "Easy Booking",
    desc: "Book tickets instantly with a seamless checkout experience.",
  },
  {
    icon: "⚡",
    title: "Smart Suggestions",
    desc: "Discover events you will love based on your interests and location.",
  },
  {
    icon: "🛡️",
    title: "Secure Payments",
    desc: "Your transactions are protected with industry-standard security.",
  },
  {
    icon: "👥",
    title: "For Organizers",
    desc: "Powerful tools to create, manage and grow your events.",
  },
  {
    icon: "🔔",
    title: "Real-time Updates",
    desc: "Stay informed with instant notifications about your bookings.",
  },
];

const Home = () => {
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero content
      gsap.from(".hero-content > *", {
        opacity: 0,
        y: 40,
        duration: 0.7,
        ease: "power2.out",
        stagger: 0.15,
        delay: 0.2,
      });

      // Feature cards
      gsap.from(".feature-card", {
        scrollTrigger: {
          trigger: featuresRef.current,
          start: "top 80%",
          once: true,
        },
        opacity: 0,
        y: 40,
        duration: 0.5,
        ease: "power2.out",
        stagger: 0.1,
      });

      // CTA section
      gsap.from(".cta-content > *", {
        scrollTrigger: {
          trigger: ctaRef.current,
          start: "top 80%",
          once: true,
        },
        opacity: 0,
        y: 30,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.15,
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-[#E8DCC4] dark:bg-[#0f0f0f] flex flex-col">
      <Navbar />

      {/* ── Hero ── */}
      <section
        ref={heroRef}
        className="bg-[#8B1538] dark:bg-[#1a1a1a] text-[#E8DCC4] py-24 px-6 flex items-center justify-center relative overflow-hidden"
      >
        {/* Decorative pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-[#C4A574] rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#5A0E24] dark:bg-[#C4A574] rounded-full blur-3xl"></div>
        </div>

        <div className="hero-content text-center max-w-3xl relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6 text-[#E8DCC4]">
            Plan Your Perfect Event
            <br />
            <span className="text-[#C4A574]">with AI</span>
          </h1>
          <p className="text-[#D4C8B0] dark:text-[#a3a3a3] text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            Discover amazing events, book tickets instantly, and let AI create
            personalized event plans for you.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/register?role=attendee">
              <button className="bg-[#C4A574] hover:bg-[#B09560] text-[#0f0f0f] px-8 py-3 rounded-lg font-semibold text-base transition-all shadow-lg hover:shadow-xl">
                Explore Events
              </button>
            </Link>
            <Link to="/register?role=organizer">
              <button className="border-2 border-[#E8DCC4] dark:border-[#C4A574] hover:bg-[#E8DCC4] dark:hover:bg-[#C4A574] hover:text-[#8B1538] dark:hover:text-[#0f0f0f] text-[#E8DCC4] dark:text-[#C4A574] px-8 py-3 rounded-lg font-semibold text-base transition-all">
                Generate AI Plan
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section
        ref={featuresRef}
        className="py-16 px-6 bg-[#E8DCC4] dark:bg-[#0f0f0f]"
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#8B1538] dark:text-[#e5e5e5] mb-3">
              Why Choose EventPro?
            </h2>
            <p className="text-[#8B1538]/70 dark:text-[#a3a3a3]">
              Experience the future of event management
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="feature-card bg-white dark:bg-[#242424] rounded-2xl p-6 hover:shadow-xl transition-all hover:-translate-y-1 border border-[#C4A574]/20 dark:border-[#333333]"
              >
                <div className="w-12 h-12 bg-[#C4A574]/30 dark:bg-[#C4A574]/20 rounded-xl flex items-center justify-center text-2xl mb-4">
                  {f.icon}
                </div>
                <h3 className="text-base font-bold text-[#8B1538] dark:text-[#e5e5e5] mb-2">
                  {f.title}
                </h3>
                <p className="text-sm text-[#8B1538]/70 dark:text-[#a3a3a3] leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Roles ── */}
      <section className="py-16 px-6 bg-white dark:bg-[#1a1a1a]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#8B1538] dark:text-[#e5e5e5] mb-3">
              Built for Every Role
            </h2>
            <p className="text-[#8B1538]/70 dark:text-[#a3a3a3]">
              One platform, three powerful dashboards
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                role: "Admin",
                icon: "🛡️",
                color: "bg-[#5A0E24] dark:bg-[#242424]",
                desc: "Verify organizers, monitor all events and manage the platform.",
              },
              {
                role: "Organizer",
                icon: "🎪",
                color: "bg-[#C4A574]",
                desc: "Create events, manage guests, use AI planner and track tasks.",
              },
              {
                role: "Attendee",
                icon: "🎟️",
                color: "bg-[#8B1538] dark:bg-[#C4A574]",
                desc: "Browse events, book tickets and get your digital event pass.",
              },
            ].map((r) => (
              <div
                key={r.role}
                className="bg-[#E8DCC4] dark:bg-[#242424] rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1 border border-[#C4A574]/30 dark:border-[#333333]"
              >
                <div
                  className={`w-12 h-12 ${r.color} rounded-xl flex items-center justify-center text-2xl mb-4 shadow-md`}
                >
                  {r.icon}
                </div>
                <h3 className="text-base font-bold text-[#8B1538] dark:text-[#e5e5e5] mb-2">
                  {r.role}
                </h3>
                <p className="text-sm text-[#8B1538]/70 dark:text-[#a3a3a3]">
                  {r.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section
        ref={ctaRef}
        className="bg-[#8B1538] dark:bg-[#1a1a1a] py-20 px-6 relative overflow-hidden"
      >
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-72 h-72 bg-[#C4A574] rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-[#5A0E24] dark:bg-[#C4A574] rounded-full blur-3xl"></div>
        </div>

        <div className="cta-content text-center max-w-xl mx-auto relative z-10">
          <h2 className="text-3xl font-bold text-[#E8DCC4] mb-3">
            Ready to Get Started?
          </h2>
          <p className="text-[#D4C8B0] dark:text-[#a3a3a3] mb-8">
            Join thousands of users who trust EventPro
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/register?role=attendee">
              <button className="bg-[#C4A574] hover:bg-[#B09560] text-[#0f0f0f] px-8 py-3 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl">
                Join Event
              </button>
            </Link>
            <Link to="/register?role=organizer">
              <button className="border-2 border-[#E8DCC4] dark:border-[#C4A574] hover:bg-[#E8DCC4] dark:hover:bg-[#C4A574] hover:text-[#8B1538] dark:hover:text-[#0f0f0f] text-[#E8DCC4] dark:text-[#C4A574] px-8 py-3 rounded-lg font-semibold transition-all">
                Become Organizer
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-[#5A0E24] dark:bg-[#0a0a0a] py-6 text-center text-xs text-[#D4C8B0] dark:text-[#a3a3a3]">
        © 2026 EventPro. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;
