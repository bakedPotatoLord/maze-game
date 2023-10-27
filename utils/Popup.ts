
export default class Popup{
  hidden = true
  constructor(){

  }

  draw(ctx:CanvasRenderingContext2D,cw:number,ch:number){
    if(!this.hidden){
      const fill = ctx.fillStyle

      ctx.fillStyle = "white"
      ctx.fillRect(cw*0.2,ch*0.2,cw*0.6,ch*0.6)

      ctx.fillStyle = "black"
      ctx.textAlign = "center"
      ctx.font = `${69*(cw/1200)}px Arial`
      ctx.fillText("High Scores",cw*0.5,ch*0.30 )

      ctx.fillStyle = fill
    }
  }
}