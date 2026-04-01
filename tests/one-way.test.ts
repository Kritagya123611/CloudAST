// tests/one-way.test.ts
import { parseJSXToState } from '../parsers/jsx-parser/babel-visitor';

const mockUserCode = `
  <Infrastructure>
    <VPC className="cidr-10.0.0.0/16 region-us-east-1" name="production-vpc">
      <RDS className="engine-postgres storage-100gb multi-az" name="api-db" />
    </VPC>
  </Infrastructure>
`;

console.log("Reading JSX code and generating AST...");
const blueprint = parseJSXToState(mockUserCode);

console.log("\nSuccess! Here is the resulting JSON Blueprint:\n");
console.log(JSON.stringify(blueprint, null, 2));