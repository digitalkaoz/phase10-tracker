import { useState } from "react";
import type { Session, Player, PhaseNumber, Round } from "../types/game";
import { ScoreEntryModal, type PlayerRoundEntry } from "./ScoreEntryModal";
import { PlayerCard } from "./PlayerCard";
import { RoundsHistory } from "./RoundsHistory";
import { getWinner } from "../utils/scoring";
import { useLocale } from "../i18n/useLocale";
import { BackIcon, HistoryIcon, TrophyIcon } from "./icons";

interface Props {
  session: Session;
  onUpdate: (session: Session) => void;
  onBack: () => void;
}

export function GameBoard({ session, onUpdate, onBack }: Props) {
  const { t } = useLocale();
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [showRoundsHistory, setShowRoundsHistory] = useState(false);

  const roundNumber = session.rounds.length + 1;
  const activePlayers = session.players.filter((p) => !p.completedGame);

  const sortedPlayers = [...session.players].sort((a, b) => {
    if (b.currentPhase !== a.currentPhase)
      return b.currentPhase - a.currentPhase;
    return a.totalScore - b.totalScore;
  });

  const handleRoundSubmit = (entries: PlayerRoundEntry[]) => {
    const updatedPlayers: Player[] = session.players.map((player) => {
      const entry = entries.find((e) => e.playerId === player.id);
      if (!entry || player.completedGame) return player;

      const newScore = player.totalScore + entry.score;
      let newPhase = player.currentPhase;
      let completedGame: boolean = player.completedGame;

      if (entry.phaseCompleted && player.currentPhase !== 11) {
        if (player.currentPhase === 10) {
          completedGame = true;
          newPhase = 11;
        } else {
          const nextPhase: Record<number, PhaseNumber> = {
            1: 2,
            2: 3,
            3: 4,
            4: 5,
            5: 6,
            6: 7,
            7: 8,
            8: 9,
            9: 10,
          };
          newPhase = nextPhase[player.currentPhase];
        }
      }

      return {
        ...player,
        totalScore: newScore,
        currentPhase: newPhase,
        completedGame,
      };
    });

    const round: Round = {
      roundNumber,
      entries: Object.fromEntries(
        entries.map((e) => [
          e.playerId,
          { phaseCompleted: e.phaseCompleted, score: e.score },
        ]),
      ),
    };

    const someoneFinished = updatedPlayers.some((p) => p.completedGame);
    let winnerId = session.winnerId;
    let status = session.status;

    if (someoneFinished) {
      status = "finished";
      winnerId = getWinner(updatedPlayers);
    }

    onUpdate({
      ...session,
      players: updatedPlayers,
      rounds: [...session.rounds, round],
      status,
      winnerId,
    });
    setShowScoreModal(false);
  };

  const winner = session.winnerId
    ? session.players.find((p) => p.id === session.winnerId)
    : null;

  return (
    <div className="min-h-screen bg-p10-bg flex flex-col">
      <header
        className="flex items-center justify-between px-4 border-b border-p10-border bg-p10-surface sticky top-0 z-10"
        style={{
          paddingTop: "calc(0.75rem + env(safe-area-inset-top))",
          paddingBottom: "0.75rem",
        }}
      >
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-p10-text-dim active:text-p10-text transition-colors text-sm min-h-[44px] min-w-[44px]"
        >
          <BackIcon />
          <span>{t.backToGames}</span>
        </button>
        <div className="text-center">
          <p className="text-p10-heading font-semibold text-sm leading-tight">
            {session.status === "finished"
              ? t.gameOver
              : t.roundLabel(roundNumber)}
          </p>
          <p className="text-p10-text-dim text-xs">
            {t.roundsPlayed(session.rounds.length)}
          </p>
        </div>
        <button
          onClick={() => setShowRoundsHistory(true)}
          className="p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-p10-text-dim active:text-p10-text active:bg-p10-surface-2 transition-colors"
          aria-label={t.roundHistory}
        >
          <HistoryIcon />
        </button>
      </header>

      {session.status === "finished" && winner && (
        <div className="mx-4 mt-4 px-4 py-3 bg-p10-yellow/10 border border-p10-yellow/40 rounded-2xl flex items-center gap-3">
          <TrophyIcon />
          <div>
            <p className="text-p10-yellow font-bold">
              {t.winsMessage(winner.name)}
            </p>
            <p className="text-p10-text-dim text-xs mt-0.5">
              {t.winnerSubtitle(winner.totalScore)}
            </p>
          </div>
        </div>
      )}

      <main className="flex-1 px-4 py-4 space-y-3">
        {sortedPlayers.map((player, rank) => (
          <PlayerCard
            key={player.id}
            player={player}
            rank={rank}
            isWinner={player.id === session.winnerId}
          />
        ))}
      </main>

      {showRoundsHistory && (
        <RoundsHistory
          session={session}
          onClose={() => setShowRoundsHistory(false)}
        />
      )}

      {showScoreModal && (
        <ScoreEntryModal
          players={activePlayers}
          roundNumber={roundNumber}
          onSubmit={handleRoundSubmit}
          onCancel={() => setShowScoreModal(false)}
        />
      )}

      <div
        className="sticky bottom-0 px-4 pt-3 bg-gradient-to-t from-p10-bg via-p10-bg to-transparent"
        style={{ paddingBottom: "calc(1.25rem + env(safe-area-inset-bottom))" }}
      >
        {session.status === "active" ? (
          <button
            onClick={() => setShowScoreModal(true)}
            className="w-full py-4 rounded-2xl bg-p10-accent active:bg-p10-accent-hover text-white font-bold text-lg transition-colors shadow-lg min-h-[56px]"
          >
            {t.endRound(roundNumber)}
          </button>
        ) : (
          <button
            onClick={onBack}
            className="w-full py-4 rounded-2xl bg-p10-surface border border-p10-border text-p10-text font-semibold text-lg transition-colors min-h-[56px]"
          >
            {t.backToGames}
          </button>
        )}
      </div>
    </div>
  );
}
