/* eslint-disable no-unused-vars */
import ToggleButtonSelector from "../../components/landingPage/ToggleButton";
import { useEffect, useState } from "react";
import {
  Brain,
  Video,
  BookOpen,
  TrendingUp,
  MessageCircle,
  FileText,
  Globe,
  BarChart,
  Menu,
  X,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Phone,
  Mail,
  MapPin,
  Check,
} from "lucide-react";
import { BsWhatsapp, BsTelephone } from "react-icons/bs";
import { useLocation, useNavigate } from "react-router-dom";

const Call = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className=" relative w-full py-4 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full font-bold text-lg hover:shadow-2xl hover:-translate-y-1 transition-all">
      <button
        onClick={() => setOpen((v) => !v)}
        className="px-4 flex items-center gap-1 m-auto w-full justify-center"
      >
        Call Us
        <svg
          className={`w-4 h-4 transition-transform duration-300 ${
            open ? "rotate-180" : "rotate-0"
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {open && (
        <ul className="absolute left-0 mt-2 w-full bg-white rounded-lg shadow-lg z-50 border ">
          <li>
            <a
              href="https://wa.me/201021355543"
              target="_blank"
              rel="noopener noreferrer"
              className="block px-4 py-3 text-base hover:bg-gray-100 text-gray-700 font-medium"
            >
              <BsWhatsapp className="inline mr-2 text-green-600 text-lg" />
              WhatsApp: 01021355543
            </a>
          </li>
          <li>
            <a
              href="tel:+201031165004"
              className="block px-4 py-3 text-base hover:bg-gray-100 text-gray-700 font-medium"
            >
              <BsTelephone className="inline mr-2 text-blue-600 text-lg" />
              Call: 01031165004
            </a>
          </li>
        </ul>
      )}
    </div>
  );
};
// Main Component
export default function IgLandingPage() {
  const [open, setOpen] = useState(false); // لقائمة "تواصل معنا"
  const location = useLocation();

  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  useEffect(() => {
    setOpen(false);
  }, [location]);

  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI-Powered Learning",
      description:
        "Intelligent AI assistant that helps you understand concepts better through interactive conversations and personalized explanations",
    },
    {
      icon: <Video className="w-8 h-8" />,
      title: "Live Sessions with Teachers",
      description:
        "Interactive online classes with certified teachers providing real-time instruction and personalized guidance",
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Digital Learning Resources",
      description:
        "Comprehensive educational materials and recorded sessions available anytime for review and study",
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Continuous Progress Tracking",
      description:
        "Regular detailed reports monitoring your performance, identifying areas for improvement, and celebrating achievements",
    },
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: "AI Chat with Content",
      description:
        "Chat directly with your subject content using AI - ask questions, get explanations, and deepen understanding instantly",
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: "Smart Summarization",
      description:
        "AI-powered content summarization to help you quickly grasp key concepts and save study time",
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Instant Translation",
      description:
        "Translate your learning materials into multiple languages to enhance comprehension and accessibility",
    },
    {
      icon: <BarChart className="w-8 h-8" />,
      title: "Continuous Reports",
      description:
        "Regular detailed progress reports to track improvement, identify strengths, and address learning gaps",
    },
  ];

  return (
    <div
      style={{ direction: "ltr" }}
      className="min-h-screen bg-[#0a0e27] text-white overflow-x-hidden "
    >
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0a0e27]"></div>
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-[20%] left-[20%] w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-[50%] left-[60%] w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-[80%] left-[30%] w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>
      </div>

      {/* Navbar */}
      <nav className="relative z-50 px-4 md:px-8 py-5 bg-[#0a0e27]/80 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Brain className="w-10 h-10 text-purple-400" />
            <span className="text-2xl font-black bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Edu-Smart AI
            </span>
          </div>

          <ul className="hidden lg:flex gap-10 items-center">
            <li>
              <a
                href="#curricula"
                className="font-semibold hover:text-cyan-400 transition-colors"
              >
                Curricula
              </a>
            </li>
            <li>
              <a
                href="#features"
                className="font-semibold hover:text-cyan-400 transition-colors"
              >
                Features
              </a>
            </li>
            <li>
              <a
                href="#pricing"
                className="font-semibold hover:text-cyan-400 transition-colors"
              >
                Pricing
              </a>
            </li>
            <li>
              <a
                href="#about"
                className="font-semibold hover:text-cyan-400 transition-colors"
              >
                About
              </a>
            </li>
          </ul>

          <button className="hidden lg:block px-8 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full font-bold hover:shadow-xl hover:-translate-y-1 transition-all">
            Get Started
          </button>

          <button
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4">
            <ul className="flex flex-col gap-4">
              <li>
                <a
                  href="#curricula"
                  className="block font-semibold hover:text-cyan-400"
                >
                  Curricula
                </a>
              </li>
              <li>
                <a
                  href="#features"
                  className="block font-semibold hover:text-cyan-400"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#pricing"
                  className="block font-semibold hover:text-cyan-400"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  className="block font-semibold hover:text-cyan-400"
                >
                  About
                </a>
              </li>
            </ul>
            <button className="w-full mt-4 px-8 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full font-bold">
              Get Started
            </button>
          </div>
        )}
      </nav>

      <div className="absolute top-[95px] left-1/2 -translate-x-1/2 z-50">
        <ToggleButtonSelector lvl="ig" />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 px-4 md:px-4 py-20 md:py-32">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          <div className="space-y-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight bg-gradient-to-r from-white to-purple-400 bg-clip-text text-transparent">
              Smart Learning for Future Leaders
            </h1>
            <p className="text-lg md:text-xl text-gray-400 leading-relaxed">
              Advanced AI-powered educational platform for IGCSE and American
              curricula, designed specifically for middle school students
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-purple-500/10 to-cyan-500/10 border border-white/10 rounded-2xl p-6 backdrop-blur-sm hover:border-purple-500/50 hover:shadow-xl hover:-translate-y-2 transition-all cursor-pointer">
                <h3 className="text-xl md:text-2xl font-bold text-cyan-400 mb-2">
                  IGCSE Curriculum
                </h3>
                <p className="text-sm text-gray-400">
                  Cambridge International certified curriculum with specialized
                  teachers and modern interactive tools
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-500/10 to-cyan-500/10 border border-white/10 rounded-2xl p-6 backdrop-blur-sm hover:border-purple-500/50 hover:shadow-xl hover:-translate-y-2 transition-all cursor-pointer">
                <h3 className="text-xl md:text-2xl font-bold text-cyan-400 mb-2">
                  American Curriculum
                </h3>
                <p className="text-sm text-gray-400">
                  US-accredited curriculum meeting American educational
                  standards
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate("/kg1")}
                className="px-10 py-4 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full font-bold text-lg hover:shadow-2xl hover:-translate-y-1 transition-all"
              >
                Start Free Trial
              </button>
              <button className="px-10 py-4 border-2 border-purple-500/50 rounded-full font-bold text-lg hover:bg-purple-500/10 hover:border-purple-500 transition-all">
                Talk to Advisor
              </button>
            </div>
          </div>

          <div className="relative h-[400px] md:h-[600px]">
            <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-cyan-500/30 z-10"></div>
              <img
                src="/assets/img/gallery/ig.jfif"
                alt="Students Learning"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-8 right-8 bg-[#0a0e27]/90 backdrop-blur-lg p-6 rounded-2xl border border-white/20 z-20 animate-bounce">
                <h4 className="text-lg font-bold text-cyan-400 mb-1">
                  10,000+ Students
                </h4>
                <p className="text-sm text-gray-400">
                  Succeeding with international curricula
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 px-4 md:px-8 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4 bg-gradient-to-r from-white to-purple-400 bg-clip-text text-transparent">
              Why Choose Edu-Smart AI?
            </h2>
            <p className="text-lg text-gray-400">
              Advanced technology and innovative teaching methods ensuring
              student excellence
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-purple-500/5 to-cyan-500/5 border border-white/10 rounded-2xl p-8 hover:border-purple-500/50 hover:shadow-2xl hover:-translate-y-3 transition-all group"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative z-10 px-4 md:px-8 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4 bg-gradient-to-r from-white to-purple-400 bg-clip-text text-transparent">
              Plans That Fit Your Needs
            </h2>
            <p className="text-lg text-gray-400">
              Choose the right package for your child's academic level
            </p>
          </div>

          <div className="max-w-md mx-auto">
            <div className="bg-gradient-to-br from-purple-500/5 to-cyan-500/5 border border-white/10 rounded-3xl p-10 hover:border-purple-500/50 hover:shadow-2xl transition-all">
              <h3 className="text-3xl font-bold text-cyan-400 mb-4">
                Basic Plan
              </h3>
              <div className="text-5xl font-black text-white my-8">
                Contact us <span className="text-xl text-gray-400">/year</span>
              </div>
              <ul className="space-y-4 mb-8">
                {[
                  "Live sessions with teachers",
                  "AI chat with content",
                  "Content summarization",
                  "Basic translation",
                  "Monthly progress reports",
                ].map((item, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-3 text-gray-400"
                  >
                    <Check className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              {/* <button className="w-full py-4 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full font-bold text-lg hover:shadow-2xl hover:-translate-y-1 transition-all">
                Choose Plan
              </button> */}
              <Call />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-4 md:px-8 py-16 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            <div>
              <h3 className="text-xl font-bold text-cyan-400 mb-4">
                Edu-Smart AI
              </h3>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Empowering middle school students worldwide with cutting-edge
                AI-powered education for IGCSE and American curricula.
              </p>
              <div className="flex gap-3">
                {[Facebook, Twitter, Instagram, Linkedin].map((Icon, index) => (
                  <a
                    key={index}
                    href="#"
                    className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center hover:bg-gradient-to-r hover:from-purple-500 hover:to-cyan-500 hover:-translate-y-1 transition-all"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-cyan-400 mb-4">
                Quick Links
              </h3>
              <ul className="space-y-2">
                {[
                  "About Us",
                  "Our Teachers",
                  "Testimonials",
                  "Blog",
                  "Contact",
                ].map((link, index) => (
                  <li key={index}>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-cyan-400 transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-cyan-400 mb-4">
                Curricula
              </h3>
              <ul className="space-y-2">
                {[
                  "IGCSE Program",
                  "American Curriculum",
                  "SAT Preparation",
                ].map((link, index) => (
                  <li key={index}>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-cyan-400 transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-cyan-400 mb-4">
                Contact Us
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-gray-400">
                  <Phone className="w-5 h-5" />
                  <span>+1 (555) 123-4567</span>
                </li>
                <li className="flex items-center gap-2 text-gray-400">
                  <Mail className="w-5 h-5" />
                  <span>hello@edu-smart.ai</span>
                </li>
                <li className="flex items-center gap-2 text-gray-400">
                  <MapPin className="w-5 h-5" />
                  <span>Global Education Hub</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 text-center text-gray-400">
            <p>
              &copy; 2024 Edu-Smart AI. All rights reserved. Designed for the
              future of education.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
