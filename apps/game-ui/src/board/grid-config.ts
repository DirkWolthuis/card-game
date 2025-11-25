/**
 * Grid layout configuration for the game board.
 * This configuration defines the CSS Grid areas and their positions.
 */

export interface BoardGridConfig {
  /**
   * CSS Grid template areas definition
   * Defines the layout structure using named grid areas
   */
  gridTemplateAreas: string;

  /**
   * CSS Grid template columns definition
   * Defines the column widths
   */
  gridTemplateColumns: string;

  /**
   * CSS Grid template rows definition
   * Defines the row heights
   */
  gridTemplateRows: string;

  /**
   * Gap between grid items
   */
  gap: string;
}

/**
 * Default grid configuration for a standard 2-player game
 */
export const DEFAULT_GRID_CONFIG: BoardGridConfig = {
  gridTemplateAreas: `
    "opponents opponents opponents"
    "opponents opponents opponents"
    "game-stats battlefield resources"
    "game-stats battlefield card-zones"
    "hand hand card-zones"
  `,
  gridTemplateColumns: '200px 1fr 200px',
  gridTemplateRows: '1fr 1fr 1fr auto',
  gap: '1rem',
};

/**
 * Grid configuration for 4-player games
 * Opponents section takes up half the screen
 */
export const FOUR_PLAYER_GRID_CONFIG: BoardGridConfig = {
  gridTemplateAreas: `
    "opponents opponents opponents"
    "opponents opponents opponents"
    "game-stats battlefield resources"
    "game-stats battlefield card-zones"
    "hand hand hand"
  `,
  gridTemplateColumns: '200px 1fr 200px',
  gridTemplateRows: '1fr 1fr 1fr 1fr auto',
  gap: '1rem',
};

/**
 * Get the appropriate grid configuration based on the number of players
 */
export function getGridConfig(playerCount: number): BoardGridConfig {
  if (playerCount >= 4) {
    return FOUR_PLAYER_GRID_CONFIG;
  }
  return DEFAULT_GRID_CONFIG;
}
