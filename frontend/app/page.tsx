"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import logoImage from "@/components/Kairo_logo.jpg";
import { ArrowRight, Briefcase, Users, Zap, Star } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";

const growthData = [
  { month: "Jan", users: 5000, placements: 120 },
  { month: "Feb", users: 8000, placements: 240 },
  { month: "Mar", users: 12000, placements: 480 },
  { month: "Apr", users: 20000, placements: 900 },
  { month: "May", users: 32000, placements: 1500 },
  { month: "Jun", users: 45000, placements: 3000 },
];

const satisfactionData = [
  { category: "Applicants", score: 92 },
  { category: "Recruiters", score: 88 },
  { category: "Overall", score: 95 },
];

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-slate-100 to-slate-200 flex flex-col items-center text-center px-4 overflow-hidden">

      {/* Added Top Padding */}
      <div className="pt-10 sm:pt-16"></div>

      {/* ---------------- ORIGINAL CODE ABOVE ---------------- */}

      {/* Hero Section */}
      <div className="max-w-3xl space-y-6 animate-fadeInUp">

        {/* Logo */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <div>
            <img
              src={logoImage.src}
              alt="Kairo Logo"
              className="h-16 sm:h-20 lg:h-24 w-auto object-contain animate-float"
            />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 leading-tight animate-fadeInUp">
          Welcome to <span className="text-gray-900">Kairo</span>
        </h1>

        <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto leading-relaxed animate-fadeInUp">
          The smart platform connecting <strong>Applicants</strong> and <strong>Recruiters</strong> seamlessly.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 animate-fadeInUp">
          <Link href="/signin">
            <Button className="px-8 py-5 text-lg shadow-md hover:scale-110 transition-all duration-300">
              Sign In
            </Button>
          </Link>
          <Link href="/signup">
            <Button
              variant="outline"
              className="px-8 py-5 text-lg border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white hover:scale-110 transition-all duration-300"
            >
              Sign Up
            </Button>
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="mt-24 grid grid-cols-1 sm:grid-cols-3 gap-8 w-full max-w-6xl px-4 animate-fadeInUp delay-200">
        {[
          {
            icon: <Users className="w-10 h-10 text-gray-900 mb-3" />,
            title: "For Applicants",
            text: "Build your professional profile and get matched with recruiters who value your skills.",
          },
          {
            icon: <Briefcase className="w-10 h-10 text-gray-900 mb-3" />,
            title: "For Recruiters",
            text: "Discover top talent effortlessly with AI-powered insights to hire smarter.",
          },
          {
            icon: <ArrowRight className="w-10 h-10 text-gray-900 mb-3" />,
            title: "Get Started",
            text: "Join Kairo today and experience the next generation of hiring and career growth.",
          },
        ].map((feature, index) => (
          <Card
            key={index}
            className="border border-gray-200 shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 rounded-2xl bg-white/80 backdrop-blur-sm animate-fadeInUp"
            style={{ animationDelay: `${index * 150}ms` }}
          >
            <CardContent className="p-8 flex flex-col items-center text-center space-y-3">
              <div className="animate-fadeIn">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{feature.text}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* -------------------- NEW SECTIONS ADDED BELOW -------------------- */}

      {/* Stats Section */}
      <div className="mt-28 grid grid-cols-1 sm:grid-cols-3 gap-10 w-full max-w-6xl px-4 animate-fadeInUp">
        {[
          { number: "50K+", label: "Applicants Joined" },
          { number: "8K+", label: "Recruiters Onboarded" },
          { number: "98%", label: "Satisfaction Rate" },
        ].map((item, idx) => (
          <div
            key={idx}
            className="bg-white/80 p-8 rounded-2xl shadow-md hover:-translate-y-2 transition-all duration-300 backdrop-blur-sm"
          >
            <h3 className="text-4xl font-extrabold text-gray-900">{item.number}</h3>
            <p className="text-gray-600 mt-2">{item.label}</p>
          </div>
        ))}
      </div>
   

      <section className="py-24 px-4 bg-white/60 backdrop-blur-md mt-28 w-full">
        <div className="max-w-6xl mx-auto">

          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">How It Works</h2>
          <p className="text-gray-600 text-center max-w-2xl mx-auto mb-16">
            Get started in minutes with our simple, streamlined process
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-12">

            {/* STEP 1 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-black text-white rounded-full flex items-center justify-center text-3xl mb-4">
                👤
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Create Account</h3>
              <p className="text-gray-600 mt-2 max-w-xs">
                Sign up quickly and set up your professional profile.
              </p>
            </div>

            {/* STEP 2 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-black text-white rounded-full flex items-center justify-center text-3xl mb-4">
                📄
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Build Profile</h3>
              <p className="text-gray-600 mt-2 max-w-xs">
                Add your skills, experience, and preferences.
              </p>
            </div>

            {/* STEP 3 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-black text-white rounded-full flex items-center justify-center text-3xl mb-4">
                🔍
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Get Matched</h3>
              <p className="text-gray-600 mt-2 max-w-xs">
                Our Platform finds the best opportunities or candidates for you.
              </p>
            </div>

            {/* STEP 4 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-black text-white rounded-full flex items-center justify-center text-3xl mb-4">
                ✅
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Connect & Grow</h3>
              <p className="text-gray-600 mt-2 max-w-xs">
                Build meaningful professional relationships.
              </p>
            </div>

          </div>

        </div>
      </section>
       {/*  ADDED: GRAPH SECTION  */}
      <div className="mt-32 w-full max-w-6xl px-4 animate-fadeInUp">

        <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
          Our Growth Story
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* Area Chart */}
          <div className="bg-white/80 p-8 rounded-2xl shadow-lg backdrop-blur-sm">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 text-left">
              User & Placement Growth
            </h3>

            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={growthData}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0f172a" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0f172a" stopOpacity={0}/>
                  </linearGradient>

                  <linearGradient id="colorPlace" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#475569" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#475569" stopOpacity={0}/>
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" />

                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    borderRadius: "10px",
                    border: "1px solid #e2e8f0",
                  }}
                />

                <Area
                  type="monotone"
                  dataKey="users"
                  stroke="#0f172a"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorUsers)"
                />

                <Area
                  type="monotone"
                  dataKey="placements"
                  stroke="#475569"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorPlace)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart */}
          <div className="bg-white/80 p-8 rounded-2xl shadow-lg backdrop-blur-sm">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 text-left">
              User Satisfaction Scores
            </h3>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={satisfactionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="category" stroke="#64748b" />
                <YAxis stroke="#64748b" domain={[0, 100]} />

                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    borderRadius: "10px",
                    border: "1px solid #e2e8f0",
                  }}
                />

                <Bar dataKey="score" fill="#0f172a" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/*  User Reviews */}
      <div className="mt-32 w-full max-w-6xl px-4 animate-fadeInUp">
        <h2 className="text-3xl font-bold text-gray-800 mb-10">What Our Users Say</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              name: "Aarav Sharma",
              text: "Kairo helped me land a great internship within 2 weeks!",
            },
            {
              name: "Sophia Patel",
              text: "As a recruiter, the AI matching saves me hours every day.",
            },
            {
              name: "Ryan Carter",
              text: "The platform experience is smooth, clean and very smart.",
            },
          ].map((review, i) => (
            <Card
              key={i}
              className="bg-white/90 p-6 rounded-2xl shadow-lg hover:-translate-y-2 transition-all duration-300"
            >
              <CardContent className="space-y-4">
                <div className="flex justify-center">
                  <Star className="text-yellow-500" />
                  <Star className="text-yellow-500" />
                  <Star className="text-yellow-500" />
                  <Star className="text-yellow-500" />
                  <Star className="text-yellow-500" />
                </div>

                <p className="text-gray-600 italic">{review.text}</p>
                <h4 className="font-semibold text-gray-900">{review.name}</h4>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* -------------------- FOOTER -------------------- */}

      <footer className="mt-20 w-full bg-slate-900 text-gray-300 py-10 px-6 animate-fadeInUp delay-300">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-10">

          {/* About Section */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-white">About Kairo</h3>
            <p className="text-sm leading-relaxed">
              Kairo connects applicants and recruiters with intelligent matching,
              helping both sides grow faster and smarter.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-white">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/signin" className="hover:text-white">Sign In</Link></li>
              <li><Link href="/signup" className="hover:text-white">Sign Up</Link></li>
              <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-white">Contact</h3>
            <p className="text-sm">Email: support@kairo.com</p>
            <p className="text-sm">Phone: +1 234 567 890</p>
          </div>
        </div>

        <div className="mt-10 text-center text-gray-400 text-xs">
          © {new Date().getFullYear()} <span className="font-semibold text-gray-200">Kairo</span> — All rights reserved.
        </div>
      </footer>

      {/* Animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        @keyframes slideSlow {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-fadeIn {
          animation: fadeInUp 1s ease-out both;
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out both;
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-slideSlow {
          animation: slideSlow 10s linear infinite;
        }
      `}</style>

    </div>
  );
};

export default LandingPage;
