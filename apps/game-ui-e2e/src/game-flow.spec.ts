import { test, expect } from '@playwright/test';

test.describe('Game Flow E2E Tests', () => {
  test('should complete a full game flow including setup and turn management', async ({ page }) => {
    // Navigate to the game
    await page.goto('/');

    // Wait for the game to load
    await expect(page.locator('h1')).toContainText('Game Setup');

    // ============================================
    // TEST SETUP PHASE - PLAYER 0
    // ============================================
    
    // Verify we're on Player 0's tab
    const player0Tab = page.getByTestId('player-0-tab');
    await expect(player0Tab).toHaveClass(/bg-blue-500/);

    // Set player 0's name
    const nameInput = page.getByTestId('player-name-input');
    await nameInput.fill('Player Zero');
    await page.getByTestId('set-name-button').click();

    // Wait for name to be set
    await expect(page.locator('text=Name set: Player Zero')).toBeVisible();

    // Select two decks for Player 0 - avoid E2E test deck for this general flow test
    // Use specific deck IDs to ensure consistent behavior
    const aggroRedDeck = page.getByTestId('deck-aggro-red');
    const controlWhiteDeck = page.getByTestId('deck-control-white');
    
    await aggroRedDeck.click();
    await controlWhiteDeck.click();

    // Verify decks are selected (both should have blue border)
    await expect(aggroRedDeck).toHaveClass(/border-blue-500/);
    await expect(controlWhiteDeck).toHaveClass(/border-blue-500/);

    // Click ready button
    const readyButton = page.getByTestId('ready-button');
    await expect(readyButton).toBeEnabled();
    await readyButton.click();

    // Verify ready state
    await expect(readyButton).toContainText('Ready');

    // ============================================
    // TEST SETUP PHASE - PLAYER 1 (SWITCHING TABS)
    // ============================================
    
    // Switch to Player 1's tab
    const player1Tab = page.getByTestId('player-1-tab');
    await player1Tab.click();

    // Verify we're now on Player 1's tab
    await expect(player1Tab).toHaveClass(/bg-blue-500/);
    await expect(player0Tab).not.toHaveClass(/bg-blue-500/);

    // Verify we see Player 1's setup screen
    await expect(page.locator('h1')).toContainText('Game Setup - Player 1');

    // Set player 1's name
    await nameInput.fill('Player One');
    await page.getByTestId('set-name-button').click();
    await expect(page.locator('text=Name set: Player One')).toBeVisible();

    // Select two decks for Player 1 (select different ones from Player 0)
    const balancedGreenDeck = page.getByTestId('deck-balanced-green');
    const comboBlueDeck = page.getByTestId('deck-combo-blue');
    
    await balancedGreenDeck.click();
    await comboBlueDeck.click();

    // Click ready button for Player 1
    await expect(readyButton).toBeEnabled();
    await readyButton.click();

    // Wait for game to start (setup phase should be complete)
    // The game should transition to the main game phase
    // We'll detect this by waiting for the "Hand" text to appear
    await expect(page.locator('text=Hand')).toBeVisible({ timeout: 10000 });

    // ============================================
    // TEST PLAYING CARDS
    // ============================================
    
    // Switch back to Player 0's view
    await player0Tab.click();

    // Wait for the game board to be visible
    await expect(page.locator('text=Hand')).toBeVisible();

    // Skip playing cards to avoid chain/target selection complexity
    // The main test is about game flow (setup, turn management, UI state)
    // Card playing mechanics are tested separately in target-selection tests
    
    // ============================================
    // TEST ENDING THE TURN
    // ============================================
    
    // Find and click the end turn button
    const endTurnButton = page.getByTestId('end-turn-button');
    await expect(endTurnButton).toBeVisible();
    await expect(endTurnButton).toBeEnabled();
    await endTurnButton.click();

    // Wait for turn transition to complete
    // The turn should end and the button should become disabled
    await expect(endTurnButton).toBeDisabled({ timeout: 10000 });

    // ============================================
    // VERIFY GAME STATE AFTER TURN
    // ============================================
    
    // Switch to Player 1's view to verify they can now act
    await player1Tab.click();

    // Player 1 should now have an enabled end turn button
    const player1EndTurnButton = page.getByTestId('end-turn-button');
    await expect(player1EndTurnButton).toBeEnabled();

    // End Player 1's turn
    await player1EndTurnButton.click();

    // The test has successfully verified:
    // 1. Game setup for both players with tab switching
    // 2. Turn management and transitions
    // 3. UI state consistency across player turns
  });
});
