import { useState } from "react";
import { playSound } from "../../assets/soundEffects";
import ScenarioStage, { ScenarioReview } from "./ScenarioStage";

const Tags = ({ data, next, deferFeedback = false }) => {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [scenarioRead, setScenarioRead] = useState(!data.scenario);
  const complete = data.items.every((item) => answers[item.id]);
  const attempts = data.items.map((item) => ({
    itemId: item.id,
    selectedLabel: answers[item.id],
    correctLabel: item.correctLabel,
    isCorrect: answers[item.id] === item.correctLabel,
    feedback: item.feedback,
  }));
  const result = {
    exerciseId: data.id,
    type: data.type,
    answers,
    isCorrect: attempts.every((attempt) => attempt.isCorrect),
    attempts,
  };

  const submit = () => {
    if (!complete) return;
    playSound(result.isCorrect ? "correct" : "incorrect");
    if (deferFeedback) next(result);
    else setSubmitted(true);
  };

  if (!scenarioRead) {
    return (
      <ScenarioStage
        title={data.title}
        narration={data.narration}
        scenario={data.scenario}
        buttonLabel="I've observed the scene"
        onContinue={() => setScenarioRead(true)}
      />
    );
  }

  return (
    <div className="p-0 md:p-8 flex-1 flex">
      <section className="min-h-[calc(100dvh-58px)] md:min-h-0 w-full bg-white border-0 md:border border-slate-200 rounded-none md:rounded-3xl shadow-none md:shadow-sm p-6 md:p-9 flex flex-col">
        <div>
        <p className="text-xs font-bold uppercase tracking-wider text-purple-700 mb-3">Tag each observation</p>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">{data.title}</h1>
        {data.narration && <p className="mt-3 text-slate-500">{data.narration}</p>}
        <ScenarioReview scenario={data.scenario} />
        <h2 className="mt-6 mb-4 font-bold text-slate-900">{data.instruction}</h2>
        </div>

        <div className="space-y-4 mt-auto">
          {data.items.map((item) => (
            <article key={item.id} className="rounded-2xl border border-slate-200 p-4">
              <p className="font-medium text-slate-800 mb-3">{item.text}</p>
              <div className="flex flex-wrap gap-2">
                {data.labels.map((label) => {
                  const selected = answers[item.id] === label;
                  const correct = submitted && item.correctLabel === label;
                  const wrong = submitted && selected && !correct;
                  return (
                    <button
                      type="button"
                      key={label}
                      disabled={submitted}
                      onClick={() => {
                        playSound("tap");
                        setAnswers((current) => ({ ...current, [item.id]: label }));
                      }}
                      className={`px-4 py-2 rounded-full border font-semibold capitalize ${
                        correct ? "bg-emerald-50 border-emerald-500 text-emerald-800" :
                        wrong ? "bg-rose-50 border-rose-400 text-rose-700" :
                        selected ? "bg-purple-100 border-purple-500 text-purple-800" :
                        "bg-white border-slate-300 text-slate-600"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
              {submitted && <p className="mt-3 text-sm text-slate-600">{item.feedback}</p>}
            </article>
          ))}
        </div>

        <button type="button" disabled={!complete} onClick={submitted ? () => {
          playSound("continueEnabled");
          next(result);
        } : submit}
          className="mt-6 w-full rounded-xl bg-purple-600 disabled:bg-slate-300 text-white font-bold py-3.5 shrink-0">
          {submitted ? "Continue" : "Check answers"}
        </button>
      </section>
    </div>
  );
};

export default Tags;
