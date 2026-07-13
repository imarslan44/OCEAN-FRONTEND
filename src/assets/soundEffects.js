import clickSound from "./sounds/click.mp3";
import correctSound from "./sounds/correct.mp3";
import levelUpSound from "./sounds/level-up.mp3";
import sortClickSound from "./sounds/sortClick.mp3";
import wrongAnswerSound from "./sounds/wrong_answer.mp3";

// Exercise sounds are local bundled assets. Creating a new Audio instance lets
// rapid taps replay cleanly without relying on Web Audio synthesis or an API.
const sounds = {
  tap: clickSound,
  sort: sortClickSound,
  continueEnabled: clickSound,
  incorrect: wrongAnswerSound,
  correct: correctSound,
  complete: levelUpSound,
};

export function playSound(name) {
  const source = sounds[name];
  if (!source) return;

  try {
    const audio = new Audio(source);
    audio.volume = name === "correct" || name === "complete" ? 0.55 : 0.35;
    void audio.play().catch(() => {
      // Browsers can block audio before a user gesture; the exercise remains usable.
    });
  } catch {
    // Sound is non-essential feedback, so never interrupt the exercise flow.
  }
}
