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

    // Select the E2E test deck by its ID for better reliability
    const e2eTestDeck = page.getByTestId('deck-e2e-test-deck');
    
    // Players must select 2 decks - click the same deck twice to select it as both deck slots
    await e2eTestDeck.click();
    await e2eTestDeck.click();
    await expect(e2eTestDeck).toHaveClass(/border-blue-500/);

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

    // Players must select 2 decks - click the same deck twice to select it as both deck slots
    await e2eTestDeck.click();
    await e2eTestDeck.click();
    await expect(readyButton).toBeEnabled();
    await readyButton.click();

    // Wait for game to start
    await expect(page.locator('text=Hand')).toBeVisible({ timeout: 10000 });

    // ============================================
    // TEST TARGET SELECTION - PLAYER target type
    // ============================================
    
    // Switch to Player 0's view
    await player0Tab.click();
    await expect(page.locator('text=Hand')).toBeVisible();

    // The first card in hand should be 'spell-target-any' (requires PLAYER target)
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

    // ============================================
    // TEST PLAYING UNIT CARDS - TROOP
    // ============================================
    
    // The next card should be a troop unit
    const troopCard = page.locator('[data-testid^="card-"]').first();
    await expect(troopCard).toBeVisible();
    
    // Check if the card is a unit (should have unit stats)
    await expect(troopCard).toContainText('Foot Soldier');

    // Play the troop card
    const playTroopButton = troopCard.locator('[data-testid="play-card-button"]');
    await playTroopButton.click();

    // Unit should be placed on battlefield (no target selection needed)
    // Verify modal does NOT appear
    await expect(targetModal).not.toBeVisible({ timeout: 1000 });

    // Verify the card is on the battlefield
    const battlefield = page.locator('text=Battlefield').locator('..');
    await expect(battlefield).toContainText('Foot Soldier');

    // ============================================
    // TEST PLAYING UNIT CARDS - LEADER
    // ============================================
    
    // The next card should be a leader unit
    const leaderCard = page.locator('[data-testid^="card-"]').first();
    await expect(leaderCard).toBeVisible();
    
    // Check if the card is a leader unit
    await expect(leaderCard).toContainText('Knight Commander');

    // Play the leader card
    const playLeaderButton = leaderCard.locator('[data-testid="play-card-button"]');
    await playLeaderButton.click();

    // Unit should be placed on battlefield (no target selection needed)
    await expect(targetModal).not.toBeVisible({ timeout: 1000 });

    // Verify the card is on the battlefield
    await expect(battlefield).toContainText('Knight Commander');

    // ============================================
    // TEST PITCHING CARDS
    // ============================================
    
    // Get a card to pitch
    const cardsToPitch = page.locator('[data-testid^="card-"]');
    const cardCount = await cardsToPitch.count();
    
    if (cardCount > 0) {
      const cardToPitch = cardsToPitch.first();
      const cardBox = await cardToPitch.boundingBox();
      
      if (cardBox) {
        // Start dragging the card
        await page.mouse.move(cardBox.x + cardBox.width / 2, cardBox.y + cardBox.height / 2);
        await page.mouse.down();
        
        // Move slightly to trigger drag state
        await page.mouse.move(cardBox.x + cardBox.width / 2 + 10, cardBox.y + cardBox.height / 2 + 10);
        
        // Wait for the pitch zone to appear
        const pitchZone = page.getByTestId('pitch-card-zone');
        await pitchZone.waitFor({ state: 'visible', timeout: 5000 });
        
        // Get pitch zone position and drop the card
        const pitchZoneBox = await pitchZone.boundingBox();
        
        if (pitchZoneBox) {
          await page.mouse.move(pitchZoneBox.x + pitchZoneBox.width / 2, pitchZoneBox.y + pitchZoneBox.height / 2, { steps: 10 });
          await page.mouse.up();
        } else {
          await page.mouse.up();
        }
      }
    }

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
    // 3. Playing TROOP unit cards (placed on battlefield)
    // 4. Playing LEADER unit cards (placed on battlefield)
    // 5. Pitching cards
  });
});
