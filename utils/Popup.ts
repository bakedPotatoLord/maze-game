
export default class Popup{
  hidden = true
  constructor(){

  }

  draw(ctx:CanvasRenderingContext2D,cw:number,ch:number){
    if(!this.hidden){
      ctx.fillStyle = "white"
      ctx.fillRect(cw*0.2,ch*0.2,cw*0.6,ch*0.6)
    }
  }
}