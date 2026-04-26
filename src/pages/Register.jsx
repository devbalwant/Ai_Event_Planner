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
    <div className="min-h-screen bg-[#f0f5e8] dark:bg-[#1a2e22] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-9 h-9 bg-[#8aab5a] rounded-lg flex items-center justify-center text-white text-sm font-bold">
              EP
            </div>
            <span className="text-xl font-bold text-[#437057] dark:text-white">
              EventPro
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Create your account
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Join as an Organizer or Attendee
          </p>
        </div>

        <div className="bg-white dark:bg-[#1f3329] border border-gray-200 dark:border-gray-700 rounded-2xl px-8 py-8 shadow-sm">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm px-4 py-3 rounded-lg mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
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
                        ? "border-[#437057] bg-[#437057]/5 dark:bg-[#437057]/20"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                    }`}
                  >
                    <div className="text-xl mb-1">{r.icon}</div>
                    <div className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                      {r.label}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {r.desc}
                    </div>
                  </button>
                ))}
              </div>
              {formData.role === "organizer" && (
                <p className="text-xs text-[#437057] dark:text-[#8aab5a] mt-2 bg-[#c5d9a0]/30 dark:bg-[#437057]/20 px-3 py-2 rounded-lg border border-[#8aab5a]/40 dark:border-[#8aab5a]/30">
                  ⚠️ Organizer accounts require admin verification before you
                  can create events.
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="Your full name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8aab5a]/20 focus:border-[#437057] dark:focus:border-[#8aab5a] bg-white dark:bg-[#1f3329] dark:text-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8aab5a]/20 focus:border-[#437057] dark:focus:border-[#8aab5a] bg-white dark:bg-[#1f3329] dark:text-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5">
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
                  className="w-full px-4 py-2.5 pr-16 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8aab5a]/20 focus:border-[#437057] dark:focus:border-[#8aab5a] bg-white dark:bg-[#1f3329] dark:text-gray-100"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#437057] hover:bg-[#365a46] text-white py-2.5 rounded-lg font-semibold text-sm transition-colors flex items-center justify-center gap-2"
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

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-[#437057] dark:text-[#8aab5a] font-semibold hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
        <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-5">
          © 2025 EventPro
        </p>
      </div>
    </div>
  );
};

export default Register;
