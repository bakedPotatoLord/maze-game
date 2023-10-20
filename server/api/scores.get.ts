import { Scores } from "~/models/scores";

export default defineEventHandler(async (event) => {
  return await Scores.find()
})