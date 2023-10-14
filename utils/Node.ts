export type nodeHash = string
export type polygonIdentifier = |3|4|5|6


export default class Node{
  static TAU = Math.PI *2
  type:polygonIdentifier =4
  x: number
  y: number
  children:Node[] = []
  parent?:Node
  isStartingNode = false
  isEndingNode = false
  visited = false
  generation= 0
  wallsTo?:Node[]
  walls?:{left:boolean,right:boolean,top:boolean,bottom:boolean}
  constructor(x:number,y:number,parent?:Node){
    this.x =x
    this.y=y
    this.parent = parent
  }

  reset(){
    this.children = []
    this.parent = undefined
    this.isStartingNode = false
    this.isEndingNode = false
    this.visited = false
    this.generation = 0
    this.wallsTo = undefined
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
      ctx.arc(this.x,this.y,blockSize/3,0,Node.TAU)
      ctx.fill()
      
    }
    ctx.strokeStyle ='#000000'
    ctx.fillStyle ='#000000'

    this.wallsTo?.forEach((el)=>{
      ctx.save()
      ctx.translate(this.x,this.y)
      ctx.rotate(Math.atan2(this.y-el.y,this.x-el.x)+ Math.PI)

      ctx.beginPath()
      ctx.moveTo(blockSize/2,blockSize/2)
      ctx.lineTo(blockSize/2,-blockSize/2)
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(blockSize/2,blockSize/2,2,0,Node.TAU)
      ctx.fill() 
      ctx.restore()
    })
  }

  addChildren=(...node:Node[])=>this.children.push(...node)

  getTouchingNodes(nodes:Node[][],blockSize:number){

    const x = (this.x-10)/blockSize
    const y = (this.y-10)/blockSize
    return <Node[]> [
      x+1 < nodes.length ? nodes.at(x+1)?.at(y): undefined,
      x-1 >= 0 ?nodes.at(x-1)?.at(y): undefined,
      y+1 < nodes.length ? nodes.at(x)?.at(y+1): undefined,
      y-1 >= 0 ?nodes.at(x)?.at(y-1): undefined,
      
      
    ].filter(el=> el ?? false)
  }

  getViableNodes(nodes:Node[][],blockSize:number){
    let tNodes = this.getTouchingNodes(nodes,blockSize)
    return (<Node[]>tNodes)
    .filter(
      el=>el!==undefined &&
      !this.wallsTo.includes(el) && 
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