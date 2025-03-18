import { GameState } from "@/src/container/Game/types";

export interface ICompleteGameBoard {
    state: {
      summaryData: GameState;
    };
    actions: {
      startNewGame: () => Promise<void>;
      handleShareModalOpen: () => void;
    };
  }