/**
 * Engineering Ascent — the 10 stages of the journey.
 *
 * Every fact here comes from Dinesh's resume (Dineshkannan1_resume.pdf).
 * Nothing is invented: if a stage has no evidence for a section, that
 * section is left empty and the UI simply hides it.
 */

export type StageIconKey =
  | "graduation"
  | "terminal"
  | "network"
  | "cloud"
  | "container"
  | "layers"
  | "ship"
  | "workflow"
  | "blocks"
  | "mountain";

export interface JourneyStage {
  id: string;
  title: string;
  tagline: string;
  icon: StageIconKey;
  /** one or two factual sentences about this stage */
  story: string;
  /** heading for the learnings block (defaults to "Key learnings") */
  learningsLabel?: string;
  learnings: string[];
  tools: string[];
  milestones: string[];
  /** where it showed up: roles / education, with dates */
  usedAt: string[];
}

const UNI = "Annamalai University (AAGAC) · B.Sc. Computer Science · 2024";
const IW = "Instant Webs India · Cloud & DevOps Intern · Jan 2024 – May 2024";
const KT = "Kloud Tom India · DevOps Trainee · May 2024 – May 2025";
const SEM = "Semalgo (Fintech) · DevOps / Cloud Support, Freelance · Apr 2025 – May 2025";
const C2S = "Cloud2Scale Technologies · Junior DevOps Engineer · Aug 2025 – Present";

export const JOURNEY_STAGES: JourneyStage[] = [
  {
    id: "computer-science",
    title: "Computer Science",
    tagline: "The foundation of problem solving.",
    icon: "graduation",
    story:
      "A B.Sc. in Computer Science from Annamalai University (AAGAC), completed in 2024 — the base everything else is built on.",
    learnings: [],
    tools: [],
    milestones: [
      "Graduated with a B.Sc. in Computer Science in 2024",
      "Stepped into cloud and DevOps with my first internship at Instant Webs India (Jan 2024)",
    ],
    usedAt: [UNI],
  },
  {
    id: "linux",
    title: "Linux",
    tagline: "Getting comfortable with the command line.",
    icon: "terminal",
    story:
      "Day-to-day server administration across Ubuntu, Amazon Linux and CentOS — and the troubleshooting that comes with keeping them healthy.",
    learnings: [
      "systemd services and cron jobs",
      "Disk and filesystem capacity troubleshooting",
      "NFS shared storage",
      "Gunicorn / systemd service issues",
    ],
    tools: ["Ubuntu", "Amazon Linux", "CentOS", "systemd", "cron", "NFS", "Bash"],
    milestones: [
      "Automated scheduled start/stop of dev servers to save cost",
      "Automated journal-log cleanup and VPN access creation with Bash and cron",
    ],
    usedAt: [C2S],
  },
  {
    id: "networking",
    title: "Networking",
    tagline: "Understanding how things connect.",
    icon: "network",
    story:
      "From DNS and TLS certificates to multi-VPC AWS networking — understanding how traffic actually moves between systems.",
    learnings: [
      "TCP/IP, DNS, HTTP/HTTPS and routing",
      "Security Groups, NACLs and load balancers",
      "Nginx, Apache and Tomcat as reverse proxies",
      "TLS/SSL certificate renewal with Certbot",
    ],
    tools: [
      "Route 53",
      "VPC",
      "Transit Gateway",
      "NAT Gateway",
      "VPC Peering",
      "ALB / NLB",
      "Nginx",
      "Istio",
      "Certbot",
    ],
    milestones: [
      "Configured a Transit Gateway joining four VPCs into one shared network for database access",
      "Set up an Application Load Balancer with target groups and path-based routing",
      "Renewed and replaced SSL/TLS certificates on Nginx, Apache and Tomcat — and on GCP VMs and load balancers",
    ],
    usedAt: [C2S, KT, SEM],
  },
  {
    id: "aws",
    title: "AWS",
    tagline: "Discovered the power of the cloud.",
    icon: "cloud",
    story:
      "My primary platform. I manage a multi-account environment — production, CDN and supporting accounts — across compute, networking, storage and security.",
    learnings: [
      "EC2, Auto Scaling and VPC",
      "IAM/STS, KMS, WAF and GuardDuty",
      "S3, EBS and RDS",
      "CloudWatch and CloudTrail",
      "Cost analysis, right-sizing and tagging standards",
    ],
    tools: [
      "EC2",
      "VPC",
      "IAM",
      "S3",
      "EKS",
      "ECR",
      "RDS",
      "ALB / NLB",
      "Route 53",
      "CloudFront",
      "CloudWatch",
      "WAF",
      "KMS",
      "GCP",
    ],
    milestones: [
      "Manage a multi-account AWS environment day to day",
      "Set up a multi-region DR environment (ap-south-1 primary, ap-south-2 DR)",
      "Investigated production 5xx errors with ALB logs in Athena and blocked malicious traffic with WAF rules",
      "Diagnosed RDS MySQL/PostgreSQL replication lag and high CPU",
    ],
    usedAt: [C2S, KT, IW],
  },
  {
    id: "docker",
    title: "Docker",
    tagline: "Packaging applications the right way.",
    icon: "container",
    story:
      "Packaging and releasing applications as images — from Dockerized apps in my first internship to image releases alongside dev and QA teams.",
    learnings: ["Docker image builds and releases", "Updating base-image versions used in builds"],
    tools: ["Docker", "Amazon ECR"],
    milestones: [
      "Deployed Dockerized applications as a Cloud & DevOps Intern (2024)",
      "Release Docker images together with the dev and QA teams",
      "Updated base-image versions used for builds in GitLab CI",
    ],
    usedAt: [IW, KT, C2S],
  },
  {
    id: "terraform",
    title: "Terraform",
    tagline: "Infrastructure as code. Repeatable. Scalable.",
    icon: "layers",
    story:
      "Provisioning AWS infrastructure as code — first as an intern, now through CI/CD with remote state and workspaces.",
    learnings: [
      "Modules, remote state and state locking",
      "Workspaces",
      "Running Terraform through CI/CD",
      "Also: Ansible, Packer and CloudFormation",
    ],
    tools: ["Terraform", "Ansible", "Packer", "CloudFormation"],
    milestones: [
      "Provisioned AWS infrastructure with Terraform as an intern (Jan – May 2024)",
      "Created servers and AWS infrastructure with Terraform and deployed a ticket-booking app on EC2",
      "Provision AWS infrastructure with Terraform through CI/CD",
    ],
    usedAt: [IW, KT, C2S],
  },
  {
    id: "kubernetes",
    title: "Kubernetes",
    tagline: "Orchestrating containers at scale.",
    icon: "ship",
    story:
      "Operating production EKS workloads — deployments, upgrades, and the incidents that teach you the most.",
    learnings: [
      "Helm, Argo CD, HPA, KEDA and Karpenter",
      "Rolling updates and Helm rollbacks",
      "RBAC, StatefulSets and CronJobs",
      "NGINX Ingress Controller and Istio Gateways / VirtualServices",
    ],
    tools: ["Amazon EKS", "Helm", "Argo CD", "KEDA", "Karpenter", "HPA", "Istio", "NGINX Ingress"],
    milestones: [
      "Operate production EKS workloads",
      "Upgraded EKS clusters, base images, Jenkins and supporting tools",
      "Resolved CrashLoopBackOff, ImagePullBackOff, OOM and ingress/DNS incidents",
      "Fixed StatefulSet pods stuck in Terminating after Karpenter node replacement (EBS Multi-Attach)",
      "Found and fixed an RBAC gap — pods/log defined in YAML but never applied",
    ],
    usedAt: [C2S],
  },
  {
    id: "cicd",
    title: "CI / CD",
    tagline: "Automating delivery with confidence.",
    icon: "workflow",
    story: "Taking code from a Git commit all the way to a running Kubernetes deployment.",
    learnings: [
      "Jenkins, GitHub Actions and GitLab CI/CD",
      "Argo CD and Devtron",
      "Low-downtime releases: rolling updates, Helm rollback and ALB health checks",
    ],
    tools: ["Jenkins", "GitHub Actions", "GitLab CI/CD", "Argo CD", "Devtron", "Git"],
    milestones: [
      "Built an end-to-end pipeline from Git commit to Kubernetes deployment",
      "Carried out a database upgrade using the blue/green method",
      "Maintained and fixed GitLab CI pipelines",
      "Assisted with CI/CD work during my first internship",
    ],
    usedAt: [C2S, KT, IW],
  },
  {
    id: "platform-engineering",
    title: "Platform Engineering",
    tagline: "Building platforms that empower teams.",
    icon: "blocks",
    story:
      "Observability, reliability and resilience — dashboards, runbooks, on-call response and disaster recovery that keep the platform dependable.",
    learnings: [
      "Dashboards and alerting with Prometheus, Grafana, Loki, SigNoz and ELK",
      "On-call incident response, RCA and runbooks",
      "Multi-region disaster recovery and backups",
      "Event pipelines with Kafka, RabbitMQ and Redpanda Connect",
    ],
    tools: [
      "Prometheus",
      "Grafana",
      "Loki",
      "SigNoz",
      "ELK",
      "CloudWatch",
      "StatusCake",
      "Nagios",
      "Kafka",
      "RabbitMQ",
    ],
    milestones: [
      "Built SigNoz and Grafana/Loki dashboards for cron jobs and deployments",
      "Take part in on-call incident response, RCA and runbook documentation",
      "Set up multi-region DR with S3 versioning, EBS lifecycle policies, snapshots and AMI backups",
      "Manage CDC connector pipelines across Redpanda Connect, Kafka and RabbitMQ",
    ],
    usedAt: [C2S],
  },
  {
    id: "continue-climbing",
    title: "Continue Climbing",
    tagline: "The summit is a new starting point.",
    icon: "mountain",
    story:
      "The summit is not the end. The mountain keeps going — there is always another layer to learn.",
    learningsLabel: "Currently exploring",
    learnings: [
      "An MCP server that exposes repository structure as tools, so an LLM can answer questions about a codebase",
      "More hands-on GCP: virtual machines, load balancers and certificate updates",
    ],
    tools: ["Python", "Model Context Protocol", "GCP"],
    milestones: [],
    usedAt: [],
  },
];
