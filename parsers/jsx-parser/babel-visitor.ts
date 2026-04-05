/*
This is the heavy lifter. Babel will read the JSX, find the <VPC> or <RDS> tags, 
grab the className, pass it to our helper above, and save it to our blueprint.
*/ 
// parsers/jsx-parser/babel-visitor.ts
// parsers/jsx-parser/babel-visitor.ts
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import { InfrastructureState, AWSResource, AWSResourceType } from '../../core/schema/ast-types';
import { parseClassName } from '../classname-parser/tailwind-infra';

export function parseJSXToState(jsxCode: string): InfrastructureState {
  const state: InfrastructureState = { resources: {} };

  const ast = parse(jsxCode, {
    sourceType: 'module',
    plugins: ['jsx']
  });

  traverse(ast, {
    JSXElement(path) {
      const openingElement = path.node.openingElement;
      const componentName = (openingElement.name as any).name as AWSResourceType;

      // FIX 1: Updated to match your AWSResourceType
      const validComponents: AWSResourceType[] = [
        'EC2', 'S3', 'Lambda', 'DynamoDB', 'RDS', 'VPC', 'Subnet', 'SecurityGroup', 'IAMRole', 'CloudFormationStack'
      ];

      if (validComponents.includes(componentName)) {
        let id = '';
        let className = '';

        openingElement.attributes.forEach((attr: any) => {
          if (attr.name.name === 'name') id = attr.value.value;
          if (attr.name.name === 'className') className = attr.value.value;
        });

        if (!id) return; 

        // FIX 2: Changed parentId to parent to match BaseResources
        let parent = undefined;
        const parentJSX = path.findParent((p) => p.isJSXElement());
        if (parentJSX) {
           const parentOpening = (parentJSX.node as any).openingElement;
           const parentNameAttr = parentOpening.attributes.find((a: any) => a.name.name === 'name');
           if (parentNameAttr) parent = parentNameAttr.value.value;
        }

        const configProps = parseClassName(className);

        // FIX 3: Cast to AWSResource, not InfrastructureResource
        state.resources[id] = {
          id,
          type: componentName,
          parent,
          properties: configProps, // Based on your BaseResources definition
          ...configProps           // Spread at top level for specific resource interfaces
        } as AWSResource;
      }
    }
  });

  return state;
}