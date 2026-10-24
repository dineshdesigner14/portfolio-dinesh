/**
 * System Design Lab — data model + case studies.
 *
 * HONESTY RULES (do not break these when adding case studies):
 *  - Every component carries a provenance: built / operated / explored / concept.
 *  - "built" is only used for things the resume says Dinesh implemented.
 *  - No metrics, uptime figures, savings or other production results — ever.
 *  - Reasoning text (scaling, failure, trade-offs, ...) is standard engineering
 *    practice, not a claim about what was measured. `reviewed: false` keeps a
 *    "draft" chip visible until the owner has checked the text.
 *  - Troubleshooting walkthroughs are illustrative scenarios, labelled as such.
 *  - Employer systems stay generic: no account IDs, CIDRs, hostnames or names.
 */

export type Provenance = "built" | "operated" | "explored" | "concept" | "actor";
export type EdgeKind = "request" | "data" | "control";
export type ZoneTone = "lavender" | "sky" | "gold" | "peach";

export type IconKey =
  | "user"
  | "api"
  | "auth"
  | "file"
  | "queue"
  | "lock"
  | "archive"
  | "gauge"
  | "cog"
  | "terraform"
  | "folder"
  | "cloud"
  | "database"
  | "key"
  | "globe"
  | "shield"
  | "network"
  | "zap"
  | "git"
  | "hammer"
  | "package"
  | "refresh"
  | "waypoints"
  | "chart"
  | "search"
  | "bell"
  | "book"
  | "radar"
  | "activity"
  | "cpu"
  | "disk"
  | "boxes"
  | "target";

export interface DiagramNode {
  id: string;
  label: string;
  /** short descriptor under the label (≤ 16 characters so it fits the node) */
  sub: string;
  icon: IconKey;
  /** centre, in diagram units */
  x: number;
  y: number;
  w?: number;
  h?: number;
  provenance: Provenance;
}

export interface DiagramEdge {
  id: string;
  from: string;
  to: string;
  label: string;
  kind: EdgeKind;
  bend?: number;
  provenance?: Provenance;
}

export interface DiagramZone {
  id: string;
  label: string;
  x: number;
  y: number;
  w: number;
  h: number;
  tone: ZoneTone;
}

export interface FlowStep {
  title: string;
  detail: string;
  nodes: string[];
  edges: string[];
}

export interface Flow {
  id: string;
  label: string;
  blurb: string;
  steps: FlowStep[];
}

export interface FailureScenario {
  id: string;
  label: string;
  /** node and/or edge ids that stop working */
  breaks: string[];
  symptom: string;
  behaviour: string;
  mitigation: string;
  provenance: Provenance;
}

export interface NodeInfo {
  what: string;
  scaling: string;
  failure: string;
  tradeoffs: string[];
  reliability: string;
  security: string;
  cost: string;
}

export interface Decision {
  title: string;
  chose: string;
  over: string;
  because: string;
  cost: string;
  provenance: Provenance;
}

export type WalkStepKey =
  | "symptoms"
  | "evidence"
  | "hypotheses"
  | "rootCause"
  | "fix"
  | "prevention";

export interface Walkthrough {
  title: string;
  /** always states that the scenario is illustrative */
  label: string;
  intro: string;
  symptoms: string[];
  evidence: { source: string; finding: string; command?: string }[];
  hypotheses: { text: string; verdict: "ruled-out" | "confirmed"; because: string }[];
  rootCause: string;
  fix: string[];
  prevention: string[];
  /** diagram components to highlight on each step */
  focus: Record<WalkStepKey, string[]>;
  /** optional incident timeline: phases in order, no invented durations */
  timeline?: { phase: string; event: string }[];
}

export interface CaseStudy {
  id: string;
  title: string;
  short: string;
  kind: "implemented" | "conceptual";
  tagline: string;
  summary: string;
  /** shown under the summary, e.g. "a reference design, not an employer system" */
  disclaimer?: string;
  /** false → a "draft" chip shows until the owner has reviewed the reasoning text */
  reviewed: boolean;
  /** an honest summary of what is real in this case study */
  real: {
    built?: string[];
    operated?: string[];
    explored?: string[];
    concept?: string[];
  };
  viewBox: { w: number; h: number };
  zones: DiagramZone[];
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  flows: Flow[];
  failures: FailureScenario[];
  info: Record<string, NodeInfo>;
  decisions: Decision[];
  walkthrough: Walkthrough;
}

/* ====================================================================== */
/* 1 · D-Worker Infrastructure Deployment Platform  (implemented)          */
/* ====================================================================== */

const DWORKER_CASE: CaseStudy = {
  id: "d-worker-platform",
  title: "D-Worker Infrastructure Deployment Platform",
  short: "D-Worker",
  kind: "implemented",
  tagline:
    "Deploy AWS infrastructure from form inputs — without making the API wait for Terraform.",
  summary:
    "A control plane (FastAPI) authenticates and validates deployment requests and puts them on a queue. An execution plane (Celery workers) picks jobs up and runs Terraform in isolated workspaces. Tested on AWS ap-south-1.",
  reviewed: false,
  real: {
    built: [
      "FastAPI control plane with JWT authentication and a template registry",
      "Queue-based execution of long-running Terraform jobs with Celery and Redis",
      "MinIO object storage and NFS shared workspaces, with per-deployment tfvars",
      "HashiCorp Vault integration so secret values stay out of application state",
      "Five Terraform templates (EC2, VPC, ALB, EC2 with ALB, Node.js stack), tested on AWS ap-south-1",
    ],
    explored: ["Scaling workers with queued jobs, KEDA and Karpenter"],
    concept: [
      "Remote Terraform state with locking, job redelivery behaviour and Redis high availability are shown as reference-design considerations",
    ],
  },
  viewBox: { w: 1020, h: 520 },
  zones: [
    { id: "control", label: "Control plane", x: 150, y: 52, w: 190, h: 452, tone: "sky" },
    { id: "shared", label: "Queue & services", x: 380, y: 52, w: 190, h: 452, tone: "gold" },
    { id: "execution", label: "Execution plane", x: 610, y: 52, w: 190, h: 452, tone: "lavender" },
  ],
  nodes: [
    { id: "actor", label: "You", sub: "inputs", icon: "user", x: 60, y: 270, w: 110, h: 60, provenance: "actor" },
    { id: "api", label: "FastAPI API", sub: "validate + queue", icon: "api", x: 245, y: 270, provenance: "built" },
    { id: "registry", label: "Templates", sub: "template list", icon: "file", x: 245, y: 390, provenance: "built" },
    { id: "auth", label: "JWT auth", sub: "token check", icon: "auth", x: 245, y: 150, provenance: "built" },
    { id: "autoscaler", label: "Autoscaling", sub: "KEDA + Karpenter", icon: "gauge", x: 475, y: 116, provenance: "explored" },
    { id: "redis", label: "Job queue", sub: "Redis · Celery", icon: "queue", x: 475, y: 228, provenance: "built" },
    { id: "vault", label: "Secrets", sub: "HashiCorp Vault", icon: "lock", x: 475, y: 344, provenance: "built" },
    { id: "minio", label: "Object store", sub: "MinIO", icon: "archive", x: 475, y: 460, provenance: "built" },
    { id: "worker", label: "Celery worker", sub: "runs the job", icon: "cog", x: 705, y: 150, provenance: "built" },
    { id: "terraform", label: "Terraform", sub: "plan / apply", icon: "terraform", x: 705, y: 290, provenance: "built" },
    { id: "workspace", label: "Workspace", sub: "NFS + tfvars", icon: "folder", x: 705, y: 430, provenance: "built" },
    { id: "aws", label: "AWS target", sub: "ap-south-1", icon: "cloud", x: 925, y: 190, provenance: "built" },
    { id: "state", label: "Remote state", sub: "+ locking", icon: "database", x: 925, y: 350, provenance: "concept" },
  ],
  edges: [
    { id: "e-request", from: "actor", to: "api", label: "deploy request + JWT", kind: "request", bend: 0.03 },
    { id: "e-auth", from: "api", to: "auth", label: "verify token", kind: "control", bend: 0.04 },
    { id: "e-registry", from: "api", to: "registry", label: "resolve template", kind: "control", bend: 0.04 },
    { id: "e-enqueue", from: "api", to: "redis", label: "enqueue job", kind: "request", bend: 0.08 },
    { id: "e-consume", from: "redis", to: "worker", label: "worker consumes job", kind: "request", bend: 0.08 },
    { id: "e-secrets", from: "worker", to: "vault", label: "fetch secrets at run time", kind: "data", bend: -0.12 },
    { id: "e-run", from: "worker", to: "terraform", label: "prepare + run", kind: "control", bend: 0.05 },
    { id: "e-workspace", from: "terraform", to: "workspace", label: "template + tfvars", kind: "data", bend: 0.05 },
    { id: "e-provision", from: "terraform", to: "aws", label: "provision resources", kind: "request", bend: -0.08 },
    { id: "e-state", from: "terraform", to: "state", label: "state + lock (concept)", kind: "data", bend: 0.08, provenance: "concept" },
    { id: "e-output", from: "terraform", to: "minio", label: "job output", kind: "data", bend: 0.1 },
    { id: "e-depth", from: "redis", to: "autoscaler", label: "queue depth (explored)", kind: "data", bend: 0.1, provenance: "explored" },
    { id: "e-scale", from: "autoscaler", to: "worker", label: "scale workers (explored)", kind: "control", bend: 0.1, provenance: "explored" },
  ],
  flows: [
    {
      id: "deploy",
      label: "Deploy request",
      blurb: "From form input to AWS resources",
      steps: [
        {
          title: "A deployment is requested",
          detail: "A user submits form inputs. The request carries a JWT.",
          nodes: ["actor", "api"],
          edges: ["e-request"],
        },
        {
          title: "Authenticate and validate",
          detail:
            "The API checks the token and resolves the chosen template, rejecting bad input before anything is queued.",
          nodes: ["api", "auth", "registry"],
          edges: ["e-auth", "e-registry"],
        },
        {
          title: "Enqueue — don't wait",
          detail:
            "The API never runs Terraform. It puts a job on the queue and returns, so a slow deployment can't tie up the API.",
          nodes: ["api", "redis"],
          edges: ["e-enqueue"],
        },
        {
          title: "A worker takes the job",
          detail: "A Celery worker in the execution plane consumes the job from the queue.",
          nodes: ["redis", "worker"],
          edges: ["e-consume"],
        },
        {
          title: "Secrets at run time",
          detail:
            "The worker reads secrets from Vault only when it needs them, so secret values stay out of the application's own state.",
          nodes: ["worker", "vault"],
          edges: ["e-secrets"],
        },
        {
          title: "Isolated workspace",
          detail:
            "Terraform runs in this deployment's own workspace on shared NFS, with its own tfvars, so deployments don't touch each other's inputs.",
          nodes: ["worker", "terraform", "workspace"],
          edges: ["e-run", "e-workspace"],
        },
        {
          title: "Provision",
          detail: "terraform apply creates the resources in AWS (tested on ap-south-1).",
          nodes: ["terraform", "aws"],
          edges: ["e-provision"],
        },
        {
          title: "Record the result",
          detail:
            "Job output goes to object storage. Shown as a concept: remote state with locking, so only one run can change a given state at a time.",
          nodes: ["terraform", "minio", "state"],
          edges: ["e-output", "e-state"],
        },
      ],
    },
    {
      id: "scale",
      label: "Scale under load",
      blurb: "Explored, not shipped",
      steps: [
        {
          title: "Jobs pile up",
          detail: "Many deployments arrive at once and the queue gets deeper than the workers can drain.",
          nodes: ["api", "redis"],
          edges: ["e-enqueue"],
        },
        {
          title: "Queue depth is the signal",
          detail: "Explored: KEDA reads the queue length and decides how many workers are needed.",
          nodes: ["redis", "autoscaler"],
          edges: ["e-depth"],
        },
        {
          title: "More workers",
          detail:
            "Explored: KEDA adds worker replicas; Karpenter adds nodes when pods can't be scheduled. When the queue is empty it can scale back down.",
          nodes: ["autoscaler", "worker"],
          edges: ["e-scale"],
        },
      ],
    },
    {
      id: "isolation",
      label: "Concurrent deployments",
      blurb: "Why workspaces are isolated",
      steps: [
        {
          title: "Two jobs, two workers",
          detail: "Two deployments are picked up by different workers at the same time.",
          nodes: ["redis", "worker"],
          edges: ["e-consume"],
        },
        {
          title: "Separate workspace and tfvars",
          detail:
            "Each run gets its own directory and its own tfvars. One run can't overwrite another run's inputs.",
          nodes: ["terraform", "workspace"],
          edges: ["e-workspace"],
        },
        {
          title: "Locking protects shared state",
          detail:
            "Concept: if two runs target the same deployment, a state lock makes the second wait or fail fast instead of corrupting state.",
          nodes: ["terraform", "state"],
          edges: ["e-state"],
        },
      ],
    },
  ],
  failures: [
    {
      id: "worker-crash",
      label: "Worker crashes mid-apply",
      breaks: ["worker", "e-run"],
      provenance: "concept",
      symptom: "A deployment stops part-way and never reports completion.",
      behaviour:
        "Whether the job is redelivered depends on acknowledgement settings. Resources created so far are in Terraform state, so a rerun converges instead of starting over.",
      mitigation:
        "Make templates safe to re-apply, set job time limits, and release any state lock a crashed run left behind.",
    },
    {
      id: "redis-down",
      label: "Queue unavailable",
      breaks: ["redis"],
      provenance: "concept",
      symptom: "New deployments are rejected; running ones continue.",
      behaviour:
        "The API can't enqueue, so it should answer quickly with a clear error instead of hanging. Jobs already running on workers aren't affected.",
      mitigation:
        "Run Redis with persistence and a replica, and alert on queue depth and the age of the oldest job.",
    },
    {
      id: "vault-down",
      label: "Vault unreachable",
      breaks: ["vault", "e-secrets"],
      provenance: "concept",
      symptom: "Jobs fail early with a secrets error.",
      behaviour:
        "The design should fail closed: the job stops before touching AWS instead of falling back to a weaker way of getting credentials.",
      mitigation: "Run Vault in HA, retry with backoff, and alert when it is sealed.",
    },
    {
      id: "same-state",
      label: "Two runs, same deployment",
      breaks: ["state", "e-state"],
      provenance: "concept",
      symptom: "Two applies race on the same infrastructure.",
      behaviour:
        "Without a state lock they could interleave and corrupt state. With remote state and locking, the second run waits or fails fast.",
      mitigation: "Use remote state with locking, one state per deployment, and a documented way to break a stuck lock.",
    },
  ],
  info: {
    actor: {
      what: "Someone asking for infrastructure through form inputs. Not a component of the platform.",
      scaling: "—",
      failure: "—",
      tradeoffs: [],
      reliability: "—",
      security: "—",
      cost: "—",
    },
    api: {
      what: "The FastAPI layer. It authenticates the caller with a JWT, checks the inputs against the chosen template, and enqueues a job. It does not run Terraform itself.",
      scaling: "Stateless, so you add API instances behind a load balancer. Load follows request volume, not how long deployments take.",
      failure: "If the API is down no new deployments start, but jobs already running on workers carry on.",
      tradeoffs: [
        "Returning immediately keeps the API fast, but clients must poll or subscribe for the result.",
        "Validating up front rejects bad input early, but the API must stay in sync with each template's inputs.",
      ],
      reliability: "Health checks, and fail fast with a clear error if the queue is unreachable instead of hanging.",
      security: "JWT on every request. A control plane that holds no cloud credentials limits the damage if the API is ever compromised (a design principle).",
      cost: "Small: a couple of small instances. The heavy compute is on the workers.",
    },
    auth: {
      what: "JWT authentication in front of the API.",
      scaling: "Tokens are verified from their signature, so there is no database lookup on every request.",
      failure: "An expired or invalid token gets a 401 and nothing reaches the queue.",
      tradeoffs: [
        "Stateless tokens scale well but can't be revoked instantly without a deny-list.",
        "Short expiry limits exposure but means handling refresh.",
      ],
      reliability: "No runtime dependency beyond the signing key.",
      security: "Keep the signing key in a secrets manager, rotate it, and keep token lifetimes short.",
      cost: "Negligible.",
    },
    registry: {
      what: "The registry of available Terraform templates (EC2, VPC, ALB, EC2 with ALB, Node.js stack) and the inputs each one accepts.",
      scaling: "Read-mostly, so it caches well.",
      failure: "If a template is missing or invalid the request is rejected before anything is queued.",
      tradeoffs: [
        "A registry of approved templates gives guard-rails, at the price of flexibility compared with raw Terraform.",
        "Versioned templates make runs reproducible but need a way to retire old versions.",
      ],
      reliability: "Run fmt, validate and plan on templates in CI before registering them.",
      security: "Only approved templates can run. Users supply inputs, not arbitrary code.",
      cost: "Negligible. The real cost is maintaining the templates.",
    },
    redis: {
      what: "The job queue. Celery uses Redis as the broker between the API and the workers, so long Terraform runs never block the API.",
      scaling: "Queue depth is the natural scaling signal: more waiting jobs means more workers are needed.",
      failure: "If Redis is down the API can't enqueue and should return a clear error. Jobs already running continue.",
      tradeoffs: [
        "Redis is simple and fast, but durability depends on persistence settings. A restart can lose queued jobs unless configured otherwise.",
        "Delivery is effectively at-least-once, so tasks should be safe to run twice.",
      ],
      reliability: "Persistence plus a replica, and alerts on queue depth and the age of the oldest job.",
      security: "Keep it on a private network with authentication. It is not an internet-facing service.",
      cost: "A small instance is usually enough. A managed service costs more but removes operations work.",
    },
    vault: {
      what: "HashiCorp Vault holds the secrets, so secret values stay out of the application's own state.",
      scaling: "Read-heavy with small requests, so one HA cluster goes a long way.",
      failure: "If Vault is sealed or unreachable the job should fail before touching AWS (fail closed).",
      tradeoffs: [
        "Central secrets are safer and auditable, but add a dependency that must itself be highly available.",
        "Short-lived credentials reduce exposure but need renewal logic.",
      ],
      reliability: "Run it in HA and alert when it seals.",
      security: "Least-privilege policies per role, audit logging and short TTLs.",
      cost: "Mostly operational effort rather than infrastructure spend.",
    },
    minio: {
      what: "S3-compatible object storage used by the platform.",
      scaling: "Scales by adding drives and nodes. Object storage suits large, write-once files.",
      failure: "If it is down, output can't be saved. Whether the run can still proceed depends on how strictly saving is required.",
      tradeoffs: [
        "Self-hosted S3-compatible storage avoids cloud storage fees and lock-in, but you operate it.",
        "Versioning and lifecycle rules help recovery but cost disk.",
      ],
      reliability: "Erasure coding or replication, plus regular backups.",
      security: "Per-bucket policies and encryption at rest.",
      cost: "Disk space and operations time.",
    },
    autoscaler: {
      what: "Explored, not implemented: scale workers from the queue length with KEDA, and add or remove nodes with Karpenter.",
      scaling: "KEDA turns queue depth into a replica count (including scale-to-zero). Karpenter provisions nodes when pods are pending.",
      failure: "Node start-up adds delay for the first jobs after idle (cold start). A bad scaling rule can thrash.",
      tradeoffs: [
        "Scale-to-zero saves money but the first job waits.",
        "Aggressive scale-down can stop a worker mid-apply, so jobs need graceful termination.",
      ],
      reliability: "Set a maximum replica count, cooldowns, and a termination grace period at least as long as the longest run.",
      security: "The autoscaler needs permission to create nodes. Scope it tightly.",
      cost: "You pay mostly while jobs run, bounded by the maximum replica count.",
    },
    worker: {
      what: "Celery workers form the execution plane. A worker takes a job, prepares its workspace and runs Terraform.",
      scaling: "Scale out by adding workers. Each job occupies a worker for the whole run, so concurrency equals the number of workers.",
      failure: "If a worker dies mid-run the job may be redelivered or lost depending on acknowledgement settings. A partial apply is recorded in state, so a rerun converges.",
      tradeoffs: [
        "Few workers is cheap but jobs wait. Many is fast but costs more while idle.",
        "Long runs argue for separate queues, so a slow job doesn't block quick ones.",
      ],
      reliability: "Job time limits, careful retries (re-applying is usually safe, re-creating is not) and workspace cleanup.",
      security: "Workers are the only place that touch cloud credentials, so lock them down: least-privilege IAM and private networking (a design principle).",
      cost: "The main compute cost. Scaling to zero when idle is the goal of the explored autoscaling.",
    },
    terraform: {
      what: "The Terraform CLI, run from a worker: plan and apply against the chosen template and this deployment's tfvars.",
      scaling: "Runs are sequential within one deployment. Parallelism comes from many workers each running their own deployment.",
      failure: "A failed apply can leave resources part-created. State records what exists, and a corrected rerun continues from there.",
      tradeoffs: [
        "Running the CLI is simple and mirrors how engineers work, but wraps a long-running process.",
        "Plan-then-apply gives a review point but takes longer.",
      ],
      reliability: "Pin Terraform and provider versions so runs are reproducible.",
      security: "Never print secret values in logs. Pass them in through variables or the environment from Vault.",
      cost: "Time-bound compute. Some resources it creates (NAT gateways, load balancers) cost money while they exist, so destroy test stacks.",
    },
    workspace: {
      what: "A separate working directory for every deployment on shared NFS storage, holding that deployment's own tfvars.",
      scaling: "Shared storage lets any worker pick up any job. NFS throughput becomes the limit at high concurrency.",
      failure: "If NFS is unavailable jobs can't start. A leftover directory could mix up runs if cleanup fails.",
      tradeoffs: [
        "Per-deployment isolation stops one run overwriting another's inputs.",
        "NFS is easy to share between workers but is a single point of failure unless made redundant.",
      ],
      reliability: "A unique directory per deployment, cleanup when finished, and monitoring of free space.",
      security: "Restrict file permissions. tfvars can hold sensitive values, so don't leave them lying around.",
      cost: "Cheap storage, growing if old workspaces aren't cleaned up.",
    },
    aws: {
      what: "The target environment: AWS ap-south-1, where the five templates were tested.",
      scaling: "Limited more by account service quotas than by the platform.",
      failure: "API throttling or quota errors can fail a run part-way.",
      tradeoffs: ["Single-region testing is simpler. Going multi-region needs per-region state and templates."],
      reliability: "Retry transient errors and surface quota errors clearly.",
      security: "Run with a dedicated, least-privilege role.",
      cost: "Resources it creates are billed. Tag them and destroy test stacks.",
    },
    state: {
      what: "Concept: keep Terraform state in a remote backend with locking, so only one run can change a given state at a time.",
      scaling: "One state per deployment keeps the locks independent.",
      failure: "A stuck lock after a crash blocks that deployment until it is released.",
      tradeoffs: ["Remote state with locking prevents corruption and is needed once several workers exist, but adds a backend to run."],
      reliability: "A versioned backend and a documented way to break a stuck lock.",
      security: "Encrypt state at rest, because it can contain secrets, and restrict who can read it.",
      cost: "Very low.",
    },
  },
  decisions: [
    {
      title: "Split control plane from execution plane",
      chose: "API validates and enqueues; workers run Terraform",
      over: "Running Terraform inside the API request",
      because: "Terraform runs are long and can fail halfway. The API stays responsive, and each plane scales and fails on its own.",
      cost: "Two things to operate instead of one, and a queue between them.",
      provenance: "built",
    },
    {
      title: "Queue long-running work",
      chose: "Celery with Redis",
      over: "Synchronous calls or ad-hoc background threads",
      because: "A queue gives backpressure, retries and a clear scaling signal: the number of waiting jobs.",
      cost: "Another service to run, and at-least-once delivery means tasks must be safe to repeat.",
      provenance: "built",
    },
    {
      title: "One workspace and tfvars per deployment",
      chose: "Isolated directories on shared NFS",
      over: "A single shared working directory",
      because: "Concurrent runs can't overwrite each other's inputs, and any worker can pick up any job.",
      cost: "Storage to clean up, and NFS as a shared dependency.",
      provenance: "built",
    },
    {
      title: "Keep secrets out of application state",
      chose: "HashiCorp Vault, read at run time",
      over: "Secrets in environment files or the database",
      because: "Central, auditable and short-lived secrets reduce the damage from a leak.",
      cost: "Vault becomes a critical dependency that needs its own HA.",
      provenance: "built",
    },
    {
      title: "Protect state from concurrent writes",
      chose: "Remote state with locking (concept)",
      over: "Local state files on workers",
      because: "Once several workers exist, local state can't be shared safely and can be lost with the worker.",
      cost: "A state backend to run and secure.",
      provenance: "concept",
    },
    {
      title: "Scale workers with demand",
      chose: "KEDA on queue length, Karpenter for nodes (explored)",
      over: "A fixed number of always-on workers",
      because: "Deployment load is bursty. Scaling from the queue matches capacity to demand.",
      cost: "Cold-start delay after idle, and care so scale-down never kills a running apply.",
      provenance: "explored",
    },
  ],
  walkthrough: {
    title: "Deployment jobs sit in “queued” forever",
    label:
      "Illustrative scenario — modelled on a common failure of queue-based platforms. It is not a record of a real incident.",
    intro:
      "Users report that deployments are accepted but never start. Follow the investigation step by step.",
    symptoms: [
      "Deployments are accepted (the API answers success) but stay in “queued”.",
      "Nothing fails — no errors in the API logs.",
      "The number of waiting jobs keeps growing.",
    ],
    evidence: [
      {
        source: "API logs",
        finding: "Jobs are enqueued successfully and task IDs are returned.",
      },
      {
        source: "Queue",
        finding: "The queue keeps growing and the oldest job gets older.",
        command: "redis-cli LLEN <queue-name>",
      },
      {
        source: "Workers",
        finding: "Workers are up and idle: no active tasks.",
        command: "celery -A <app> inspect active",
      },
      {
        source: "Worker config",
        finding: "Workers are consuming from the default queue only.",
        command: "celery -A <app> inspect active_queues",
      },
      {
        source: "Change history",
        finding: "The latest release gave deployment jobs their own queue — on the API side only.",
      },
    ],
    hypotheses: [
      {
        text: "Redis is down or unreachable",
        verdict: "ruled-out",
        because: "The API enqueued successfully and the queue length can be read.",
      },
      {
        text: "The workers have crashed",
        verdict: "ruled-out",
        because: "Workers answer inspect commands and are healthy.",
      },
      {
        text: "All workers are busy with long applies",
        verdict: "ruled-out",
        because: "inspect active shows no running tasks.",
      },
      {
        text: "Workers listen on a different queue than the API publishes to",
        verdict: "confirmed",
        because: "active_queues lists only the default queue while the jobs wait in the deployment queue.",
      },
    ],
    rootCause:
      "A release sent deployment jobs to a dedicated queue on the API side, but the worker deployment still consumed only the default queue. Jobs were accepted and never picked up.",
    fix: [
      "Add the dedicated queue to the workers' consume list and roll the workers.",
      "Watch the queue drain and the oldest-job age fall back to normal.",
      "Re-submit any job that was marked failed by a timeout while it waited.",
    ],
    prevention: [
      "Define queue names in one shared config used by both the API and the workers.",
      "Add a smoke test: enqueue a no-op job in CI and assert that a worker completes it.",
      "Alert on “jobs waiting and no active tasks”, and on the age of the oldest job.",
      "Roll out worker changes before the API changes that depend on them.",
    ],
    focus: {
      symptoms: ["api", "redis"],
      evidence: ["redis", "worker"],
      hypotheses: ["redis", "worker"],
      rootCause: ["api", "redis", "worker"],
      fix: ["worker"],
      prevention: ["redis", "worker"],
    },
  },
};

export const CASE_STUDIES: CaseStudy[] = [DWORKER_CASE];
