# Production-Grade Overhaul Plan: Wager Chess

## Phase 1: Robust Testing and Evals (@qa)
### Smart Contracts (Foundry)
- Implement comprehensive unit tests for ChessLogic.sol focusing on edge cases: Castling rights invalidation, En Passant captures, Promotion scenarios.
- Implement exhaustive state transition tests for WagerChessEngine.sol (Join -> Play -> Check -> Checkmate -> Claim).
- Add Fuzz Testing for move fees and wager amounts to ensure no arithmetic overflows or stuck funds.

### Frontend (Vitest / E2E)
- Install Vitest and React Testing Library.
- Test UI components in isolation (mocking Wagmi hooks).
- Ensure the dynamic fee calculator logic matches the contract expected state.

## Phase 2: UI/UX and Design Overhaul (@ui-designer)
### Landing Page Redesign
- Implement a premium, modern Web3 aesthetic (glassmorphism, subtle glows, Kubar Labs color scheme).
- Interactive Rules of Engagement cards.
- Polished CTA buttons with hover effects.

### Game Board Enhancements
- Dynamic Fee Indicator: Before moving, show the user exactly how much the move will cost based on the piece they touch.
- Match Status Panel: Show active game ID clearly, material advantage, and current turn with a pulsing indicator.
- Move History: Redesign into a scrollable, stylized algebraic notation list.
- Responsive Design: Ensure the chessboard scales perfectly on mobile and desktop.
