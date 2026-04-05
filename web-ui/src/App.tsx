import { useState, useEffect } from 'react'
import Editor from '@monaco-editor/react'
// Import our engine functions!
import { parseJSXToState } from '../../parsers/jsx-parser/babel-visitor'
import { generateTerraform } from '../../generators/hcl-generator/formatter'
import { parseHCLToState } from '../../parsers/hcl-parser/custom-parser'
import { generateJSX } from '../../generators/jsx-generator/react-builder'

const DEFAULT_JSX = `<Infrastructure>
  <VPC className="cidr-10.0.0.0/16" name="prod-vpc">
    <RDS className="engine-postgres storage-100gb multi-az" name="api-db" />
  </VPC>
</Infrastructure>`

export default function App() {
  const [jsxCode, setJsxCode] = useState(DEFAULT_JSX)
  const [hclCode, setHclCode] = useState('')

  // The Forward Gear: When JSX changes -> Update HCL
  const handleJsxChange = (value: string | undefined) => {
    if (!value) return
    setJsxCode(value)
    try {
      const blueprint = parseJSXToState(value)
      const newHcl = generateTerraform(blueprint)
      setHclCode(newHcl)
    } catch (err) {
      console.log("Waiting for valid JSX syntax...")
    }
  }

  // The Reverse Gear: When HCL changes -> Update JSX (Optional Flex)
// The Reverse Gear: When HCL changes -> Update JSX
  const handleHclChange = (value: string | undefined) => {
    if (!value) return;
    setHclCode(value);
    
    try {
      // 1. Read the raw Terraform and build the JSON Blueprint
      const reverseBlueprint = parseHCLToState(value);
      
      // 2. Generate new React JSX from that Blueprint
      const newJsx = generateJSX(reverseBlueprint);
      
      // 3. Prevent infinite loops by only updating if the code actually changed
      if (newJsx.trim() !== jsxCode.trim()) {
        setJsxCode(newJsx);
      }
    } catch (err) {
      console.log("Waiting for valid HCL syntax...");
    }
  }

  // Run once on load to generate the initial HCL
  useEffect(() => {
    handleJsxChange(DEFAULT_JSX)
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#1e1e1e', color: 'white', fontFamily: 'sans-serif' }}>
      
      {/* Header */}
      <div style={{ padding: '1rem', borderBottom: '1px solid #333' }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem' }}>⚛️ React2AWS Infrastructure Studio</h1>
      </div>

      {/* Split Screen */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        
        {/* Left Side: React Code */}
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

        {/* Right Side: Terraform Code */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '0.5rem', backgroundColor: '#252526', fontSize: '0.9rem', color: '#858585' }}>main.tf (Generated)</div>
          <Editor
            height="100%"
            defaultLanguage="hcl"
            theme="vs-dark"
            value={hclCode}
            onChange={handleHclChange}
            options={{ minimap: { enabled: false }, fontSize: 14, readOnly: false }}
          />
        </div>

      </div>
    </div>
  )
}