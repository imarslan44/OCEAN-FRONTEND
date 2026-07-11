import { useState } from "react";
import { BookOpenCheck, Flag, Lightbulb } from "lucide-react";
import MultipleChoice from "./Mcq";
import Tags from "./Tags";
import Sort from "./sort";
import { playSound, unlockAudio } from "../../assets/soundEffects";

const Mission = ({ data, next }) => {
  const [started, setStarted] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [results, setResults] = useState([]);

  const finishStep = (result) => {
    setResults((current) => [...current, { ...result, stepId: data.steps[stepIndex].id }]);
    setStepIndex((current) => current + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const beginMission = () => {
    unlockAudio();
    playSound("tap");
    setStarted(true);
  };

  const completeMission = () => {
    playSound("complete");
    const misses = results.flatMap((result) => result.attempts ?? []).filter((attempt) => !attempt.isCorrect);
    next({ exerciseId: data.id, type: data.type, results, isCorrect: misses.length === 0 });
  };

  if (!started) {
    return (
      <div className="p-4 md:p-8 flex-1 flex items-center">
        <section className="w-full rounded-3xl bg-slate-900 text-white p-7 md:p-10 shadow-xl">
          <div className="flex items-center gap-2 text-purple-300 text-xs font-bold uppercase tracking-widest mb-4">
            <Flag size={18} /> Mission
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold">{data.title}</h1>
          <p className="mt-5 text-slate-300 leading-relaxed text-lg">{data.story}</p>
          <div className="mt-6 p-5 rounded-2xl bg-white/10 border border-white/10">
            <span className="font-bold text-purple-200">Objective</span>
            <p className="mt-1 text-slate-200">{data.objective}</p>
          </div>
          <button type="button" onClick={beginMission} className="mt-7 w-full rounded-xl bg-purple-500 hover:bg-purple-400 py-4 font-bold">
            Begin mission
          </button>
        </section>
      </div>
    );
  }

  if (stepIndex >= data.steps.length) {
    const misses = results.flatMap((result) => result.attempts ?? []).filter((attempt) => !attempt.isCorrect);
    const notebook = results.flatMap((result) => result.attempts ?? []).filter((attempt) => attempt.isCorrect);
    return (
      <div className="p-4 md:p-8 flex-1 flex items-center">
        <section className="w-full bg-white border border-slate-200 rounded-3xl shadow-sm p-7 md:p-10">
          <div className="flex items-center gap-2 text-emerald-700 font-bold uppercase tracking-wider text-xs mb-3">
            <BookOpenCheck size={18} /> Mission debrief
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">{data.debrief.title}</h1>
          <p className="mt-4 text-slate-600 leading-relaxed">{data.debrief.summary}</p>
          <div className="mt-6 rounded-2xl bg-purple-50 border border-purple-100 p-5">
            <div className="flex gap-2 font-bold text-purple-900"><Lightbulb size={20} /> Key lesson</div>
            <p className="mt-2 text-purple-900">{data.debrief.keyLesson}</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-3 mt-5">
            <div className="rounded-2xl bg-emerald-50 p-4 text-emerald-900">
              <p className="font-bold">Notebook</p>
              <p className="text-sm mt-1">{notebook.length} correct decisions recorded</p>
            </div>
            <div className="rounded-2xl bg-amber-50 p-4 text-amber-950">
              <p className="font-bold">Review</p>
              <p className="text-sm mt-1">{misses.length} decisions to revisit</p>
            </div>
          </div>
          {misses.length > 0 && (
            <div className="mt-5 space-y-2">
              {misses.map((miss, index) => (
                <p key={`${miss.itemId}-${index}`} className="rounded-xl bg-slate-50 border border-slate-200 p-3 text-sm text-slate-600">
                  {miss.feedback}
                </p>
              ))}
            </div>
          )}
          <p className="mt-5 text-sm font-semibold text-slate-500">Unlocked: {data.debrief.unlockedSkill}</p>
          <button type="button" onClick={completeMission}
            className="mt-6 w-full rounded-xl bg-purple-600 text-white font-bold py-3.5">
            Complete mission
          </button>
        </section>
      </div>
    );
  }

  const step = data.steps[stepIndex];
  const props = { key: step.id, data: step, next: finishStep, deferFeedback: true };
  return (
    <div>
      <div className="px-6 pt-5 text-xs font-bold uppercase tracking-wider text-slate-400">
        Mission step {stepIndex + 1} of {data.steps.length}
      </div>
      {(step.type === "choice" || step.type === "multiselect") && <MultipleChoice {...props} />}
      {step.type === "tag" && <Tags {...props} />}
      {step.type === "sort" && <Sort {...props} />}
    </div>
  );
};

export default Mission;
