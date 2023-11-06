
export default class Popup{
  hidden = true
  scores:number[]
  gameLevel:number
  currLevel = 0
  
  constructor(){
    this.getScores()
  }

  async getScores(){
    this.scores = (<{num:number[]}>(await $fetch("/api/scores"))?.[0])?.num;
    console.log("scores",this.scores)
  }

  getCurrScore(){
    const ms = this.scores.at(this.currLevel )
    if(ms == null) return "Unset"
    let s = (ms/1000%60).toFixed(2)
    if(parseInt(s).toString().length == 1) s = "0"+s
    const m = (ms/1000/60).toFixed(0)
    console.log(m,s)
    return `${m}:${s}`
  }

  async handleEnd(time:number){
    this.currLevel = this.gameLevel
    if( this.scores[this.gameLevel] == null || time < this.scores[this.currLevel ]){
      this.scores[this.gameLevel ] = time
      
      await this.saveScores(time)
    }
    this.hidden = false
  }

  async saveScores(time:number){
    await $fetch("/api/highscore",{
      method: "PATCH",
      body:{
        level:this.currLevel,
        newScore:time
      }
    })
  }

  draw(ctx:CanvasRenderingContext2D,cw:number,ch:number){
    if(!this.hidden){
      const fill = ctx.fillStyle

      ctx.fillStyle = "white"
      ctx.fillRect(cw*0.2,ch*0.2,cw*0.6,ch*0.6)

      ctx.strokeStyle = "black"
      ctx.lineWidth = 3
      ctx.strokeRect(cw*0.2,ch*0.2,cw*0.6,ch*0.6)

      
      ctx.fillStyle = "black"
      ctx.textAlign = "center"
      ctx.font = `${69*(cw/1200)}px Arial`
      ctx.fillText("High Scores",cw*0.5,ch*0.30 )

      ctx.font = `${40*(cw/1200)}px Arial`
      ctx.fillText(`Best Time: ${this.getCurrScore()}`,cw*0.5,ch*0.5250 )
      
      ctx.font = `${40*(cw/1200)}px Arial`
      ctx.fillText( `Level ${this.currLevel }`,cw*0.5,ch*0.475 )
     
      ctx.fillStyle = "black"
      ctx.beginPath()
      ctx.moveTo(cw*0.22,ch*0.5)
      ctx.lineTo(cw*0.25,ch*0.6)
      ctx.lineTo(cw*0.25,ch*0.4)
      ctx.fill()

      ctx.beginPath()
      ctx.moveTo(cw*0.78,ch*0.5)
      ctx.lineTo(cw*0.75,ch*0.6)
      ctx.lineTo(cw*0.75,ch*0.4)
      ctx.fill()

      

      ctx.fillStyle = fill
    }
  }
}