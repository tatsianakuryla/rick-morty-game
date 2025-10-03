# Rick & Morty Game (CLI)

A command-line game inspired by the generalized Monty Hall problem.  
Rick picks one box out of **N**; Morty removes **N−2** empty boxes, leaving Rick’s box and one other. Rick may **stay** or **switch**.  
The app demonstrates fairness using **HMAC commitments** and records round statistics.

---

## Table of Contents
- [Features](#features)
- [Installation](#installation)
- [Start](#start)
- [How to Play](#how-to-play)
- [Statistics](#statistics)
- [Project Structure](#project-structure)

---

## Features
- **Provably fair randomness** via HMAC commitments (commit → reveal)
- **Two user-seeded offsets** to derive secrets transparently
- **ASCII summary table** with empirical and theoretical probabilities
- **Graceful abort** at any prompt with `exit`

---

## Installation
```bash
  git clone https://github.com/tatsianakuryla/rick-morty-game.git
  npm install
```

## Start

```bash
    npm run build
    npm start -- N (box count must be >=3 and <= 20) Morty path (./ClassicMorty.ts or ./LazyMorty.ts)
```
##### Example:  
***npm start -- 3 ./LazyMorty.ts***

***npm start -- 3 ./ClassicMorty.ts***

## Lint & Format

#### Check ESLint issues
```
npm run lint
```
#### Fix ESLint issues
```
npm run lint:fix
```

#### Format with Prettier
```
npm run format
```

#### Check formatting without writing
```
npm run format:check
```

## How to Play

1. **Round starts** — you see the current **Round** and **HMAC #1** (commitment for the gun’s position).
2. **Enter Random #1** — type an integer in `[0..N-1)`.
3. **Guess the gun’s box** — enter an integer in `[0..N-1)` (Rick’s initial choice).
4. **Second commitment (only for Classic Morty)** — the game prints **HMAC #2** (commitment for the second candidate box).
5. **Enter Random #2** — type an integer in `[0..(N-2))`.
6. **Stay or Switch** — reply `0` to switch, `1` to stay.
7. **Outcome & Reveal** — the game reveals both commitments (message, key, result) and shows whether Rick won.
8. **Play again?** — `y/yes` or `n/no`.

> You can type `exit` at **any** prompt to abort and quit.

---

## Statistics

After the game is complete, you see a result table:

| Game results   | Rick switched | Rick stayed |
| -------------- | -------------:| ----------: |
| Rounds         |          *n₁* |       *n₂*  |
| Wins           |          *w₁* |       *w₂*  |
| P (estimate)   |  `w₁ / n₁`    |  `w₂ / n₂`  |
| P (exact)      |   `(N-1)/N`   |     `1/N`   |

- **P (estimate)** — empirical win rate from played rounds (shows `-` if no rounds of that type were played).
- **P (exact)** — theoretical probabilities for the current **N**.

---

## Project Structure

```
src/
├─ adapters/
│  └─ Messenger/
│     ├─ constants.ts
│     ├─ Messenger.ts
│     └─ messenger.type.ts
├─ cli/
│  └─ GameCliArgsParser/
│     └─ GameCliArgsParser.ts
├─ core/
│  ├─ GameLogic/
│  │  ├─ GameLogic.ts
│  │  └─ gameLogic.type.ts
│  └─ morty/
│     ├─ ClassicMorty/
│     ├─ LazyMorty/
│     ├─ Morty/
│     └─ mortyRegistry.ts
├─ statistics/
│  ├─ GameStatistics/
│  ├─ TableGenerator/
│  └─ types.ts
├─ crypto/
│  ├─ HmacGenerator/
│  └─ MortyRandomizer/
├─ shared/
│  ├─ constants/
│  ├─ types/
│  └─ utils/
└─ main.ts
```