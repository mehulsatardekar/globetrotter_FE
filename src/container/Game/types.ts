export interface GameProps {
  sessionId: string;
  challengedBy?: string;
  challengeScore?: number;
  playerName?: string;
}

export interface GameStateError {
  gameState: GameState;
  error: string;
}

export interface GameState {
    id: string;
    user: {
      id: string;
      username: string;
    };
    score: number;
    correct_answers: number;
    total_questions: number;
    is_completed?: boolean;
    current_round: {
      id: string;
      destination: {
        id: string;
        city: string;
        country: string;
        clues: string[];
        fun_fact: string[];
        trivia: string[];
        options: string[];
      };
    };
    rounds: Array<{
      id: string;
      is_correct: boolean;
      time_taken: number;
      user_answer: string;
      destination_id: string;
    }>;
    share_code: string;
  }
  