// generators/jsx-generator/react-builder.ts
import { InfrastructureState, AWSResource } from '../../core/ast-types';

export function generateJSX(state: InfrastructureState): string {
  let jsx = `<Infrastructure>\n`;

  // Separate root resources (like VPCs) from child resources (like RDS inside a VPC)
  const allResources = Object.values(state.resources);
  const rootResources = allResources.filter(r => !r.parent);
  const childResources = allResources.filter(r => r.parent);

  for (const res of rootResources) {
    jsx += renderComponent(res, childResources, '  ');
  }

  jsx += `</Infrastructure>`;
  return jsx;
}

function renderComponent(res: AWSResource, allChildren: AWSResource[], indent: string): string {
  // Find any children that belong to this specific resource
  const children = allChildren.filter(c => c.parent === res.id);
  
  // Reconstruct the Tailwind classes from the properties
  let className = '';
  if (res.type === 'VPC' && (res as any).cidrBlock) className += `cidr-${(res as any).cidrBlock} `;
  if (res.type === 'RDS' && (res as any).engine) className += `engine-${(res as any).engine} `;
  if (res.type === 'RDS' && (res as any).storageGb) className += `storage-${(res as any).storageGb}gb `;
  if (res.type === 'RDS' && (res as any).multiAz) className += `multi-az `;
  
  className = className.trim();
  const classProp = className ? ` className="${className}"` : '';

  // If this resource has children (like a VPC with an RDS inside), wrap them!
  if (children.length > 0) {
    let block = `${indent}<${res.type}${classProp} name="${res.id}">\n`;
    for (const child of children) {
      block += renderComponent(child, allChildren, indent + '  ');
    }
    block += `${indent}</${res.type}>\n`;
    return block;
  } else {
    // If it has no children, just return a self-closing tag
    return `${indent}<${res.type}${classProp} name="${res.id}" />\n`;
  }
}