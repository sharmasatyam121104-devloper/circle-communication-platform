import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Check,
  Lock,
  MessageCircle,
  Video,
  Phone,
  File,
  ShieldCheck,
  Users,
  Sparkles,
  Circle,
} from "lucide-react";

const features = [
  {
    icon: Lock,
    title: "Secure Login",
    description:
      "Industry-standard authentication with protected user sessions.",
  },
  {
    icon: MessageCircle,
    title: "Real-Time Chat",
    description:
      "Lightning fast messaging powered by WebSockets.",
  },
  {
    icon: File,
    title: "File Sharing",
    description:
      "Share images, videos, PDFs and documents instantly.",
  },
  {
    icon: Phone,
    title: "Audio Calling",
    description:
      "Crystal clear voice calls with low latency.",
  },
  {
    icon: Video,
    title: "Video Calling",
    description:
      "High quality face-to-face conversations anytime.",
  },
  {
    icon: ShieldCheck,
    title: "Privacy First",
    description:
      "Your conversations stay protected and secure.",
  },
];

const stats = [
  {
    number: "99.9%",
    title: "Uptime",
  },
  {
    number: "1M+",
    title: "Messages",
  },
  {
    number: "24/7",
    title: "Availability",
  },
  {
    number: "100%",
    title: "Secure",
  },
];

const checklist = [
  "Secure Authentication",
  "Real-Time Messaging",
  "Typing Indicator",
  "Online Presence",
  "Audio Calling",
  "Video Calling",
  "File Sharing",
  "Beautiful UI",
  "Responsive Design",
  "Cross Platform",
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden bg-[#050816] text-white">

      {/* Background Blur */}

      <div className="absolute inset-0 overflow-hidden">

        <motion.div
          animate={{
            x: [0, 60, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
          }}
          className="absolute -top-20 left-0 h-96 w-96 rounded-full bg-indigo-600/30 blur-[120px]"
        />

        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, -60, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
          }}
          className="absolute right-0 top-40 h-[450px] w-[450px] rounded-full bg-violet-600/20 blur-[140px]"
        />

        <motion.div
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
          }}
          className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-cyan-500/20 blur-[120px]"
        />

      </div>

      {/* Grid */}

      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(to right,#ffffff 1px,transparent 1px),linear-gradient(to bottom,#ffffff 1px,transparent 1px)",
          backgroundSize: "45px 45px",
        }}
      />

      {/* Navbar */}

      <header className="relative z-20">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3"
          >

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 shadow-xl shadow-indigo-600/40">

              <Circle size={24} />

            </div>

            <div>

              <h1 className="text-2xl font-bold tracking-wide">
                Circle
              </h1>

              <p className="text-xs text-zinc-400">
                Secure Communication
              </p>

            </div>

          </motion.div>

          <div className="flex items-center gap-3">

            <button
              onClick={() => navigate("/login")}
              className="rounded-xl border border-zinc-700 px-5 py-2 text-sm transition hover:border-indigo-500 hover:bg-indigo-500/10"
            >
              Login
            </button>

            <button
              onClick={() => navigate("/signup")}
              className="rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2 text-sm font-semibold transition hover:scale-105"
            >
              Get Started
            </button>

          </div>

        </div>

      </header>

      {/* Hero Starts Here */}

            <section className="relative z-10 mx-auto flex min-h-[90vh] max-w-7xl flex-col items-center gap-16 px-6 pt-10 pb-24 lg:flex-row">

        {/* Left */}

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: .7 }}
          className="flex-1"
        >

          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-2 text-sm text-indigo-300">

            <Sparkles size={16} />

            Trusted Secure Communication Platform

          </div>

          <h1 className="max-w-3xl text-5xl font-black leading-tight md:text-7xl">

            Connect

            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">

              {" "}Smarter

            </span>

            <br />

            Communicate

            <br />

            Securely.

          </h1>

          <p className="mt-8 max-w-xl text-lg leading-8 text-zinc-400">

            Circle helps you stay connected through secure messaging,
            lightning-fast real-time chat, file sharing,
            HD audio calls and crystal-clear video meetings —
            all inside one modern platform.

          </p>

          <div className="mt-10 flex flex-wrap gap-5">

            <button
              onClick={() => navigate("/signup")}
              className="group flex items-center gap-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-8 py-4 font-semibold shadow-xl shadow-indigo-600/30 transition hover:scale-105"
            >

              Get Started

              <ArrowRight
                size={20}
                className="transition group-hover:translate-x-1"
              />

            </button>

            <button
              onClick={() => navigate("/login")}
              className="rounded-2xl border border-zinc-700 px-8 py-4 transition hover:border-indigo-500 hover:bg-indigo-500/10"
            >
              Login
            </button>

          </div>

          <div className="mt-12 flex flex-wrap gap-8 text-sm text-zinc-400">

            <div className="flex items-center gap-2">

              <Check className="text-green-400" size={18} />

              End-to-End Secure

            </div>

            <div className="flex items-center gap-2">

              <Check className="text-green-400" size={18} />

              Real-Time

            </div>

            <div className="flex items-center gap-2">

              <Check className="text-green-400" size={18} />

              File Sharing

            </div>

          </div>

        </motion.div>

        {/* Right */}

        <motion.div
          initial={{ opacity: 0, x: 80 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: .8 }}
          className="relative flex-1"
        >

          <motion.div
            animate={{
              y: [0, -12, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
            }}
            className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl shadow-[0_0_80px_rgba(99,102,241,.25)]"
          >

            {/* Top */}

            <div className="mb-6 flex items-center justify-between">

              <div className="flex items-center gap-3">

                <div className="relative">

                  <img
                    src="https://i.pravatar.cc/100?img=12"
                    className="h-14 w-14 rounded-full object-cover"
                  />

                  <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-[#050816] bg-green-500" />

                </div>

                <div>

                  <h3 className="font-semibold">
                    Alex Johnson
                  </h3>

                  <p className="text-sm text-green-400">
                    Online
                  </p>

                </div>

              </div>

              <div className="flex gap-3">

                <button className="rounded-xl bg-zinc-800 p-3 hover:bg-indigo-600">

                  <Phone size={18} />

                </button>

                <button className="rounded-xl bg-indigo-600 p-3">

                  <Video size={18} />

                </button>

              </div>

            </div>

            {/* Messages */}

            <div className="space-y-4">

              <div className="max-w-xs rounded-2xl rounded-bl-sm bg-zinc-800 p-4 text-sm">

                Hey 👋

                <br />

                Are you joining today's meeting?

              </div>

              <div className="ml-auto max-w-xs rounded-2xl rounded-br-sm bg-indigo-600 p-4 text-sm">

                Yes.

                I'll join in 5 minutes.

              </div>

              <div className="max-w-xs rounded-2xl bg-zinc-800 p-4">

                <div className="flex items-center gap-3">

                  <div className="rounded-xl bg-red-500/20 p-3">

                    <File className="text-red-400" />

                  </div>

                  <div>

                    <p className="font-medium">
                      Project.pdf
                    </p>

                    <span className="text-xs text-zinc-500">

                      2.4 MB

                    </span>

                  </div>

                </div>

              </div>

              <div className="ml-auto w-52 overflow-hidden rounded-2xl">

                <img
                  src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=500"
                  className="rounded-2xl"
                />

              </div>

              {/* Typing */}

              <div className="flex items-center gap-2 text-zinc-400">

                <div className="flex gap-1">

                  <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-400" />

                  <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-400 [animation-delay:0.2s]" />

                  <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-400 [animation-delay:0.4s]" />

                </div>

                Alex is typing...

              </div>

            </div>

          </motion.div>

          {/* Floating Notification */}

          <motion.div
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
            }}
            className="absolute -right-5 -top-5 rounded-2xl border border-indigo-500/20 bg-[#111827] px-5 py-4 shadow-xl"
          >

            <div className="flex items-center gap-3">

              <div className="rounded-full bg-green-500 p-2">

                <MessageCircle size={16} />

              </div>

              <div>

                <p className="text-sm font-semibold">

                  New Message

                </p>

                <p className="text-xs text-zinc-400">

                  Sarah sent a file

                </p>

              </div>

            </div>

          </motion.div>

        </motion.div>

      </section>

            {/* ================= FEATURES ================= */}

      <section className="relative z-10 py-28">

        <div className="mx-auto max-w-7xl px-6">

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: .6 }}
            className="text-center"
          >

            <span className="rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-2 text-sm text-indigo-300">
              FEATURES
            </span>

            <h2 className="mt-6 text-4xl font-black md:text-5xl">

              Everything you need

              <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">

                {" "}in one place

              </span>

            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-zinc-400">

              Experience secure communication with powerful collaboration
              tools designed for modern teams and individuals.

            </p>

          </motion.div>

          <div className="mt-20 grid gap-8 md:grid-cols-2 lg:grid-cols-3">

            {features.map((feature, index) => {

              const Icon = feature.icon;

              return (

                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: .5,
                    delay: index * .08,
                  }}
                  whileHover={{
                    y: -10,
                  }}
                  className="group rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition duration-300 hover:border-indigo-500/50 hover:shadow-[0_0_40px_rgba(99,102,241,.25)]"
                >

                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 transition group-hover:rotate-6">

                    <Icon size={28} />

                  </div>

                  <h3 className="text-2xl font-bold">

                    {feature.title}

                  </h3>

                  <p className="mt-4 leading-7 text-zinc-400">

                    {feature.description}

                  </p>

                </motion.div>

              );

            })}

          </div>

        </div>

      </section>

      {/* ================= WHY CHOOSE ================= */}

      <section className="relative z-10 py-24">

        <div className="mx-auto grid max-w-7xl items-center gap-20 px-6 lg:grid-cols-2">

          {/* Illustration */}

          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: .7 }}
            className="relative flex items-center justify-center"
          >

            <div className="absolute h-80 w-80 rounded-full bg-indigo-600/20 blur-[110px]" />

            <div className="relative">

              <div className="rounded-[40px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl">

                <div className="grid grid-cols-2 gap-5">

                  <div className="rounded-3xl bg-indigo-600 p-8">

                    <Users size={40} />

                    <h3 className="mt-5 font-semibold">

                      Friends

                    </h3>

                  </div>

                  <div className="rounded-3xl bg-violet-600 p-8">

                    <Video size={40} />

                    <h3 className="mt-5 font-semibold">

                      Meetings

                    </h3>

                  </div>

                  <div className="rounded-3xl bg-cyan-600 p-8">

                    <MessageCircle size={40} />

                    <h3 className="mt-5 font-semibold">

                      Chat

                    </h3>

                  </div>

                  <div className="rounded-3xl bg-pink-600 p-8">

                    <ShieldCheck size={40} />

                    <h3 className="mt-5 font-semibold">

                      Secure

                    </h3>

                  </div>

                </div>

              </div>

            </div>

          </motion.div>

          {/* Content */}

          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: .7 }}
          >

            <span className="rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-2 text-sm text-indigo-300">

              WHY CIRCLE

            </span>

            <h2 className="mt-6 text-5xl font-black">

              Built for

              <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">

                {" "}modern communication

              </span>

            </h2>

            <p className="mt-6 max-w-xl leading-8 text-zinc-400">

              Whether you're chatting with friends, collaborating with your
              team, or sharing important documents, Circle provides a fast,
              secure and enjoyable communication experience.

            </p>

            <div className="mt-10 grid gap-5 sm:grid-cols-2">

              {checklist.map((item) => (

                <motion.div
                  key={item}
                  whileHover={{
                    x: 8,
                  }}
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4"
                >

                  <div className="rounded-full bg-green-500 p-1">

                    <Check
                      size={16}
                      className="text-white"
                    />

                  </div>

                  <span className="text-zinc-300">

                    {item}

                  </span>

                </motion.div>

              ))}

            </div>

          </motion.div>

        </div>

      </section>
            {/* ====================== STATS ====================== */}

      <section className="relative z-10 py-24">

        <div className="mx-auto max-w-7xl px-6">

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: .6 }}
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-4"
          >

            {stats.map((item) => (

              <motion.div
                key={item.title}
                whileHover={{
                  y: -8,
                  scale: 1.03,
                }}
                className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center backdrop-blur-xl hover:border-indigo-500/40 hover:shadow-[0_0_40px_rgba(99,102,241,.25)] transition"
              >

                <h2 className="bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-6xl font-black text-transparent">

                  {item.number}

                </h2>

                <p className="mt-4 text-lg text-zinc-400">

                  {item.title}

                </p>

              </motion.div>

            ))}

          </motion.div>

        </div>

      </section>

      {/* ====================== CTA ====================== */}

      <section className="relative z-10 py-32">

        <div className="mx-auto max-w-6xl px-6">

          <motion.div
            initial={{ opacity: 0, scale: .95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: .7 }}
            className="relative overflow-hidden rounded-[40px] border border-white/10 bg-gradient-to-r from-indigo-700 via-violet-700 to-indigo-600 p-14 md:p-20"
          >

            <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-[120px]" />

            <div className="absolute -right-24 -bottom-24 h-72 w-72 rounded-full bg-cyan-400/20 blur-[120px]" />

            <div className="relative text-center">

              <span className="rounded-full bg-white/10 px-5 py-2 text-sm">

                START TODAY

              </span>

              <h2 className="mt-8 text-5xl font-black leading-tight md:text-6xl">

                Ready to experience

                <br />

                secure communication?

              </h2>

              <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-indigo-100">

                Join thousands of users already using Circle to
                communicate faster, collaborate smarter and stay connected
                anywhere.

              </p>

              <div className="mt-12 flex flex-wrap justify-center gap-5">

                <button
                  onClick={() => navigate("/signup")}
                  className="rounded-2xl bg-white px-8 py-4 font-semibold text-black transition hover:scale-105"
                >

                  Get Started

                </button>

                <button
                  onClick={() => navigate("/login")}
                  className="rounded-2xl border border-white/30 px-8 py-4 transition hover:bg-white/10"
                >

                  Login

                </button>

              </div>

            </div>

          </motion.div>

        </div>

      </section>

      {/* ====================== FOOTER ====================== */}

      <footer className="relative z-10 border-t border-white/10">

        <div className="mx-auto max-w-7xl px-6 py-16">

          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">

            <div>

              <div className="flex items-center gap-3">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600">

                  <Circle size={24} />

                </div>

                <div>

                  <h3 className="text-2xl font-bold">

                    Circle

                  </h3>

                  <p className="text-sm text-zinc-400">

                    Secure Communication

                  </p>

                </div>

              </div>

              <p className="mt-6 leading-7 text-zinc-400">

                A modern communication platform for secure messaging,
                file sharing, voice calls and HD video meetings.

              </p>

            </div>

            <div>

              <h4 className="mb-5 text-lg font-semibold">

                Product

              </h4>

              <ul className="space-y-3 text-zinc-400">

                <li className="hover:text-white cursor-pointer">Home</li>
                <li className="hover:text-white cursor-pointer">Features</li>
                <li className="hover:text-white cursor-pointer">Security</li>
                <li className="hover:text-white cursor-pointer">Download</li>

              </ul>

            </div>

            <div>

              <h4 className="mb-5 text-lg font-semibold">

                Company

              </h4>

              <ul className="space-y-3 text-zinc-400">

                <li className="hover:text-white cursor-pointer">About</li>
                <li className="hover:text-white cursor-pointer">Blog</li>
                <li className="hover:text-white cursor-pointer">Careers</li>
                <li className="hover:text-white cursor-pointer">Contact</li>

              </ul>

            </div>

            <div>

              <h4 className="mb-5 text-lg font-semibold">

                Legal

              </h4>

              <ul className="space-y-3 text-zinc-400">

                <li className="hover:text-white cursor-pointer">Privacy</li>
                <li className="hover:text-white cursor-pointer">Terms</li>
                <li className="hover:text-white cursor-pointer">Cookies</li>
                <li className="hover:text-white cursor-pointer">Support</li>

              </ul>

            </div>

          </div>

          <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-sm text-zinc-500 md:flex-row">

            <p>

              © 2026 Circle. All rights reserved.

            </p>

            <p>

              Designed & Developed by Satyam Sharma

            </p>

          </div>

        </div>

      </footer>

    </div>

  );

}