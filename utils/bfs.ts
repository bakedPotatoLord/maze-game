import type Node from './Node'

export default async function bfs(start:Node,end:Node,nodes:Node[][],blockSize:number,ctx:CanvasRenderingContext2D,traceRoutes?:boolean, traceSpeed?:number){
  ctx.lineWidth = GlobalState.traceWidth
  const flatNodes = nodes.flat()
  flatNodes.forEach(el=>el.visited = false)
  let que: Node[] =[start]
  start.visited = true
  start.generation = 0
  while(que.length >0){
    let v = <Node>que.shift()
    for(let child of v.getViableNodes(nodes,blockSize)){
      if(GlobalState.leaveWelcome) return null
      if(!child.visited){
        child.generation = v.generation+1
        child.parent = v
        if(traceRoutes){
          await new Promise(res=>setTimeout(res,traceSpeed ?? 100))
          ctx.strokeStyle = 'brown'
          child.drawLineTo(v,ctx)
        }
        child.visited = true
        que.push(child)
      }
      if(child == end){
        const toReturn:Node[] = [end]
        let next =<Node> toReturn.at(-1)
        while(true){
          if(next?.isStartingNode) break
          toReturn.push(next)
          next = <Node>next.parent
        }
        que.length = 0
        return toReturn
      }
    }
  }
  return null
}