import { useState, useEffect } from 'react'
import Editor from '@monaco-editor/react'
// Import our engine functions!
import { parseJSXToState } from '../../parsers/jsx-parser/babel-visitor'
import { generateTerraform } from '../../generators/hcl-generator/formatter'
import { parseHCLToState } from '../../parsers/hcl-parser/custom-parser'
import { generateJSX } from '../../generators/jsx-generator/react-builder'
import { InfrastructureState } from '../../core/schema/ast-types'
import GraphCanvas from './components/GraphCanvas'
import { generatePulumi } from './generators/polyglot-engine/pulumi-generator'
import { generateCloudFormation } from './generators/polyglot-engine/cfn-generator'

const DEFAULT_JSX = `<Infrastructure>
  <VPC className="cidr-10.0.0.0/16" name="prod-vpc">
    <RDS className="engine-postgres storage-100gb multi-az" name="api-db" />
  </VPC>
</Infrastructure>`

export default function App() {
  const [jsxCode, setJsxCode] = useState(DEFAULT_JSX)
  const [hclCode, setHclCode] = useState('')
  const [currentBlueprint, setCurrentBlueprint] = useState<InfrastructureState>({ resources: {} })
  
  // State to track which view the user wants
  const [viewMode, setViewMode] = useState<'code' | 'visual'>('code')
  const [targetLanguage, setTargetLanguage] = useState<'terraform' | 'pulumi' | 'cloudformation'>('terraform')

  const handleJsxChange = (value: string | undefined) => {
    if (!value) return
    setJsxCode(value)
    try {
      const blueprint = parseJSXToState(value)
      setCurrentBlueprint(blueprint)
      
      // ✨ FIX: Check the dropdown before generating!
      if (targetLanguage === 'terraform') setHclCode(generateTerraform(blueprint));
      if (targetLanguage === 'pulumi') setHclCode(generatePulumi(blueprint));
      if (targetLanguage === 'cloudformation') setHclCode(generateCloudFormation(blueprint));
    } catch (err) {}
  }

  const handleHclChange = (value: string | undefined) => {
    if (!value) return
    setHclCode(value)
    try {
      const blueprint = parseHCLToState(value)
      setCurrentBlueprint(blueprint)
      const newJsx = generateJSX(blueprint)
      if (newJsx.trim() !== jsxCode.trim()) setJsxCode(newJsx)
    } catch (err) {}
  }

  const handleGraphUpdate = (newBlueprint: InfrastructureState) => {
    setCurrentBlueprint(newBlueprint);
    setJsxCode(generateJSX(newBlueprint));
    
    // Polyglot Engine Switcher
    if (targetLanguage === 'terraform') setHclCode(generateTerraform(newBlueprint));
    if (targetLanguage === 'pulumi') setHclCode(generatePulumi(newBlueprint));
    if (targetLanguage === 'cloudformation') setHclCode(generateCloudFormation(newBlueprint));
  }

  // If the user changes the dropdown, instantly re-translate the existing graph
  useEffect(() => {
    handleGraphUpdate(currentBlueprint);
  }, [targetLanguage]);

  useEffect(() => { handleJsxChange(DEFAULT_JSX) }, [])

  // Helper styles for our buttons
  const activeBtnStyle = { padding: '8px 16px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }
  const inactiveBtnStyle = { padding: '8px 16px', background: '#333', color: '#aaa', border: 'none', borderRadius: '4px', cursor: 'pointer' }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#1e1e1e', color: 'white', fontFamily: 'sans-serif' }}>
      
      {/* Header with Toggles */}
      <div style={{ padding: '1rem', borderBottom: '1px solid #333', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem' }}>⚛️ React2AWS Platform IDE</h1>
        
        {/* ✨ FIX: Cleaned up Header Toggles & Dropdown */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <select 
            value={targetLanguage} 
            onChange={(e) => setTargetLanguage(e.target.value as any)}
            style={{ padding: '8px', background: '#252526', color: 'white', border: '1px solid #4f46e5', borderRadius: '4px', cursor: 'pointer', outline: 'none' }}
          >
            <option value="terraform">🎯 Target: Terraform (HCL)</option>
            <option value="pulumi">🎯 Target: Pulumi (TS)</option>
            <option value="cloudformation">🎯 Target: CloudFormation (JSON)</option>
          </select>
          
          <button style={viewMode === 'code' ? activeBtnStyle : inactiveBtnStyle} onClick={() => setViewMode('code')}>💻 Code Editor (50:50)</button>
          <button style={viewMode === 'visual' ? activeBtnStyle : inactiveBtnStyle} onClick={() => setViewMode('visual')}>📊 Visual Canvas</button>
        </div>
      </div>

      {/* Dynamic Main Body */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        
        {/* PANE 1: React Code (Only shows in 'code' mode) */}
        {viewMode === 'code' && (
          <div style={{ flex: 1, borderRight: '1px solid #333', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '0.5rem', backgroundColor: '#252526', fontSize: '0.9rem', color: '#858585' }}>infrastructure.jsx</div>
            <Editor
              height="100%"
              defaultLanguage="javascript"
              theme="vs-dark"
              value={jsxCode}
              onChange={handleJsxChange}
              options={{ minimap: { enabled: false }, fontSize: 14 }}
            />
          </div>
        )}

        {/* PANE 2: The Visual Canvas (Only shows in 'visual' mode) */}
        {viewMode === 'visual' && (
          <div style={{ flex: 1.5, borderRight: '1px solid #333', display: 'flex', flexDirection: 'column', position: 'relative' }}>
             <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 10, backgroundColor: '#00000088', padding: '5px 10px', borderRadius: '5px' }}>Live Architecture Graph</div>
             <GraphCanvas 
                blueprint={currentBlueprint} 
                onBlueprintChange={handleGraphUpdate} 
              />
          </div>
        )}

        {/* PANE 3: The Polyglot Output */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '0.5rem', backgroundColor: '#252526', fontSize: '0.9rem', color: '#858585', display: 'flex', justifyContent: 'space-between' }}>
            <span>
              {targetLanguage === 'terraform' && 'main.tf'}
              {targetLanguage === 'pulumi' && 'index.ts'}
              {targetLanguage === 'cloudformation' && 'template.json'}
            </span>
            <span style={{ color: '#4f46e5' }}>{targetLanguage === 'terraform' ? 'Bidirectional Sync Active' : 'Read-Only Mode'}</span>
          </div>
          <Editor
            height="100%"
            // Change syntax highlighting dynamically!
            language={targetLanguage === 'terraform' ? 'hcl' : targetLanguage === 'pulumi' ? 'typescript' : 'json'}
            theme="vs-dark"
            value={hclCode}
            onChange={handleHclChange}
            // Lock the editor if it's not Terraform
            options={{ minimap: { enabled: false }, fontSize: 14, readOnly: targetLanguage !== 'terraform' }}
          />
        </div>

      </div>
    </div>
  )
}
