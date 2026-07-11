import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Introduction from "../components/Learn.components/Intro";
import MultipleChoice from "../components/Learn.components/Mcq";
import Mission from "../components/Learn.components/Mission";
import Sort from "../components/Learn.components/sort";
import Tags from "../components/Learn.components/Tags";
import { playSound } from "../assets/soundEffects";
import { useAuth } from "../context/AuthContext";
import { completeLevel, getLevelProgress, saveLevelProgress } from "../utils/learnProgress";
import { getLevelById } from "../SKILLS/SKILLS.JS";

const createExerciseSequence = (level) => {
  if (!level) return [];
  const exercises = level.exercises ?? {};
  return [
    exercises.introduction,
    ...(exercises.multipleChoice ?? []),
    ...(exercises.observation ?? []),
    ...(exercises.compare ?? []),
    ...(exercises.expertThinking ?? []),
    level.mission,
  ].filter(Boolean);
};

const UnsupportedExercise = ({ type }) => (
  <div className="m-8 rounded-3xl border border-rose-200 bg-rose-50 p-8 text-center">
    <h2 className="font-bold text-rose-900">Unsupported exercise type</h2>
    <code className="text-rose-700">{String(type)}</code>
  </div>
);

const ExercisePlayer = ({ skillId, levelId, userId }) => {
  const navigate = useNavigate();
  const found = useMemo(() => getLevelById(skillId, levelId), [skillId, levelId]);
  const exercises = useMemo(() => createExerciseSequence(found?.level), [found]);
  const initialProgress = useMemo(
    () => getLevelProgress(userId, skillId, levelId),
    [userId, skillId, levelId],
  );
  const [currentIndex, setCurrentIndex] = useState(initialProgress.exerciseIndex ?? 0);
  const [responses, setResponses] = useState(initialProgress.responses ?? {});

  if (!found) {
    return <div className="min-h-screen grid place-items-center text-slate-600">Level not found.</div>;
  }

  const { skill, level } = found;

  const finishExercise = (result = {}) => {
    const nextIndex = currentIndex + 1;
    const nextResponses = {
      ...responses,
      [exercises[currentIndex].id]: result,
    };
    setResponses(nextResponses);
    setCurrentIndex(nextIndex);
    saveLevelProgress(userId, skill.id, level.id, {
      exerciseIndex: nextIndex,
      responses: nextResponses,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (currentIndex >= exercises.length) {
    return (
      <div className="min-h-screen grid place-items-center bg-slate-50 p-6">
        <section className="max-w-lg w-full bg-white border border-slate-200 rounded-3xl p-9 text-center shadow-sm">
          <div className="text-5xl mb-4">✓</div>
          <h1 className="text-3xl font-extrabold text-slate-900">Level complete!</h1>
          <p className="mt-3 text-slate-500">Your progress has been saved on this device.</p>
          <button type="button" onClick={() => {
            playSound("complete");
            completeLevel(userId, skill, level);
            navigate("/learn");
          }} className="mt-7 w-full rounded-xl bg-purple-600 text-white font-bold py-3.5">
            Return to map
          </button>
        </section>
      </div>
    );
  }

  const exercise = exercises[currentIndex];
  const progress = ((currentIndex + 1) / exercises.length) * 100;
  let content;
  if (exercise.type === "introduction") content = <Introduction key={exercise.id} intro={exercise} next={finishExercise} />;
  else if (["multipleChoice", "multiselect", "choice", "compare"].includes(exercise.type)) content = <MultipleChoice key={exercise.id} data={exercise} next={finishExercise} />;
  else if (exercise.type === "tag") content = <Tags key={exercise.id} data={exercise} next={finishExercise} />;
  else if (exercise.type === "sort") content = <Sort key={exercise.id} data={exercise} next={finishExercise} />;
  else if (exercise.type === "mission") content = <Mission key={exercise.id} data={exercise} next={finishExercise} />;
  else content = <UnsupportedExercise type={exercise.type} />;

  return (
    <div className="w-full min-h-screen bg-slate-50 flex flex-col">
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
        <div className="h-1.5 bg-slate-100">
          <div className="h-full bg-purple-600 transition-all" style={{ width: `${progress}%` }} />
        </div>
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <button type="button" onClick={() => navigate("/learn")} className="text-slate-500 hover:text-slate-900">✕</button>
          <span className="font-bold text-slate-700">{level.title}</span>
          <span className="text-xs font-bold text-slate-400">{currentIndex + 1} / {exercises.length}</span>
        </div>
      </header>
      <main className="flex-1 w-full max-w-4xl mx-auto flex flex-col">{content}</main>
    </div>
  );
};

const ExerciseContainer = () => {
  const { skillId, levelId } = useParams();
  const { user } = useAuth();
  const userId = user?._id ?? user?.id ?? "guest";
  return <ExercisePlayer key={`${userId}:${skillId}:${levelId}`} skillId={skillId} levelId={levelId} userId={userId} />;
};

export default ExerciseContainer;
