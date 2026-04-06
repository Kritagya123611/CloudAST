import { InfrastructureState } from '../../../../core/schema/ast-types';

export function generatePulumi(state: InfrastructureState): string {
  let code = `import * as pulumi from "@pulumi/pulumi";\nimport * as aws from "@pulumi/aws";\n\n`;

  Object.values(state.resources).forEach(res => {
    code += `// Auto-generated Pulumi for ${res.id}\n`;
    
    if (res.type === 'VPC') {
      const cidr = (res as any).cidrBlock || "10.0.0.0/16";
      code += `const ${res.id.replace(/-/g, '_')} = new aws.ec2.Vpc("${res.id}", {\n`;
      code += `    cidrBlock: "${cidr}",\n`;
      code += `    enableDnsHostnames: true,\n`;
      code += `    enableDnsSupport: true,\n`;
      code += `    tags: { Name: "${res.id}" },\n`;
      code += `});\n\n`;
    } 
    else if (res.type === 'RDS') {
      const engine = (res as any).engine || "postgres";
      const storage = (res as any).storageGb || 20;
      code += `const ${res.id.replace(/-/g, '_')} = new aws.rds.Instance("${res.id}", {\n`;
      code += `    engine: "${engine}",\n`;
      code += `    instanceClass: "db.t3.micro",\n`;
      code += `    allocatedStorage: ${storage},\n`;
      code += `    skipFinalSnapshot: true,\n`;
      code += `});\n\n`;
    }
    else if (res.type === 'S3') {
      code += `const ${res.id.replace(/-/g, '_')} = new aws.s3.Bucket("${res.id}", {\n`;
      code += `    acl: "private",\n`;
      code += `    tags: { Environment: "Dev" },\n`;
      code += `});\n\n`;
    }
    else {
      code += `// ${res.type} component generation not yet implemented for Pulumi.\n\n`;
    }
  });

  return code;
}