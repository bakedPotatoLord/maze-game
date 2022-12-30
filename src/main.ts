
import Node from "./Node"
import BFS from "./bfs"
import rdfs from "./rdfs"

let c = document.querySelectorAll("canvas")[0]
let ctx = c.getContext("2d")
let form = document.forms[0]
ctx.fillStyle = "black"



export let cw:number
export let ch:number 


export let fill:number
export let blockSize:number

let nodes:Node[] = []
let startingNode:Node;
let endingNode:Node;

let parsedData:[number,number,number]

let mazeExists = false

async function setup(heigth:number,width:number,blockSizeP:number){
  if(heigth * width /blockSizeP > 16_000){
    if(!confirm('Making large mazes like this can take A REALLY LONG TIME.\r\n\r\nDo you want to continue?')){
      throw [false]
    }else{
      alert('Suit yourself, but dont say I didnt warn you.\r\n\r\nIf your browser says that it is unresponsive, chose "wait", as the is just thinking really hard, and not broken')
    }
  }
  if( width % blockSizeP == 0 && width % blockSizeP == 0){
    cw = c.width = heigth
    ch = c.height =width
  
    blockSize = blockSizeP

  }else{
    throw [true,new Error('Width and Heigth must be a multiple of blockSize')]
  }

  nodes = Array((cw/blockSize)*(ch/blockSize)).fill(0).map((_el,i)=>{
    return new Node(
      (i%(cw/blockSize)*(blockSize))+(blockSize/2),
      (Math.floor(i/(cw/blockSize))*(blockSize))+(blockSize/2))
  })   

  startingNode = nodes[0]
  startingNode.isStartingNode = true
  endingNode = nodes[nodes.length-1]
  endingNode.isEndingNode = true
  
  rdfs(nodes,startingNode,blockSize)

  draw()
}

export const TAU = 2*Math.PI


function draw(){
  console.log("started")

  ctx.fillStyle  = 'white'

  ctx.clearRect(0,0,cw,ch)
  ctx.strokeStyle = 'black'
  ctx.fillRect(0,0,cw,ch)
  ctx.strokeRect(0,0,cw,ch)
  
  nodes.forEach(el=>el.draw(ctx,blockSize))
  
  BFS(startingNode,endingNode,nodes,blockSize,false) 

  mazeExists = true
}


form.onsubmit= (e)=>{
  e.preventDefault()
  let data = (new FormData(<HTMLFormElement>e.target))
  //@ts-ignore
  parsedData = Array.from(data.entries()).map(el=>parseFloat(el[1]))

  try{
    setup(...parsedData)
  }catch(err){
    if(err[0]) alert(err[1])
    console.log(err)
    return
  }
}

(<HTMLButtonElement>document.querySelector('#d'))
.onclick = (e)=>{
  e.preventDefault()
  if(mazeExists){
    let a = document.createElement('a')
    document.body.appendChild(a)
    a.href = c.toDataURL()
    a.download = 'maze.png'
    a.click()
  }else{
    alert('you need to generate your maze first bozo')
  }
}

(<HTMLButtonElement>document.querySelector('#showSolution'))
.onclick = (e)=>{
  e.preventDefault()
  if(mazeExists){
    let n = endingNode
    ctx.beginPath()
    ctx.moveTo(n.x,n.y)
    while(n.parent != undefined){
      ctx.lineWidth = blockSize * (3/40)
      ctx.strokeStyle = 'blue'
      ctx.lineTo(n.parent.x,n.parent.y)
      n = n.parent
    }
    ctx.stroke()
  }else{
    alert('you need to generate your maze first bozo')
  }
}
