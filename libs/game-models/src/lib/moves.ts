export enum MoveType {
  PLAY_CARD_FROM_HAND = 'playCardFromHand',
  END_TURN = 'endTurn',
  SELECT_TARGET = 'selectTarget',
  DRAW_CARD = 'drawCard',
  DISCARD_FROM_HAND = 'discardFromHand',
  PITCH_CARD = 'pitchCard',
  // Setup phase moves
  SET_PLAYER_NAME = 'setPlayerName',
  SELECT_DECK = 'selectDeck',
  SET_READY = 'setReady',
}
