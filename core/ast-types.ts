/*in this file we define what types of resources we would have 
and how they would be represented in the AST (Abstract Syntax Tree)
A Type (What is it?)
An ID/Name (What are we calling it?)
Properties (How is it configured?)
A Parent (Is it inside a VPC?)
and we would create json according to this structure 
*/
export type AWSResourceType='EC2'|'S3'|'Lambda'|'DynamoDB'|'RDS'|'VPC'|'Subnet'|'SecurityGroup'|'IAMRole'|'CloudFormationStack';

export interface BaseResources{
    id:string;
    type:AWSResourceType;
    properties:any;
    parent?:string;
}

//defining custom for rds resource
export interface RDSResource extends BaseResources{
    type:'RDS';
    engine: string;      // e.g., "mysql", "postgres"
    storageGb: number;   // e.g., 100
    instanceClass: string; // e.g., "db.t3.micro"
    multiAz: boolean;
}

//defining custom for lambda resource
export interface LambdaResource extends BaseResources{
    type:'Lambda';
    runtime: string;     // e.g., "nodejs14.x", "python3.8"
    handler: string;     // e.g., "index.handler"
    codeSizeMb: number;  // e.g., 50
    timeoutSec: number;  // e.g., 30
}

//defining custom for EC2 resource
export interface EC2Resource extends BaseResources{
    type:'EC2';
    instanceType: string; // e.g., "t2.micro"
    amiId: string;       // e.g., "ami-0abcdef1234567890"
    keyName: string;     // e.g., "my-key-pair"
    securityGroupIds: string[]; // e.g., ["sg-0123456789abcdef0"]
}

//defining custom for S3 resource
export interface S3Resource extends BaseResources{
    type:'S3';
    bucketName: string;  // e.g., "my-bucket"
    versioningEnabled: boolean;
    accessControl: string; // e.g., "private", "public-read"
}

//defining custom for VPC resource
export interface VPCResource extends BaseResources{
    type:'VPC';
    cidrBlock: string;  
    enableDnsSupport: boolean;
    enableDnsHostnames: boolean;
    region: string; // e.g., "us-west-2"
}

export type AWSResource = RDSResource | LambdaResource | EC2Resource | S3Resource | VPCResource;

export interface InfrastructureState {
  resources: Record<string, AWSResource>;
}
