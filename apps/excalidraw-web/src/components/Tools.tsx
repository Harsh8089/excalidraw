import { 
  Circle,
  Pen, 
  Square 
} from "lucide-react";
  
export type toolsType = "rect" | "circle" | "pen";
  
const tools: {
  type: toolsType,
  icon: React.ReactNode
}[] = [
  {
    type: "rect",
    icon: <Square color="white" />
  },
  {
    type: "circle",
    icon: <Circle color="white"/>
  }, 
  {
    type: "pen",
    icon: <Pen color="white"/>
  }
];

export default function Tools({
  setToolSelected,
  toolSelected
}: {
  setToolSelected: (tool: toolsType) => void;
  toolSelected: toolsType;
}) { 
  return <div className="absolute bottom-2 right-2 flex gap-2 rounded-lg px-4 py-1 bg-purple-950">
    {tools.map((tool) => {
      return <button 
        key={tool.type} 
        className={`${toolSelected === tool.type && 'bg-purple-800 rounded-md' } p-1 cursor-pointer outline-none border-none`}
        onClick={() => setToolSelected(tool.type)}
      >
        { tool.icon }
      </button>
    })}
  </div>
}