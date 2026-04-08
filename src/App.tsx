import { useConvexAuth, useQuery, useMutation, useAction } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "../convex/_generated/api";
import { useState } from "react";
import { Id } from "../convex/_generated/dataModel";

// Video type definition
type Video = {
  _id: Id<"videos">;
  userId: Id<"users">;
  title: string;
  prompt: string;
  status: "generating" | "completed" | "failed";
  videoData?: string;
  thumbnailData?: string;
  aspectRatio: "16:9" | "9:16";
  createdAt: number;
  completedAt?: number;
  errorMessage?: string;
};

// Floating cloud decoration component
function Cloud({ className }: { className?: string }) {
  return (
    <div className={`absolute pointer-events-none opacity-60 ${className}`}>
      <svg viewBox="0 0 200 100" className="w-full h-full">
        <ellipse cx="50" cy="60" rx="40" ry="30" fill="currentColor" />
        <ellipse cx="90" cy="50" rx="50" ry="35" fill="currentColor" />
        <ellipse cx="140" cy="55" rx="45" ry="32" fill="currentColor" />
        <ellipse cx="70" cy="70" rx="35" ry="25" fill="currentColor" />
        <ellipse cx="120" cy="68" rx="40" ry="28" fill="currentColor" />
      </svg>
    </div>
  );
}

// Twinkling star component
function Star({ delay, size, left, top }: { delay: number; size: number; left: string; top: string }) {
  return (
    <div
      className="absolute animate-twinkle"
      style={{
        left,
        top,
        animationDelay: `${delay}s`,
        width: size,
        height: size,
      }}
    >
      <svg viewBox="0 0 24 24" className="w-full h-full text-amber-300 drop-shadow-[0_0_4px_rgba(251,191,36,0.8)]">
        <polygon
          points="12,2 15,9 22,9 16,14 18,22 12,18 6,22 8,14 2,9 9,9"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}

// Decorative rainbow arc
function RainbowArc() {
  return (
    <div className="absolute -right-20 -top-20 w-96 h-96 opacity-30 pointer-events-none">
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <defs>
          <linearGradient id="rainbowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF6B6B" />
            <stop offset="25%" stopColor="#FFE66D" />
            <stop offset="50%" stopColor="#4ECDC4" />
            <stop offset="75%" stopColor="#A78BFA" />
            <stop offset="100%" stopColor="#FF8ED4" />
          </linearGradient>
        </defs>
        <path
          d="M20,180 Q20,20 180,20"
          stroke="url(#rainbowGradient)"
          strokeWidth="30"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

// Auth form component
function AuthForm() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);
      formData.append("flow", flow);
      await signIn("password", formData);
    } catch (err) {
      setError(flow === "signIn" ? "Invalid email or password" : "Could not create account");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-sky-100 via-rose-50 to-amber-50">
      {/* Background decorations */}
      <Cloud className="text-white w-48 -top-10 left-10 animate-float" />
      <Cloud className="text-white w-64 top-1/4 -right-20 animate-float-slow" />
      <Cloud className="text-white w-40 bottom-20 left-20 animate-float-delayed" />
      <RainbowArc />

      {/* Stars */}
      <Star delay={0} size={20} left="15%" top="20%" />
      <Star delay={0.5} size={16} left="80%" top="15%" />
      <Star delay={1} size={24} left="70%" top="60%" />
      <Star delay={1.5} size={18} left="25%" top="70%" />
      <Star delay={2} size={14} left="85%" top="80%" />

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-2xl shadow-rose-200/50 p-8 md:p-10 border-4 border-white">
          {/* Logo area */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-rose-400 to-amber-400 shadow-lg shadow-rose-300/50 mb-4 animate-bounce-gentle">
              <svg viewBox="0 0 24 24" className="w-10 h-10 text-white">
                <path fill="currentColor" d="M18,4L20,8H17L15,4H13L15,8H12L10,4H8L10,8H7L5,4H4A2,2 0 0,0 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V4H18M11.5,18A2.5,2.5 0 0,1 9,15.5C9,14.7 9.33,13.96 9.88,13.41L12,11L14.12,13.41C14.67,13.96 15,14.7 15,15.5A2.5,2.5 0 0,1 12.5,18H11.5Z"/>
              </svg>
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-amber-500 to-teal-500">
              PixarMagic
            </h1>
            <p className="text-slate-500 mt-2 font-body">Create magical videos for kids</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-rose-300 focus:bg-white outline-none transition-all font-body text-slate-700 placeholder:text-slate-400"
                required
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-rose-300 focus:bg-white outline-none transition-all font-body text-slate-700 placeholder:text-slate-400"
                required
              />
            </div>

            {error && (
              <div className="bg-rose-100 text-rose-600 px-4 py-3 rounded-xl text-sm font-body">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-400 via-amber-400 to-teal-400 text-white font-display font-bold text-lg shadow-lg shadow-rose-300/50 hover:shadow-xl hover:shadow-rose-400/50 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="inline-flex items-center gap-2">
                  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Loading...
                </span>
              ) : flow === "signIn" ? "Sign In" : "Create Account"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setFlow(flow === "signIn" ? "signUp" : "signIn")}
              className="text-slate-500 hover:text-rose-500 transition-colors font-body text-sm"
            >
              {flow === "signIn" ? "Need an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-dashed border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white/80 text-slate-400 font-body">or</span>
            </div>
          </div>

          <button
            onClick={() => signIn("anonymous")}
            className="w-full py-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-display font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Continue as Guest ✨
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}

// Video creation form
function VideoCreator({ onClose }: { onClose: () => void }) {
  const [prompt, setPrompt] = useState("");
  const [title, setTitle] = useState("");
  const [aspectRatio, setAspectRatio] = useState<"16:9" | "9:16">("16:9");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createVideo = useMutation(api.videos.create);
  const generateVideo = useAction(api.videos.generateVideo);

  const suggestedPrompts = [
    "A friendly robot learning to dance",
    "A magical treehouse adventure",
    "Cute animals having a tea party",
    "A brave little star exploring space",
    "Dinosaurs playing in a colorful garden",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || !title.trim()) return;

    setIsSubmitting(true);
    try {
      const videoId = await createVideo({
        prompt: prompt.trim(),
        title: title.trim(),
        aspectRatio,
      });
      // Start generation in background
      generateVideo({ videoId, prompt: prompt.trim(), aspectRatio });
      onClose();
    } catch (err) {
      console.error("Failed to create video:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[2rem] w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl border-4 border-white animate-pop-in">
        <div className="p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-2xl font-bold text-slate-800">Create Magic ✨</h2>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
            >
              <svg className="w-5 h-5 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-display font-semibold text-slate-600 mb-2">Video Title</label>
              <input
                type="text"
                placeholder="My Amazing Adventure"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-amber-300 focus:bg-white outline-none transition-all font-body text-slate-700 placeholder:text-slate-400"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-display font-semibold text-slate-600 mb-2">Describe Your Story</label>
              <textarea
                placeholder="A curious little penguin discovers a magical snowflake that grants wishes..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={4}
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-amber-300 focus:bg-white outline-none transition-all font-body text-slate-700 placeholder:text-slate-400 resize-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-display font-semibold text-slate-600 mb-3">Quick Ideas 💡</label>
              <div className="flex flex-wrap gap-2">
                {suggestedPrompts.map((suggestion, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setPrompt(suggestion);
                      if (!title) setTitle(suggestion.split(' ').slice(0, 3).join(' '));
                    }}
                    className="px-3 py-2 rounded-full bg-gradient-to-r from-rose-100 to-amber-100 text-slate-600 text-sm font-body hover:from-rose-200 hover:to-amber-200 transition-all hover:scale-105"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-display font-semibold text-slate-600 mb-3">Video Format</label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setAspectRatio("16:9")}
                  className={`flex-1 py-3 rounded-xl font-display font-semibold transition-all ${
                    aspectRatio === "16:9"
                      ? "bg-gradient-to-r from-teal-400 to-cyan-400 text-white shadow-lg"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  📺 Landscape
                </button>
                <button
                  type="button"
                  onClick={() => setAspectRatio("9:16")}
                  className={`flex-1 py-3 rounded-xl font-display font-semibold transition-all ${
                    aspectRatio === "9:16"
                      ? "bg-gradient-to-r from-teal-400 to-cyan-400 text-white shadow-lg"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  📱 Portrait
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !prompt.trim() || !title.trim()}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-400 via-amber-400 to-teal-400 text-white font-display font-bold text-lg shadow-lg shadow-rose-300/50 hover:shadow-xl hover:shadow-rose-400/50 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isSubmitting ? (
                <span className="inline-flex items-center gap-2">
                  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Starting...
                </span>
              ) : "Create Video 🎬"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// Video card component
function VideoCard({ video, onSelect }: {
  video: Video;
  onSelect: () => void;
}) {
  const deleteVideo = useMutation(api.videos.remove);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Delete this video?")) return;
    setIsDeleting(true);
    try {
      await deleteVideo({ id: video._id });
    } catch (err) {
      console.error("Failed to delete:", err);
    }
    setIsDeleting(false);
  };

  const timeAgo = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return "Just now";
  };

  return (
    <div
      onClick={video.status === "completed" ? onSelect : undefined}
      className={`group relative bg-white rounded-2xl overflow-hidden shadow-lg shadow-slate-200/50 border-2 border-white transition-all hover:shadow-xl hover:shadow-rose-200/50 ${
        video.status === "completed" ? "cursor-pointer hover:scale-[1.02]" : ""
      }`}
    >
      {/* Thumbnail area */}
      <div className={`relative ${video.aspectRatio === "9:16" ? "aspect-[9/12]" : "aspect-video"} bg-gradient-to-br from-rose-100 via-amber-50 to-teal-100`}>
        {video.thumbnailData ? (
          <img
            src={`data:image/png;base64,${video.thumbnailData}`}
            alt={video.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            {video.status === "generating" ? (
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-3 relative">
                  <div className="absolute inset-0 rounded-full border-4 border-rose-200"></div>
                  <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-rose-400 animate-spin"></div>
                  <div className="absolute inset-2 rounded-full bg-gradient-to-br from-rose-400 to-amber-400 animate-pulse flex items-center justify-center">
                    <span className="text-white text-xl">🎬</span>
                  </div>
                </div>
                <p className="text-slate-500 font-body text-sm">Creating magic...</p>
                <p className="text-slate-400 font-body text-xs mt-1">This may take 1-2 minutes</p>
              </div>
            ) : video.status === "failed" ? (
              <div className="text-center p-4">
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-rose-100 flex items-center justify-center">
                  <span className="text-2xl">😢</span>
                </div>
                <p className="text-rose-500 font-body text-sm">Oops! Something went wrong</p>
              </div>
            ) : (
              <div className="w-16 h-16 rounded-full bg-white/80 flex items-center justify-center">
                <span className="text-2xl">🎥</span>
              </div>
            )}
          </div>
        )}

        {/* Play button overlay for completed videos */}
        {video.status === "completed" && (
          <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/20 transition-all flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-white/90 shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100">
              <svg className="w-6 h-6 text-rose-500 ml-1" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </div>
        )}

        {/* Aspect ratio badge */}
        <div className="absolute top-3 left-3 px-2 py-1 rounded-full bg-white/90 text-xs font-display font-semibold text-slate-600">
          {video.aspectRatio === "16:9" ? "📺" : "📱"} {video.aspectRatio}
        </div>

        {/* Delete button */}
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 hover:bg-rose-500 hover:text-white text-slate-400 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
        >
          {isDeleting ? (
            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
          ) : (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          )}
        </button>
      </div>

      {/* Info area */}
      <div className="p-4">
        <h3 className="font-display font-bold text-slate-800 truncate">{video.title}</h3>
        <p className="text-slate-500 text-sm font-body mt-1 line-clamp-2">{video.prompt}</p>
        <p className="text-slate-400 text-xs font-body mt-2">{timeAgo(video.createdAt)}</p>
      </div>
    </div>
  );
}

// Video player modal
function VideoPlayer({ video, onClose }: {
  video: Video;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 bg-slate-900/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 rounded-2xl overflow-hidden shadow-2xl max-w-4xl w-full animate-pop-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          {video.videoData ? (
            <video
              src={`data:video/mp4;base64,${video.videoData}`}
              controls
              autoPlay
              className={`w-full ${video.aspectRatio === "9:16" ? "max-h-[70vh]" : ""}`}
            />
          ) : (
            <div className="aspect-video bg-slate-800 flex items-center justify-center">
              <p className="text-slate-400 font-body">Video not available</p>
            </div>
          )}

          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div className="p-6">
          <h2 className="font-display text-xl font-bold text-white">{video.title}</h2>
          <p className="text-slate-400 font-body mt-2">{video.prompt}</p>
        </div>
      </div>
    </div>
  );
}

// Footer component
function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 py-3 text-center bg-gradient-to-t from-white/80 to-transparent pointer-events-none">
      <p className="text-slate-400 text-xs font-body">
        Requested by <span className="text-slate-500">@web-user</span> · Built by <span className="text-slate-500">@clonkbot</span>
      </p>
    </footer>
  );
}

// Main dashboard
function Dashboard() {
  const { signOut } = useAuthActions();
  const videos = useQuery(api.videos.list) as Video[] | undefined;
  const [showCreator, setShowCreator] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-rose-50 to-amber-50 relative overflow-hidden">
      {/* Background decorations */}
      <Cloud className="text-white w-48 -top-10 left-10 animate-float" />
      <Cloud className="text-white w-64 top-1/4 -right-20 animate-float-slow" />
      <Cloud className="text-white w-56 bottom-40 -left-10 animate-float-delayed" />
      <Cloud className="text-white w-40 top-1/2 right-1/4 animate-float" />

      {/* Stars */}
      <Star delay={0} size={20} left="10%" top="15%" />
      <Star delay={0.7} size={16} left="85%" top="10%" />
      <Star delay={1.2} size={24} left="75%" top="45%" />
      <Star delay={1.8} size={18} left="20%" top="55%" />
      <Star delay={2.3} size={14} left="90%" top="70%" />
      <Star delay={0.3} size={22} left="5%" top="80%" />

      <RainbowArc />

      {/* Header */}
      <header className="relative z-10 px-4 md:px-8 py-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-400 to-amber-400 shadow-lg shadow-rose-300/50 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-white">
                <path fill="currentColor" d="M18,4L20,8H17L15,4H13L15,8H12L10,4H8L10,8H7L5,4H4A2,2 0 0,0 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V4H18M11.5,18A2.5,2.5 0 0,1 9,15.5C9,14.7 9.33,13.96 9.88,13.41L12,11L14.12,13.41C14.67,13.96 15,14.7 15,15.5A2.5,2.5 0 0,1 12.5,18H11.5Z"/>
              </svg>
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-amber-500 to-teal-500">
              PixarMagic
            </h1>
          </div>

          <button
            onClick={() => signOut()}
            className="px-4 py-2 rounded-full bg-white/80 hover:bg-white text-slate-600 font-display font-semibold text-sm shadow-lg hover:shadow-xl transition-all"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 px-4 md:px-8 pb-24">
        <div className="max-w-6xl mx-auto">
          {/* Welcome section */}
          <div className="text-center py-8 md:py-12">
            <h2 className="font-display text-3xl md:text-5xl font-bold text-slate-800 mb-4">
              Create Magical Videos ✨
            </h2>
            <p className="text-slate-500 font-body text-lg max-w-xl mx-auto">
              Turn your imagination into beautiful Pixar-style animated videos for kids
            </p>

            <button
              onClick={() => setShowCreator(true)}
              className="mt-8 px-8 py-4 rounded-full bg-gradient-to-r from-rose-400 via-amber-400 to-teal-400 text-white font-display font-bold text-lg shadow-lg shadow-rose-300/50 hover:shadow-xl hover:shadow-rose-400/50 hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-2"
            >
              <span className="text-xl">🎬</span>
              Create New Video
            </button>
          </div>

          {/* Videos grid */}
          <div className="mt-8">
            <h3 className="font-display text-xl font-bold text-slate-700 mb-6">Your Creations</h3>

            {videos === undefined ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white/50 rounded-2xl aspect-video animate-pulse" />
                ))}
              </div>
            ) : videos.length === 0 ? (
              <div className="text-center py-16 bg-white/50 rounded-3xl border-2 border-dashed border-slate-200">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-rose-100 to-amber-100 flex items-center justify-center">
                  <span className="text-4xl">🎥</span>
                </div>
                <p className="text-slate-500 font-body text-lg">No videos yet</p>
                <p className="text-slate-400 font-body mt-1">Create your first magical video!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map((video) => (
                  <VideoCard
                    key={video._id}
                    video={video}
                    onSelect={() => setSelectedVideo(video)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modals */}
      {showCreator && <VideoCreator onClose={() => setShowCreator(false)} />}
      {selectedVideo && selectedVideo.status === "completed" && (
        <VideoPlayer video={selectedVideo} onClose={() => setSelectedVideo(null)} />
      )}

      <Footer />
    </div>
  );
}

// Main App component
export default function App() {
  const { isAuthenticated, isLoading } = useConvexAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-100 via-rose-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 relative">
            <div className="absolute inset-0 rounded-full border-4 border-rose-200"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-rose-400 animate-spin"></div>
            <div className="absolute inset-2 rounded-full bg-gradient-to-br from-rose-400 to-amber-400 flex items-center justify-center">
              <span className="text-white text-2xl">🎬</span>
            </div>
          </div>
          <p className="font-display text-slate-500">Loading the magic...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthForm />;
  }

  return <Dashboard />;
}
