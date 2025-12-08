import { INVALID_MOVE } from 'boardgame.io/core';
import type { Move } from 'boardgame.io';
import { GameState } from '@game/models';

/**
 * Set the player's name during setup phase
 */
export const setPlayerName: Move<GameState> = (
  { G, playerID },
  name: string
) => {
  if (!G.setupData || !playerID) {
    return INVALID_MOVE;
  }

  if (!name || name.trim().length === 0) {
    return INVALID_MOVE;
  }

  G.setupData.playerSetup[playerID].name = name.trim();
  return G;
};

/**
 * Select a deck during setup phase
 * Players can select up to 2 decks
 */
export const selectDeck: Move<GameState> = ({ G, playerID }, deckId: string) => {
  if (!G.setupData || !playerID) {
    return INVALID_MOVE;
  }

  const playerSetup = G.setupData.playerSetup[playerID];

  // Check if deck is already selected
  if (playerSetup.selectedDeckIds.includes(deckId)) {
    // Remove the deck if already selected (toggle behavior)
    playerSetup.selectedDeckIds = playerSetup.selectedDeckIds.filter(
      (id) => id !== deckId
    );
  } else {
    // Add the deck if not at limit
    if (playerSetup.selectedDeckIds.length < 2) {
      playerSetup.selectedDeckIds.push(deckId);
    } else {
      return INVALID_MOVE;
    }
  }

  // Reset ready state when deck selection changes
  playerSetup.isReady = false;

  return G;
};

/**
 * Mark the player as ready to start the game
 * Player must have name and 2 decks selected
 */
export const setReady: Move<GameState> = ({ G, playerID }, isReady: boolean) => {
  if (!G.setupData || !playerID) {
    return INVALID_MOVE;
  }

  const playerSetup = G.setupData.playerSetup[playerID];

  // Validate that player has name and 2 decks selected before allowing ready
  if (isReady) {
    if (!playerSetup.name || playerSetup.selectedDeckIds.length !== 2) {
      return INVALID_MOVE;
    }
  }

  playerSetup.isReady = isReady;
  return G;
};
