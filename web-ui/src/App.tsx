import { useState, useEffect } from 'react'
import Editor from '@monaco-editor/react'
// Import our engine functions!
import { parseJSXToState } from '../../parsers/jsx-parser/babel-visitor'
import { generateTerraform } from '../../generators/hcl-generator/formatter'
import { parseHCLToState } from '../../parsers/hcl-parser/custom-parser'
import { generateJSX } from '../../generators/jsx-generator/react-builder'
import { InfrastructureState } from '../../core/schema/ast-types'
import GraphCanvas from './components/GraphCanvas'

const DEFAULT_JSX = `<Infrastructure>
  <VPC className="cidr-10.0.0.0/16" name="prod-vpc">
    <RDS className="engine-postgres storage-100gb multi-az" name="api-db" />
  </VPC>
</Infrastructure>`

export default function App() {
  const [jsxCode, setJsxCode] = useState(DEFAULT_JSX)
  const [hclCode, setHclCode] = useState('')
  // ✨ NEW: We hold the JSON Blueprint in state so the Canvas can see it!
  const [currentBlueprint, setCurrentBlueprint] = useState<InfrastructureState>({ resources: {} })

  const handleJsxChange = (value: string | undefined) => {
    if (!value) return
    setJsxCode(value)
    try {
      const blueprint = parseJSXToState(value)
      setCurrentBlueprint(blueprint) // Update the Graph
      setHclCode(generateTerraform(blueprint)) // Update Terraform
    } catch (err) {
      // Waiting for valid JSX syntax...
    }
  }

  const handleHclChange = (value: string | undefined) => {
    if (!value) return
    setHclCode(value)
    try {
      const blueprint = parseHCLToState(value)
      setCurrentBlueprint(blueprint) // Update the Graph
      const newJsx = generateJSX(blueprint)
      if (newJsx.trim() !== jsxCode.trim()) setJsxCode(newJsx)
    } catch (err) {
      // Waiting for valid HCL syntax...
    }
  }

  useEffect(() => { handleJsxChange(DEFAULT_JSX) }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#1e1e1e', color: 'white', fontFamily: 'sans-serif' }}>
      
      {/* Header */}
      <div style={{ padding: '1rem', borderBottom: '1px solid #333' }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem' }}>⚛️ React2AWS Platform IDE</h1>
      </div>

      {/* 3-PANE SPLIT SCREEN */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        
        {/* PANE 1: React Code (25%) */}
        <div style={{ width: '25%', borderRight: '1px solid #333', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '0.5rem', backgroundColor: '#252526', fontSize: '0.9rem', color: '#858585' }}>infrastructure.jsx</div>
          <Editor
            height="100%"
            defaultLanguage="javascript"
            theme="vs-dark"
            value={jsxCode}
            onChange={handleJsxChange}
            options={{ minimap: { enabled: false }, fontSize: 13 }}
          />
        </div>

        {/* PANE 2: The Visual Canvas (50%) */}
        <div style={{ width: '50%', borderRight: '1px solid #333', display: 'flex', flexDirection: 'column', position: 'relative' }}>
           <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 10, backgroundColor: '#00000088', padding: '5px 10px', borderRadius: '5px' }}>Live Architecture Graph</div>
           <GraphCanvas blueprint={currentBlueprint} />
        </div>

        {/* PANE 3: Terraform Code (25%) */}
        <div style={{ width: '25%', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '0.5rem', backgroundColor: '#252526', fontSize: '0.9rem', color: '#858585' }}>main.tf (Generated)</div>
          <Editor
            height="100%"
            defaultLanguage="hcl"
            theme="vs-dark"
            value={hclCode}
            onChange={handleHclChange}
            options={{ minimap: { enabled: false }, fontSize: 13 }}
          />
        </div>

      </div>
    </div>
  )
}
