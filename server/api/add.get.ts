import { Scores } from "~/models/scores";

export default defineEventHandler(async (event) => {
   await Scores.create({num:1})
   
   return await Scores.find({})

})