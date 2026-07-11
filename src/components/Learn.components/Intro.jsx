import React from "react";
import { motion } from "framer-motion";
import { Clock, Target, Lightbulb, ArrowRight, BookOpen } from "lucide-react";
import { playSound, unlockAudio } from "../../assets/soundEffects";

const Introduction = ({ intro, next }) => {
  // Use demo data if no intro prop is provided, otherwise use the passed intro data
  const data = intro || {
    title: "What is a Behavioral Baseline?",
    estimatedReadTime: "45 sec",
    objective: "Help the user understand what a behavioral baseline is before practicing it.",
    content: "A behavioral baseline is a person's normal way of behaving when they are relaxed and under little pressure. It includes habits like their usual speech, eye contact, body language, posture, and energy. Before you can understand why someone's behavior changes, you first need to know what 'normal' looks like for them. Skilled observers don't judge isolated behaviors—they compare them to a person's baseline before drawing conclusions.",
    keyTakeaway: "Observe what's normal before interpreting what's different."
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center p-4 md:p-8">
      <motion.div 
        className="w-full max-w-2xl bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header Section */}
        <div className="px-6 py-8 md:px-10 md:pt-10 md:pb-8">
          <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3 mb-6">
            <span className="flex items-center gap-1.5 bg-purple-100 text-purple-700 px-3 py-1.5 rounded-full text-[13px] font-bold tracking-wide uppercase">
              <BookOpen size={16} /> Introduction
            </span>
            {data.estimatedReadTime && (
              <span className="flex items-center gap-1.5 bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full text-[13px] font-semibold">
                <Clock size={16} /> {data.estimatedReadTime} read
              </span>
            )}
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight mb-6">
              {data.title}
            </h1>
          </motion.div>

          {data.objective && (
            <motion.div variants={itemVariants} className="flex gap-4 p-5 rounded-2xl bg-blue-50/80 border border-blue-100/50 mb-8">
              <div className="shrink-0 mt-0.5">
                <Target className="text-blue-500" size={24} />
              </div>
              <div>
                <h4 className="text-[15px] font-bold text-blue-900 mb-1">Objective</h4>
                <p className="text-[15px] text-blue-800 leading-relaxed">{data.objective}</p>
              </div>
            </motion.div>
          )}

          <motion.div variants={itemVariants} className="mb-4">
            <p className="text-slate-600 leading-relaxed text-[17px] md:text-lg">
              {data.content}
            </p>
          </motion.div>
        </div>

        {/* Footer / Takeaway Section */}
        <motion.div variants={itemVariants} className="bg-gradient-to-br from-purple-600 to-indigo-700 p-6 md:p-8 text-white relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 bg-purple-400 opacity-10 rounded-full blur-2xl pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            {data.keyTakeaway && (
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2 text-purple-200">
                  <Lightbulb size={18} />
                  <span className="text-[13px] font-bold uppercase tracking-wider">Key Takeaway</span>
                </div>
                <p className="text-lg md:text-xl font-semibold leading-snug">
                  "{data.keyTakeaway}"
                </p>
              </div>
            )}
            
            <div className="shrink-0 pt-2 md:pt-0 w-full md:w-auto">
              <button 
                onClick={() => {
                  unlockAudio();
                  playSound("continueEnabled");
                  next();
                }}
                className="group relative inline-flex items-center justify-center gap-2 bg-white text-indigo-700 px-8 py-4 rounded-xl font-bold text-[17px] shadow-[0_8px_20px_rgba(0,0,0,0.15)] hover:shadow-[0_12px_25px_rgba(0,0,0,0.2)] transition-all duration-300 hover:-translate-y-1 active:translate-y-0 w-full"
              >
                <span>Continue</span>
                <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Introduction;
