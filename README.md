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

[**Launch Studio**](#local-development-setup) &nbsp;&nbsp;|&nbsp;&nbsp; [**Read the Docs**](#table-of-contents) &nbsp;&nbsp;|&nbsp;&nbsp; [**Report a Bug**](https://github.com/your-org/cloudast/issues)

<br />
</div>

---

## The Paradigm: React for Infrastructure

CloudAST eliminates the cognitive load of managing thousands of lines of YAML or HCL. By treating cloud resources as composable UI components, you can architect infrastructure using the exact same mental models used for modern frontend development.

If you can build a React application, you can now provision enterprise-grade AWS infrastructure.

### The Syntax Translation

Write standard JSX with Tailwind-inspired configuration classes. The internal Abstract Syntax Tree (AST) engine validates your logic and compiles it into the industry-standard tools your organization already uses.

**Input: React (JSX)**
```jsx
<Infrastructure>
  <VPC className="cidr-10.0.0.0/16 region-us-east-1">
    <RDS className="engine-postgres instance-lg multi-az" name="primary-db" />
    <Fargate className="mem-2gb cpu-1 port-8080" name="api-service" />
  </VPC>
</Infrastructure>

## What is CloudAST?

CloudAST is a **browser-based infrastructure compiler** that eliminates the gap between architectural intent and deployed code.

You draw. The engine writes.

```jsx
<Infrastructure>
  <VPC className="cidr-10.0.0.0/16 region-us-east-1">
    <RDS className="engine-postgres multi-az" />
    <Fargate className="mem-2gb cpu-1 port-8080" />
    <Lambda className="runtime-nodejs22" />
  </VPC>
</Infrastructure>
```

That five-line JSX block compiles into a fully modular Terraform directory, a typed Pulumi stack, or a native CloudFormation template — your choice, in real time.

No new proprietary DSL. No lock-in. The output is standard IaC your team already knows.

---

## Core Features

###  &nbsp;Polyglot Compiler Engine

One internal AST. Three deployment targets. The compiler translates your JSX graph into whichever format your organization uses — with bidirectional sync for Terraform and read-only output for Pulumi and CloudFormation.

| Target | Mode | Output |
|---|---|---|
| **Terraform (HCL)** | Bidirectional | Modular directory with `main.tf`, `variables.tf`, AWS modules |
| **Pulumi (TypeScript)** | Read-only | Strongly-typed `@pulumi/aws` instantiations |
| **AWS CloudFormation** | Read-only | Native JSON with `Refs`, `DependsOn`, and IAM roles |

###  &nbsp;Bidirectional Visual Canvas

Built on React Flow. The canvas and the code editor are two views into the same AST — they stay in perfect sync.

- **Visual → Code:** Drag a node onto the canvas. JSX and IaC are written for you immediately.
- **Code → Visual:** Type a component in the Monaco editor. The graph renders the node in the correct architectural tier instantly.

###  &nbsp;Tailwind-Inspired Configuration

Resource configuration lives in the `className` prop. No boilerplate. No looking up parameter group names.

```jsx
<!-- Instead of 50 lines of Terraform: -->
<RDS className="engine-postgres instance-lg multi-az storage-100gb" />
```

The compiler handles subnet associations, parameter groups, and backup configuration automatically.

###  &nbsp;Architectural Guardrails

The validation engine checks the graph before compilation runs. It blocks illegal configurations — databases outside subnets, open security groups, missing execution roles — so broken architectures simply cannot be deployed.

###  &nbsp;Production Auth System

Full Supabase integration with email/password and OAuth via GitHub and Google. Race-condition-safe routing with `replace: true` prevents auth bounce loops and broken back-button behavior after OAuth redirects.

###  &nbsp;Local Deployment Bridge

A companion Node.js/Express daemon bridges the browser to your host machine. It receives the compiled `.tf` output via POST and executes `terraform apply` using your local AWS CLI credentials — no CI/CD pipeline required for local deployments.

---

## The Compiler Pipeline

```
  ┌─────────────────────────────────────────────────────────────┐
  │                      Monaco Editor                          │
  │              (JSX Input / Syntax Highlighting)              │
  └──────────────────────────┬──────────────────────────────────┘
                             │  JSX String
                             ▼
  ┌─────────────────────────────────────────────────────────────┐
  │               Babel-Based Lexical Visitor                   │
  │          (Tokenizes JSX → Component Hierarchy)              │
  └──────────────────────────┬──────────────────────────────────┘
                             │  Component Tree
                             ▼
  ┌─────────────────────────────────────────────────────────────┐
  │              InfrastructureState AST Builder                │
  │        (Maps hierarchy → internal JSON schema)              │
  └──────────────────────────┬──────────────────────────────────┘
                             │  AST JSON
                             ▼
  ┌─────────────────────────────────────────────────────────────┐
  │                   Validation Engine                         │
  │    (Edge validation · Security checks · Subnet bounds)      │
  └──────────────────────────┬──────────────────────────────────┘
                             │  Validated AST
                    ┌────────┴────────┬────────────────┐
                    ▼                 ▼                 ▼
            ┌──────────┐    ┌─────────────┐    ┌──────────────┐
            │  HCL Gen │    │   TS Gen    │    │   JSON Gen   │
            │Terraform │    │   Pulumi    │    │CloudFormation│
            └────┬─────┘    └──────┬──────┘    └──────┬───────┘
                 └─────────────────┴───────────────────┘
                                   │
                                   ▼
                     ┌─────────────────────────┐
                     │   Deployment Daemon      │
                     │  (Node.js local bridge)  │
                     │  terraform apply → AWS   │
                     └─────────────────────────┘
```

---

## Supported AWS Primitives

| JSX Component | AWS Resources Scaffolded |
|---|---|
| `<VPC>` | VPC · Public & Private Subnets · Internet Gateway · NAT Gateway · Route Tables |
| `<RDS>` | DB Instance · Subnet Group · Parameter Group · Automated Backups |
| `<Fargate>` | ECS Cluster · Task Definition · Execution Role · Security Group |
| `<EC2>` | EC2 Instance · AMI · Key Pair · Instance Profile |
| `<Lambda>` | Lambda Function · IAM Execution Role · CloudWatch Log Group |
| `<S3>` | S3 Bucket · Public Access Block · Server-Side Encryption |
| `<ALB>` | Application Load Balancer · Target Group · Listeners |

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | React 18 + TypeScript + Vite |
| **Visual Canvas** | React Flow |
| **Code Editor** | Monaco Editor |
| **Compiler** | Custom Babel-based AST visitor |
| **Auth & Database** | Supabase (PostgreSQL + GoTrue) |
| **Styling** | CSS-in-JS (custom design system) |
| **Fonts** | Bebas Neue · DM Sans · DM Mono |
| **Icons** | Lucide React |
| **Deployment Bridge** | Node.js + Express |
| **IaC Runtime** | Terraform CLI · AWS CLI |

---

## Local Development Setup

### Prerequisites

Ensure the following are installed and configured on your machine:

```
Node.js        v18.0.0 or higher
Terraform CLI  Any recent version
AWS CLI        Configured with deployment credentials (aws configure)
Supabase       A project with auth enabled
```

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/your-organization/cloudast.git
cd cloudast
```

**2. Install dependencies**

```bash
# Install frontend dependencies
cd web-ui && npm install

# Install deployment bridge dependencies
cd ../deploy-server && npm install
```

**3. Configure environment variables**

Create a `.env.local` file inside the `web-ui` directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

> You can find both values in your Supabase project under **Settings → API**.

**4. Enable OAuth providers** *(optional)*

In your Supabase dashboard go to **Authentication → Providers** and enable GitHub and/or Google. Set the redirect URL to:

```
http://localhost:5173/login
```

**5. Launch the platform**

Open two terminal sessions and run:

```bash
# Terminal 1 — Client IDE
cd web-ui && npm run dev

# Terminal 2 — Local Deployment Daemon
cd deploy-server && node server.js
```

The CloudAST IDE will be available at **[http://localhost:5173](http://localhost:5173)**.

---

## Usage

### Writing Infrastructure as JSX

```jsx
<Infrastructure>
  <VPC className="cidr-10.0.0.0/16 region-us-east-1">

    {/* PostgreSQL database — multi-AZ, 100GB storage */}
    <RDS className="engine-postgres storage-100gb multi-az" />

    {/* Containerized API */}
    <Fargate className="mem-2gb cpu-1 port-8080" />

    {/* Serverless handler */}
    <Lambda className="runtime-nodejs22" />

  </VPC>
</Infrastructure>
```

### Selecting a Compile Target

Use the **Target** dropdown in the top-right of the Studio to switch between:

- `Terraform (HCL)` — Bidirectional. Edits in either pane sync back.
- `Pulumi (TypeScript)` — Read-only output.
- `AWS CloudFormation` — Read-only output.

### Deploying

Click **Deploy** in the Studio toolbar. The browser sends the compiled output to the local deployment daemon, which runs `terraform apply` against your configured AWS credentials.

> **Note:** Pulumi and CloudFormation targets must be deployed through their respective CLI tools. The deployment bridge is Terraform-only.

---

## Architecture Overview

```
cloudast/
├── web-ui/                      # React frontend (Vite)
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Landing.tsx          # Marketing page
│   │   │   ├── Auth.tsx             # Login / register
│   │   │   ├── Dashboard.tsx        # Project management
│   │   │   └── Studio.tsx           # Main IDE
│   │   ├── components/
│   │   │   ├── canvas/              # React Flow nodes, edges, dock
│   │   │   └── editor/              # Monaco wrapper, output pane
│   │   ├── compiler/
│   │   │   ├── lexer.ts             # Babel-based JSX visitor
│   │   │   ├── ast.ts               # InfrastructureState schema
│   │   │   ├── validator.ts         # Edge & resource validation
│   │   │   └── generators/
│   │   │       ├── terraform.ts
│   │   │       ├── pulumi.ts
│   │   │       └── cloudformation.ts
│   │   ├── context/
│   │   │   └── AuthContext.tsx      # Global session management
│   │   └── supabaseClient.ts
│   └── .env.local
│
└── deploy-server/               # Node.js deployment bridge
    └── server.js                # Express API → terraform apply
```

---

## Contributing

Contributions are welcome. If you find a bug or want to propose a feature:

1. Fork the repository
2. Create a branch: `git checkout -b feat/your-feature-name`
3. Commit with a clear message: `git commit -m 'feat: add your feature'`
4. Push and open a Pull Request

Please keep PRs focused. Include a clear description of what changed and why.

---

## License

Released under the **MIT License**. See [`LICENSE`](./LICENSE) for details.

---

<div align="center">

Built with React · Compiled to infrastructure.

</div>
