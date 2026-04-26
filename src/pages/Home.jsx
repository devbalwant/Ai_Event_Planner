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
    <div className="min-h-screen bg-white dark:bg-[#1f3329] flex flex-col">
      <Navbar />

      {/* ── Hero ── */}
      <section
        ref={heroRef}
        className="bg-[#1a2e22] text-white py-24 px-6 flex items-center justify-center"
      >
        <div className="hero-content text-center max-w-3xl">
          <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
            Plan Your Perfect Event
            <br />
            <span className="text-[#8aab5a]">with AI</span>
          </h1>
          <p className="text-gray-300 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            Discover amazing events, book tickets instantly, and let AI create
            personalized event plans for you.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/register?role=attendee">
              <button className="bg-[#8aab5a] hover:bg-[#7a9a4e] text-white px-8 py-3 rounded-lg font-semibold text-base transition-colors">
                Explore Events
              </button>
            </Link>
            <Link to="/register?role=organizer">
              <button className="border-2 border-white hover:bg-white hover:text-[#437057] text-white px-8 py-3 rounded-lg font-semibold text-base transition-all">
                Generate AI Plan
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section
        ref={featuresRef}
        className="py-16 px-6 bg-white dark:bg-[#1f3329]"
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">
              Why Choose EventPro?
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Experience the future of event management
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="feature-card bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-[#c5d9a0]/30 dark:bg-[#437057]/20 rounded-xl flex items-center justify-center text-2xl mb-4">
                  {f.icon}
                </div>
                <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {f.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Roles ── */}
      <section className="py-16 px-6 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">
              Built for Every Role
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              One platform, three powerful dashboards
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                role: "Admin",
                icon: "🛡️",
                color: "bg-red-500",
                desc: "Verify organizers, monitor all events and manage the platform.",
              },
              {
                role: "Organizer",
                icon: "🎪",
                color: "bg-[#437057]",
                desc: "Create events, manage guests, use AI planner and track tasks.",
              },
              {
                role: "Attendee",
                icon: "🎟️",
                color: "bg-blue-500",
                desc: "Browse events, book tickets and get your digital event pass.",
              },
            ].map((r) => (
              <div
                key={r.role}
                className="bg-white dark:bg-[#1f3329] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div
                  className={`w-12 h-12 ${r.color} rounded-xl flex items-center justify-center text-2xl mb-4`}
                >
                  {r.icon}
                </div>
                <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {r.role}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {r.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section ref={ctaRef} className="bg-[#1a2e22] py-20 px-6">
        <div className="cta-content text-center max-w-xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-3">
            Ready to Get Started?
          </h2>
          <p className="text-gray-400 mb-8">
            Join thousands of users who trust EventPro
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/register?role=attendee">
              <button className="bg-[#8aab5a] hover:bg-[#7a9a4e] text-white px-8 py-3 rounded-lg font-semibold transition-colors">
                Join Event
              </button>
            </Link>
            <Link to="/register?role=organizer">
              <button className="border-2 border-white hover:bg-white hover:text-[#437057] text-white px-8 py-3 rounded-lg font-semibold transition-all">
                Become Organizer
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-black py-6 text-center text-xs text-gray-500">
        © 2026 EventPro. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;
