// StatCard component - displays statistics with icons

const StatCard = ({ icon: Icon, label, value, color = 'blue', delay = '' }) => {
  // Color classes for different stat types
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
  };

  return (
    <div 
      className={`glass-premium hover:animate-neonPulse parallax-tilt magnetic-hover transform transition-all duration-500 hover:-translate-y-1 hover:scale-[1.02] animate-fadeInUp ${delay} group cursor-pointer`}
      style={{ borderRadius: '16px' }}
    >
      <div className="flex items-center gap-4">
        {/* Icon circle */}
        <div className={`p-4 rounded-2xl bg-gradient-to-br ${colorClasses[color]} shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all duration-500 group-hover:scale-125 group-hover:animate-pulse group-hover:shadow-[0_0_30px_rgba(59,130,246,0.5)]`}>
          <Icon className="h-7 w-7 text-white drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
        </div>

        {/* Stat text */}
        <div>
          <p className="text-3xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 animate-gradientShift group-hover:scale-105 transition-transform duration-300">{value}</p>
          <p className="text-sm text-slate-400 group-hover:text-slate-100 transition-colors duration-300">{label}</p>
        </div>
      </div>
    </div>
  );
};

export default StatCard;