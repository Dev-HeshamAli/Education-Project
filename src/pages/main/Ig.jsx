// /* eslint-disable no-unused-vars */
// import ToggleButtonSelector from "../../components/landingPage/ToggleButton";
// import { useEffect, useState } from "react";
// import {
//   Brain,
//   Video,
//   BookOpen,
//   TrendingUp,
//   MessageCircle,
//   FileText,
//   Globe,
//   BarChart,
//   Menu,
//   X,
//   Facebook,
//   Twitter,
//   Instagram,
//   Linkedin,
//   Phone,
//   Mail,
//   MapPin,
//   Check,
// } from "lucide-react";
// import { BsWhatsapp, BsTelephone } from "react-icons/bs";
// import { useLocation, useNavigate } from "react-router-dom";

// const Call = () => {
//   const [open, setOpen] = useState(false);

//   return (
//     <div className=" relative w-full py-4 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full font-bold text-lg hover:shadow-2xl hover:-translate-y-1 transition-all">
//       <button
//         onClick={() => setOpen((v) => !v)}
//         className="px-4 flex items-center gap-1 m-auto w-full justify-center"
//       >
//         Call Us
//         <svg
//           className={`w-4 h-4 transition-transform duration-300 ${
//             open ? "rotate-180" : "rotate-0"
//           }`}
//           fill="none"
//           stroke="currentColor"
//           viewBox="0 0 24 24"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={2}
//             d="M19 9l-7 7-7-7"
//           />
//         </svg>
//       </button>

//       {open && (
//         <ul className="absolute left-0 mt-2 w-full bg-white rounded-lg shadow-lg z-50 border ">
//           <li>
//             <a
//               href="https://wa.me/201021355543"
//               target="_blank"
//               rel="noopener noreferrer"
//               className="block px-4 py-3 text-base hover:bg-gray-100 text-gray-700 font-medium"
//             >
//               <BsWhatsapp className="inline mr-2 text-green-600 text-lg" />
//               WhatsApp: 01021355543
//             </a>
//           </li>
//           <li>
//             <a
//               href="tel:+201031165004"
//               className="block px-4 py-3 text-base hover:bg-gray-100 text-gray-700 font-medium"
//             >
//               <BsTelephone className="inline mr-2 text-blue-600 text-lg" />
//               Call: 01031165004
//             </a>
//           </li>
//         </ul>
//       )}
//     </div>
//   );
// };
// // Main Component
// export default function IgLandingPage() {
//   const [open, setOpen] = useState(false); // لقائمة "تواصل معنا"
//   const location = useLocation();

//   const navigate = useNavigate();
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   useEffect(() => {
//     setOpen(false);
//   }, [location]);

//   const features = [
//     {
//       icon: <Brain className="w-8 h-8" />,
//       title: "AI-Powered Learning",
//       description:
//         "Intelligent AI assistant that helps you understand concepts better through interactive conversations and personalized explanations",
//     },
//     {
//       icon: <Video className="w-8 h-8" />,
//       title: "Live Sessions with Teachers",
//       description:
//         "Interactive online classes with certified teachers providing real-time instruction and personalized guidance",
//     },
//     {
//       icon: <BookOpen className="w-8 h-8" />,
//       title: "Digital Learning Resources",
//       description:
//         "Comprehensive educational materials and recorded sessions available anytime for review and study",
//     },
//     {
//       icon: <TrendingUp className="w-8 h-8" />,
//       title: "Continuous Progress Tracking",
//       description:
//         "Regular detailed reports monitoring your performance, identifying areas for improvement, and celebrating achievements",
//     },
//     {
//       icon: <MessageCircle className="w-8 h-8" />,
//       title: "AI Chat with Content",
//       description:
//         "Chat directly with your subject content using AI - ask questions, get explanations, and deepen understanding instantly",
//     },
//     {
//       icon: <FileText className="w-8 h-8" />,
//       title: "Smart Summarization",
//       description:
//         "AI-powered content summarization to help you quickly grasp key concepts and save study time",
//     },
//     {
//       icon: <Globe className="w-8 h-8" />,
//       title: "Instant Translation",
//       description:
//         "Translate your learning materials into multiple languages to enhance comprehension and accessibility",
//     },
//     {
//       icon: <BarChart className="w-8 h-8" />,
//       title: "Continuous Reports",
//       description:
//         "Regular detailed progress reports to track improvement, identify strengths, and address learning gaps",
//     },
//   ];

//   return (
//     <div
//       style={{ direction: "ltr" }}
//       className="min-h-screen bg-[#0a0e27] text-white overflow-x-hidden "
//     >
//       {/* Animated Background */}
//       <div className="fixed inset-0 z-0">
//         <div className="absolute inset-0 bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0a0e27]"></div>
//         <div className="absolute inset-0 opacity-30">
//           <div className="absolute top-[20%] left-[20%] w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
//           <div className="absolute top-[50%] left-[60%] w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
//           <div className="absolute top-[80%] left-[30%] w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
//         </div>
//       </div>

//       {/* Navbar */}
//       <nav className="relative z-50 px-4 md:px-8 py-5 bg-[#0a0e27]/80 backdrop-blur-lg border-b border-white/10">
//         <div className="max-w-7xl mx-auto flex justify-between items-center">
//           <div className="flex items-center gap-3">
//             <Brain className="w-10 h-10 text-purple-400" />
//             <span className="text-2xl font-black bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
//               Edu-Smart AI
//             </span>
//           </div>

//           <ul className="hidden lg:flex gap-10 items-center">
//             <li>
//               <a
//                 href="#curricula"
//                 className="font-semibold hover:text-cyan-400 transition-colors"
//               >
//                 Curricula
//               </a>
//             </li>
//             <li>
//               <a
//                 href="#features"
//                 className="font-semibold hover:text-cyan-400 transition-colors"
//               >
//                 Features
//               </a>
//             </li>
//             <li>
//               <a
//                 href="#pricing"
//                 className="font-semibold hover:text-cyan-400 transition-colors"
//               >
//                 Pricing
//               </a>
//             </li>
//             <li>
//               <a
//                 href="#about"
//                 className="font-semibold hover:text-cyan-400 transition-colors"
//               >
//                 About
//               </a>
//             </li>
//           </ul>

//           <button className="hidden lg:block px-8 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full font-bold hover:shadow-xl hover:-translate-y-1 transition-all">
//             Get Started
//           </button>

//           <button
//             className="lg:hidden"
//             onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//           >
//             {mobileMenuOpen ? (
//               <X className="w-6 h-6" />
//             ) : (
//               <Menu className="w-6 h-6" />
//             )}
//           </button>
//         </div>

//         {/* Mobile Menu */}
//         {mobileMenuOpen && (
//           <div className="lg:hidden mt-4 pb-4">
//             <ul className="flex flex-col gap-4">
//               <li>
//                 <a
//                   href="#curricula"
//                   className="block font-semibold hover:text-cyan-400"
//                 >
//                   Curricula
//                 </a>
//               </li>
//               <li>
//                 <a
//                   href="#features"
//                   className="block font-semibold hover:text-cyan-400"
//                 >
//                   Features
//                 </a>
//               </li>
//               <li>
//                 <a
//                   href="#pricing"
//                   className="block font-semibold hover:text-cyan-400"
//                 >
//                   Pricing
//                 </a>
//               </li>
//               <li>
//                 <a
//                   href="#about"
//                   className="block font-semibold hover:text-cyan-400"
//                 >
//                   About
//                 </a>
//               </li>
//             </ul>
//             <button className="w-full mt-4 px-8 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full font-bold">
//               Get Started
//             </button>
//           </div>
//         )}
//       </nav>

//       <div className="absolute top-[95px] left-1/2 -translate-x-1/2 z-50">
//         <ToggleButtonSelector lvl="ig" />
//       </div>

//       {/* Hero Section */}
//       <section className="relative z-10 px-4 md:px-4 py-20 md:py-32">
//         <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 md:gap-16 items-center">
//           <div className="space-y-8">
//             <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight bg-gradient-to-r from-white to-purple-400 bg-clip-text text-transparent">
//               Smart Learning for Future Leaders
//             </h1>
//             <p className="text-lg md:text-xl text-gray-400 leading-relaxed">
//               Advanced AI-powered educational platform for IGCSE and American
//               curricula, designed specifically for middle school students
//             </p>

//             <div className="grid sm:grid-cols-2 gap-4">
//               <div className="bg-gradient-to-br from-purple-500/10 to-cyan-500/10 border border-white/10 rounded-2xl p-6 backdrop-blur-sm hover:border-purple-500/50 hover:shadow-xl hover:-translate-y-2 transition-all cursor-pointer">
//                 <h3 className="text-xl md:text-2xl font-bold text-cyan-400 mb-2">
//                   IGCSE Curriculum
//                 </h3>
//                 <p className="text-sm text-gray-400">
//                   Cambridge International certified curriculum with specialized
//                   teachers and modern interactive tools
//                 </p>
//               </div>
//               <div className="bg-gradient-to-br from-purple-500/10 to-cyan-500/10 border border-white/10 rounded-2xl p-6 backdrop-blur-sm hover:border-purple-500/50 hover:shadow-xl hover:-translate-y-2 transition-all cursor-pointer">
//                 <h3 className="text-xl md:text-2xl font-bold text-cyan-400 mb-2">
//                   American Curriculum
//                 </h3>
//                 <p className="text-sm text-gray-400">
//                   US-accredited curriculum meeting American educational
//                   standards
//                 </p>
//               </div>
//             </div>

//             <div className="flex flex-col sm:flex-row gap-4">
//               <button
//                 onClick={() => navigate("/kg1")}
//                 className="px-10 py-4 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full font-bold text-lg hover:shadow-2xl hover:-translate-y-1 transition-all"
//               >
//                 Start Free Trial
//               </button>
//               <button className="px-10 py-4 border-2 border-purple-500/50 rounded-full font-bold text-lg hover:bg-purple-500/10 hover:border-purple-500 transition-all">
//                 Talk to Advisor
//               </button>
//             </div>
//           </div>

//           <div className="relative h-[400px] md:h-[600px]">
//             <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl">
//               <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-cyan-500/30 z-10"></div>
//               <img
//                 src="/assets/img/gallery/ig.jfif"
//                 alt="Students Learning"
//                 className="w-full h-full object-cover"
//               />
//               <div className="absolute bottom-8 right-8 bg-[#0a0e27]/90 backdrop-blur-lg p-6 rounded-2xl border border-white/20 z-20 animate-bounce">
//                 <h4 className="text-lg font-bold text-cyan-400 mb-1">
//                   10,000+ Students
//                 </h4>
//                 <p className="text-sm text-gray-400">
//                   Succeeding with international curricula
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Features Section */}
//       <section id="features" className="relative z-10 px-4 md:px-8 py-20">
//         <div className="max-w-7xl mx-auto">
//           <div className="text-center mb-16">
//             <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4 bg-gradient-to-r from-white to-purple-400 bg-clip-text text-transparent">
//               Why Choose Edu-Smart AI?
//             </h2>
//             <p className="text-lg text-gray-400">
//               Advanced technology and innovative teaching methods ensuring
//               student excellence
//             </p>
//           </div>

//           <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
//             {features.map((feature, index) => (
//               <div
//                 key={index}
//                 className="bg-gradient-to-br from-purple-500/5 to-cyan-500/5 border border-white/10 rounded-2xl p-8 hover:border-purple-500/50 hover:shadow-2xl hover:-translate-y-3 transition-all group"
//               >
//                 <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
//                   {feature.icon}
//                 </div>
//                 <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
//                 <p className="text-gray-400 leading-relaxed">
//                   {feature.description}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Pricing Section */}
//       <section id="pricing" className="relative z-10 px-4 md:px-8 py-20">
//         <div className="max-w-7xl mx-auto">
//           <div className="text-center mb-16">
//             <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4 bg-gradient-to-r from-white to-purple-400 bg-clip-text text-transparent">
//               Plans That Fit Your Needs
//             </h2>
//             <p className="text-lg text-gray-400">
//               Choose the right package for your child's academic level
//             </p>
//           </div>

//           <div className="max-w-md mx-auto">
//             <div className="bg-gradient-to-br from-purple-500/5 to-cyan-500/5 border border-white/10 rounded-3xl p-10 hover:border-purple-500/50 hover:shadow-2xl transition-all">
//               <h3 className="text-3xl font-bold text-cyan-400 mb-4">
//                 Basic Plan
//               </h3>
//               <div className="text-5xl font-black text-white my-8">
//                 Contact us <span className="text-xl text-gray-400">/year</span>
//               </div>
//               <ul className="space-y-4 mb-8">
//                 {[
//                   "Live sessions with teachers",
//                   "AI chat with content",
//                   "Content summarization",
//                   "Basic translation",
//                   "Monthly progress reports",
//                 ].map((item, index) => (
//                   <li
//                     key={index}
//                     className="flex items-center gap-3 text-gray-400"
//                   >
//                     <Check className="w-5 h-5 text-cyan-400 flex-shrink-0" />
//                     <span>{item}</span>
//                   </li>
//                 ))}
//               </ul>
//               {/* <button className="w-full py-4 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full font-bold text-lg hover:shadow-2xl hover:-translate-y-1 transition-all">
//                 Choose Plan
//               </button> */}
//               <Call />
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="relative z-10 px-4 md:px-8 py-16 border-t border-white/10">
//         <div className="max-w-7xl mx-auto">
//           <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
//             <div>
//               <h3 className="text-xl font-bold text-cyan-400 mb-4">
//                 Edu-Smart AI
//               </h3>
//               <p className="text-gray-400 mb-6 leading-relaxed">
//                 Empowering middle school students worldwide with cutting-edge
//                 AI-powered education for IGCSE and American curricula.
//               </p>
//               <div className="flex gap-3">
//                 {[Facebook, Twitter, Instagram, Linkedin].map((Icon, index) => (
//                   <a
//                     key={index}
//                     href="#"
//                     className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center hover:bg-gradient-to-r hover:from-purple-500 hover:to-cyan-500 hover:-translate-y-1 transition-all"
//                   >
//                     <Icon className="w-5 h-5" />
//                   </a>
//                 ))}
//               </div>
//             </div>

//             <div>
//               <h3 className="text-xl font-bold text-cyan-400 mb-4">
//                 Quick Links
//               </h3>
//               <ul className="space-y-2">
//                 {[
//                   "About Us",
//                   "Our Teachers",
//                   "Testimonials",
//                   "Blog",
//                   "Contact",
//                 ].map((link, index) => (
//                   <li key={index}>
//                     <a
//                       href="#"
//                       className="text-gray-400 hover:text-cyan-400 transition-colors"
//                     >
//                       {link}
//                     </a>
//                   </li>
//                 ))}
//               </ul>
//             </div>

//             <div>
//               <h3 className="text-xl font-bold text-cyan-400 mb-4">
//                 Curricula
//               </h3>
//               <ul className="space-y-2">
//                 {[
//                   "IGCSE Program",
//                   "American Curriculum",
//                   "SAT Preparation",
//                 ].map((link, index) => (
//                   <li key={index}>
//                     <a
//                       href="#"
//                       className="text-gray-400 hover:text-cyan-400 transition-colors"
//                     >
//                       {link}
//                     </a>
//                   </li>
//                 ))}
//               </ul>
//             </div>

//             <div>
//               <h3 className="text-xl font-bold text-cyan-400 mb-4">
//                 Contact Us
//               </h3>
//               <ul className="space-y-3">
//                 <li className="flex items-center gap-2 text-gray-400">
//                   <Phone className="w-5 h-5" />
//                   <span>+1 (555) 123-4567</span>
//                 </li>
//                 <li className="flex items-center gap-2 text-gray-400">
//                   <Mail className="w-5 h-5" />
//                   <span>hello@edu-smart.ai</span>
//                 </li>
//                 <li className="flex items-center gap-2 text-gray-400">
//                   <MapPin className="w-5 h-5" />
//                   <span>Global Education Hub</span>
//                 </li>
//               </ul>
//             </div>
//           </div>

//           <div className="pt-8 border-t border-white/10 text-center text-gray-400">
//             <p>
//               &copy; 2024 Edu-Smart AI. All rights reserved. Designed for the
//               future of education.
//             </p>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }

// ====================================================

import Footer from "../../components/main/Footer";
import Navbar from "../../components/main/Navbar";
import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import MainBannerIg from "./MainBannerIg";
import PricingSectionIg from "./PricingSectionIg";

export default function Ig() {
  const pricingRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    if (location.hash === "#pricing" && pricingRef.current) {
      pricingRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [location, pricingRef]);

  return (
    <>
      <Navbar />
      {/* Hero Section with enhanced styling */}
      <div className="relative">
        <MainBannerIg />
        {/* Subtle gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/10 pointer-events-none"></div>
      </div>

      {/* Who Are We Section with professional touches */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-orange-600"></div>

        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-16 items-center relative">
          {/* Logo section with enhanced styling */}
          <div className="flex justify-center relative">
            <div className="relative w-80 h-80 rounded-full border-8 border-gradient-to-r from-orange-500 to-orange-600 shadow-2xl bg-white flex items-center justify-center transform hover:scale-105 transition-transform duration-500">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500/10 to-orange-600/10 animate-pulse"></div>
              <div className="w-64 h-64 rounded-full overflow-hidden relative z-10 shadow-inner">
                <img
                  src="/assets/img/Logoo.png"
                  alt="Edu-Smart Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              {/* Floating dots */}
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-orange-500 rounded-full animate-bounce"></div>
              <div
                className="absolute -bottom-2 -left-2 w-3 h-3 bg-orange-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.5s" }}
              ></div>
            </div>
          </div>

          {/* Content section with enhanced typography */}
          <div className="text-left space-y-6">
            <div className="inline-flex items-center bg-orange-100 px-4 py-2 rounded-full">
              <span className="text-orange-600 font-bold text-lg ">
                Who We Are
              </span>
            </div>

            <h3 className="text-4xl font-bold text-[#051441] leading-tight text-left">
              We Are <span className="text-orange-600">edu-smart.ai</span>
            </h3>

            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed text-lg font-medium text-left">
                A digital educational academy founded by a group of experts and
                consultants specialized in pre-university and post-university
                education. Our goal is to connect Egyptian students abroad with
                their roots through a modern and flexible learning experience.
              </p>

              <p className="text-gray-700 leading-relaxed text-lg text-left">
                We leverage artificial intelligence and interactive technologies
                to deliver accredited Egyptian curricula in a way that builds
                character and prepares future leaders.
              </p>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-orange-100">
              <ul className="text-gray-700 list-inside space-y-3 text-left">
                {[
                  "A distinguished team of educational experts and consultants inside and outside Egypt.",
                  "A distance-learning academy with an authentic Egyptian identity.",
                  "Using artificial intelligence to personalize content and enhance learning experiences.",
                  "Providing accredited Egyptian curricula through modern and interactive methods.",
                  "Developing personal skills and preparing students for exams at different educational stages inside and outside Egypt.",
                  "Assistance with registration at the Egyptian embassy until obtaining the official certificate.",
                ].map((item, index) => (
                  <li key={index} className="flex items-start ">
                    <span className="leading-relaxed">{item}</span>
                    <span className="text-orange-500 font-bold mr-2 mt-1 ">
                      •
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* What We Offer Section with enhanced cards */}
      <section className="py-20 bg-white relative ">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-orange-50/30"></div>
        <div className="max-w-7xl mx-auto px-4 relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-orange-100 px-6 py-3 rounded-full mb-4">
              <span className="text-orange-600 font-bold text-lg ">
                What We Offer
              </span>
            </div>
            <h2 className="text-4xl font-bold text-[#051441] leading-tight">
              A Complete Learning Experience for Your Children
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 ">
            {[
              {
                img: "/assets/img/class.png",
                title: "Interactive Virtual Classrooms",
                desc: "Live sessions with teachers allowing students to interact, ask questions, and participate in discussions just like traditional classrooms.",
                color: "from-blue-500 to-blue-600",
              },
              {
                img: "/assets/img/robot.png",
                title: "AI Learning Assistant",
                desc: "A smart tool that helps students solve assignments, understand difficult concepts, and receive extra exercises tailored to their level.",
                color: "from-purple-500 to-purple-600",
              },
              {
                img: "/assets/img/rec.png",
                title: "Recorded Lessons",
                desc: "All lectures are recorded and available anytime, helping students review lessons and prepare for exams.",
                color: "from-green-500 to-green-600",
              },
              {
                img: "/assets/img/film.png",
                title: "Educational Movies & Animations",
                desc: "We use modern visual tools such as educational films and animations to simplify concepts and make learning more engaging.",
                color: "from-red-500 to-red-600",
              },
            ].map((feature, index) => (
              <div key={index} className="group relative ">
                <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 text-right border border-gray-100 hover:border-orange-200 transform hover:-translate-y-2">
                  {/* Top gradient line */}
                  <div
                    className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${feature.color} rounded-t-xl`}
                  ></div>

                  <div className="relative  overflow-hidden rounded-lg mb-6 shadow-md group-hover:shadow-lg transition-shadow duration-300">
                    <img
                      src={feature.img}
                      alt={feature.title}
                      className="w-full h-44 object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                  </div>

                  <h3 className="text-xl text-left font-bold text-orange-600 mb-3 group-hover:text-orange-700 transition-colors duration-300">
                    {feature.title}
                  </h3>

                  <p className="text-gray-600 text-sm leading-relaxed text-left">
                    {feature.desc}
                  </p>

                  {/* Decorative corner */}
                  <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-orange-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section with enhanced wrapper */}
      <section ref={pricingRef} id="pricing" className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-blue-50/30"></div>
        <div className="relative">
          <PricingSectionIg />
        </div>
      </section>

      {/* Testimonials Section */}
      {/* <Testimonials/> */}

      {/* Footer with enhanced styling */}
      <div className="relative">
        <Footer />

        {/* Enhanced Copyright Section */}
        <div className="bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 py-6 text-white relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/4 w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
            <div
              className="absolute bottom-0 right-1/4 w-1 h-1 bg-orange-400 rounded-full animate-pulse"
              style={{ animationDelay: "1s" }}
            ></div>
          </div>

          <div className="container mx-auto px-4 relative">
            <div className="text-center">
              <p className="text-gray-300 text-sm leading-relaxed">
                حقوق النشر © 2025 Edu-Smart. جميع الحقوق محفوظة بواسطة{" "}
                <a
                  href="https://edu-smart.ai"
                  className="text-orange-500 hover:text-orange-400 transition-colors duration-300 font-semibold hover:underline"
                >
                  Edu-Smart.ai
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
