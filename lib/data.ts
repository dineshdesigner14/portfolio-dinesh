export const PROFILE = {
  name: "Dinesh Kannan",
  role: "Cloud Engineer • DevOps Engineer • Platform Engineering Enthusiast",
  badge: "🚀 Building D-Worker",
  heading: ["Building Reliable", "Cloud Infrastructure"],
  photo: "/profile.jpg",
  resumeUrl: "/resume.pdf",
  typingWords: [
    "AWS",
    "Terraform",
    "Docker",
    "Linux",
    "Python",
    "Kubernetes",
    "CI/CD",
    "Monitoring",
  ],
  stats: [
    { value: "40+", label: "Deployments Automated" },
    { value: "99.98%", label: "Uptime Delivered" },
    { value: "12", label: "Cloud Platforms" },
  ],
};

export const NAV_LINKS = [
  { label: "Home", href: "#top" },
  { label: "About", href: "#about" },
  { label: "Journey", href: "#journey" },
  { label: "Design Lab", href: "#design-lab" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

export const ABOUT = {
  greeting: "Hey, I'm Dinesh Kannan 👋",
  story: [
    "I never planned on becoming a DevOps engineer. It all started with curiosity. I was the person who wanted to understand why things worked — not just how to use them. Whether it was fixing a Linux server, troubleshooting a deployment, or figuring out why an application suddenly broke at 2 AM, I found myself enjoying the challenge more than anything else.",
    "Over time, that curiosity grew into a passion for cloud infrastructure, automation, and platform engineering. What excites me most about DevOps is that it sits at the intersection of development and operations. You're not just writing code or managing servers — you're building the foundation that allows everything else to run smoothly.",
    "I enjoy taking complex problems and turning them into simple, repeatable solutions. Whether it's provisioning infrastructure with Terraform, orchestrating applications with Kubernetes, building CI/CD pipelines, or monitoring production workloads, I'm always looking for ways to improve reliability and developer experience.",
    "Right now, I'm building D-Worker — a modern Cloud & DevOps Engineering Workspace designed to bring infrastructure management, Kubernetes, Terraform, monitoring, documentation, automation, and project workflows into one unified platform.",
  ],
};

export const JOURNEY = [
  "Computer Science",
  "Linux",
  "Networking",
  "AWS",
  "Terraform",
  "Docker",
  "Kubernetes",
  "CI/CD",
  "Platform Engineering",
  "Building D-Worker",
];

export const SKILLS = [
  {
    category: "Cloud & Infrastructure",
    icon: "Cloud",
    items: ["AWS", "Terraform", "Pulumi", "CloudFormation"],
  },
  {
    category: "Containers & Orchestration",
    icon: "Container",
    items: ["Docker", "Kubernetes", "Helm", "ArgoCD"],
  },
  {
    category: "CI/CD & Automation",
    icon: "Infinity",
    items: ["Jenkins", "GitHub Actions", "GitLab CI", "Ansible"],
  },
  {
    category: "Monitoring & Reliability",
    icon: "LineChart",
    items: ["Prometheus", "Grafana", "Datadog", "PagerDuty"],
  },
];

export const EXPERIENCE = [
  {
    role: "Junior DevOps Engineer",
    company: "Cloud2Scale Technologies Pvt Ltd",
    period: "Aug 2025 — Present",
    points: [
      "Manage AWS infrastructure in a multi-account environment and operate production EKS workloads with Helm, Argo CD, HPA, KEDA and Karpenter.",
      "Built an end-to-end CI/CD pipeline from Git commit to Kubernetes deployment, and provision AWS infrastructure with Terraform through CI/CD.",
      "Take part in on-call incident response with RCA and runbooks; built SigNoz and Grafana/Loki dashboards; set up multi-region DR (ap-south-1 primary, ap-south-2 DR).",
    ],
  },
  {
    role: "DevOps / Cloud Support (Freelance)",
    company: "Semalgo (Fintech)",
    period: "Apr 2025 — May 2025",
    points: [
      "Assisted in deploying the company's LMS portal under a Senior Solution Architect; troubleshot deployment and networking issues.",
    ],
  },
  {
    role: "DevOps Trainee",
    company: "Kloud Tom India",
    period: "May 2024 — May 2025",
    points: [
      "Created servers and AWS infrastructure with Terraform and deployed a ticket-booking application on EC2.",
      "Configured an Application Load Balancer with target groups and path-based routing.",
      "Maintained and fixed GitLab CI pipelines and updated base-image versions used for builds.",
    ],
  },
  {
    role: "Cloud & DevOps Intern",
    company: "Instant Webs India",
    period: "Jan 2024 — May 2024",
    points: [
      "Provisioned AWS infrastructure with Terraform, deployed Dockerized applications, and assisted with CI/CD and cost optimisation.",
    ],
  },
];

export const DWORKER = {
  tagline: "The Modern Workspace for Cloud & DevOps Engineers",
  status: "Currently Building",
  description:
    "D-Worker is my flagship engineering project — designed to simplify modern DevOps workflows by bringing cloud infrastructure, Kubernetes, Terraform, monitoring, documentation, automation, and project management into one unified workspace.",
  githubUrl: "https://github.com/yourusername/d-worker",
};

export const DWORKER_ARCHITECTURE = [
  "AWS",
  "Terraform",
  "Docker",
  "Kubernetes",
  "GitHub",
  "Networking",
  "Monitoring",
  "Automation",
  "Projects",
  "Documentation",
  "Security",
  "CI/CD",
];

/** Two-ring grouping used by the DWorkerShowcase ecosystem layout. */
export interface DWorkerRing {
  name: string;
  nodes: string[];
}

/**
 * Six orbital rings, closest to farthest from the D-Worker core. Purely
 * data-driven — the layout algorithm derives radius, angular spacing, and
 * label sizing entirely from these arrays, so adding/removing a technology
 * here never requires touching layout code or causes overlap.
 */
export const DWORKER_RINGS: DWorkerRing[] = [
  { name: "Cloud Platforms", nodes: ["AWS", "Azure", "Google Cloud"] },
  { name: "Containers & IaC", nodes: ["Docker", "Kubernetes", "Terraform", "Helm"] },
  { name: "CI/CD", nodes: ["GitHub", "GitLab", "Jenkins", "ArgoCD"] },
  { name: "Monitoring", nodes: ["Grafana", "Prometheus", "ELK", "SigNoz"] },
  { name: "Networking & Security", nodes: ["NGINX", "Istio", "Traefik", "Vault", "Falco"] },
  { name: "Projects & Automation", nodes: ["Documentation", "Automation", "Projects"] },
];

/**
 * Engineering workflow connections between related technologies — NOT a
 * hub-and-spoke model. Each pair represents an actual real-world workflow
 * relationship (e.g. GitHub triggers Jenkins, which builds a Docker image,
 * which Kubernetes runs on AWS). Used to draw curved workflow paths instead
 * of connecting every planet directly back to the center.
 */
export const DWORKER_WORKFLOWS: [string, string][] = [
  ["GitHub", "Jenkins"],
  ["Jenkins", "Docker"],
  ["Docker", "Kubernetes"],
  ["Kubernetes", "AWS"],
  ["Terraform", "AWS"],
  ["Grafana", "Prometheus"],
  ["Prometheus", "Kubernetes"],
  ["ArgoCD", "Kubernetes"],
  ["GitLab", "Docker"],
  ["Istio", "Kubernetes"],
  ["Vault", "Kubernetes"],
  ["NGINX", "Kubernetes"],
  ["Helm", "Kubernetes"],
  ["Automation", "GitHub"],
  ["Terraform", "Azure"],
  ["Terraform", "Google Cloud"],
];

/**
 * Brand-associated accent color per technology, used only for glow/hover
 * highlighting — not for reproducing any company's logo artwork.
 */
export const DWORKER_TECH_COLOR: Record<string, string> = {
  AWS: "#FF9900",
  Azure: "#0078D4",
  "Google Cloud": "#4285F4",
  Docker: "#2496ED",
  Kubernetes: "#326CE5",
  Terraform: "#7B42BC",
  Helm: "#0F1689",
  GitHub: "#F8FAFC",
  GitLab: "#FC6D26",
  Jenkins: "#D24939",
  ArgoCD: "#EF7B4D",
  Grafana: "#F46800",
  Prometheus: "#E6522C",
  ELK: "#FEC514",
  SigNoz: "#38BDF8",
  NGINX: "#009639",
  Istio: "#466BB0",
  Traefik: "#24A1C1",
  Vault: "#F8FAFC",
  Falco: "#00AEC7",
  Documentation: "#94A3B8",
  Automation: "#7C3AED",
  Projects: "#2563EB",
};

export const DWORKER_MODULE_DETAILS: Record<string, { desc: string; tech: string[] }> = {
  AWS: { desc: "Unified view of infrastructure across providers.", tech: ["EC2", "S3", "VPC", "IAM"] },
  Azure: { desc: "Microsoft's cloud platform for enterprise workloads.", tech: ["VMs", "AKS", "Blob Storage"] },
  "Google Cloud": { desc: "Google's cloud platform for scalable infrastructure.", tech: ["GKE", "Cloud Run", "BigQuery"] },
  Docker: { desc: "Container platform for building and shipping workloads.", tech: ["Images", "Compose", "Registry"] },
  Kubernetes: { desc: "Orchestration for containers at scale.", tech: ["Pods", "Helm", "Ingress"] },
  Terraform: { desc: "Infrastructure as code, provisioning and state management.", tech: ["Modules", "State", "Providers"] },
  Helm: { desc: "Package manager for Kubernetes applications.", tech: ["Charts", "Releases", "Values"] },
  GitHub: { desc: "Source control and collaboration for every repository.", tech: ["Repos", "Actions", "Pull Requests"] },
  GitLab: { desc: "DevOps platform for source control and pipelines.", tech: ["Repos", "CI/CD", "Merge Requests"] },
  Jenkins: { desc: "Automation server for building and deploying software.", tech: ["Pipelines", "Plugins", "Jobs"] },
  ArgoCD: { desc: "Declarative GitOps continuous delivery for Kubernetes.", tech: ["Sync", "Applications", "Rollouts"] },
  Grafana: { desc: "Dashboards and visualization for observability data.", tech: ["Dashboards", "Alerts", "Panels"] },
  Prometheus: { desc: "Metrics collection and alerting toolkit.", tech: ["Metrics", "Alertmanager", "PromQL"] },
  ELK: { desc: "Elasticsearch, Logstash, and Kibana for log analytics.", tech: ["Elasticsearch", "Logstash", "Kibana"] },
  SigNoz: { desc: "Open-source observability platform, self-hosted.", tech: ["Traces", "Metrics", "Logs"] },
  NGINX: { desc: "Web server, reverse proxy, and load balancer.", tech: ["Reverse Proxy", "Load Balancing", "Caching"] },
  Istio: { desc: "Service mesh for traffic management and security.", tech: ["Sidecars", "Traffic Policy", "mTLS"] },
  Traefik: { desc: "Cloud-native reverse proxy and load balancer.", tech: ["Routers", "Middlewares", "Providers"] },
  Vault: { desc: "Secrets management and data protection.", tech: ["Secrets Engine", "Auth Methods", "Policies"] },
  Falco: { desc: "Runtime security and threat detection.", tech: ["Rules", "Alerts", "Syscalls"] },
  Documentation: { desc: "Living docs tied directly to infrastructure.", tech: ["Markdown", "Auto-sync", "Search"] },
  Automation: { desc: "Workflows that remove repetitive manual work.", tech: ["Ansible", "Webhooks", "Scripts"] },
  Projects: { desc: "Unified workspace for tracking engineering work.", tech: ["Boards", "Issues", "Roadmaps"] },
};

/**
 * Level-2 "nested bloom" content: each top-level module's own children,
 * revealed once you click into focus mode on that node.
 */
export const DWORKER_SUB_MODULES: Record<string, string[]> = {
  AWS: ["EC2", "IAM", "VPC", "Lambda", "CloudWatch", "Route53", "EKS", "S3"],
  Azure: ["Virtual Machines", "AKS", "Blob Storage", "Azure Functions", "Entra ID"],
  "Google Cloud": ["Compute Engine", "GKE", "Cloud Run", "BigQuery", "Cloud Storage"],
  Docker: ["Images", "Containers", "Volumes", "Networks", "Compose", "Buildx", "Registry", "Swarm", "Dockerfile"],
  Kubernetes: [
    "Pods", "Deployments", "ReplicaSets", "Services", "Ingress", "DaemonSets",
    "StatefulSets", "Namespaces", "Secrets", "ConfigMaps", "Jobs", "CronJobs", "Helm",
  ],
  Terraform: [
    "Modules", "Providers", "Variables", "Outputs", "Remote State", "Backend",
    "Provisioners", "Workspaces", "Lifecycle", "Import", "State Management",
  ],
  Helm: ["Charts", "Releases", "Values", "Templates", "Repositories"],
  GitHub: ["Repositories", "Actions", "Pull Requests", "Issues", "Webhooks"],
  GitLab: ["Repositories", "Pipelines", "Merge Requests", "Issues", "Container Registry"],
  Jenkins: ["Pipelines", "Plugins", "Jobs", "Agents", "Credentials"],
  ArgoCD: ["Applications", "Sync Policies", "Rollouts", "Projects", "Repositories"],
  Grafana: ["Dashboards", "Alerts", "Panels", "Data Sources", "Annotations"],
  Prometheus: ["Metrics", "Alertmanager", "PromQL", "Exporters", "Service Discovery"],
  ELK: ["Elasticsearch", "Logstash", "Kibana", "Beats", "Index Patterns"],
  SigNoz: ["Traces", "Metrics", "Logs", "Dashboards", "Alerts"],
  NGINX: ["Reverse Proxy", "Load Balancing", "Caching", "SSL Termination", "Rate Limiting"],
  Istio: ["Sidecars", "Traffic Policy", "mTLS", "Gateways", "Virtual Services"],
  Traefik: ["Routers", "Middlewares", "Providers", "Entrypoints", "TLS"],
  Vault: ["Secrets Engine", "Auth Methods", "Policies", "Dynamic Secrets", "Audit Logs"],
  Falco: ["Rules", "Alerts", "Syscalls", "Plugins", "Outputs"],
  Documentation: ["Markdown", "Auto-sync", "Search", "Versioning", "Runbooks", "API Docs"],
  Automation: ["Ansible", "Webhooks", "Scheduled Jobs", "Event Triggers", "Scripts", "Runbooks"],
  Projects: ["Boards", "Issues", "Sprints", "Roadmaps", "Milestones", "Backlogs"],
};

export const PLATFORM_MODULES = [
  { name: "Infrastructure Workspace", icon: "Cloud" },
  { name: "Terraform Templates", icon: "Boxes" },
  { name: "Docker Workspace", icon: "Container" },
  { name: "Kubernetes Management", icon: "CircuitBoard" },
  { name: "Monitoring Dashboard", icon: "LineChart" },
  { name: "CI/CD Pipelines", icon: "Infinity" },
  { name: "Documentation", icon: "FileText" },
  { name: "Project Workspace", icon: "FolderOpen" },
  { name: "Infrastructure Insights", icon: "BarChart3" },
  { name: "Security Dashboard", icon: "ShieldCheck" },
  { name: "Automation Center", icon: "Zap" },
];

export const PROJECTS = [
  {
    title: "D-Worker",
    desc: "The modern workspace for cloud & DevOps engineers — unifying infra, K8s, Terraform, monitoring, and automation.",
    tags: ["Python", "Kubernetes", "Terraform", "DevOps Platform"],
    github: "https://github.com/yourusername/d-worker",
    demo: "#dworker",
    featured: true,
  },
  {
    title: "Zero-Downtime K8s Pipeline",
    desc: "Blue-green deploys across 3 clusters with automatic rollback on failed health checks.",
    tags: ["Kubernetes", "ArgoCD", "Terraform"],
    github: "https://github.com/you/k8s-pipeline",
    demo: "https://demo.example.com/k8s",
    featured: false,
  },
  {
    title: "Multi-Cloud Cost Optimizer",
    desc: "Serverless tool that analyzes AWS + GCP billing and auto-recommends rightsizing.",
    tags: ["Python", "AWS Lambda", "BigQuery"],
    github: "https://github.com/you/cost-optimizer",
    demo: "https://demo.example.com/cost",
    featured: false,
  },
  {
    title: "Observability Stack Template",
    desc: "One-command Prometheus + Grafana + Loki deployment via Terraform modules.",
    tags: ["Terraform", "Prometheus", "Grafana"],
    github: "https://github.com/you/observability",
    demo: "https://demo.example.com/obs",
    featured: false,
  },
];

/** No certifications earned yet — the Terraform Associate is the next one planned. */
export const CERTIFICATIONS = [
  { name: "HashiCorp Certified: Terraform Associate", year: "Planned", icon: "Boxes" },
];

export const CONTACT = {
  email: "kdhbpdinesh@gmail.com",
  github: "https://github.com/dineshdesigner14",
  linkedin: "https://linkedin.com/in/dinesh-kannan14",
};
