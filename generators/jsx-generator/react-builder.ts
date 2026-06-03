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
  
  // Existing Parsers
  if (res.type === 'VPC' && (res as any).cidrBlock) className += `cidr-${(res as any).cidrBlock} `;
  if (res.type === 'RDS' && (res as any).engine) className += `engine-${(res as any).engine} `;
  if (res.type === 'RDS' && (res as any).storageGb) className += `storage-${(res as any).storageGb}gb `;
  if (res.type === 'RDS' && (res as any).multiAz) className += `multi-az `;
  
  // New Diverse Parsers
  if (res.type === 'Subnet' && (res as any).cidrBlock) className += `cidr-${(res as any).cidrBlock} `;
  if (res.type === 'Subnet' && (res as any).availabilityZone) className += `az-${(res as any).availabilityZone} `;
  if (res.type === 'DynamoDB' && (res as any).billingMode) className += `billing-${(res as any).billingMode.toLowerCase()} `;
  if (res.type === 'DynamoDB' && (res as any).hashKey) className += `hk-${(res as any).hashKey} `;
  if (res.type === 'SecurityGroup' && (res as any).ingressPorts) className += `ports-[${(res as any).ingressPorts.join(',')}] `;
  if (res.type === 'APIGateway' && (res as any).protocolType) className += `protocol-${(res as any).protocolType.toLowerCase()} `;
  // Add these inside your renderComponent function in react-builder.ts
// Some resource types may not be present in the AWSResource.type union; use a safe any-cast for checks
if ((res as any).type === 'GlueCatalog' && (res as any).databaseName) className += `db-${(res as any).databaseName} `;
if ((res as any).type === 'GlueCrawler' && (res as any).scheduleCron) className += `cron-[${(res as any).scheduleCron.replace(/\s+/g, '_')}] `;
if ((res as any).type === 'Athena') className += `serverless-sql `;
  
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