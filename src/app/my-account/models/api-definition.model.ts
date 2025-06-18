export interface IApiDefinition {
  name: string;
  httpMethod: string;
  path: string;
  parameters: string[];
  sample: string;
  return: string;
}
