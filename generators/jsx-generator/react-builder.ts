import { InfrastructureState, AWSResource } from '../../core/schema/ast-types';

export function generateJSX(state: InfrastructureState): string {
  let jsx = `<Infrastructure>\n`;
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
  const children = allChildren.filter(c => c.parent === res.id);
  let className = '';
  if (res.type === 'VPC' && (res as any).cidrBlock) className += `cidr-${(res as any).cidrBlock} `;
  if (res.type === 'RDS' && (res as any).engine) className += `engine-${(res as any).engine} `;
  if (res.type === 'RDS' && (res as any).storageGb) className += `storage-${(res as any).storageGb}gb `;
  if (res.type === 'RDS' && (res as any).multiAz) className += `multi-az `;
  
  className = className.trim();
  const classProp = className ? ` className="${className}"` : '';
  if (children.length > 0) {
    let block = `${indent}<${res.type}${classProp} name="${res.id}">\n`;
    for (const child of children) {
      block += renderComponent(child, allChildren, indent + '  ');
    }
    block += `${indent}</${res.type}>\n`;
    return block;
  } else {
    return `${indent}<${res.type}${classProp} name="${res.id}" />\n`;
  }
}