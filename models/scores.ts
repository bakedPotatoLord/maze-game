import { defineMongooseModel } from '#nuxt/mongoose'
export const Scores = defineMongooseModel<{num:number}>('User')