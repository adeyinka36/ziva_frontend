import { PlayerType } from "@/functions/getPlayers";
import {  Topic } from "@/functions/getTopics";

export interface GameType {
  id?: string | null | undefined;
  name?: string | null | undefined;
  creator?: string | null | undefined;
  status?: string | null | undefined;
  winnder_id?: string | null | undefined,
  players?: PlayerType[] | undefined,
  topic?: Topic | undefined
}


export interface GameQuestionType {
    id: string;
    question_text: string;
    currentQuestion: number;
    totalQuestions: number;
    topic: string;
    options: { A: string; B: string; C: string; D: string; };
    answer: 'A' | 'B' | 'C' | 'D';
}