import { CloudFormationClient, CreateStackCommand } from "@aws-sdk/client-cloudformation";

interface DeployParams {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
  templateBody: string; // The CFN JSON/YAML string from your generator
  stackName: string;
}

export const deployToAWS = async (params: DeployParams) => {
  // 1. Initialize the client securely with temporary credentials
  const client = new CloudFormationClient({
    region: params.region,
    credentials: {
      accessKeyId: params.accessKeyId,
      secretAccessKey: params.secretAccessKey,
    },
  });

  // 2. Prepare the CloudFormation payload
  const command = new CreateStackCommand({
    StackName: params.stackName,
    TemplateBody: params.templateBody,
    Capabilities: ["CAPABILITY_NAMED_IAM"], // Required if your AST generates IAM roles
  });

  // 3. Fire it off to AWS
  try {
    const response = await client.send(command);
    return { success: true, stackId: response.StackId };
  } catch (error: any) {
    console.error("AWS Deployment Failed:", error);
    return { success: false, error: error.message };
  }
};