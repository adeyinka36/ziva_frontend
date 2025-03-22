import { PlayerType } from "@/functions/getPlayers";
import {  Topic } from "@/functions/getTopics";

export interface GameType {
  id?: string | null | undefined;
  name?: string | null | undefined;
  creator?: string | null | undefined;
  start_date_time?: string | null | undefined;
  status?: string | null | undefined;
  winnder_id?: string | null | undefined,
  players?: PlayerType[] | undefined,
  topic?: Topic | undefined
}