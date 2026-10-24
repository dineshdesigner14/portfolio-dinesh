import type { CaseStudy, NodeInfo } from "../designLab";

/**
 * Case study 2 — Highly Available AWS Web Application (conceptual reference design).
 * Badges on components describe hands-on experience with that SERVICE (from the resume),
 * not a claim that this exact architecture runs anywhere. No metrics, no employer detail.
 */

const appInfo: NodeInfo = {
  what: "The compute tier: instances in an Auto Scaling group, spread across Availability Zones, serving the application behind the load balancer.",
  scaling: "Add instances when load rises and remove them when it falls. Keep instances stateless so any of them can serve any request.",
  failure: "An unhealthy instance is taken out of rotation and replaced. Losing a whole AZ leaves the other AZ carrying the load, so it needs spare headroom.",
  tradeoffs: [
    "Instances are simple and familiar; containers or serverless can scale faster but change how you build and operate.",
    "Spreading across AZs costs a little more and adds cross-AZ traffic, in return for surviving an AZ problem.",
  ],
  reliability: "Health checks that exercise the app (not just the port), rolling replacement, and images built the same way every time.",
  security: "Private subnets, security groups that only allow the load balancer in, instance roles instead of stored keys, and patched images.",
  cost: "The biggest running cost. Right-size instances, scale in when idle, and use scheduled scaling for predictable quiet periods.",
};

export const HA_WEB_CASE: CaseStudy = {
  id: "ha-web-app",
  title: "Highly Available AWS Web Application",
  short: "HA web app",
  kind: "conceptual",
  tagline: "No single point of failure between the user and the data.",
  summary:
    "A reference design for a web application that keeps serving when an instance, an Availability Zone or even a whole region has a problem: DNS and a CDN at the edge, a load balancer over multi-AZ compute, a replicated database, a cache, and a second region for disaster recovery.",
  disclaimer:
    "A reference design assembled from AWS services I work with. It is not a description of any employer's system.",
  reviewed: false,
  real: {
    operated: [
      "Route 53, CloudFront, WAF and Application Load Balancers in a multi-account AWS environment",
      "EC2 Auto Scaling, RDS (MySQL and PostgreSQL), S3 and CloudWatch",
      "A multi-region DR environment (ap-south-1 primary, ap-south-2 DR) with S3 versioning, EBS lifecycle policies, snapshots and AMI backups",
      "Investigating production 5xx errors with ALB target groups, ALB logs in Athena and WAF rules",
    ],
    concept: [
      "The caching layer and the Multi-AZ database standby are reference-design elements, not claims of hands-on experience",
    ],
  },
  viewBox: { w: 1020, h: 620 },
  zones: [
    { id: "edge", label: "Edge", x: 140, y: 52, w: 190, h: 452, tone: "sky" },
    { id: "region", label: "Primary region · two AZs", x: 355, y: 52, w: 620, h: 452, tone: "lavender" },
    { id: "dr", label: "Second region", x: 355, y: 524, w: 620, h: 80, tone: "gold" },
  ],
  nodes: [
    { id: "actor", label: "Users", sub: "visitors", icon: "user", x: 60, y: 260, w: 110, h: 60, provenance: "actor" },
    { id: "route53", label: "Route 53", sub: "DNS + health", icon: "globe", x: 235, y: 110, provenance: "operated" },
    { id: "cloudfront", label: "CloudFront", sub: "CDN + caching", icon: "cloud", x: 235, y: 235, provenance: "operated" },
    { id: "waf", label: "WAF", sub: "edge filtering", icon: "shield", x: 235, y: 360, provenance: "operated" },
    { id: "s3", label: "S3", sub: "static assets", icon: "archive", x: 455, y: 395, provenance: "operated" },
    { id: "alb", label: "Load balancer", sub: "ALB, 2+ AZs", icon: "network", x: 455, y: 245, provenance: "operated" },
    { id: "appA", label: "App · AZ-a", sub: "EC2 Auto Scaling", icon: "api", x: 665, y: 150, provenance: "operated" },
    { id: "appB", label: "App · AZ-b", sub: "EC2 Auto Scaling", icon: "api", x: 665, y: 300, provenance: "operated" },
    { id: "cache", label: "Cache", sub: "in-memory cache", icon: "zap", x: 875, y: 115, provenance: "concept" },
    { id: "rdsP", label: "Database", sub: "RDS primary", icon: "database", x: 875, y: 235, provenance: "operated" },
    { id: "rdsS", label: "Standby", sub: "Multi-AZ replica", icon: "database", x: 875, y: 355, provenance: "concept" },
    { id: "backups", label: "Backups", sub: "snapshots, AMIs", icon: "disk", x: 665, y: 430, provenance: "operated" },
    { id: "dr", label: "DR region", sub: "second region", icon: "globe", x: 875, y: 567, provenance: "operated" },
  ],
  edges: [
    { id: "e-dns", from: "actor", to: "route53", label: "DNS lookup", kind: "control", bend: 0.05 },
    { id: "e-alias", from: "route53", to: "cloudfront", label: "points to the CDN", kind: "control", bend: 0.03 },
    { id: "e-req", from: "actor", to: "cloudfront", label: "HTTPS request", kind: "request", bend: 0.05 },
    { id: "e-waf", from: "cloudfront", to: "waf", label: "inspect requests", kind: "control", bend: 0.03 },
    { id: "e-static", from: "cloudfront", to: "s3", label: "static assets", kind: "data", bend: 0.08 },
    { id: "e-dyn", from: "cloudfront", to: "alb", label: "dynamic requests", kind: "request", bend: 0.04 },
    { id: "e-a", from: "alb", to: "appA", label: "healthy target", kind: "request", bend: 0.06 },
    { id: "e-b", from: "alb", to: "appB", label: "healthy target", kind: "request", bend: 0.06 },
    { id: "e-cache", from: "appA", to: "cache", label: "cache lookup", kind: "data", bend: 0.05, provenance: "concept" },
    { id: "e-rw-a", from: "appA", to: "rdsP", label: "read / write", kind: "data", bend: 0.05 },
    { id: "e-rw-b", from: "appB", to: "rdsP", label: "read / write", kind: "data", bend: 0.05 },
    { id: "e-repl", from: "rdsP", to: "rdsS", label: "replication", kind: "data", bend: 0.04, provenance: "concept" },
    { id: "e-bak", from: "rdsS", to: "backups", label: "snapshots", kind: "data", bend: 0.06 },
    { id: "e-dr", from: "backups", to: "dr", label: "copy to second region", kind: "data", bend: 0.05 },
  ],
  flows: [
    {
      id: "request",
      label: "A user request",
      blurb: "DNS → edge → origin → data",
      steps: [
        {
          title: "Find the site",
          detail: "The browser asks DNS where the site lives. Route 53 can answer based on health checks.",
          nodes: ["actor", "route53"],
          edges: ["e-dns"],
        },
        {
          title: "Land on the CDN",
          detail: "DNS points at the CDN, so most traffic never has to reach the origin servers.",
          nodes: ["route53", "cloudfront"],
          edges: ["e-alias"],
        },
        {
          title: "HTTPS at the edge",
          detail: "The request arrives at the nearest edge location. Anything already cached is answered right there.",
          nodes: ["actor", "cloudfront"],
          edges: ["e-req"],
        },
        {
          title: "Filter bad traffic",
          detail: "WAF rules drop obviously bad requests before they cost any origin compute.",
          nodes: ["cloudfront", "waf"],
          edges: ["e-waf"],
        },
        {
          title: "Static or dynamic?",
          detail: "Static files come from object storage; dynamic requests go on to the load balancer.",
          nodes: ["cloudfront", "s3", "alb"],
          edges: ["e-static", "e-dyn"],
        },
        {
          title: "Spread across zones",
          detail: "The load balancer only sends traffic to targets that pass health checks, in more than one Availability Zone.",
          nodes: ["alb", "appA", "appB"],
          edges: ["e-a", "e-b"],
        },
        {
          title: "Cache first, then the database",
          detail: "The app tries the cache and falls back to the database (the cache is a concept in this design).",
          nodes: ["appA", "cache", "rdsP"],
          edges: ["e-cache", "e-rw-a"],
        },
      ],
    },
    {
      id: "scale",
      label: "Scale out",
      blurb: "More traffic, more instances",
      steps: [
        {
          title: "Load rises",
          detail: "More requests reach the load balancer and spread across the instances in both zones.",
          nodes: ["alb", "appA", "appB"],
          edges: ["e-a", "e-b"],
        },
        {
          title: "Auto Scaling adds instances",
          detail: "A scaling policy adds instances in both zones; new ones join the load balancer once healthy.",
          nodes: ["appA", "appB"],
          edges: [],
        },
        {
          title: "The database is the next limit",
          detail:
            "Compute scales out easily; the database is harder. That is why a cache and read replicas are used to protect it.",
          nodes: ["appA", "appB", "rdsP"],
          edges: ["e-rw-a", "e-rw-b"],
        },
      ],
    },
    {
      id: "dr",
      label: "Backup & disaster recovery",
      blurb: "Surviving a region problem",
      steps: [
        {
          title: "Take snapshots",
          detail: "Database snapshots, volume snapshots and machine images are taken on a schedule.",
          nodes: ["rdsS", "backups"],
          edges: ["e-bak"],
        },
        {
          title: "Copy to a second region",
          detail: "Backups are copied to another region, so a problem in one region doesn't take the copies with it.",
          nodes: ["backups", "dr"],
          edges: ["e-dr"],
        },
        {
          title: "Recover if needed",
          detail:
            "If the primary region is lost, rebuild from the copies and repoint DNS. How fast depends on how much is pre-built, which is a cost versus recovery-time decision.",
          nodes: ["dr", "route53"],
          edges: [],
        },
      ],
    },
  ],
  failures: [
    {
      id: "az",
      label: "Lose an Availability Zone",
      breaks: ["appA", "rdsP"],
      provenance: "concept",
      symptom: "Capacity drops and some requests error for a short time.",
      behaviour:
        "Health checks stop sending traffic to the lost zone. The standby database can take over (concept). The surviving zone must have enough headroom to carry the whole load.",
      mitigation: "Size for the loss of a zone, spread Auto Scaling across zones, and rehearse the database failover.",
    },
    {
      id: "cache",
      label: "Cache unavailable",
      breaks: ["cache"],
      provenance: "concept",
      symptom: "Pages get slower and database load climbs.",
      behaviour: "Every request falls through to the database, which can then become the bottleneck.",
      mitigation: "Treat the cache as optional: short timeouts, a fallback to the database, request coalescing and connection limits.",
    },
    {
      id: "traffic",
      label: "Bad traffic floods the origin",
      breaks: ["appA", "appB"],
      provenance: "operated",
      symptom: "5xx errors and timeouts while real users are affected.",
      behaviour:
        "The targets saturate. Blocking the abusive pattern with WAF rules or rate limits at the edge frees capacity again.",
      mitigation: "Rate-based WAF rules, cache more at the CDN, and alert on the error rate.",
    },
    {
      id: "region",
      label: "Whole region unavailable",
      breaks: ["alb", "appA", "appB", "cache", "rdsP", "rdsS", "s3", "backups"],
      provenance: "concept",
      symptom: "The site is down in the primary region.",
      behaviour:
        "Recovery depends on the copies in the second region: restore data, start compute, repoint DNS. A cheaper standby recovers more slowly.",
      mitigation: "Rehearse the failover, keep the copies current and automate the runbook.",
    },
  ],
  info: {
    actor: {
      what: "People using the site. Not a component of the design.",
      scaling: "—",
      failure: "—",
      tradeoffs: [],
      reliability: "—",
      security: "—",
      cost: "—",
    },
    route53: {
      what: "DNS. Maps the site's name to the CDN and can use health checks to steer traffic away from a failing target.",
      scaling: "Managed and global. Query volume is not something you scale yourself.",
      failure: "DNS answers are cached, so a change or failover takes as long as the TTL allows.",
      tradeoffs: [
        "A short TTL makes failover faster but increases query volume and cost.",
        "Health-check-based routing automates failover but can flap if checks are too sensitive.",
      ],
      reliability: "Run health checks from several locations and keep records simple.",
      security: "Restrict who can edit records, and protect the registrar account: DNS is a classic takeover target.",
      cost: "Low. Per-hosted-zone and per-query pricing.",
    },
    cloudfront: {
      what: "A content delivery network. Caches content close to users and terminates HTTPS at the edge.",
      scaling: "Absorbs traffic spikes for cacheable content without touching the origin.",
      failure: "If the origin is down, the CDN can still serve what it has cached; uncached requests fail.",
      tradeoffs: [
        "Caching speeds things up and protects the origin, but stale content and cache invalidation need care.",
        "Putting everything behind a CDN adds one more layer to debug.",
      ],
      reliability: "Set sensible cache rules, use an origin failover where possible, and watch the cache hit ratio.",
      security: "HTTPS only, restrict the origin so it accepts traffic only from the CDN, and attach WAF.",
      cost: "Data transfer is the main cost. Higher cache hit rates reduce both the origin load and the bill.",
    },
    waf: {
      what: "A web application firewall: rules that block or rate-limit bad requests at the edge.",
      scaling: "Scales with the service it protects; rule complexity affects cost.",
      failure: "A too-broad rule can block real users, so new rules are best run in count mode first.",
      tradeoffs: [
        "Managed rule sets give quick protection but can produce false positives.",
        "Rate limits stop floods but need tuning so they don't affect busy, legitimate users.",
      ],
      reliability: "Log blocked and allowed requests, and review rule changes like code.",
      security: "This is the front line: block known-bad patterns, limit request rates and protect login endpoints.",
      cost: "Charged per rule and per request. Cheaper than serving the bad traffic.",
    },
    s3: {
      what: "Object storage for static assets such as images, scripts and downloads.",
      scaling: "Practically unlimited. No servers to size.",
      failure: "Highly durable. Mistakes (deleting or overwriting) are the bigger risk, so versioning helps.",
      tradeoffs: [
        "Serving static files from S3 and the CDN keeps load off the app servers.",
        "Versioning protects against mistakes but stores every version.",
      ],
      reliability: "Turn on versioning and, for critical data, cross-region replication.",
      security: "Block public access, allow only the CDN to read, and encrypt at rest.",
      cost: "Storage plus requests. Lifecycle rules move old data to cheaper tiers.",
    },
    alb: {
      what: "The Application Load Balancer. Spreads requests over the healthy instances in several Availability Zones.",
      scaling: "Scales automatically with traffic. Very sudden spikes can outrun it, so warm-up matters for big events.",
      failure: "If every target in a zone fails health checks, traffic shifts to the other zones.",
      tradeoffs: [
        "Layer-7 routing (paths and hosts) is flexible but costs more than a simple network balancer.",
        "Aggressive health checks remove bad targets quickly but can remove healthy ones under load.",
      ],
      reliability: "Enable at least two zones, use a health-check path that tests the app, and drain connections on deploys.",
      security: "TLS certificates on the listener, security groups that only accept the CDN, and WAF attached.",
      cost: "A fixed hourly cost plus usage. Shared across services where it makes sense.",
    },
    appA: appInfo,
    appB: appInfo,
    cache: {
      what: "Concept: an in-memory cache in front of the database for hot, repeated reads.",
      scaling: "Scales by adding nodes or shards. The hit rate matters more than the size.",
      failure: "If it is lost, every request goes to the database. Design for that, don't rely on the cache for correctness.",
      tradeoffs: [
        "Much faster reads and a lighter database, in return for stale data and the question of when to invalidate.",
        "An extra component to run, monitor and secure.",
      ],
      reliability: "Replicas for availability, and expiry times with some random spread so everything doesn't expire at once.",
      security: "Private subnets, authentication and encryption in transit. A cache can hold sensitive data.",
      cost: "Memory is expensive. Cache only what is read often.",
    },
    rdsP: {
      what: "The managed relational database (RDS). Holds the application's data.",
      scaling: "Scale up with a bigger instance, and offload reads to replicas and the cache. Writes are the hard part to scale.",
      failure: "Slow queries and long-running transactions are a more common problem than the instance dying. Replication lag shows up before outages.",
      tradeoffs: [
        "Managed RDS removes patching and backup chores but gives you less control than self-managing.",
        "Read replicas help reads but add replication lag, so some reads can be slightly stale.",
      ],
      reliability: "Backups with a tested restore, monitoring of slow queries, connections and lag, and a failover plan.",
      security: "Private subnets, encryption at rest with KMS, TLS in transit, and credentials from a secrets manager.",
      cost: "Instance size and storage dominate. Right-size, and don't pay for a replica you don't use.",
    },
    rdsS: {
      what: "Concept: a standby copy of the database in the other Availability Zone, kept in sync so it can take over.",
      scaling: "A standby is for availability, not for extra capacity.",
      failure: "On failover there is a short interruption while the standby is promoted and connections re-establish.",
      tradeoffs: [
        "Roughly doubles the database cost, in return for surviving a zone or instance failure.",
        "Synchronous replication adds a little write latency.",
      ],
      reliability: "Rehearse failover so the application reconnects cleanly.",
      security: "Same controls as the primary, including encryption.",
      cost: "About the cost of a second database instance.",
    },
    backups: {
      what: "Database snapshots, volume snapshots, machine images and versioned objects, kept so you can restore after a mistake or a disaster.",
      scaling: "Grows with the data. Lifecycle policies keep it in check.",
      failure: "The real risk is a backup you've never restored. Untested backups are guesses.",
      tradeoffs: [
        "More frequent backups mean less data lost, in return for more storage and more work.",
        "Taking an image before an upgrade makes rollback easy but is easy to forget.",
      ],
      reliability: "Automate backups, keep copies in another region, and test restores regularly.",
      security: "Encrypt backups and restrict who can delete them, so an attacker can't remove them along with the data.",
      cost: "Storage cost grows over time. Expire what you no longer need.",
    },
    dr: {
      what: "A second region holding copies of the data, ready to be brought up if the primary region fails.",
      scaling: "Sized for the minimum you must run during a disaster, not necessarily full capacity.",
      failure: "If the failover has never been rehearsed, expect surprises such as missing permissions, stale configuration or quotas.",
      tradeoffs: [
        "Backup-and-restore is the cheapest style of DR but the slowest to recover. Active-active is the fastest and by far the most expensive.",
        "More automation shortens recovery but needs ongoing upkeep.",
      ],
      reliability: "Write the runbook, rehearse it, and keep infrastructure in code so it can be recreated.",
      security: "Same standards as the primary: encryption, access control and logging.",
      cost: "A cold copy costs little; a warm or hot copy costs more. Decide based on how long the business can wait.",
    },
  },
  decisions: [
    {
      title: "Spread across Availability Zones",
      chose: "Compute and database in at least two zones",
      over: "Everything in one zone",
      because: "A zone-level problem then costs capacity, not availability.",
      cost: "A larger footprint and some cross-zone data transfer.",
      provenance: "concept",
    },
    {
      title: "CDN and WAF at the edge",
      chose: "Serve and filter traffic before it reaches the origin",
      over: "Sending all traffic straight to the load balancer",
      because: "Cacheable content never touches the origin, and bad traffic is dropped cheaply.",
      cost: "One more layer to configure and debug, and cache invalidation to manage.",
      provenance: "operated",
    },
    {
      title: "Managed database",
      chose: "RDS",
      over: "A database you install and run on instances",
      because: "Backups, patching and failover tooling come with the service, so the team spends time on the application.",
      cost: "Less control and a higher price for the same raw capacity.",
      provenance: "operated",
    },
    {
      title: "Protect the database with a cache",
      chose: "An in-memory cache for hot reads",
      over: "Letting every read hit the database",
      because: "Compute scales out easily; the database doesn't. A cache protects the part that is hardest to scale.",
      cost: "Stale data, invalidation rules and another component to run.",
      provenance: "concept",
    },
    {
      title: "Cheap disaster recovery",
      chose: "Copy backups to a second region and rebuild from them",
      over: "Running the full stack in two regions",
      because: "Most of the protection for a fraction of the cost.",
      cost: "Slower recovery, and a runbook that must be rehearsed.",
      provenance: "concept",
    },
    {
      title: "Health-checked, auto-scaled compute",
      chose: "Load balancer with Auto Scaling groups",
      over: "A fixed set of servers",
      because: "Failed instances are replaced automatically and capacity follows demand.",
      cost: "Instances must be stateless and start up quickly and repeatably.",
      provenance: "operated",
    },
  ],
  walkthrough: {
    title: "Intermittent 5xx errors behind the load balancer",
    label:
      "Illustrative scenario — modelled on a common production problem. It is not a record of a real incident.",
    intro:
      "Users report the site is slow and sometimes shows errors. Follow the investigation, from the load balancer down to the database.",
    symptoms: [
      "Some requests fail with 5xx, others succeed, with no clear pattern.",
      "The slowness comes and goes, and is worse at busy times.",
      "No deployment has happened today.",
    ],
    evidence: [
      {
        source: "Load balancer",
        finding: "Target health flaps: instances drop out and come back, in both zones.",
      },
      {
        source: "Access logs",
        finding: "Errors are concentrated on a few paths, not spread across the site.",
        command: "SELECT elb_status_code, request_url, count(*) FROM alb_logs GROUP BY 1, 2 ORDER BY 3 DESC LIMIT 20;",
      },
      {
        source: "WAF logs",
        finding: "Blocked and allowed volumes look normal, with no unusual client or burst.",
      },
      {
        source: "App servers",
        finding: "CPU and memory are normal, but requests are waiting on the database.",
      },
      {
        source: "Database",
        finding: "A long-running query holds connections and drives high I/O.",
        command: "SHOW FULL PROCESSLIST;",
      },
    ],
    hypotheses: [
      {
        text: "A bad deployment broke the application",
        verdict: "ruled-out",
        because: "No release today, and the same code was healthy yesterday.",
      },
      {
        text: "Malicious or abusive traffic is flooding the site",
        verdict: "ruled-out",
        because: "Request volume and sources look normal in the WAF and access logs.",
      },
      {
        text: "The instances themselves are unhealthy",
        verdict: "ruled-out",
        because: "CPU, memory and disk are fine. They fail health checks only when requests stall.",
      },
      {
        text: "The database is slow and the app is waiting on it",
        verdict: "confirmed",
        because: "A long-running query is holding connections and I/O; the failing paths are the ones that use it.",
      },
    ],
    rootCause:
      "A heavy query without a suitable index runs during busy periods, holds connections and drives I/O. Requests that need the database queue behind it and time out, so the load balancer sees the targets as unhealthy.",
    fix: [
      "Stop the long-running query to restore normal service.",
      "Add the missing index or rewrite the query, and test it with production-sized data.",
      "Move heavy reporting off the primary: a read replica or an off-peak schedule.",
    ],
    prevention: [
      "Alert on slow queries, connection usage and replication lag, not only on 5xx.",
      "Set query timeouts and limit connection pools so one query can't take everything.",
      "Review the query plan of new queries before release.",
      "Cache hot reads so the database isn't hit for every request.",
    ],
    focus: {
      symptoms: ["alb"],
      evidence: ["alb", "waf", "appA", "rdsP"],
      hypotheses: ["alb", "waf", "appA", "rdsP"],
      rootCause: ["rdsP"],
      fix: ["rdsP"],
      prevention: ["rdsP", "cache", "appA"],
    },
  },
};
