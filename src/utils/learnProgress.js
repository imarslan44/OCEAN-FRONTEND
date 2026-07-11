const STORAGE_PREFIX = "ocean:learn-progress";

const storageKey = (userId) => `${STORAGE_PREFIX}:${userId || "guest"}`;

export const getLearnProgress = (userId) => {
  try {
    return JSON.parse(localStorage.getItem(storageKey(userId))) || { skills: {} };
  } catch {
    return { skills: {} };
  }
};

export const saveLearnProgress = (userId, progress) => {
  localStorage.setItem(storageKey(userId), JSON.stringify(progress));
  window.dispatchEvent(new CustomEvent("learn-progress-changed"));
  return progress;
};

export const getLevelProgress = (userId, skillId, levelId) =>
  getLearnProgress(userId).skills?.[skillId]?.levels?.[levelId] ?? {
    exerciseIndex: 0,
    responses: {},
    completed: false,
  };

export const saveLevelProgress = (userId, skillId, levelId, levelProgress) => {
  const progress = getLearnProgress(userId);
  const skillProgress = progress.skills[skillId] ?? {
    currentLevelId: levelId,
    unlockedLevelId: 1,
    levels: {},
  };

  progress.skills[skillId] = {
    ...skillProgress,
    currentLevelId: levelId,
    levels: {
      ...skillProgress.levels,
      [levelId]: {
        ...skillProgress.levels?.[levelId],
        ...levelProgress,
      },
    },
  };
  return saveLearnProgress(userId, progress);
};

export const completeLevel = (userId, skill, level) => {
  const progress = getLearnProgress(userId);
  const current = progress.skills[skill.id] ?? { unlockedLevelId: 1, levels: {} };
  const levelIndex = skill.levels.findIndex((item) => String(item.id) === String(level.id));
  const nextLevel = skill.levels[levelIndex + 1];

  progress.skills[skill.id] = {
    ...current,
    currentLevelId: nextLevel?.id ?? level.id,
    unlockedLevelId: nextLevel?.id ?? current.unlockedLevelId ?? level.id,
    levels: {
      ...current.levels,
      [level.id]: {
        ...current.levels?.[level.id],
        completed: true,
      },
    },
  };
  return saveLearnProgress(userId, progress);
};
