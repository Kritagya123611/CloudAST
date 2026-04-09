import { InfrastructureState, AWSResource, AWSResourceType } from '../../../../core/schema/ast-types';
const resourceTypeMap: Record<string, AWSResourceType> = {
  'aws_vpc': 'VPC',
  'aws_db_instance': 'RDS',
  'aws_instance': 'EC2',
  'aws_s3_bucket': 'S3'
};

export function parseHCLToState(hclCode: string): InfrastructureState {
  const state: InfrastructureState = { resources: {} };
  const resourceBlockRegex = /resource\s+"([^"]+)"\s+"([^"]+)"\s+{([^}]+)}/g;

  let match;
  while ((match = resourceBlockRegex.exec(hclCode)) !== null) {
    const tfType = match[1];   
    const id = match[2];       
    const blockContent = match[3]; 
    const componentType = resourceTypeMap[tfType];
    if (!componentType) continue;
    const properties = parseHCLProperties(blockContent);
    let mappedProps: any = {};
    if (componentType === 'VPC') {
      mappedProps.cidrBlock = properties['cidr_block'];
    } else if (componentType === 'RDS') {
      mappedProps.engine = properties['engine'];
      mappedProps.storageGb = parseInt(properties['allocated_storage'] || '0', 10);
      mappedProps.multiAz = properties['multi_az'] === 'true';
    }
    state.resources[id] = {
      id,
      type: componentType,
      properties: mappedProps,
      ...mappedProps
    } as AWSResource;
  }

  return state;
}
function parseHCLProperties(blockContent: string): Record<string, string> {
  const props: Record<string, string> = {};
  const propertyRegex = /([a-zA-Z0-9_-]+)\s*=\s*(?:"([^"]*)"|([^"\s\n]+))/g;
  
  let propMatch;
  while ((propMatch = propertyRegex.exec(blockContent)) !== null) {
    const key = propMatch[1];
    const value = propMatch[2] !== undefined ? propMatch[2] : propMatch[3];
    props[key] = value;
  }
  return props;
}