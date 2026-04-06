import { useEffect, useState, useCallback, useRef } from 'react';
import ReactFlow, { Background, Controls, MarkerType, useNodesState, useEdgesState, Connection, ReactFlowInstance, NodeChange } from 'reactflow';
import 'reactflow/dist/style.css';
import { InfrastructureState, AWSResource, AWSResourceType } from '../../../core/schema/ast-types';

interface GraphCanvasProps {
  blueprint: InfrastructureState;
  // ✨ NEW: The graph needs to tell the app when a user changes the diagram
  onBlueprintChange: (newState: InfrastructureState) => void; 
}

export default function GraphCanvas({ blueprint, onBlueprintChange }: GraphCanvasProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);

  // 🧠 CACHE MAGIC: We cache node positions so they don't snap back when the code updates!
  const positionCache = useRef<Record<string, { x: number; y: number }>>({});

  useEffect(() => {
    const newNodes: any[] = [];
    const newEdges: any[] = [];
    let rootX = 100;
    let childY = 150;

    Object.values(blueprint.resources).forEach((res) => {
      const pos = positionCache.current[res.id] || (res.parent ? { x: rootX, y: childY } : { x: rootX, y: 50 });
      if (!positionCache.current[res.id]) positionCache.current[res.id] = pos;

      newNodes.push({
        id: res.id,
        position: pos,
        data: {
          label: (
            <div style={{ padding: '5px', textAlign: 'center' }}>
              <strong>{res.type}</strong><br />
              <span style={{ fontSize: '0.8em', color: '#666' }}>{res.id}</span>
            </div>
          )
        },
        style: { background: res.type === 'VPC' ? '#eef2ff' : '#fff', border: '2px solid #4f46e5', borderRadius: '8px', width: 150 }
      });

      if (res.parent) {
        newEdges.push({
          id: `e-${res.parent}-${res.id}`, source: res.parent, target: res.id,
          animated: true, markerEnd: { type: MarkerType.ArrowClosed },
          style: { stroke: '#4f46e5', strokeWidth: 2 }
        });
        childY += 100;
      } else {
        rootX += 200;
        childY = 150;
      }
    });
    setNodes(newNodes);
    setEdges(newEdges);
  }, [blueprint, setNodes, setEdges]);

  // ✨ NEW: Track Manual Dragging
  const handleNodesChange = useCallback((changes: NodeChange[]) => {
    onNodesChange(changes);
    changes.forEach((change) => {
      if (change.type === 'position' && change.position) {
        positionCache.current[change.id] = change.position;
      }
    });
  }, [onNodesChange]);

  // ✨ NEW: Handle Drag & Drop from Sidebar
  const onDragOver = useCallback((event: any) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: any) => {
      event.preventDefault();
      const type = event.dataTransfer.getData('application/reactflow') as AWSResourceType;
      if (!type || !rfInstance) return;

      const position = rfInstance.screenToFlowPosition({ x: event.clientX, y: event.clientY });
      const newId = `${type.toLowerCase()}-${Math.floor(Math.random() * 1000)}`;

      positionCache.current[newId] = position; // Save position instantly

      // Create new resource in the Blueprint
      const newBlueprint = { resources: { ...blueprint.resources } };
      newBlueprint.resources[newId] = { id: newId, type } as AWSResource;
      
      onBlueprintChange(newBlueprint);
    },
    [blueprint, rfInstance, onBlueprintChange]
  );

  // ✨ NEW: Handle Connecting Nodes (Arrow dragging)
  const onConnect = useCallback((params: Connection) => {
    const newBlueprint = { resources: { ...blueprint.resources } };
    const child = newBlueprint.resources[params.target!];
    if (child) {
      child.parent = params.source!; // Link them in the JSON!
      onBlueprintChange(newBlueprint);
    }
  }, [blueprint, onBlueprintChange]);

  const onDragStart = (event: any, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const sidebarBtn = { padding: '10px', margin: '10px 0', background: '#333', color: 'white', borderRadius: '5px', cursor: 'grab', textAlign: 'center' as const };

  return (
    <div style={{ display: 'flex', width: '100%', height: '100%', background: '#f8fafc' }}>
      
      {/* 🎨 THE SIDEBAR PALETTE */}
      <div style={{ width: '120px', background: '#1e1e1e', padding: '10px', borderRight: '1px solid #333' }}>
        <h4 style={{ color: '#aaa', marginTop: 0, textAlign: 'center' }}>Services</h4>
        <div draggable onDragStart={(e) => onDragStart(e, 'VPC')} style={sidebarBtn}>🌐 VPC</div>
        <div draggable onDragStart={(e) => onDragStart(e, 'RDS')} style={sidebarBtn}>🗄️ RDS</div>
        <div draggable onDragStart={(e) => onDragStart(e, 'EC2')} style={sidebarBtn}>💻 EC2</div>
        <div draggable onDragStart={(e) => onDragStart(e, 'S3')} style={sidebarBtn}>🪣 S3</div>
        <div draggable onDragStart={(e) => onDragStart(e, 'Lambda')} style={sidebarBtn}>⚡ Lambda</div>
      </div>

      {/* 🗺️ THE MAIN CANVAS */}
      <div style={{ flex: 1, position: 'relative' }}>
        <ReactFlow
          nodes={nodes} edges={edges}
          onNodesChange={handleNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={setRfInstance}
          onDrop={onDrop}
          onDragOver={onDragOver}
          fitView
        >
          <Background color="#ccc" gap={16} />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
}