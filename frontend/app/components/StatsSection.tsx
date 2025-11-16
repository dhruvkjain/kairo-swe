import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface StatCardProps {
  value: number;
  label: string;
  suffix?: string;
  delay?: number;
}

function StatCard({ value, label, suffix = "", delay = 0 }: StatCardProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className="text-center"
    >
      <div className="text-slate-900 mb-2">
        {count.toLocaleString()}{suffix}
      </div>
      <p className="text-gray-600">{label}</p>
    </motion.div>
  );
}

export function StatsSection() {
  return (
    <section className="py-20 px-4 bg-white/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-slate-900 mb-4">Trusted by Thousands</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Join the growing community of professionals and companies making smarter hiring decisions
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          <StatCard value={50000} label="Active Users" suffix="+" delay={0.1} />
          <StatCard value={12000} label="Companies" suffix="+" delay={0.2} />
          <StatCard value={95} label="Success Rate" suffix="%" delay={0.3} />
          <StatCard value={200000} label="Matches Made" suffix="+" delay={0.4} />
        </div>
      </div>
    </section>
  );
}
