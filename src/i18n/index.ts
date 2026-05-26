// ---- Translation keys ----
export type Locale = "en" | "de";

export interface Translations {
  // App / nav
  appTitle: string;
  appSubtitle: string;
  newGame: string;
  backToGames: string;
  back: string;
  cancel: string;
  delete: string;
  save: string;

  // Session picker
  inProgress: string;
  completed: string;
  noSessions: string;
  active: string;
  finished: string;
  rounds: (n: number) => string;
  winner: string;
  deleteConfirm: (players: string) => string;

  // Game setup
  newGameTitle: string;
  newGameSubtitle: (min: number, max: number) => string;
  playerPlaceholder: (n: number) => string;
  addPlayer: string;
  startGame: string;
  minPlayersHint: (n: number) => string;

  // Game board
  roundLabel: (n: number) => string;
  roundsPlayed: (n: number) => string;
  gameOver: string;
  endRound: (n: number) => string;
  winsMessage: (name: string) => string;
  winnerSubtitle: (pts: number) => string;
  roundExplainer: string;
  currentPhases: string;
  phaseDone: string;
  allDone: string;

  // Score modal
  roundScores: (n: number) => string;
  alreadyFinished: string;
  completedGame: string;
  phaseQuestion: string;
  pointsThisRound: string;
  saveRound: string;
  cardCalculator: string;
  manual: string;
  pointsLabel: string;
  ptsEach: (n: number) => string;
  validationTooManyZeros: string;

  // Phase descriptions
  phaseDescriptions: Record<number, string>;

  // Round history
  roundHistory: string;
  noRoundsYet: string;
  phaseCheck: string;
  roundWinner: string;
  lastRound: string;
}

const en: Translations = {
  appTitle: "Phase 10 Tracker",
  appSubtitle: "Track phases, scores, and glory",
  newGame: "+ New Game",
  backToGames: "Games",
  back: "Back",
  cancel: "Cancel",
  delete: "Delete",
  save: "Save",

  inProgress: "In Progress",
  completed: "Completed",
  noSessions: "No saved sessions yet. Start a new game!",
  active: "Active",
  finished: "Finished",
  rounds: (n) => `${n} round${n !== 1 ? "s" : ""}`,
  winner: "Winner",
  deleteConfirm: (players) =>
    `Delete game with ${players}? This cannot be undone.`,

  newGameTitle: "New Game",
  newGameSubtitle: (min, max) => `Enter player names (${min}–${max} players)`,
  playerPlaceholder: (n) => `Player ${n}`,
  addPlayer: "+ Add Player",
  startGame: "Start Game",
  minPlayersHint: (n) => `At least ${n} players required`,

  roundLabel: (n) => `Round ${n}`,
  roundsPlayed: (n) => `${n} round${n !== 1 ? "s" : ""} played`,
  gameOver: "Game Over",
  endRound: (n) => `End Round ${n}`,
  winsMessage: (name) => `${name} wins!`,
  winnerSubtitle: (pts) =>
    `${pts} pts — lowest score among Phase 10 completers`,
  roundExplainer: "This Round",
  currentPhases: "Current Phases",
  phaseDone: "Done!",
  allDone: "All Done!",

  roundScores: (n) => `Round ${n} Scores`,
  alreadyFinished: "Already finished",
  completedGame: "Completed game",
  phaseQuestion: "Phase done?",
  pointsThisRound: "Points this round",
  saveRound: "Save Round",
  cardCalculator: "Card Calculator",
  manual: "Manual",
  pointsLabel: "Points scored this round",
  ptsEach: (n) => `${n} pts each`,
  validationTooManyZeros:
    "Only the round winner can score 0. Please adjust scores.",

  phaseDescriptions: {
    1: "2 sets of 3",
    2: "1 set of 3 + 1 run of 4",
    3: "1 set of 4 + 1 run of 4",
    4: "1 run of 7",
    5: "1 run of 8",
    6: "1 run of 9",
    7: "2 sets of 4",
    8: "7 cards of one color",
    9: "1 set of 5 + 1 set of 2",
    10: "1 set of 5 + 1 set of 3",
  },

  roundHistory: "Round History",
  noRoundsYet: "No rounds played yet.",
  phaseCheck: "Phase up!",
  roundWinner: "Round winner",
  lastRound: "Last round",
};

const de: Translations = {
  appTitle: "Phase 10 Tracker",
  appSubtitle: "Phasen, Punkte und Ruhm verfolgen",
  newGame: "+ Neues Spiel",
  backToGames: "Spiele",
  back: "Zurück",
  cancel: "Abbrechen",
  delete: "Löschen",
  save: "Speichern",

  inProgress: "Laufend",
  completed: "Abgeschlossen",
  noSessions: "Noch keine gespeicherten Spiele. Starte ein neues Spiel!",
  active: "Aktiv",
  finished: "Beendet",
  rounds: (n) => `${n} Runde${n !== 1 ? "n" : ""}`,
  winner: "Gewinner",
  deleteConfirm: (players) =>
    `Spiel mit ${players} löschen? Dies kann nicht rückgängig gemacht werden.`,

  newGameTitle: "Neues Spiel",
  newGameSubtitle: (min, max) =>
    `Spielernamen eingeben (${min}–${max} Spieler)`,
  playerPlaceholder: (n) => `Spieler ${n}`,
  addPlayer: "+ Spieler hinzufügen",
  startGame: "Spiel starten",
  minPlayersHint: (n) => `Mindestens ${n} Spieler erforderlich`,

  roundLabel: (n) => `Runde ${n}`,
  roundsPlayed: (n) => `${n} Runde${n !== 1 ? "n" : ""} gespielt`,
  gameOver: "Spiel vorbei",
  endRound: (n) => `Runde ${n} beenden`,
  winsMessage: (name) => `${name} gewinnt!`,
  winnerSubtitle: (pts) =>
    `${pts} Pkt. — niedrigste Punktzahl unter Phase-10-Vollständigen`,
  roundExplainer: "Diese Runde",
  currentPhases: "Aktuelle Phasen",
  phaseDone: "Fertig!",
  allDone: "Alles geschafft!",

  roundScores: (n) => `Runde ${n} Punkte`,
  alreadyFinished: "Bereits fertig",
  completedGame: "Spiel beendet",
  phaseQuestion: "Phase geschafft?",
  pointsThisRound: "Punkte diese Runde",
  saveRound: "Runde speichern",
  cardCalculator: "Kartenrechner",
  manual: "Manuell",
  pointsLabel: "Punkte diese Runde",
  ptsEach: (n) => `${n} Pkt. je Karte`,
  validationTooManyZeros:
    "Nur der Rundengewinner darf 0 Punkte erhalten. Bitte Punktzahlen anpassen.",

  phaseDescriptions: {
    1: "2 Drillinge",
    2: "1 Drilling + 1 Viererlauf",
    3: "1 Vierling + 1 Viererlauf",
    4: "1 Siebenlauf",
    5: "1 Achterlauf",
    6: "1 Neunerlauf",
    7: "2 Vierlinge",
    8: "7 Karten einer Farbe",
    9: "1 Fünfling + 1 Zwilling",
    10: "1 Fünfling + 1 Drilling",
  },

  roundHistory: "Rundenhistorie",
  noRoundsYet: "Noch keine Runden gespielt.",
  phaseCheck: "Phase up!",
  roundWinner: "Rundensieger",
  lastRound: "Letzte Runde",
};

export const TRANSLATIONS: Record<Locale, Translations> = { en, de };
