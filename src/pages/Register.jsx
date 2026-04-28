import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerAPI } from "../services/api";
import toast from "react-hot-toast";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "attendee",
  });
  const [showPassword, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await registerAPI(formData);
      toast.success("Account created! Please sign in.");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#E8DCC4] dark:bg-[#0f0f0f] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-9 h-9 bg-[#C4A574] rounded-lg flex items-center justify-center text-[#0f0f0f] text-sm font-bold shadow-md">
              EP
            </div>
            <span className="text-xl font-bold text-[#8B1538] dark:text-[#e5e5e5]">
              EventPro
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-[#8B1538] dark:text-[#e5e5e5]">
            Create your account
          </h1>
          <p className="text-[#8B1538]/70 dark:text-[#a3a3a3] text-sm mt-1">
            Join as an Organizer or Attendee
          </p>
        </div>

        <div className="bg-white dark:bg-[#242424] border border-[#C4A574]/30 dark:border-[#333333] rounded-2xl px-8 py-8 shadow-xl">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm px-4 py-3 rounded-lg mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role selector */}
            <div>
              <label className="block text-sm font-medium text-[#8B1538] dark:text-[#e5e5e5] mb-2">
                I want to join as
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    value: "attendee",
                    label: "Attendee",
                    icon: "🎟️",
                    desc: "Browse & book events",
                  },
                  {
                    value: "organizer",
                    label: "Organizer",
                    icon: "🎪",
                    desc: "Create & manage events",
                  },
                ].map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() =>
                      setFormData((p) => ({ ...p, role: r.value }))
                    }
                    className={`p-3 rounded-xl border-2 text-left transition-all ${
                      formData.role === r.value
                        ? "border-[#C4A574] bg-[#C4A574]/10 dark:bg-[#C4A574]/20"
                        : "border-[#C4A574]/30 dark:border-[#333333] hover:border-[#C4A574]/50 dark:hover:border-[#C4A574]/40"
                    }`}
                  >
                    <div className="text-xl mb-1">{r.icon}</div>
                    <div className="text-sm font-semibold text-[#8B1538] dark:text-[#e5e5e5]">
                      {r.label}
                    </div>
                    <div className="text-xs text-[#8B1538]/70 dark:text-[#a3a3a3]">
                      {r.desc}
                    </div>
                  </button>
                ))}
              </div>
              {formData.role === "organizer" && (
                <p className="text-xs text-[#8B1538] dark:text-[#C4A574] mt-2 bg-[#C4A574]/20 dark:bg-[#C4A574]/10 px-3 py-2 rounded-lg border border-[#C4A574]/40 dark:border-[#C4A574]/30">
                  ⚠️ Organizer accounts require admin verification before you
                  can create events.
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#8B1538] dark:text-[#e5e5e5] mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="Your full name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 border border-[#C4A574]/30 dark:border-[#333333] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C4A574]/40 focus:border-[#C4A574] bg-white dark:bg-[#1a1a1a] dark:text-[#e5e5e5] placeholder:text-[#8B1538]/40 dark:placeholder:text-[#a3a3a3]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#8B1538] dark:text-[#e5e5e5] mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 border border-[#C4A574]/30 dark:border-[#333333] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C4A574]/40 focus:border-[#C4A574] bg-white dark:bg-[#1a1a1a] dark:text-[#e5e5e5] placeholder:text-[#8B1538]/40 dark:placeholder:text-[#a3a3a3]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#8B1538] dark:text-[#e5e5e5] mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 pr-16 border border-[#C4A574]/30 dark:border-[#333333] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C4A574]/40 focus:border-[#C4A574] bg-white dark:bg-[#1a1a1a] dark:text-[#e5e5e5] placeholder:text-[#8B1538]/40 dark:placeholder:text-[#a3a3a3]"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#8B1538]/60 dark:text-[#a3a3a3] hover:text-[#8B1538] dark:hover:text-[#e5e5e5]"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#C4A574] hover:bg-[#B09560] text-[#0f0f0f] py-2.5 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    />
                  </svg>
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <p className="text-center text-sm text-[#8B1538]/70 dark:text-[#a3a3a3] mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-[#8B1538] dark:text-[#C4A574] font-semibold hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
        <p className="text-center text-xs text-[#8B1538]/50 dark:text-[#a3a3a3] mt-5">
          © 2026 EventPro
        </p>
      </div>
    </div>
  );
};

export default Register;
