import { Scores } from "~/models/scores";

export default defineEventHandler(async (event) => {
   let scores = await Scores.findOne() ?? <never>(()=>{throw new Error("Scores not found")})
   console.log(scores.num)
   let {level,newScore} = await readBody(event)

   scores.num[level] = newScore

   await Scores.updateOne({},{num:scores})

   return {
      ok:true
   }
})