import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Dumbbell, Lock } from 'lucide-react';
import useSound from 'use-sound';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getLearnProgress, getLevelProgress, saveLevelProgress } from '../../utils/learnProgress';

const clickSoundUrl = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=';

const IsometricNode = ({ state }) => {
  // state: 'completed', 'active', 'locked'
  if (state === 'active') {
    return (
      <div className="relative w-32 h-32 flex items-center justify-center mt-2">
        {/* Glow effect */}
        <div className="absolute bottom-2 w-28 h-12 bg-purple-400 rounded-full blur-xl opacity-50"></div>
        
        {/* Base shadow/bottom of cylinder */}
        <div className="absolute bottom-2 w-24 h-10 bg-[#7c3aed] rounded-[50%]"></div>
        
        {/* Platform top */}
        <div className="absolute bottom-4 w-24 h-10 bg-[#e9d5ff] rounded-[50%] border-b-[4px] border-[#000] flex items-center justify-center shadow-inner">
            {/* Bright core */}
            <div className="w-14 h-6 bg-white rounded-[50%] shadow-[0_0_15px_#d8b4fe]"></div>
        </div>
        
        {/* Hovering Crystal/Icon */}
        <motion.div 
          animate={{ y: [-6, 6, -6] }} 
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          className="relative z-10 w-12 h-12 bg-red-700 rounded-xl flex items-center justify-center shadow-[0_8px_15px_rgba(34,197,94,0.4)] border-[3px] border-white rotate-45 mb-10"
        >
           <div className="-rotate-45 bg-black w-4 h-4 rounded-sm shadow-sm"></div>
        </motion.div>
      </div>
    );
  }

  // locked or completed
  return (
    <div className="relative w-28 h-20 flex flex-col items-center justify-end group mt-2 cursor-pointer transition-transform duration-200 hover:-translate-y-1">
      {/* Base platform shadow (bottom of cylinder) */}
      <div className="absolute bottom-0 w-24 h-10 bg-[#cbd5e1] rounded-[50%]"></div>
      
      {/* Top platform */}
      <div className={`absolute bottom-2 w-24 h-10 rounded-[50%] flex items-center justify-center border-b-[2px] border-black/5 ${state === 'completed' ? 'bg-[#dcfce7]' : 'bg-[#e2e8f0]'}`}>
         {/* Inner ring */}
         <div className={`w-14 h-5 rounded-[50%] border-[2px] ${state === 'completed' ? 'border-[#86efac]' : 'border-white/60'}`}></div>
      </div>
      
      {/* Lock Icon */}
      {state === 'locked' && (
        <div className="absolute bottom-6 text-gray-400/80 drop-shadow-sm">
          <Lock size={20} />
        </div>
      )}
    </div>
  );
};

export const Map = ({ skillsData = [] }) => {
  const [playClick] = useSound(clickSoundUrl, { volume: 0.5 });
  const [selectedLevel, setSelectedLevel] = useState(null);
  const activeNodeRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user?._id ?? user?.id ?? 'guest';
  const progress = getLearnProgress(userId);

  useEffect(() => {
    // Scroll to the active node automatically on load
    const timer = setTimeout(() => {
      if (activeNodeRef.current) {
        activeNodeRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 300); // short delay to ensure DOM is painted
    
    return () => clearTimeout(timer);
  }, []);

  if (!skillsData || skillsData.length === 0) {
    return <div className="p-8 text-center text-gray-500">No skills available to display.</div>;
  }

  return (
    <div className="w-full max-w-[1000px] mx-auto py-8 px-4 flex flex-col-reverse items-center relative">
      
      {skillsData.map((skill, skillIndex) => {
        
        const skillProgress = progress.skills?.[skill.id] ?? {};
        const unlockedLevelId = skillProgress.unlockedLevelId ?? skill.levels[0]?.id;
        const levelsWithStatus = skill.levels.map((lvl, idx) => ({
          ...lvl,
          skillId: skill.id,
          status: skillProgress.levels?.[lvl.id]?.completed
            ? 'completed'
            : Number(lvl.id) <= Number(unlockedLevelId)
              ? 'active'
              : 'locked',
          title: lvl.title || (idx === 0 ? "The Baseline" : idx === 1 ? "Recognizing Changes" : "Advanced Assessment")
        }));

        const exerciseCount = levelsWithStatus.reduce((total, level) => {
          const groups = level.exercises ?? {};
          return total + Object.values(groups).reduce(
            (count, value) => count + (Array.isArray(value) ? value.length : value ? 1 : 0),
            0
          ) + (level.mission ? 1 : 0);
        }, 0);

        return (
          <div key={skill.id || skillIndex} className="w-full flex flex-col md:flex-row mb-24 md:items-end md:justify-center relative">
            
            {/* Skill Card (Desktop Left / Mobile Bottom) */}
            <div className="w-full md:w-[340px] md:sticky md:bottom-24 bg-white rounded-[20px] p-6 mb-12 md:mb-0 md:mr-16 shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-gray-100 shrink-0">
              <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mb-5">
                 <BookOpen className="text-purple-600" size={32} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{skill.name}</h2>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                {skill.keyLesson || 'Master the fundamentals of observing behavior and understanding psychological baselines.'}
              </p>
              <div className="flex items-center gap-5 text-sm font-semibold text-gray-600">
                 <div className="flex items-center gap-1.5"><BookOpen size={16}/> {levelsWithStatus.length} Levels</div>
                 <div className="flex items-center gap-1.5"><Dumbbell size={16}/> {exerciseCount} Exercises</div>
              </div>
            </div>
            
            {/* Path Column */}
            <div className="flex-1 flex flex-col items-center max-w-[320px]">
              
              {/* Path Nodes (Reversed for Bottom-to-Up) */}
              <div className="relative flex flex-col-reverse items-center w-full">
                
                {/* Topic Pill (Black Card at the BOTTOM of the levels) */}
                <div className="w-full mb-12 mt-6 z-20">
                  <div className="bg-[#1e293b] rounded-2xl border-2 border-purple-500 py-3 px-4 flex flex-col items-center shadow-lg">
                    <span className="text-[11px] font-bold text-purple-400 tracking-[0.2em] uppercase mb-1">
                      Level {skillIndex + 1}
                    </span>
                    <h3 className="text-[15px] font-bold text-white text-center">{skill.name}</h3>
                  </div>
                </div>

                {levelsWithStatus.map((level, levelIndex) => {
                  const isLocked = level.status === 'locked';
                  const isActive = level.status === 'active';
                  const isEven = levelIndex % 2 === 0;
                  
                  return (
                    <div 
                      key={level.id || levelIndex} 
                      className="relative flex flex-col items-center w-full mb-10 mt-4"
                      ref={isActive ? activeNodeRef : null}
                    >
                      <div 
                        className={`flex items-center gap-8 cursor-pointer group w-full ${isEven ? 'flex-row' : 'flex-row-reverse'}`}
                        onClick={() => {
                          if (!isLocked) {
                            playClick();
                            setSelectedLevel(level);
                          }
                        }}
                      >
                         {/* Node illustration */}
                         <div className="w-32 flex justify-center shrink-0">
                            <IsometricNode state={level.status} />
                         </div>

                         {/* Text alongside node */}
                         <div className={`flex-1 ${isEven ? 'pr-4 text-left' : 'pl-4 text-right'}`}>
                            <span className={`text-[15px] font-bold transition-colors ${isActive ? 'text-gray-900' : isLocked ? 'text-gray-400' : 'text-gray-600 group-hover:text-gray-900'}`}>
                              {level.title}
                            </span>
                         </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}

      {/* Bottom Sheet / Floating Start Card */}
      <AnimatePresence>
        {selectedLevel && (
          <motion.div 
            initial={{ y: 120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 120, opacity: 0 }}
            className="fixed bottom-20 left-0 right-0 px-4 z-40 flex justify-center pointer-events-none"
          >
            <div className="bg-[#1e293b] text-white w-full max-w-md rounded-[20px] p-5 shadow-[0_10px_40px_rgba(0,0,0,0.3)] pointer-events-auto flex flex-col border border-gray-700/50">
               <div className="flex justify-between items-center mb-4">
                 <h3 className="text-lg font-bold">{selectedLevel.title}</h3>
                 <button onClick={() => setSelectedLevel(null)} className="text-gray-400 hover:text-white bg-white/10 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">&times;</button>
               </div>
               <button 
                  onClick={() => {
                    playClick();
                    const levelProgress = getLevelProgress(userId, selectedLevel.skillId, selectedLevel.id);
                    saveLevelProgress(userId, selectedLevel.skillId, selectedLevel.id, levelProgress);
                    navigate(`/learn/${selectedLevel.skillId}/level/${selectedLevel.id}`);
                  }}
                  className="w-full bg-[#a855f7] hover:bg-[#9333ea] text-white font-bold py-3.5 rounded-xl transition-all active:scale-95 text-[17px]"
               >
                 Start
               </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Map;
