const VISITED_KEY = "world_to_go_visited_country_ids";
const PLANNED_KEY = "world_to_go_planned_country_ids";
const TRAVEL_STATE_KEY = "world_to_go_travel_state";
const TRAVEL_SEEDED_ONCE_KEY = "world_to_go_travel_seeded_once";
const ACTIVE_USER_KEY = "world_to_go_active_user_email";
const GUEST_USER = "guest";
const DEFAULT_VISITED_IDS = ["JPN", "FRA", "ARE"];
const DEFAULT_PLANNED_IDS = ["CAN", "AUS"];
const RANDOM_VISITED_COUNT = 3;
const RANDOM_PLANNED_COUNT = 2;

const getNormalizedUserKey = (email) => {
  if (!email || typeof email !== "string") return GUEST_USER;
  return email.trim().toLowerCase() || GUEST_USER;
};

const getScopedKey = (baseKey, email) => {
  const userKey = getNormalizedUserKey(email ?? getActiveUserEmail());
  return `${baseKey}::${userKey}`;
};

const parseIds = (raw) => {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item) => typeof item === "string" && item.trim());
  } catch {
    return [];
  }
};

const readTravelState = () => {
  try {
    const raw = localStorage.getItem(TRAVEL_STATE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return {
      visited: Array.isArray(parsed?.visited)
        ? parsed.visited.filter((v) => typeof v === "string" && v.trim())
        : [],
      planned: Array.isArray(parsed?.planned)
        ? parsed.planned.filter((v) => typeof v === "string" && v.trim())
        : [],
    };
  } catch {
    return null;
  }
};

const seedDefaultTravelState = () => {
  localStorage.setItem(
    TRAVEL_STATE_KEY,
    JSON.stringify({
      visited: DEFAULT_VISITED_IDS,
      planned: DEFAULT_PLANNED_IDS,
    }),
  );
  localStorage.setItem(VISITED_KEY, JSON.stringify(DEFAULT_VISITED_IDS));
  localStorage.setItem(PLANNED_KEY, JSON.stringify(DEFAULT_PLANNED_IDS));
  localStorage.setItem(TRAVEL_SEEDED_ONCE_KEY, "1");
};

const shouldSeedFromEmptyState = (state) => {
  if (!state) return false;
  const hasVisited = Array.isArray(state.visited) && state.visited.length > 0;
  const hasPlanned = Array.isArray(state.planned) && state.planned.length > 0;
  if (hasVisited || hasPlanned) return false;
  return localStorage.getItem(TRAVEL_SEEDED_ONCE_KEY) !== "1";
};

const writeTravelState = (visited, planned) => {
  const normalizedVisited = Array.from(new Set(visited));
  const normalizedPlanned = Array.from(new Set(planned));
  localStorage.setItem(
    TRAVEL_STATE_KEY,
    JSON.stringify({ visited: normalizedVisited, planned: normalizedPlanned }),
  );
  localStorage.setItem(VISITED_KEY, JSON.stringify(normalizedVisited));
  localStorage.setItem(PLANNED_KEY, JSON.stringify(normalizedPlanned));
  window.dispatchEvent(new Event("travel-storage-updated"));
};

const normalizeCountryId = (country) => {
  const rawId = country?.cca3 || country?.cca2 || country?.name?.common;
  if (!rawId || typeof rawId !== "string") return "";
  return rawId.trim().toUpperCase();
};

const pickRandomUnique = (items, count) => {
  const pool = [...items];
  const picked = [];
  while (pool.length && picked.length < count) {
    const randomIndex = Math.floor(Math.random() * pool.length);
    picked.push(pool[randomIndex]);
    pool.splice(randomIndex, 1);
  }
  return picked;
};

const saveIds = (key, ids) => {
  localStorage.setItem(key, JSON.stringify(Array.from(new Set(ids))));
  window.dispatchEvent(new Event("travel-storage-updated"));
};

const readWithMigration = (baseKey) => {
  const directRaw = localStorage.getItem(baseKey);
  if (directRaw !== null) {
    return parseIds(directRaw);
  }

  const currentScoped = parseIds(localStorage.getItem(getScopedKey(baseKey)));
  if (currentScoped.length) {
    saveIds(baseKey, currentScoped);
    return currentScoped;
  }

  const guestScoped = parseIds(
    localStorage.getItem(`${baseKey}::${GUEST_USER}`),
  );
  if (guestScoped.length) {
    saveIds(baseKey, guestScoped);
    return guestScoped;
  }

  return [];
};

export const getActiveUserEmail = () =>
  localStorage.getItem(ACTIVE_USER_KEY) || "";

export const setActiveUserEmail = (email) => {
  const normalized = getNormalizedUserKey(email);
  if (normalized === GUEST_USER) {
    localStorage.removeItem(ACTIVE_USER_KEY);
  } else {
    localStorage.setItem(ACTIVE_USER_KEY, normalized);
  }
  window.dispatchEvent(new Event("travel-storage-updated"));
};

export const clearActiveUserEmail = () => {
  localStorage.removeItem(ACTIVE_USER_KEY);
  window.dispatchEvent(new Event("travel-storage-updated"));
};

export const setTravelState = (visitedIds = [], plannedIds = []) => {
  writeTravelState(visitedIds, plannedIds);
  localStorage.setItem(TRAVEL_SEEDED_ONCE_KEY, "1");
};

export const seedRandomTravelState = (countries = []) => {
  const normalizedIds = Array.from(
    new Set(countries.map(normalizeCountryId).filter(Boolean)),
  );

  if (!normalizedIds.length) {
    seedDefaultTravelState();
    return {
      visited: [...DEFAULT_VISITED_IDS],
      planned: [...DEFAULT_PLANNED_IDS],
    };
  }

  const visited = pickRandomUnique(
    normalizedIds,
    Math.min(RANDOM_VISITED_COUNT, normalizedIds.length),
  );
  const remaining = normalizedIds.filter((id) => !visited.includes(id));
  const planned = pickRandomUnique(
    remaining,
    Math.min(RANDOM_PLANNED_COUNT, remaining.length),
  );

  setTravelState(visited, planned);
  return { visited, planned };
};

export const getVisitedIds = () => {
  const state = readTravelState();
  if (state) {
    if (shouldSeedFromEmptyState(state)) {
      seedDefaultTravelState();
      return [...DEFAULT_VISITED_IDS];
    }
    return state.visited;
  }

  const visited = readWithMigration(VISITED_KEY);
  const planned = readWithMigration(PLANNED_KEY);

  if (visited.length || planned.length) {
    writeTravelState(visited, planned);
    return visited;
  }

  seedDefaultTravelState();
  return [...DEFAULT_VISITED_IDS];
};

export const getPlannedIds = () => {
  const state = readTravelState();
  if (state) {
    if (shouldSeedFromEmptyState(state)) {
      seedDefaultTravelState();
      return [...DEFAULT_PLANNED_IDS];
    }
    return state.planned;
  }

  const visited = readWithMigration(VISITED_KEY);
  const planned = readWithMigration(PLANNED_KEY);

  if (visited.length || planned.length) {
    writeTravelState(visited, planned);
    return planned;
  }

  seedDefaultTravelState();
  return [...DEFAULT_PLANNED_IDS];
};

export const isVisited = (countryId) => getVisitedIds().includes(countryId);

export const isPlanned = (countryId) => getPlannedIds().includes(countryId);

export const toggleVisited = (countryId) => {
  const travelState = readTravelState();
  const current = new Set(travelState?.visited || getVisitedIds());
  const planned = travelState?.planned || getPlannedIds();
  if (current.has(countryId)) {
    current.delete(countryId);
  } else {
    current.add(countryId);
  }
  writeTravelState([...current], planned);
  return current.has(countryId);
};

export const togglePlanned = (countryId) => {
  const travelState = readTravelState();
  const visited = travelState?.visited || getVisitedIds();
  const current = new Set(travelState?.planned || getPlannedIds());
  if (current.has(countryId)) {
    current.delete(countryId);
  } else {
    current.add(countryId);
  }
  writeTravelState(visited, [...current]);
  return current.has(countryId);
};

export const removeVisited = (countryId) => {
  const travelState = readTravelState();
  const current = new Set(travelState?.visited || getVisitedIds());
  const planned = travelState?.planned || getPlannedIds();
  current.delete(countryId);
  writeTravelState([...current], planned);
};

export const removePlanned = (countryId) => {
  const travelState = readTravelState();
  const visited = travelState?.visited || getVisitedIds();
  const current = new Set(travelState?.planned || getPlannedIds());
  current.delete(countryId);
  writeTravelState(visited, [...current]);
};
