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
    this.walls = undefined
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

  getTouchingNodes(nodes:Map<nodeHash,Node>,blockSize:number){
    return <Node[]> [
      nodes.get(this.hashFrom(this.x+blockSize,this.y)),
      nodes.get(this.hashFrom(this.x,this.y+blockSize)),
      nodes.get(this.hashFrom(this.x-blockSize,this.y)),
      nodes.get(this.hashFrom(this.x,this.y-blockSize)),
    ].filter(el=> el ?? false)
  }

  getViableNodes(nodes:Map<nodeHash,Node>,blockSize:number){
    let tNodes = this.getTouchingNodes(nodes,blockSize)
    return (<Node[]>tNodes
    .filter(el=>el!==undefined))
    .filter(
      el=>!this?.wallsTo?.includes(el) && 
      !el?.wallsTo?.includes(this)
    )
  }

  drawLineTo(node:Node,ctx:CanvasRenderingContext2D){
    ctx.beginPath()
    ctx.moveTo(this.x,this.y)
    ctx.lineTo(node.x,node.y)
    ctx.stroke()
  }

  toHash = ():nodeHash=> this.x+','+this.y

  hashFrom = (...args:number[])=>args.join(',')
}