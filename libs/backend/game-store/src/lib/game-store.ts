import { configureStore } from '@reduxjs/toolkit';
import { cardSlice } from './card-slice';

export default configureStore({
  reducer: {
    cards: cardSlice.reducer,
  },
});
