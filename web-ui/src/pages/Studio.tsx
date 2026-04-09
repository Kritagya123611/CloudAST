import { useState, useEffect } from 'react'
import Editor from '@monaco-editor/react'
import { Play, Save, Code2, LayoutDashboard, ChevronDown, FileCode2, FolderTree, GitBranch } from 'lucide-react'
import { Link } from 'react-router-dom'
import { parseJSXToState } from '../../../parsers/jsx-parser/babel-visitor'
import { generateTerraform } from '../../../generators/hcl-generator/formatter'
import { parseHCLToState } from '../../../parsers/hcl-parser/custom-parser'
import { generateJSX } from '../../../generators/jsx-generator/react-builder'
import { InfrastructureState } from '../../../core/schema/ast-types'
import GraphCanvas from './../components/GraphCanvas'
import { generatePulumi } from './../generators/polyglot-engine/pulumi-generator'
import { generateCloudFormation } from './../generators/polyglot-engine/cfn-generator'
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';

const handleEditorWillMount = (monaco: any) => {
  monaco.editor.defineTheme('cloudast-theme', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'tag', foreground: 'F59E0B', fontStyle: 'bold' },
      { token: 'identifier', foreground: 'F59E0B' }, 
      { token: 'attribute.name', foreground: 'A78BFA' },
      { token: 'type.identifier', foreground: 'A78BFA' },
      { token: 'string', foreground: '34D399' },
      { token: 'attribute.value', foreground: '34D399' },
      { token: 'delimiter', foreground: '8A8A8A' },
      { token: 'delimiter.html', foreground: '8A8A8A' },
    ],
    colors: {
      'editor.background': '#050505', 
      'editor.foreground': '#EFEFEF',
      'editorLineNumber.foreground': '#555555',
      'editorCursor.foreground': '#E8500A',
      'editor.lineHighlightBackground': '#111111',
      'editor.selectionBackground': '#222222'
    }
  });
};

const DEFAULT_JSX = `<Infrastructure>
  <VPC className="cidr-10.0.0.0/16" name="prod-vpc">
    <RDS className="engine-postgres storage-100gb multi-az" name="api-db" />
  </VPC>
</Infrastructure>`
const STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:wght@400;500;600&display=swap');

  :root {
    --bg-ide:       #000000;
    --bg-panel:     #0A0A0A;
    --bg-surface:   #111111;
    --border:       rgba(255,255,255,0.08);
    --border-focus: rgba(255,255,255,0.2);
    --orange:       #E8500A;
    --text-main:    #EFEFEF;
    --text-muted:   #8A8A8A;
    --sans:         'DM Sans', sans-serif;
    --mono:         'DM Mono', monospace;
  }

  body { margin: 0; overflow: hidden; background: var(--bg-ide); color: var(--text-main); font-family: var(--sans); }

  /* Segmented Control (Code vs Visual) */
  .segmented-control {
    display: flex; background: var(--bg-surface); padding: 4px; border-radius: 6px; border: 1px solid var(--border);
  }
  .segment-btn {
    padding: 6px 14px; font-family: var(--sans); font-size: 0.8rem; font-weight: 500;
    color: var(--text-muted); background: transparent; border: none; border-radius: 4px;
    cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 6px;
  }
  .segment-btn.active { background: #1A1A1A; color: var(--text-main); box-shadow: 0 1px 4px rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.05); }
  .segment-btn:hover:not(.active) { color: var(--text-main); }

  /* Premium Dropdown */
  .target-select-wrapper { position: relative; display: flex; align-items: center; }
  .target-select {
    appearance: none; background: var(--bg-surface); color: var(--text-main);
    border: 1px solid var(--border); border-radius: 6px; padding: 6px 36px 6px 12px;
    font-family: var(--mono); font-size: 0.75rem; cursor: pointer; transition: border-color 0.2s;
    outline: none;
  }
  .target-select:hover { border-color: var(--border-focus); }
  .target-select:focus { border-color: var(--orange); box-shadow: 0 0 0 1px var(--orange); }
  .select-icon { position: absolute; right: 10px; pointer-events: none; color: var(--text-muted); }

  /* Panel Headers */
  .panel-header {
    display: flex; justify-content: space-between; align-items: center;
    background: var(--bg-panel); padding: 8px 16px; border-bottom: 1px solid var(--border);
    font-family: var(--mono); font-size: 0.7rem; color: var(--text-muted); letter-spacing: 0.05em; text-transform: uppercase;
  }

  /* IDE Buttons */
  .btn-ide-primary {
    background: var(--text-main); color: #000; padding: 6px 14px; border: none; border-radius: 4px;
    font-weight: 600; font-size: 0.75rem; cursor: pointer; display: flex; align-items: center; gap: 6px;
    transition: transform 0.1s;
  }
  .btn-ide-primary:active { transform: scale(0.96); }

  /* Sync Badge */
  .sync-badge {
    display: inline-flex; align-items: center; gap: 6px;
    background: rgba(39, 200, 64, 0.1); color: #27C840;
    padding: 4px 8px; border-radius: 4px; border: 1px solid rgba(39, 200, 64, 0.2);
    font-family: var(--sans); font-size: 0.7rem; font-weight: 600; text-transform: none; letter-spacing: 0;
  }
  .sync-dot { width: 6px; height: 6px; background: #27C840; border-radius: 50%; animation: pulse 2s infinite; }
  @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
`;

export default function Studio() {
  const [jsxCode, setJsxCode] = useState(DEFAULT_JSX)
  const [hclCode, setHclCode] = useState('')
  const [currentBlueprint, setCurrentBlueprint] = useState<InfrastructureState>({ resources: {} })
  const [viewMode, setViewMode] = useState<'code' | 'visual'>('code')
  const [targetLanguage, setTargetLanguage] = useState<'terraform' | 'pulumi' | 'cloudformation'>('cloudformation')
  const { user } = useAuth();
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveName, setSaveName] = useState('Production Architecture');
  const [saveRegion, setSaveRegion] = useState('us-east-1');
  const [isSaving, setIsSaving] = useState(false);
  const executeSave = async () => {
    if (!user) {
      alert("Error: You must be logged in to save.");
      return;
    }

    setIsSaving(true);
    const nodeCount = Object.keys(currentBlueprint.resources).length;
    const { error } = await supabase.from('blueprints').insert([{
      user_id: user.id,
      name: saveName,
      region: saveRegion,
      status: 'active',
      nodes_count: nodeCount,
      jsx_code: jsxCode 
    }]);

    setIsSaving(false);

    if (error) {
      console.error("Save error:", error);
      alert("Failed to save. Check console for details.");
    } else {
      setShowSaveModal(false);
    }
  };

  useEffect(() => {
    const el = document.createElement('style'); el.textContent = STYLE; document.head.appendChild(el);
    return () => { document.head.removeChild(el); };
  }, []);

  useEffect(() => {
    if (targetLanguage === 'terraform') setHclCode(generateTerraform(currentBlueprint));
    if (targetLanguage === 'pulumi') setHclCode(generatePulumi(currentBlueprint));
    if (targetLanguage === 'cloudformation') setHclCode(generateCloudFormation(currentBlueprint));
  }, [currentBlueprint, targetLanguage]);

  const handleJsxChange = (value: string | undefined) => {
    if (value === undefined) return;
    setJsxCode(value); 
    try {
      const blueprint = parseJSXToState(value);
      setCurrentBlueprint(blueprint); 
    } catch (err) { }
  }

  const handleHclChange = (value: string | undefined) => {
    if (value === undefined) return;
    setHclCode(value);
    if (targetLanguage !== 'terraform') return;
    try {
      const blueprint = parseHCLToState(value);
      setCurrentBlueprint(blueprint);
      const newJsx = generateJSX(blueprint);
      if (newJsx.trim() !== jsxCode.trim()) setJsxCode(newJsx);
    } catch (err) {}
  }

  const handleGraphUpdate = (newBlueprint: InfrastructureState) => {
    setCurrentBlueprint(newBlueprint);
    setJsxCode(generateJSX(newBlueprint)); 
  }

  useEffect(() => { 
    try {
      const initialBlueprint = parseJSXToState(DEFAULT_JSX);
      setCurrentBlueprint(initialBlueprint);
    } catch(err) {}
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: 'var(--bg-ide)' }}>
      <div style={{ height: '54px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px', backgroundColor: 'var(--bg-panel)' }}>
        
        {/* Left: Branding & Project */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Link to="/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: 20, height: 20, borderRadius: 3, background: 'var(--orange)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <GitBranch size={12} color="#fff" strokeWidth={2.5} />
            </div>
          </Link>
          <div style={{ width: 1, height: 20, backgroundColor: 'var(--border)' }} />
          <span style={{ fontFamily: 'var(--mono)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <span style={{ color: 'var(--text-main)' }}>workspace</span> / production-vpc
          </span>
        </div>

        <div className="segmented-control">
          <button className={`segment-btn ${viewMode === 'code' ? 'active' : ''}`} onClick={() => setViewMode('code')}>
            <Code2 size={14} /> Code Editor
          </button>
          <button className={`segment-btn ${viewMode === 'visual' ? 'active' : ''}`} onClick={() => setViewMode('visual')}>
            <LayoutDashboard size={14} /> Visual Canvas
          </button>
        </div>

        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div className="target-select-wrapper">
            <select className="target-select" value={targetLanguage} onChange={(e) => setTargetLanguage(e.target.value as any)}>
              <option value="terraform"> Target: Terraform (HCL)</option>
              <option value="pulumi"> Target: Pulumi (TS)</option>
              <option value="cloudformation"> Target: CloudFormation</option>
            </select>
            <ChevronDown size={14} className="select-icon" />
          </div>
          <button className="btn-ide-primary" onClick={() => setShowSaveModal(true)}>
            <Save size={14} /> Save
          </button>
          <button className="btn-ide-primary" style={{ background: 'var(--orange)', color: '#fff' }}><Play size={14} /> Deploy</button>
        </div>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        <div style={{ width: '220px', borderRight: '1px solid var(--border)', backgroundColor: 'var(--bg-panel)', display: 'flex', flexDirection: 'column' }}>
          <div className="panel-header"><FolderTree size={12} /> Explorer</div>
          <div style={{ padding: '12px 0' }}>
            <div style={{ padding: '6px 16px', fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', backgroundColor: 'rgba(255,255,255,0.03)', borderLeft: '2px solid var(--orange)' }}>
              <FileCode2 size={14} color="#61DAFB" /> infrastructure.jsx
            </div>
            <div style={{ padding: '6px 16px', fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <FileCode2 size={14} color="#844FBA" /> {targetLanguage === 'terraform' ? 'main.tf' : targetLanguage === 'pulumi' ? 'index.ts' : 'template.json'}
            </div>
            <div style={{ padding: '6px 16px', fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', opacity: 0.5 }}>
              <FileCode2 size={14} color="#F2CA30" /> variables.json
            </div>
          </div>
        </div>

        <div style={{ flex: viewMode === 'visual' ? 1.5 : 1, display: 'flex', flexDirection: 'column', borderRight: '1px solid var(--border)', position: 'relative', backgroundColor: '#000' }}>
          
          {viewMode === 'code' ? (
            <>
              <div className="panel-header">
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)', textTransform: 'none' }}><FileCode2 size={14} color="#61DAFB"/> infrastructure.jsx</span>
              </div>
              <Editor height="100%" defaultLanguage="javascript" theme="cloudast-theme" beforeMount={handleEditorWillMount} value={jsxCode} onChange={handleJsxChange} options={{ minimap: { enabled: false }, fontSize: 14, padding: { top: 16 } }} />
            </>
          ) : (
            <>
              <div className="panel-header" style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, background: 'rgba(10,10,10,0.8)', backdropFilter: 'blur(8px)', borderBottom: '1px solid var(--border)' }}>
                 <span><LayoutDashboard size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }}/> Visual Canvas</span>
              </div>
              <div style={{ paddingTop: '36px', height: '100%' }}>
                <GraphCanvas blueprint={currentBlueprint} onBlueprintChange={handleGraphUpdate} />
              </div>
            </>
          )}

        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#000' }}>
          <div className="panel-header">
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)', textTransform: 'none' }}>
              <FileCode2 size={14} color="#844FBA"/> 
              {targetLanguage === 'terraform' ? 'main.tf' : targetLanguage === 'pulumi' ? 'index.ts' : 'template.json'}
            </span>
            {targetLanguage === 'terraform' ? (
              <span className="sync-badge"><div className="sync-dot"/> Bidirectional Sync</span>
            ) : (
              <span className="sync-badge" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', borderColor: 'var(--border)' }}>Read-Only Output</span>
            )}
          </div>
          <Editor
            height="100%"
            language={targetLanguage === 'terraform' ? 'hcl' : targetLanguage === 'pulumi' ? 'typescript' : 'json'}
            theme="cloudast-theme"
            beforeMount={handleEditorWillMount}
            value={hclCode}
            onChange={handleHclChange}
            options={{ minimap: { enabled: false }, fontSize: 14, padding: { top: 16 }, readOnly: targetLanguage !== 'terraform' }}
          />
        </div>

      </div>
      {showSaveModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999,
          background: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{
            background: 'var(--bg-panel)', border: '1px solid var(--border)',
            borderRadius: '8px', padding: '24px', width: '400px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.8)'
          }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '1.2rem', fontWeight: 500 }}>Save Blueprint</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Project Name</label>
                <input 
                  type="text" value={saveName} onChange={(e) => setSaveName(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-main)', borderRadius: '4px', outline: 'none' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Target Region</label>
                <select 
                  value={saveRegion} onChange={(e) => setSaveRegion(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-main)', borderRadius: '4px', outline: 'none' }}
                >
                  <option value="us-east-1">us-east-1 (N. Virginia)</option>
                  <option value="us-west-2">us-west-2 (Oregon)</option>
                  <option value="eu-central-1">eu-central-1 (Frankfurt)</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button 
                onClick={() => setShowSaveModal(false)}
                style={{ padding: '8px 16px', background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-main)', borderRadius: '4px', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button 
                onClick={executeSave} disabled={isSaving}
                style={{ padding: '8px 16px', background: 'var(--orange)', border: 'none', color: '#fff', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}
              >
                {isSaving ? 'Saving...' : 'Confirm Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}