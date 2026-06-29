import { 
  MessageCircleDashed, 
  Video, 
  Phone, 
  Shield, 
  ArrowRight,
  FileText 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  // इन फंक्शन्स को अपने React Router या Navigation Logic से रिप्लेस करें
  const navigate = useNavigate()
  const handleNavigate = (path: string) => {
    navigate(path)
  };

  return (
    <div className="min-h-screen bg-indigo-400 font-sans flex flex-col justify-between overflow-x-hidden selection:bg-indigo-600 selection:text-white">
      
      {/* --- NAVBAR --- */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="bg-white rounded-2xl shadow-md px-6 py-4 flex items-center justify-between transition-all">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-md">
              <MessageCircleDashed size={28} />
            </div>
            <span className="text-2xl font-bold text-slate-800 tracking-tight">
              Circle
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => handleNavigate('/login')}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-indigo-600 hover:bg-zinc-100 active:scale-95 transition-all"
            >
              Log In
            </button>
            <button 
              onClick={() => handleNavigate('/signup')}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95 shadow-md hover:shadow-lg transition-all"
            >
              Sign Up
            </button>
          </div>
        </div>
      </header>

      {/* --- HERO SECTION --- */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 flex flex-col lg:flex-row items-center gap-12">
        
        {/* Left: Text & CTA */}
        <div className="w-full lg:w-1/2 space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-1.5 rounded-full text-indigo-700 text-xs font-semibold tracking-wide uppercase shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            Next-Gen Realtime Communication
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-800 leading-tight">
            Connect your <br />
            <span className="text-indigo-700">Circle</span> instantly.
          </h1>
          
          <p className="text-slate-700 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
            Experience crisp audio/video calls, lightning-fast file sharing, and seamless live chatting. Bring your friends, team, and community into one secure space.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <button 
              onClick={() => handleNavigate('/signup')}
              className="w-full sm:w-auto px-8 py-4 bg-green-600 text-white rounded-2xl font-bold shadow-lg hover:bg-green-500 hover:shadow-green-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 group text-base"
            >
              Get Started Free 
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Right: Feature Preview / Visual Mockup */}
        <div className="w-full lg:w-1/2">
          <div className="bg-gray-600 p-3 sm:p-4 rounded-3xl shadow-2xl border border-white/10 relative overflow-hidden group">
            {/* Top Mock Window Bar */}
            <div className="bg-white rounded-t-xl px-4 py-3 flex items-center justify-between border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-sm shadow">
                  C
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-800">Circle Global Chat</h3>
                  <p className="text-xs text-green-500 flex items-center gap-1 font-medium">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full" /> Online
                  </p>
                </div>
              </div>
              <div className="flex gap-3 text-slate-500">
                <Video size={18} className="hover:text-green-500 cursor-pointer transition-colors" />
                <Phone size={17} className="hover:text-green-500 cursor-pointer transition-colors" />
              </div>
            </div>

            {/* Chat Area Preview */}
            <div className="bg-gray-600 h-64 p-4 overflow-y-auto space-y-4">
              {/* Receiver Bubble */}
              <div className="flex justify-start">
                <div className="bg-indigo-500 text-white max-w-[75%] p-3 rounded-2xl rounded-bl-md shadow-md text-sm">
                  Hey guys! Did you check out the new design update? 🚀
                </div>
              </div>
              
              {/* Sender Bubble */}
              <div className="flex justify-end">
                <div className="bg-slate-700 text-white max-w-[75%] p-3 rounded-2xl rounded-br-md shadow-md text-sm space-y-2">
                  <p>Yeah, just uploaded the project document. Check it here!</p>
                  <div className="bg-white/10 border border-white/10 rounded-xl p-2 flex items-center gap-2 text-xs">
                    <FileText size={16} className="text-indigo-200" />
                    <span className="truncate flex-1">project_spec.pdf</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Input Bar Preview */}
            <div className="bg-gray-600 pt-2 flex items-center gap-2">
              <div className="flex-1 bg-white/10 rounded-xl px-4 py-3 text-xs text-slate-300 border border-white/5">
                Write your message here...
              </div>
              <div className="bg-indigo-600 p-3 rounded-xl text-white shadow">
                <ArrowRight size={16} className="-rotate-45" />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* --- FEATURES GRID --- */}
      <section className="bg-white/40 backdrop-blur-md py-12 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Feature 1 */}
            <div className="bg-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow space-y-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <MessageCircleDashed size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Rich Live Chat</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Enjoy real-time messaging with fully detailed read, delivered, and sent status ticks.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow space-y-3">
              <div className="w-12 h-12 rounded-xl bg-green-100 text-green-600 flex items-center justify-center">
                <Video size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-800">HD Video & Audio Calls</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Connect face-to-face instantly with crystal clear lag-free WebRTC high-definition calling.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow space-y-3">
              <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
                <Shield size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Secure File Sharing</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Seamlessly transfer images, high-res videos, or PDFs up to any size with complete progress indicators.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* --- PROPER FOOTER --- */}
      <footer className="w-full bg-slate-800 text-slate-300 mt-auto border-t border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* Brand Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-md">
                  <MessageCircleDashed size={20} />
                </div>
                <span className="text-xl font-bold text-white tracking-tight">
                  Circle
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                The ultimate next-gen communication platform. Share moments, files, and secure calls within your circle.
              </p>
            </div>

            {/* Product Links */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-white tracking-wider uppercase">Product</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li><a className="hover:text-indigo-400 transition-colors">Live Chat</a></li>
                <li><a  className="hover:text-indigo-400 transition-colors">HD Video Calls</a></li>
                <li><a  className="hover:text-indigo-400 transition-colors">File Sharing</a></li>
              </ul>
            </div>

            {/* Company Links */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-white tracking-wider uppercase">Company</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li><a  className="hover:text-indigo-400 transition-colors">About Us</a></li>
                <li><a  className="hover:text-indigo-400 transition-colors">Privacy Policy</a></li>
                <li><a  className="hover:text-indigo-400 transition-colors">Terms of Service</a></li>
              </ul>
            </div>

            {/* Connect/Action */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-white tracking-wider uppercase">Ready to Start?</h4>
              <p className="text-xs text-slate-400">Join thousands of users communicating securely today.</p>
              <div className="flex gap-2 pt-1">
                <button 
                  onClick={() => handleNavigate('/login')}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-xs font-medium rounded-lg transition-all"
                >
                  Login
                </button>
                <button 
                  onClick={() => handleNavigate('/signup')}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-lg shadow transition-all"
                >
                  Get Circle Free
                </button>
              </div>
            </div>

          </div>

          {/* Bottom Copyright Area */}
          <div className="mt-12 pt-6 border-t border-slate-700 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
            <p>© {new Date().getFullYear()} Circle Inc. All rights reserved.</p>
            <div className="flex gap-4">
              <a className="hover:text-slate-400 transition-colors">Twitter</a>
              <a className="hover:text-slate-400 transition-colors">GitHub</a>
              <a className="hover:text-slate-400 transition-colors">Discord</a>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}