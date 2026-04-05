//component that takes your JSON Blueprint (InfrastructureState) and translates it into 
// mathematical Nodes (boxes) and Edges (arrows) for React Flow.
import { useEffect, useState } from 'react';
import ReactFlow, { Background, Controls, Node, Edge, MarkerType } from 'reactflow';
import 'reactflow/dist/style.css';
import { InfrastructureState } from '../../../core/schema/ast-types';

interface GraphCanvasProps {
  blueprint: InfrastructureState;
}

export default function GraphCanvas({ blueprint }: GraphCanvasProps) {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  useEffect(() => {
    const newNodes: Node[] = [];
    const newEdges: Edge[] = [];
    
    let rootX = 100; // Spacing for root resources (like VPCs)
    let childY = 150; // Spacing for child resources (like RDS)

    // Loop through our blueprint to build the graph
    Object.values(blueprint.resources).forEach((res) => {
      // 1. Create the Node (The Box)
      newNodes.push({
        id: res.id,
        // If it has a parent, put it lower. If not, space it out at the top.
        position: res.parent ? { x: rootX, y: childY } : { x: rootX, y: 50 },
        data: { 
          label: (
            <div style={{ padding: '5px', textAlign: 'center' }}>
              <strong>{res.type}</strong>
              <br/>
              <span style={{ fontSize: '0.8em', color: '#666' }}>{res.id}</span>
            </div>
          ) 
        },
        style: {
          background: res.type === 'VPC' ? '#eef2ff' : '#fff',
          border: '2px solid #4f46e5',
          borderRadius: '8px',
          width: 150,
        }
      });

      // 2. Create the Edge (The Arrow) if it belongs to a parent
      if (res.parent) {
        newEdges.push({
          id: `e-${res.parent}-${res.id}`,
          source: res.parent,
          target: res.id,
          animated: true, // Cool animated data flow!
          markerEnd: { type: MarkerType.ArrowClosed },
          style: { stroke: '#4f46e5', strokeWidth: 2 }
        });
        childY += 100; // Push next child down
      } else {
        rootX += 200; // Push next root resource to the right
        childY = 150; // Reset child Y for the new root
      }
    });

    setNodes(newNodes);
    setEdges(newEdges);
  }, [blueprint]); // Re-run this math EVERY time the JSON Blueprint changes

  return (
    <div style={{ width: '100%', height: '100%', background: '#f8fafc' }}>
      <ReactFlow nodes={nodes} edges={edges} fitView>
        <Background color="#ccc" gap={16} />
        <Controls />
      </ReactFlow>
    </div>
  );
}
