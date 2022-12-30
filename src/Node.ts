
import { TAU } from "./main"

export default class Node{
  x: number
  y: number
  children:Node[] = []
  parent:Node
  isStartingNode = false
  isEndingNode = false
  visited = false
  generation= 0
  wallsTo:Node[]
  constructor(x:number,y:number,parent?:Node){
    this.x =x
    this.y=y
    this.parent = parent
  }

  topLine(ctx:CanvasRenderingContext2D,blockSize:number){
    console.log('topline called')
    ctx.strokeStyle = 'black'
    ctx.beginPath()
    ctx.moveTo(-(blockSize/2),-(blockSize/2))
    ctx.lineTo(-(blockSize/2),(blockSize/2))
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(-(blockSize/2),-(blockSize/2))
    ctx.lineTo(-(blockSize/2),(blockSize/2))
    ctx.stroke()


  }

  draw(ctx:CanvasRenderingContext2D,blockSize:number){
    if(this.isStartingNode){
      ctx.fillStyle = "green"
    }else if(this.isEndingNode){
      ctx.fillStyle = "red"
    }
    if(this.isEndingNode || this.isStartingNode){
      ctx.beginPath()
      ctx.arc(this.x,this.y,blockSize/3,0,TAU)
      ctx.fill()
    }
    ctx.strokeStyle ='rgb(0,0,0)'

    this.wallsTo.forEach((el)=>{
      ctx.save()
      ctx.translate(this.x,this.y)
      ctx.rotate(Math.atan2(this.y-el.y,this.x-el.x)+ Math.PI)

      ctx.beginPath()
      ctx.moveTo(blockSize/2,blockSize/2)
      ctx.lineTo(blockSize/2,-blockSize/2)
      ctx.lineTo(blockSize/2,blockSize/2)
      ctx.lineTo(blockSize/2,-blockSize/2)
      ctx.lineTo(blockSize/2,blockSize/2)
      ctx.lineTo(blockSize/2,-blockSize/2)
      ctx.stroke()

      ctx.restore()

    })

  }

  addChildren=(...node:Node[])=>this.children.push(...node)

  getTouchingNodes(nodes:Node[],blockSize:number){
    return nodes.filter(n=>
      (this != n) && 
      (Math.hypot(this.x-n.x,this.y-n.y) == blockSize )
    )
  }

  getViableNodes(nodes:Node[],blockSize:number){
    let tNodes = this.getTouchingNodes(nodes,blockSize)
    return tNodes
    .filter(
      el=>!this.wallsTo.includes(el) && 
      !el.wallsTo.includes(this)
    )
  }

  drawLineTo(node:Node,ctx:CanvasRenderingContext2D){
    ctx.beginPath()
    ctx.moveTo(this.x,this.y)
    ctx.lineTo(node.x,node.y)
    ctx.stroke()
  }
}