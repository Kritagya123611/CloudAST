<div align="center">

<br />

# CloudAST
**Component-Driven Cloud Infrastructure Compiler**

[![Status: Public Beta](https://img.shields.io/badge/Status-Public_Beta-E8500A?style=for-the-badge)](https://react2aws.xyz)
[![Compiler: JSX to HCL](https://img.shields.io/badge/Compiler-JSX_to_HCL-111111?style=for-the-badge&logo=react)](https://react2aws.xyz)
[![Powered by Supabase](https://img.shields.io/badge/Powered_by-Supabase-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-111111?style=for-the-badge)](LICENSE)

<br />

<p align="center" style="font-size: 1.1rem; line-height: 1.6;">
  Architect enterprise AWS environments using <b>React (JSX)</b> or a bidirectional <b>Visual Canvas</b>. <br />
  Instantly compile topologies into production-ready <b>Terraform</b>, <b>Pulumi</b>, or <b>CloudFormation</b>.
</p>

<br />
</div>

---

## The Paradigm

Modern infrastructure tooling hasn't caught up with how developers actually think. You already model UI as a hierarchy of composable components — VPCs wrap subnets, subnets contain compute, compute talks to databases. CloudAST makes that mental model the actual syntax.

**If you can build a React app, you can now provision enterprise AWS infrastructure.**

---

## Features

### Polyglot Compiler Engine

One internal AST. Three deployment targets. The compiler parses your JSX graph and emits whichever format your organization already uses.

| Target | Mode | Output |
|---|---|---|
| Terraform (HCL) | Bidirectional | Modular directory: `main.tf`, `variables.tf`, AWS modules |
| Pulumi (TypeScript) | Read-only | Strongly-typed `@pulumi/aws` instantiations |
| AWS CloudFormation | Read-only | Native JSON with `Ref`, `DependsOn`, and IAM roles |

### Direct AWS Deployment

CloudAST connects to your AWS account and deploys your stack without leaving the studio. No CLI installs. No copy-pasting configs.

- Connect once using AWS credentials or an IAM role (stored encrypted, never logged)
- Review the full changeset — resources to create, modify, or destroy — before anything touches prod
- Watch the stack build live with real-time deployment status
- Automatic rollback on any failure

> **Note:** The browser-based deploy path targets CloudFormation. Terraform deployments are handled through the companion local deployment daemon (see [Local Deployment Bridge](#local-deployment-bridge)).

### Bidirectional Visual Canvas

Built on React Flow. The canvas and the Monaco editor are two views into the same AST — they stay in perfect sync.

- **Visual → Code:** Drag a node onto the canvas. JSX and IaC output are generated immediately.
- **Code → Visual:** Type a component in the editor. The graph renders the node in the correct architectural tier instantly.

### Tailwind-Inspired Configuration

Resource configuration lives in the `className` prop. No boilerplate. No looking up parameter group names.

```jsx
{/* Instead of 50+ lines of Terraform: */}
<RDS className="engine-postgres instance-lg multi-az storage-100gb backup-7d" />
```

The compiler handles subnet associations, parameter groups, security group rules, and backup configuration automatically.

### Architectural Guardrails

The validation engine checks the graph before compilation runs. It blocks illegal configurations — databases outside subnets, open security groups, missing IAM execution roles — so broken architectures cannot be deployed.

### Big-Data & Analytics Primitives

CloudAST supports full-scale modern data pipeline topologies natively in the browser:

```jsx
<S3 className="encrypt-aes256 versioning-enabled" name="raw-data-sink" />
<GlueCatalog name="events-registry" />
<GlueCrawler className="schedule-cron target-s3" name="schema-discoverer" />
<Athena className="workgroup-isolated results-encrypted" />
```

| Component | AWS Resources Scaffolded |
|---|---|
| `<GlueCatalog>` | `aws_glue_catalog_database` — decoupled metadata registry for schemaless file streams |
| `<GlueCrawler>` | `aws_glue_crawler` with cron trigger + auto-generated least-privilege IAM role and read policies |
| `<Athena>` | `aws_athena_workgroup` with isolated query environment tied to encrypted result storage |
| `<S3>` | `aws_s3_bucket` + `aws_s3_bucket_server_side_encryption_configuration` + `aws_s3_bucket_public_access_block` |

### Production Auth System

Full Supabase integration with email/password and OAuth via GitHub and Google. Race-condition-safe routing with `replace: true` prevents auth bounce loops and back-button breakage after OAuth redirects. The auth pipeline dynamically toggles callback URLs between `localhost:5173` (development) and the production Vercel domain without manual configuration.

---

## Supported AWS Primitives

| JSX Component | AWS Resources Scaffolded |
|---|---|
| `<VPC>` | VPC · Public & Private Subnets · Internet Gateway · NAT Gateway · Route Tables |
| `<Subnet>` | Modular private/public network isolation with dynamic ingress rule parsing |
| `<SecurityGroup>` | Ingress/egress rules from `ingressPorts` array prop |
| `<RDS>` | DB Instance · Subnet Group · Parameter Group · Automated Backups |
| `<Fargate>` | ECS Cluster · Task Definition · Execution Role · Security Group |
| `<EC2>` | EC2 Instance · AMI · Key Pair · Instance Profile |
| `<Lambda>` | Lambda Function · IAM Execution Role · CloudWatch Log Group |
| `<S3>` | S3 Bucket · Public Access Block · Server-Side Encryption |
| `<DynamoDB>` | NoSQL table with `hashKey`, `billingMode`, and on-demand capacity |
| `<ALB>` | Application Load Balancer · Target Group · Listeners |
| `<APIGateway>` | `aws_apigatewayv2_api` HTTP/REST boundary with auto-wired Lambda permissions |
| `<GlueCatalog>` | Glue Database metadata registry |
| `<GlueCrawler>` | Glue Crawler + IAM role + cron schedule |
| `<Athena>` | Athena Workgroup with encrypted result bucket |

---

## The Compiler Pipeline

```
┌──────────────────────────────────────────┐
│             Monaco Editor                │
│        (JSX Input / Syntax Highlight)    │
└─────────────────┬────────────────────────┘
                  │ JSX string
                  ▼
┌──────────────────────────────────────────┐
│         Babel-Based Lexical Visitor      │
│     (Tokenizes JSX → Component Tree)     │
└─────────────────┬────────────────────────┘
                  │ Component hierarchy
                  ▼
┌──────────────────────────────────────────┐
│       InfrastructureState AST Builder    │
│      (Maps hierarchy → JSON schema)      │
└─────────────────┬────────────────────────┘
                  │ AST JSON
                  ▼
┌──────────────────────────────────────────┐
│            Validation Engine             │
│  (Edge rules · Security · Subnet bounds) │
└──────┬──────────┬──────────┬─────────────┘
       ▼          ▼          ▼
  ┌─────────┐ ┌────────┐ ┌───────────────┐
  │ HCL Gen │ │ TS Gen │ │   JSON Gen    │
  │Terraform│ │ Pulumi │ │CloudFormation │
  └────┬────┘ └───┬────┘ └───────┬───────┘
       └──────────┴──────────────┘
                  │
       ┌──────────┴──────────┐
       │                     │
       ▼                     ▼
┌─────────────┐    ┌──────────────────────┐
│  AWS Direct │    │  Local Deploy Daemon │
│   Deploy    │    │  (terraform apply)   │
│(CloudFormn) │    │   via Node.js bridge │
└─────────────┘    └──────────────────────┘
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript + Vite |
| Visual Canvas | React Flow |
| Code Editor | Monaco Editor |
| Compiler | Custom Babel-based AST visitor |
| Auth & Database | Supabase (PostgreSQL + GoTrue) |
| Styling | CSS-in-JS (custom design system) |
| Fonts | Syne · Instrument Sans · IBM Plex Mono |
| Icons | Lucide React |
| Local Deploy Bridge | Node.js + Express |
| IaC Runtime | Terraform CLI · AWS CLI |

---

## Local Development Setup

### Prerequisites

```
Node.js        v18.0.0+
Terraform CLI  Any recent version
AWS CLI        Configured with deployment credentials
Supabase       A project with auth enabled
```

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/Kritagya123611/CloudAST.git
cd CloudAST
```

**2. Install dependencies**

```bash
# Frontend
cd web-ui && npm install

# Local deployment bridge
cd ../deploy-server && npm install
```

**3. Configure environment variables**

Create `.env.local` inside `web-ui/`:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Find both values in your Supabase project under **Settings → API**.

**4. Enable OAuth providers (optional)**

In your Supabase dashboard: **Authentication → Providers** → enable GitHub and/or Google.

Set the redirect URL to `http://localhost:5173/login`.

**5. Launch**

```bash
# Terminal 1 — Studio IDE
cd web-ui && npm run dev

# Terminal 2 — Local Deployment Daemon
cd deploy-server && node server.js
```

The CloudAST IDE will be available at `http://localhost:5173`.

---

## Usage

### Writing Infrastructure as JSX

```jsx
<Infrastructure provider="aws" region="us-east-1">
  <VPC className="cidr-10.0.0.0/16 az-2 nat-enabled">

    {/* PostgreSQL — multi-AZ, 100GB, 7-day backups */}
    <RDS className="engine-postgres storage-100gb multi-az backup-7d" />

    {/* Containerized API — auto-scales 3–10 tasks */}
    <Fargate className="cpu-1 mem-2gb port-8080 scale-3-10" />

    {/* Serverless event handler */}
    <Lambda className="runtime-nodejs22 timeout-30 memory-512" />

  </VPC>
</Infrastructure>
```

### Selecting a Compile Target

Use the **Target** dropdown in the top-right of the Studio:

- **Terraform (HCL)** — Bidirectional. Edits in either pane sync back.
- **Pulumi (TypeScript)** — Read-only output.
- **AWS CloudFormation** — Read-only output. Used for direct browser deploy.

### Deploying

**Direct from browser (CloudFormation):**
1. Connect your AWS credentials in the Studio settings
2. Design your topology and select CloudFormation as the target
3. Click **Deploy** — review the changeset, then confirm
4. Watch the stack build live. CloudAST rolls back automatically on failure.

**Local via Terraform daemon:**

Click **Deploy** with Terraform selected as the target. The browser sends the compiled output to the local daemon, which runs `terraform apply` against your configured AWS credentials.

---

## Local Deployment Bridge

The `deploy-server/` directory contains a companion Node.js/Express daemon that bridges browser-compiled Terraform output to your local machine.

It receives the compiled `.tf` files via `POST` and executes `terraform apply` using your local AWS CLI credentials — no CI/CD pipeline required.

```bash
cd deploy-server && node server.js
# Listens on http://localhost:3001
```

---

## Project Structure

```
cloudast/
├── web-ui/                         # React frontend (Vite)
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Landing.tsx         # Marketing page
│   │   │   ├── Auth.tsx            # Login / register
│   │   │   ├── Dashboard.tsx       # Project management
│   │   │   └── Studio.tsx          # Main IDE
│   │   ├── components/
│   │   │   ├── canvas/             # React Flow nodes, edges, dock
│   │   │   └── editor/             # Monaco wrapper, output pane
│   │   ├── compiler/
│   │   │   ├── lexer.ts            # Babel-based JSX visitor
│   │   │   ├── ast.ts              # InfrastructureState schema
│   │   │   ├── ast-types.ts        # Component type definitions
│   │   │   ├── validator.ts        # Edge & resource validation
│   │   │   └── generators/
│   │   │       ├── terraform.ts
│   │   │       ├── pulumi.ts
│   │   │       └── cloudformation.ts
│   │   ├── context/
│   │   │   └── AuthContext.tsx     # Global session management
│   │   └── supabaseClient.ts
│   └── .env.local
│
└── deploy-server/                  # Local deployment bridge
    └── server.js                   # Express API → terraform apply
```

---

## Contributing

Contributions are welcome. To propose a change:

1. Fork the repository
2. Create a branch: `git checkout -b feat/your-feature`
3. Commit clearly: `git commit -m 'feat: describe what changed and why'`
4. Push and open a Pull Request

Keep PRs focused. One feature or fix per PR makes reviews faster.

---

## License

Released under the [MIT License](LICENSE).
