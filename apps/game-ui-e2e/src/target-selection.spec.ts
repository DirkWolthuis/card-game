import { test, expect } from '@playwright/test';

test.describe('Target Selection E2E Tests', () => {
  test('should handle target selection when playing cards with target requirements', async ({ page }) => {
    // Navigate to the game
    await page.goto('/');

    // Wait for the game to load
    await expect(page.locator('h1')).toContainText('Game Setup');

    // ============================================
    // SETUP PHASE - Use fixed E2E test decks
    // ============================================
    
    // Setup Player 0 with E2E test deck
    const player0Tab = page.getByTestId('player-0-tab');
    await expect(player0Tab).toHaveClass(/bg-blue-500/);

    const nameInput = page.getByTestId('player-name-input');
    await nameInput.fill('Player Zero');
    await page.getByTestId('set-name-button').click();
    await expect(page.locator('text=Name set: Player Zero')).toBeVisible();

    // Players must select exactly 2 different decks
    // Select the E2E test deck twice (once for each deck slot)
    const e2eTestDeck = page.getByTestId('deck-e2e-test-deck');
    const firstDeck = page.getByTestId('deck-aggro-red'); // Use any other deck as second deck
    
    await e2eTestDeck.click();
    await firstDeck.click();
    
    // Verify both decks are selected
    await expect(e2eTestDeck).toHaveClass(/border-blue-500/);
    await expect(firstDeck).toHaveClass(/border-blue-500/);

    const readyButton = page.getByTestId('ready-button');
    await expect(readyButton).toBeEnabled();
    await readyButton.click();
    await expect(readyButton).toContainText('Ready');

    // Setup Player 1 with E2E test deck
    const player1Tab = page.getByTestId('player-1-tab');
    await player1Tab.click();
    await expect(player1Tab).toHaveClass(/bg-blue-500/);

    await nameInput.fill('Player One');
    await page.getByTestId('set-name-button').click();
    await expect(page.locator('text=Name set: Player One')).toBeVisible();

    // Players must select exactly 2 different decks
    await e2eTestDeck.click();
    await firstDeck.click();
    
    await expect(readyButton).toBeEnabled();
    await readyButton.click();

    // Wait for game to start
    await expect(page.locator('text=Hand')).toBeVisible({ timeout: 10000 });

    // ============================================
    // SWITCH TO PLAYER 0
    // ============================================
    
    // Switch to Player 0's view
    await player0Tab.click();
    await expect(page.locator('text=Hand')).toBeVisible();

    // ============================================
    // TEST TARGET SELECTION - PLAYER target type
    // ============================================
    
    // The first card in hand should be 'spell-target-any' (requires PLAYER target, costs 0)
    const firstCard = page.locator('[data-testid^="card-"]').first();
    await expect(firstCard).toBeVisible();
    
    // Check if the card name contains 'Targeted Strike'
    await expect(firstCard).toContainText('Targeted Strike');

    // Play the card that requires target selection
    const playCardButton = firstCard.locator('[data-testid="play-card-button"]');
    await playCardButton.click();

    // Target selection modal should appear
    const targetModal = page.getByTestId('target-selection-modal');
    await expect(targetModal).toBeVisible({ timeout: 5000 });
    await expect(targetModal).toContainText('Select a Target');

    // Should show both players as valid targets
    // Check the count of target buttons - should be 2 (both Player 0 and Player 1)
    const allTargetButtons = page.locator('[data-testid^="target-player-"]');
    await expect(allTargetButtons).toHaveCount(2);
    
    const player0Button = page.getByTestId('target-player-0');
    const player1Button = page.getByTestId('target-player-1');
    await expect(player0Button).toBeVisible();
    await expect(player1Button).toBeVisible();

    // Select Player 1 as target
    await player1Button.click();

    // Modal should close after selection
    await expect(targetModal).not.toBeVisible({ timeout: 3000 });

    // After playing a spell card, a chain is started and all players enter chainResponse stage
    // We need to pass priority to allow the chain to resolve before we can end our turn
    const passPriorityButton = page.getByRole('button', { name: /Pass Priority/i });
    await expect(passPriorityButton).toBeVisible({ timeout: 5000 });
    await passPriorityButton.click();

    // Wait a moment for the state to update
    await page.waitForTimeout(1000);

    // Switch to Player 1 to have them pass priority too
    await player1Tab.click();
    const player1PassButton = page.getByRole('button', { name: /Pass Priority/i });
    await expect(player1PassButton).toBeVisible({ timeout: 5000 });
    await player1PassButton.click();

    // Wait for chain to resolve
    await page.waitForTimeout(1000);

    // After both players pass, the chain should resolve and we should return to mainStage
    // Switch back to Player 0
    await player0Tab.click();

    // ============================================
    // TEST TARGET SELECTION - OPPONENT target type
    // ============================================
    
    // The next card should be 'spell-target-opponent' (requires OPPONENT target)
    const secondCard = page.locator('[data-testid^="card-"]').first();
    await expect(secondCard).toBeVisible();
    
    // Check if the card name contains 'Direct Assault'
    await expect(secondCard).toContainText('Direct Assault');

    // Play the card that requires opponent target selection
    const playSecondCardButton = secondCard.locator('[data-testid="play-card-button"]');
    await playSecondCardButton.click();

    // Target selection modal should appear again
    await expect(targetModal).toBeVisible({ timeout: 5000 });
    await expect(targetModal).toContainText('Select a Target');

    // Should show only opponents as valid targets (Player 1 only)
    // Check the count of target buttons - should be 1 (only Player 1)
    const targetButtons = page.locator('[data-testid^="target-player-"]');
    await expect(targetButtons).toHaveCount(1);
    
    const opponentButton = page.getByTestId('target-player-1');
    await expect(opponentButton).toBeVisible();

    // Select the opponent
    await opponentButton.click();

    // Modal should close
    await expect(targetModal).not.toBeVisible({ timeout: 3000 });

    // After playing the second spell, it's added to the existing chain
    // Now we need to pass priority again to resolve the chain
    await expect(passPriorityButton).toBeVisible({ timeout: 5000 });
    await passPriorityButton.click();

    // Wait a moment for the state to update
    await page.waitForTimeout(1000);

    // Switch to Player 1 to have them pass priority
    await player1Tab.click();
    await expect(player1PassButton).toBeVisible({ timeout: 5000 });
    await player1PassButton.click();

    // Wait for chain to resolve
    await page.waitForTimeout(1000);

    // After both players pass, chain resolves. Switch back to Player 0
    await player0Tab.click();

    // ============================================
    // TEST ENDING THE TURN
    // ============================================
    
    const endTurnButton = page.getByTestId('end-turn-button');
    await expect(endTurnButton).toBeVisible();
    await expect(endTurnButton).toBeEnabled();
    await endTurnButton.click();

    // Verify the button is now disabled (it's not our turn anymore)
    await expect(endTurnButton).toBeDisabled();

    // Switch to Player 1's view to verify they can now act
    await player1Tab.click();

    // Player 1 should now have an enabled end turn button
    const player1EndTurnButton = page.getByTestId('end-turn-button');
    await expect(player1EndTurnButton).toBeEnabled();

    // The test has successfully verified:
    // 1. Target selection with PLAYER target type (can select any player)
    // 2. Target selection with OPPONENT target type (can only select opponents)
    // 3. Turn management
  });
});
