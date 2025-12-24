import { GameState } from '@game/models';
import { buildPlayerStateFromDecks } from './game-setup';
import { drawCardForPlayer } from './game-state-utils';

/**
 * Check if the setup phase should end.
 * Returns true when all players are ready.
 */
export const shouldEndSetupPhase = ({ G }: { G: GameState }): boolean => {
  // Check if all players are ready
  if (!G.setupData) return false;

  const allReady = Object.values(G.setupData.playerSetup).every(
    (setup) => setup.isReady
  );
  return allReady;
};

/**
 * Build player states from selected decks when setup phase ends.
 */
export const onSetupPhaseEnd = ({
  G,
  ctx,
  random,
}: {
  G: GameState;
  ctx: { playOrder: string[] };
  random: { Shuffle: <T>(deck: T[]) => T[] };
}): void => {
  // Build player states from selected decks
  if (!G.setupData) return;

  for (const playerId of ctx.playOrder) {
    const playerSetup = G.setupData.playerSetup[playerId];
    if (!playerSetup) {
      console.error(`No setup data found for player ${playerId}`);
      continue;
    }
    if (playerSetup.selectedDeckIds.length === 2) {
      G.players[playerId] = buildPlayerStateFromDecks(
        playerId,
        playerSetup.selectedDeckIds,
        random
      );
    }
  }
};

/**
 * Initialize turn beginning: reset mana, move pitched cards to graveyard,
 * draw a card, and transition to main stage.
 */
export const onTurnBegin = ({
  G,
  ctx,
  events,
}: {
  G: GameState;
  ctx: { currentPlayer: string };
  events: { setActivePlayers: (arg: { currentPlayer: string }) => void };
}): void => {
  const currentPlayerId = ctx.currentPlayer;
  const playerState = G.players[currentPlayerId];

  // Empty mana pool
  playerState.resources.mana = 0;

  // Move all cards from pitch zone to graveyard
  playerState.zones.graveyard.entityIds.push(
    ...playerState.zones.pitch.entityIds
  );
  playerState.zones.pitch.entityIds = [];

  // Draw a card if possible (Start Stage - automatic, no manual moves)
  drawCardForPlayer(G, currentPlayerId);

  // Transition to main stage for player actions
  events.setActivePlayers({ currentPlayer: 'mainStage' });
};
