import { defineMongooseModel } from '#nuxt/mongoose'
export const Scores = defineMongooseModel<{num:number[]}>({
  name:"Scores",
  schema:{
    num:{ required: true, type: [Number] }
  }
})