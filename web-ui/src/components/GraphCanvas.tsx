import { useEffect, useState, useCallback, useRef } from 'react';
import ReactFlow, { Background, Controls, MarkerType, useNodesState, useEdgesState, Connection, ReactFlowInstance, NodeChange, ReactFlowProvider } from 'reactflow';
import 'reactflow/dist/style.css';
import { InfrastructureState, AWSResource, AWSResourceType } from '../../../core/schema/ast-types';
import { Network, Database, Server, HardDrive, Zap } from 'lucide-react';

interface GraphCanvasProps {
  blueprint: InfrastructureState;
  onBlueprintChange: (newState: InfrastructureState) => void; 
}

function GraphCanvasInner({ blueprint, onBlueprintChange }: GraphCanvasProps) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null); 
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);

  const positionCache = useRef<Record<string, { x: number; y: number }>>({});

  // ── UPDATE NODES & EDGES ──
  useEffect(() => {
    const newNodes: any[] = [];
    const newEdges: any[] = [];
    let rootX = 150; // Shifted right slightly to account for the floating dock
    let childY = 150;

    Object.values(blueprint.resources).forEach((res) => {
      const pos = positionCache.current[res.id] || (res.parent ? { x: rootX, y: childY } : { x: rootX, y: 50 });
      if (!positionCache.current[res.id]) positionCache.current[res.id] = pos;

      newNodes.push({
        id: res.id,
        position: pos,
        data: {
          label: (
            <div style={{ padding: '8px', textAlign: 'center' }}>
              <strong style={{ letterSpacing: '0.05em' }}>{res.type}</strong><br />
              <span style={{ fontSize: '0.7em', color: '#888', fontFamily: 'monospace' }}>{res.id}</span>
            </div>
          )
        },
        style: { 
          background: '#0a0a0a', 
          border: '1px solid #333', 
          borderRadius: '4px', 
          width: 140,
          color: '#efefef',
          fontFamily: '"DM Mono", monospace',
          boxShadow: res.type === 'VPC' ? '0 0 0 1px #E8500A' : '0 4px 12px rgba(0,0,0,0.5)'
        }
      });

      if (res.parent) {
        newEdges.push({
          id: `e-${res.parent}-${res.id}`, source: res.parent, target: res.id,
          animated: true, 
          markerEnd: { type: MarkerType.ArrowClosed, color: '#E8500A' },
          style: { stroke: '#E8500A', strokeWidth: 2, opacity: 0.8 }
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

  const handleNodesChange = useCallback((changes: NodeChange[]) => {
    onNodesChange(changes);
    changes.forEach((change) => {
      if (change.type === 'position' && change.position) {
        positionCache.current[change.id] = change.position;
      }
    });
  }, [onNodesChange]);

  // ── DND LOGIC ──
  const onDragOver = useCallback((event: any) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: any) => {
      event.preventDefault();
      if (!reactFlowWrapper.current || !rfInstance) return;

      const type = event.dataTransfer.getData('application/reactflow') as AWSResourceType;
      const fallbackType = event.dataTransfer.getData('text/plain') as AWSResourceType;
      const finalType = type || fallbackType;

      if (!finalType) return;

      const position = rfInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newId = `${finalType.toLowerCase()}-${Math.floor(Math.random() * 1000)}`;
      positionCache.current[newId] = position; 

      const newBlueprint = { resources: { ...blueprint.resources } };
      newBlueprint.resources[newId] = { id: newId, type: finalType } as AWSResource;
      
      onBlueprintChange(newBlueprint);
    },
    [blueprint, rfInstance, onBlueprintChange]
  );

  const onConnect = useCallback((params: Connection) => {
    const newBlueprint = { resources: { ...blueprint.resources } };
    const child = newBlueprint.resources[params.target!];
    if (child) {
      child.parent = params.source!;
      onBlueprintChange(newBlueprint);
    }
  }, [blueprint, onBlueprintChange]);

  const onDragStart = (event: any, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.setData('text/plain', nodeType); 
    event.dataTransfer.effectAllowed = 'move';
  };

  // ✨ NEW: Floating Tool Dock Styles
  const dockBtnStyle = { 
    display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center',
    width: '64px', height: '60px', 
    background: 'transparent', color: '#888', 
    border: '1px solid transparent', borderRadius: '8px', 
    cursor: 'grab', gap: '4px',
    fontFamily: '"DM Sans", sans-serif', fontSize: '0.7rem', fontWeight: 600,
    transition: 'all 0.2s ease'
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: '#000' }} ref={reactFlowWrapper}>
      
{/* ── THE FLOATING DOCK ── */}
      <div style={{ 
        position: 'absolute', top: '24px', left: '24px', zIndex: 10,
        background: 'rgba(10, 10, 10, 0.85)', backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px',
        padding: '8px', display: 'flex', flexDirection: 'column', gap: '8px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.8)'
      }}>
        
        {/* Clean CSS instead of inline JS hover events */}
        <style>{`
          .tool-btn {
            display: flex; flex-direction: column; align-items: center; justify-content: center;
            width: 56px; height: 56px; 
            background: rgba(255,255,255,0.02); color: #888;
            border: 1px solid transparent; border-radius: 6px; 
            cursor: grab; gap: 6px;
            font-family: "DM Sans", sans-serif; font-size: 0.65rem; font-weight: 600;
            transition: all 0.2s ease;
          }
          .tool-btn:hover { 
            background: rgba(255,255,255,0.06); color: #fff; border-color: rgba(255,255,255,0.1); 
          }
          .tool-btn.vpc:hover { 
            background: rgba(232,80,10,0.1); color: #E8500A; border-color: rgba(232,80,10,0.3); 
          }
        `}</style>

        <div draggable onDragStart={(e) => onDragStart(e, 'VPC')} className="tool-btn vpc">
          <Network size={18} />
          VPC
        </div>

        <div draggable onDragStart={(e) => onDragStart(e, 'RDS')} className="tool-btn">
          <Database size={18} />
          RDS
        </div>

        <div draggable onDragStart={(e) => onDragStart(e, 'EC2')} className="tool-btn">
          <Server size={18} />
          EC2
        </div>

        <div draggable onDragStart={(e) => onDragStart(e, 'S3')} className="tool-btn">
          <HardDrive size={18} />
          S3
        </div>

        <div draggable onDragStart={(e) => onDragStart(e, 'Lambda')} className="tool-btn">
          <Zap size={18} />
          Lambda
        </div>

      </div>

      {/* ── THE MAIN CANVAS ── */}
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
        <Background color="#333" gap={20} size={1.5} />
        <Controls style={{ display: 'flex', flexDirection: 'column', gap: '4px', fill: '#ccc', background: 'rgba(10,10,10,0.8)', border: '1px solid #333', backdropFilter: 'blur(8px)' }} />
      </ReactFlow>
    </div>
  );
}

export default function GraphCanvas(props: GraphCanvasProps) {
  return (
    <ReactFlowProvider>
      <GraphCanvasInner {...props} />
    </ReactFlowProvider>
  );
}