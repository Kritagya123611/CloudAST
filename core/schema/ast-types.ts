export type AWSResourceType = 'EC2' | 'S3' | 'Lambda' | 'DynamoDB' | 'RDS' | 'VPC' | 'Subnet' | 'SecurityGroup' | 'IAMRole' | 'CloudFormationStack' | 'APIGateway';

export interface BaseResources {
    id: string;
    type: AWSResourceType;
    properties?: any;
    parent?: string;
}

export interface RDSResource extends BaseResources { type: 'RDS'; engine?: string; storageGb?: number; instanceClass?: string; multiAz?: boolean; }
export interface LambdaResource extends BaseResources { type: 'Lambda'; runtime?: string; handler?: string; codeSizeMb?: number; timeoutSec?: number; }
export interface EC2Resource extends BaseResources { type: 'EC2'; instanceType?: string; amiId?: string; keyName?: string; securityGroupIds?: string[]; }
export interface S3Resource extends BaseResources { type: 'S3'; bucketName?: string; versioningEnabled?: boolean; accessControl?: string; }
export interface VPCResource extends BaseResources { type: 'VPC'; cidrBlock?: string; enableDnsSupport?: boolean; enableDnsHostnames?: boolean; region?: string; }

// --- NEW DIVERSE RESOURCES ---

export interface SubnetResource extends BaseResources {
    type: 'Subnet';
    cidrBlock: string;
    availabilityZone?: string;
    mapPublicIpOnLaunch?: boolean;
}

export interface SecurityGroupResource extends BaseResources {
    type: 'SecurityGroup';
    description?: string;
    ingressPorts?: number[]; // e.g., [80, 443, 22]
}

export interface DynamoDBResource extends BaseResources {
    type: 'DynamoDB';
    hashKey: string;
    billingMode?: 'PROVISIONED' | 'PAY_PER_REQUEST';
}

export interface APIGatewayResource extends BaseResources {
    type: 'APIGateway';
    protocolType: 'HTTP' | 'REST';
    targetLambda?: string; // ID of the lambda to trigger
}

export type AWSResource = RDSResource | LambdaResource | EC2Resource | S3Resource | VPCResource | SubnetResource | SecurityGroupResource | DynamoDBResource | APIGatewayResource;

export interface InfrastructureState {
  resources: Record<string, AWSResource>;
}