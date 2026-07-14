import { Eye, FileText } from "lucide-react";
import { playSound } from "../../assets/soundEffects";

export const ScenarioReview = ({ scenario, sceneA, sceneB }) => {
  if (!scenario && !sceneA && !sceneB) return null;

  return (
    <details className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 group">
      <summary className="cursor-pointer list-none px-5 py-4 font-semibold text-slate-700 flex items-center justify-between">
        <span>Review scenario</span>
        <span className="text-purple-600 text-sm group-open:hidden">Show</span>
        <span className="text-purple-600 text-sm hidden group-open:inline">Hide</span>
      </summary>
      <div className="px-5 pb-5">
        <ScenarioContent scenario={scenario} sceneA={sceneA} sceneB={sceneB} compact />
      </div>
    </details>
  );
};

const ScenarioContent = ({ scenario, sceneA, sceneB, compact = false }) => (
  <div className={sceneA || sceneB ? "grid md:grid-cols-2 gap-3" : ""}>
    {[sceneA, sceneB].filter(Boolean).map((scene) => (
      <article key={scene.title} className={`rounded-2xl border border-slate-200 bg-white ${compact ? "p-4" : "p-5"}`}>
        <h2 className="font-bold text-slate-800 mb-2">{scene.title}</h2>
        <p className="text-slate-600 leading-relaxed">{scene.description}</p>
      </article>
    ))}
    {scenario && (
      <div className={`rounded-2xl bg-purple-50 border border-purple-100 text-slate-700 leading-relaxed ${compact ? "p-4" : "p-6"}`}>
        {scenario}
      </div>
    )}
  </div>
);

const ScenarioStage = ({ title, narration, objective, scenario, sceneA, sceneB, buttonLabel, onContinue }) => {
  const continueToQuestion = () => {
    playSound("continueEnabled");
    onContinue();
  };

  return (
    <div className="p-0 md:p-8 flex-1 flex">
      <section className="min-h-[calc(100dvh-100px)] md:min-h-0 w-full bg-white border-0 md:border border-slate-200 rounded-none md:rounded-3xl shadow-none md:shadow-sm p-6 md:p-9 flex flex-col">
        <div className="flex items-center gap-2 text-purple-700 text-xs font-bold uppercase tracking-wider mb-3">
          <Eye size={17} /> Observe first
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">{title}</h1>
        {narration && <p className="mt-3 text-slate-500">{narration}</p>}
        {objective && <p className="mt-3 text-sm text-slate-500">{objective}</p>}
        <div className="mt-6 flex-1">
          <ScenarioContent scenario={scenario} sceneA={sceneA} sceneB={sceneB} />
        </div>
        <button type="button" onClick={continueToQuestion}
          className="mt-7 w-full rounded-xl bg-purple-600 text-white font-bold py-3.5 transition hover:bg-purple-700 inline-flex justify-center items-center gap-2 shrink-0">
          <FileText size={19} /> {buttonLabel}
        </button>
      </section>
    </div>
  );
};

export default ScenarioStage;
