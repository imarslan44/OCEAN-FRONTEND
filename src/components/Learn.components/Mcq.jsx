import { useMemo, useState } from "react";
import { CheckCircle2, Circle, Layers3 } from "lucide-react";
import { playSound, unlockAudio } from "../../assets/soundEffects";

const getChoiceData = (data) => ({
  options: data?.input?.options ?? data?.options ?? [],
  scenario: data?.input?.scenario ?? data?.scenario,
  question: data?.input?.question ?? data?.instruction ?? data?.interaction,
  sceneA: data?.input?.sceneA,
  sceneB: data?.input?.sceneB,
});

const MultipleChoice = ({ data, next, deferFeedback = false }) => {
  const { options, scenario, question, sceneA, sceneB } = getChoiceData(data);
  const isMultiSelect =
    data?.type === "multiselect" ||
    data?.isMultiSelect === true ||
    options.filter((option) => option.isCorrect).length > 1;
  const [selectedIds, setSelectedIds] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  const correctIds = useMemo(
    () => options.filter((option) => option.isCorrect).map((option) => option.id),
    [options],
  );

  const isCorrect =
    selectedIds.length === correctIds.length &&
    selectedIds.every((id) => correctIds.includes(id));

  const toggleOption = (id) => {
    if (submitted) return;
    unlockAudio();
    playSound("tap");
    setSelectedIds((current) =>
      isMultiSelect
        ? current.includes(id)
          ? current.filter((selectedId) => selectedId !== id)
          : [...current, id]
        : [id],
    );
  };

  const result = {
    exerciseId: data.id,
    type: data.type,
    selectedIds,
    correctIds,
    isCorrect,
    attempts: selectedIds.map((id) => {
      const option = options.find((item) => item.id === id);
      return { itemId: id, isCorrect: Boolean(option?.isCorrect), feedback: option?.feedback };
    }),
  };

  const submit = () => {
    if (!selectedIds.length) return;
    playSound(isCorrect ? "correct" : "incorrect");
    if (deferFeedback) {
      next(result);
      return;
    }
    setSubmitted(true);
  };

  return (
    <div className="p-4 md:p-8 flex-1 flex items-center">
      <section className="w-full bg-white border border-slate-200 rounded-3xl shadow-sm p-6 md:p-9">
        <div className="flex items-center gap-2 text-purple-700 text-xs font-bold uppercase tracking-wider mb-3">
          <Layers3 size={17} />
          {isMultiSelect ? "Select all that apply" : "Choose one answer"}
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">{data.title}</h1>
        {data.narration && <p className="mt-3 text-slate-500">{data.narration}</p>}
        {data.objective && <p className="mt-3 text-sm text-slate-500">{data.objective}</p>}

        {(sceneA || sceneB) && (
          <div className="grid md:grid-cols-2 gap-3 mt-6">
            {[sceneA, sceneB].filter(Boolean).map((scene) => (
              <article key={scene.title} className="rounded-2xl bg-slate-50 border border-slate-200 p-5">
                <h2 className="font-bold text-slate-800 mb-2">{scene.title}</h2>
                <p className="text-slate-600 leading-relaxed">{scene.description}</p>
              </article>
            ))}
          </div>
        )}
        {scenario && (
          <div className="mt-6 rounded-2xl bg-purple-50 border border-purple-100 p-5 text-slate-700 leading-relaxed">
            {scenario}
          </div>
        )}
        {question && <h2 className="mt-6 mb-4 text-lg font-bold text-slate-900">{question}</h2>}

        <div className="space-y-3">
          {options.map((option) => {
            const selected = selectedIds.includes(option.id);
            const showCorrect = submitted && option.isCorrect;
            const showWrong = submitted && selected && !option.isCorrect;
            return (
              <button
                type="button"
                key={option.id}
                onClick={() => toggleOption(option.id)}
                className={`w-full text-left rounded-2xl border-2 p-4 transition ${
                  showCorrect
                    ? "border-emerald-500 bg-emerald-50"
                    : showWrong
                      ? "border-rose-400 bg-rose-50"
                      : selected
                        ? "border-purple-500 bg-purple-50"
                        : "border-slate-200 hover:border-purple-300"
                }`}
                aria-pressed={selected}
              >
                <div className="flex gap-3">
                  {selected ? <CheckCircle2 className="text-purple-600 shrink-0" /> : <Circle className="text-slate-300 shrink-0" />}
                  <span className="font-medium text-slate-800">{option.text}</span>
                </div>
                {submitted && (selected || option.isCorrect) && (
                  <p className="ml-9 mt-2 text-sm text-slate-600">{option.feedback}</p>
                )}
              </button>
            );
          })}
        </div>

        {submitted && data.output?.keyLesson && (
          <div className="mt-5 rounded-2xl bg-amber-50 border border-amber-200 p-4 text-amber-950">
            <span className="font-bold">Key lesson: </span>{data.output.keyLesson}
          </div>
        )}

        <button
          type="button"
          disabled={!selectedIds.length}
          onClick={submitted ? () => {
            playSound("continueEnabled");
            next(result);
          } : submit}
          className="mt-6 w-full rounded-xl bg-purple-600 disabled:bg-slate-300 text-white font-bold py-3.5 transition hover:bg-purple-700"
        >
          {submitted ? "Continue" : "Check answer"}
        </button>
      </section>
    </div>
  );
};

export default MultipleChoice;
