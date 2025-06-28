# Technical architecture: Lords of Estraven - web-based online (trading) card game

## Tech stack

- TypeScript for every component
- Server-side game engine
- Dumb frontends that react to events and game state, and can send events (user interaction)
- NestJS as API
- React with state machines (XState) as frontend

## Game engine

- Event-driven, queue-based architecture
- ECS architecture to handle state and systems that react to events
- Strictly typed events, components, and systems

## API layer

- NestJS to expose game logic via WebSockets / REST endpoints
- Connects frontend with game engine

## Frontend

- Baseline React application that contains very little (game) logic
- State machines for predictable behavior
- Focus on playtesting and debugging, rather than visual identity
