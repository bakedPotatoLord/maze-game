import { Scores } from "~/models/scores";

export default defineEventHandler(async (event) => {
   let {num} = await Scores.findOne() ?? <never>(()=>{throw new Error("Scores not found")})
   console.log(num)
   let {level,newScore} = await readBody(event)
   console.log("event")

   num[level] = newScore

   await Scores.updateOne({},{num})

   return {
      ok:true
   }
})