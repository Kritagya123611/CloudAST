// src/parsers/hcl-parser/custom-parser.ts
import { InfrastructureState, AWSResource, AWSResourceType } from '../../core/schema/ast-types';

// A mapping to translate Terraform resource types back to our JSX component names
const resourceTypeMap: Record<string, AWSResourceType> = {
  'aws_vpc': 'VPC',
  'aws_db_instance': 'RDS',
  'aws_instance': 'EC2',
  'aws_s3_bucket': 'S3'
};

export function parseHCLToState(hclCode: string): InfrastructureState {
  const state: InfrastructureState = { resources: {} };

  // 1. Regex to find blocks like: resource "aws_vpc" "my_vpc" { ... }
  // It captures: Group 1 (aws_vpc), Group 2 (my_vpc), Group 3 (everything inside the braces)
  const resourceBlockRegex = /resource\s+"([^"]+)"\s+"([^"]+)"\s+{([^}]+)}/g;

  let match;
  while ((match = resourceBlockRegex.exec(hclCode)) !== null) {
    const tfType = match[1];     // e.g., "aws_vpc"
    const id = match[2];         // e.g., "production-vpc"
    const blockContent = match[3]; // e.g., "\n  cidr_block = \"10.0.0.0/16\"\n"

    const componentType = resourceTypeMap[tfType];
    
    // If we don't support this resource yet, skip it
    if (!componentType) continue;

    // 2. Parse the properties inside the block
    const properties = parseHCLProperties(blockContent);

    // 3. Map the Terraform properties back to our JSX blueprint properties
    let mappedProps: any = {};
    if (componentType === 'VPC') {
      mappedProps.cidrBlock = properties['cidr_block'];
    } else if (componentType === 'RDS') {
      mappedProps.engine = properties['engine'];
      mappedProps.storageGb = parseInt(properties['allocated_storage'] || '0', 10);
      mappedProps.multiAz = properties['multi_az'] === 'true';
    }

    // 4. Reconstruct the Resource object
    state.resources[id] = {
      id,
      type: componentType,
      properties: mappedProps,
      ...mappedProps
    } as AWSResource;
  }

  return state;
}

// Helper function to extract key = "value" or key = true from inside a block
function parseHCLProperties(blockContent: string): Record<string, string> {
  const props: Record<string, string> = {};
  
  // Regex to match: key = "value" OR key = number/boolean
  const propertyRegex = /([a-zA-Z0-9_-]+)\s*=\s*(?:"([^"]*)"|([^"\s\n]+))/g;
  
  let propMatch;
  while ((propMatch = propertyRegex.exec(blockContent)) !== null) {
    const key = propMatch[1];
    // propMatch[2] is a string in quotes, propMatch[3] is a raw number/boolean
    const value = propMatch[2] !== undefined ? propMatch[2] : propMatch[3];
    props[key] = value;
  }

  return props;
}