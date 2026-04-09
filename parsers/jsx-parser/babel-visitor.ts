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
    JSXElement(path: any) {
      const openingElement = path.node.openingElement;
      const componentName = (openingElement.name as any).name as AWSResourceType;
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
        let parent = undefined;
        const parentJSX = path.findParent((p: any) => p.isJSXElement());
        if (parentJSX) {
           const parentOpening = (parentJSX.node as any).openingElement;
           const parentNameAttr = parentOpening.attributes.find((a: any) => a.name.name === 'name');
           if (parentNameAttr) parent = parentNameAttr.value.value;
        }

        const configProps = parseClassName(className);
        state.resources[id] = {
          id,
          type: componentName,
          parent,
          properties: configProps, 
          ...configProps       
        } as AWSResource;
      }
    }
  });

  return state;
}