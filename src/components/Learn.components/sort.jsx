import { useState } from "react";
import { ArrowDown, ArrowUp, GripVertical } from "lucide-react";
import { playSound, unlockAudio } from "../../assets/soundEffects";

const Sort = ({ data, next, deferFeedback = false }) => {
  const [orderedItems, setOrderedItems] = useState(() => [...data.items].reverse());
  const [submitted, setSubmitted] = useState(false);

  const move = (index, offset) => {
    if (submitted) return;
    const target = index + offset;
    if (target < 0 || target >= orderedItems.length) return;
    unlockAudio();
    playSound("tap");
    setOrderedItems((current) => {
      const copy = [...current];
      [copy[index], copy[target]] = [copy[target], copy[index]];
      return copy;
    });
  };

  const attempts = orderedItems.map((item, index) => ({
    itemId: item.id,
    selectedPosition: index + 1,
    correctPosition: item.correctPosition,
    isCorrect: item.correctPosition === index + 1,
    feedback: item.feedback,
  }));
  const result = {
    exerciseId: data.id,
    type: data.type,
    orderedIds: orderedItems.map((item) => item.id),
    isCorrect: attempts.every((attempt) => attempt.isCorrect),
    attempts,
  };

  const submit = () => {
    playSound(result.isCorrect ? "correct" : "incorrect");
    if (deferFeedback) next(result);
    else setSubmitted(true);
  };

  return (
    <div className="p-4 md:p-8 flex-1 flex items-center">
      <section className="w-full bg-white border border-slate-200 rounded-3xl shadow-sm p-6 md:p-9">
        <p className="text-xs font-bold uppercase tracking-wider text-purple-700 mb-3">Put in order</p>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">{data.title}</h1>
        {data.narration && <p className="mt-3 text-slate-500">{data.narration}</p>}
        <h2 className="mt-5 mb-4 font-bold text-slate-900">{data.instruction}</h2>

        <div className="space-y-3">
          {orderedItems.map((item, index) => {
            const correct = item.correctPosition === index + 1;
            return (
              <article key={item.id} className={`flex gap-3 rounded-2xl border-2 p-4 ${
                submitted ? (correct ? "border-emerald-400 bg-emerald-50" : "border-rose-300 bg-rose-50") : "border-slate-200"
              }`}>
                <GripVertical className="text-slate-300 shrink-0 mt-1" />
                <div className="flex-1">
                  <div className="flex gap-3">
                    <span className="font-bold text-purple-700">{index + 1}</span>
                    <p className="font-medium text-slate-800">{item.text}</p>
                  </div>
                  {submitted && <p className="mt-2 text-sm text-slate-600">{item.feedback}</p>}
                </div>
                <div className="flex flex-col gap-1">
                  <button aria-label="Move up" type="button" onClick={() => move(index, -1)} disabled={submitted || index === 0} className="p-1 disabled:opacity-25"><ArrowUp size={18} /></button>
                  <button aria-label="Move down" type="button" onClick={() => move(index, 1)} disabled={submitted || index === orderedItems.length - 1} className="p-1 disabled:opacity-25"><ArrowDown size={18} /></button>
                </div>
              </article>
            );
          })}
        </div>

        <button type="button" onClick={submitted ? () => {
          playSound("continueEnabled");
          next(result);
        } : submit}
          className="mt-6 w-full rounded-xl bg-purple-600 text-white font-bold py-3.5">
          {submitted ? "Continue" : "Check order"}
        </button>
      </section>
    </div>
  );
};

export default Sort;
