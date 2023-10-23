import { Scores } from "~/models/scores";

export default defineEventHandler(async (event) => {
  await Scores.deleteMany({})
  await Scores.create({
    num: Array(12).fill(0)
  })

})