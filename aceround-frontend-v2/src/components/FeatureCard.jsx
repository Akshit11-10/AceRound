// FeatureCard component - displays feature information with icons

const FeatureCard = ({ icon: Icon, title, description, delay = '' }) => {
  return (
    <div 
      className={`glass-premium hover:animate-neonPulse parallax-tilt magnetic-hover transform transition-all duration-500 hover:-translate-y-1 hover:scale-[1.02] animate-fadeInUp ${delay} group cursor-pointer`}
      style={{ borderRadius: '16px' }}
    >
      {/* Feature icon */}
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-600 flex items-center justify-center mb-4 transition-all duration-500 group-hover:scale-125 group-hover:animate-pulse group-hover:shadow-[0_0_20px_rgba(59,130,246,0.4)]">
        <Icon className="h-8 w-8 text-white drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
      </div>

      {/* Feature content */}
      <h3 className="text-xl font-extrabold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 animate-gradientShift group-hover:scale-105 transition-transform duration-300">{title}</h3>
      <p className="text-slate-300 text-base leading-relaxed group-hover:text-slate-100 transition-colors duration-300">{description}</p>
    </div>
  );
};

export default FeatureCard;