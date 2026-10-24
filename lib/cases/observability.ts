import type { CaseStudy } from "../designLab";

/**
 * Case study 4 — Observability & Incident Response (conceptual reference design).
 * Badges reflect hands-on experience with each tool (from the resume).
 * Distributed tracing is shown as a CONCEPT: the resume lists SigNoz for dashboards, not tracing.
 * No metrics, no real incident data, no employer detail.
 */
export const OBS_CASE: CaseStudy = {
  id: "observability",
  title: "Observability & Incident Response",
  short: "Observability",
  kind: "conceptual",
  tagline: "Know something is wrong before users tell you, then find why and stop it coming back.",
  summary:
    "A reference design for seeing what a system is doing and responding when it misbehaves: metrics, logs and traces feed dashboards and alerts; an on-call engineer follows a runbook; and each incident ends with a root-cause analysis and preventive actions.",
  disclaimer:
    "A reference design built from tools I work with. The incident shown is illustrative, not a record of a real one.",
  reviewed: false,
  real: {
    operated: [
      "Metrics and dashboards with Prometheus, Grafana and CloudWatch; SigNoz and Grafana/Loki dashboards for cron jobs and deployments",
      "Logs with Loki and the ELK stack, and ALB logs queried in Athena",
      "Uptime monitoring with StatusCake and Nagios",
      "On-call incident response, root-cause analysis (RCA) and runbook documentation",
    ],
    concept: [
      "Distributed tracing and the preventive-actions loop are reference-design elements, not claims of experience",
    ],
  },
  viewBox: { w: 1020, h: 580 },
  zones: [
    { id: "sources", label: "Sources", x: 140, y: 52, w: 190, h: 388, tone: "sky" },
    { id: "telemetry", label: "Telemetry", x: 355, y: 52, w: 190, h: 388, tone: "gold" },
    { id: "insight", label: "Insight", x: 570, y: 52, w: 190, h: 388, tone: "lavender" },
    { id: "people", label: "People", x: 785, y: 52, w: 190, h: 388, tone: "peach" },
    { id: "loop", label: "Incident learning loop", x: 355, y: 462, w: 620, h: 100, tone: "sky" },
  ],
  nodes: [
    { id: "svc", label: "Services", sub: "apps + jobs", icon: "api", x: 235, y: 130, provenance: "operated" },
    { id: "probe", label: "Uptime checks", sub: "StatusCake", icon: "radar", x: 235, y: 250, provenance: "operated" },
    { id: "infra", label: "Infrastructure", sub: "nodes, DB, LB", icon: "cpu", x: 235, y: 370, provenance: "operated" },
    { id: "traces", label: "Traces", sub: "SigNoz", icon: "waypoints", x: 450, y: 130, provenance: "concept" },
    { id: "metrics", label: "Metrics", sub: "Prometheus, CW", icon: "chart", x: 450, y: 250, provenance: "operated" },
    { id: "logs", label: "Logs", sub: "Loki, ELK", icon: "file", x: 450, y: 370, provenance: "operated" },
    { id: "dash", label: "Dashboards", sub: "Grafana", icon: "activity", x: 665, y: 130, provenance: "operated" },
    { id: "alerts", label: "Alert rules", sub: "rules + routing", icon: "bell", x: 665, y: 370, provenance: "operated" },
    { id: "search", label: "Log search", sub: "Kibana, Athena", icon: "search", x: 665, y: 250, provenance: "operated" },
    { id: "oncall", label: "On-call", sub: "engineer", icon: "user", x: 880, y: 250, provenance: "actor" },
    { id: "prevent", label: "Prevention", sub: "alerts, tests", icon: "shield", x: 450, y: 520, provenance: "concept" },
    { id: "rca", label: "RCA", sub: "cause + timeline", icon: "target", x: 665, y: 520, provenance: "operated" },
    { id: "runbook", label: "Runbooks", sub: "documented fixes", icon: "book", x: 880, y: 520, provenance: "operated" },
  ],
  edges: [
    { id: "e-svc-t", from: "svc", to: "traces", label: "emits traces", kind: "data", bend: 0.03, provenance: "concept" },
    { id: "e-svc-m", from: "svc", to: "metrics", label: "exports metrics", kind: "data", bend: 0.05 },
    { id: "e-probe-m", from: "probe", to: "metrics", label: "uptime results", kind: "data", bend: 0.03 },
    { id: "e-infra-m", from: "infra", to: "metrics", label: "host + DB metrics", kind: "data", bend: 0.05 },
    { id: "e-infra-l", from: "infra", to: "logs", label: "node + container logs", kind: "data", bend: 0.03 },
    { id: "e-trace-d", from: "traces", to: "dash", label: "trace views", kind: "data", bend: 0.03, provenance: "concept" },
    { id: "e-met-d", from: "metrics", to: "dash", label: "graphs", kind: "data", bend: 0.05 },
    { id: "e-met-a", from: "metrics", to: "alerts", label: "evaluate rules", kind: "data", bend: 0.03 },
    { id: "e-log-s", from: "logs", to: "search", label: "search", kind: "data", bend: 0.03 },
    { id: "e-alert-o", from: "alerts", to: "oncall", label: "page", kind: "request", bend: 0.03 },
    { id: "e-dash-o", from: "dash", to: "oncall", label: "investigate", kind: "request", bend: 0.05 },
    { id: "e-search-o", from: "search", to: "oncall", label: "dig into logs", kind: "request", bend: 0.05 },
    { id: "e-runbook", from: "oncall", to: "runbook", label: "follow the runbook", kind: "control", bend: 0.03 },
    { id: "e-rca", from: "runbook", to: "rca", label: "write up the cause", kind: "control", bend: 0.03 },
    { id: "e-prevent", from: "rca", to: "prevent", label: "preventive actions", kind: "control", bend: 0.03, provenance: "concept" },
    { id: "e-feedback", from: "prevent", to: "alerts", label: "better alerts and checks", kind: "control", bend: 0.03, provenance: "concept" },
  ],
  flows: [
    {
      id: "signals",
      label: "Signal to insight",
      blurb: "From a running system to a graph",
      steps: [
        {
          title: "Services emit signals",
          detail: "Applications export metrics and, as a concept, traces that follow a request through the system.",
          nodes: ["svc", "metrics", "traces"],
          edges: ["e-svc-m", "e-svc-t"],
        },
        {
          title: "Infrastructure and uptime checks add theirs",
          detail:
            "Hosts and databases add their own metrics and container logs. An uptime check measures what a user sees from outside.",
          nodes: ["infra", "probe", "metrics", "logs"],
          edges: ["e-infra-m", "e-infra-l", "e-probe-m"],
        },
        {
          title: "Dashboards show the trend",
          detail: "Dashboards turn metrics into graphs so you can see what changed and when.",
          nodes: ["metrics", "dash"],
          edges: ["e-met-d"],
        },
        {
          title: "Rules watch for symptoms",
          detail: "Alert rules evaluate the same metrics and fire when users are likely to be affected.",
          nodes: ["metrics", "alerts"],
          edges: ["e-met-a"],
        },
      ],
    },
    {
      id: "incident",
      label: "Incident lifecycle",
      blurb: "Detect → respond → learn",
      steps: [
        {
          title: "Detect",
          detail: "An alert pages the on-call engineer. The best alerts say what users are experiencing.",
          nodes: ["alerts", "oncall"],
          edges: ["e-alert-o"],
        },
        {
          title: "Triage",
          detail: "Dashboards show what changed, when it started and who is affected.",
          nodes: ["dash", "oncall"],
          edges: ["e-dash-o"],
        },
        {
          title: "Investigate",
          detail: "Log search (and traces, as a concept) explain what actually happened.",
          nodes: ["logs", "search", "oncall"],
          edges: ["e-log-s", "e-search-o"],
        },
        {
          title: "Mitigate",
          detail:
            "Follow the runbook to stop the harm first: roll back, scale, fail over. Understanding the cause can come after.",
          nodes: ["oncall", "runbook"],
          edges: ["e-runbook"],
        },
        {
          title: "Learn",
          detail: "Write the root-cause analysis with a timeline of what happened and what was decided.",
          nodes: ["runbook", "rca"],
          edges: ["e-rca"],
        },
        {
          title: "Prevent",
          detail:
            "Turn findings into better alerts, tests and guardrails, so the same problem is caught earlier next time (a concept here).",
          nodes: ["rca", "prevent", "alerts"],
          edges: ["e-prevent", "e-feedback"],
        },
      ],
    },
    {
      id: "pillars",
      label: "Metrics, logs, traces",
      blurb: "Three questions, three signals",
      steps: [
        {
          title: "Metrics: is something wrong, and how badly?",
          detail: "Numbers over time. Cheap to store and ideal for dashboards and alerts, but they don't explain why.",
          nodes: ["metrics", "dash"],
          edges: ["e-met-d"],
        },
        {
          title: "Logs: what exactly happened?",
          detail: "Detailed events. Rich in context, and expensive at volume, so structure and retention matter.",
          nodes: ["logs", "search"],
          edges: ["e-log-s"],
        },
        {
          title: "Traces: where did the time go?",
          detail: "Concept: follow one request across services to see which call was slow. Shown as a design element, not a claim of use.",
          nodes: ["traces", "dash"],
          edges: ["e-trace-d"],
        },
      ],
    },
  ],
  failures: [
    {
      id: "blind",
      label: "Telemetry pipeline down",
      breaks: ["metrics"],
      provenance: "concept",
      symptom: "Dashboards are flat or empty and no alerts fire, even though users are affected.",
      behaviour: "Silence looks like health. Without an independent check you find out from your users.",
      mitigation:
        "Alert on missing data, keep an independent uptime check, and add an alert that fires when alerting itself stops working.",
    },
    {
      id: "noisy",
      label: "Alert fatigue",
      breaks: ["alerts"],
      provenance: "concept",
      symptom: "Many alerts fire and most can be ignored.",
      behaviour: "On-call starts ignoring pages, and the one that matters hides in the noise.",
      mitigation:
        "Alert on user-visible symptoms, route by severity, remove or tune alerts nobody acts on, and link each to a runbook.",
    },
    {
      id: "logflood",
      label: "Log volume explodes",
      breaks: ["logs", "search"],
      provenance: "concept",
      symptom: "Log search is slow or drops data, and storage cost climbs.",
      behaviour: "A chatty error loop can flood the pipeline exactly when the logs are most needed.",
      mitigation: "Rate limits and sampling, structured logs, and tiered retention.",
    },
    {
      id: "norunbook",
      label: "No runbook",
      breaks: ["runbook"],
      provenance: "concept",
      symptom: "The incident is handled from memory and each person does it differently.",
      behaviour: "Recovery depends on who is on call, and knowledge is lost between incidents.",
      mitigation: "Write or update a runbook after every incident, and keep it linked from the alert.",
    },
  ],
  info: {
    oncall: {
      what: "The engineer who responds when an alert fires. A person, not a component of the system.",
      scaling: "—",
      failure: "—",
      tradeoffs: [],
      reliability: "—",
      security: "—",
      cost: "—",
    },
    svc: {
      what: "The applications and scheduled jobs that produce metrics, logs and, as a concept, traces.",
      scaling: "Instrumentation cost grows with the number of services and with metric labels.",
      failure: "A service that stops emitting data looks fine on a dashboard, so missing data needs its own alert.",
      tradeoffs: [
        "More instrumentation gives better answers but adds code, overhead and cost.",
        "Standard names and labels across services make dashboards reusable.",
      ],
      reliability: "Health endpoints that test real dependencies, and structured logs with request identifiers.",
      security: "Never log passwords, tokens or personal data.",
      cost: "Mostly the cost of storing what they emit.",
    },
    probe: {
      what: "Uptime checks from outside, such as StatusCake or Nagios, that request the site like a user would.",
      scaling: "Add checks for the journeys that matter most; more isn't always better.",
      failure: "A check that tests only the home page can stay green while checkout is broken.",
      tradeoffs: [
        "Outside-in checks catch what internal metrics miss, but only test what you point them at.",
        "Frequent checks detect problems faster and cost more.",
      ],
      reliability: "Check from several locations and alert only when more than one agrees.",
      security: "Don't put real credentials in check configuration.",
      cost: "Low.",
    },
    infra: {
      what: "The hosts, nodes, databases and load balancers underneath the applications.",
      scaling: "Metrics are collected per host, so volume grows with the fleet.",
      failure: "Resource saturation (CPU, memory, disk, connections) is the usual early warning.",
      tradeoffs: [
        "Per-instance detail helps debugging but is noisy for alerting. Alert on aggregates, investigate per instance.",
      ],
      reliability: "Watch saturation and errors, not only usage.",
      security: "Restrict who can read system logs, because they can contain sensitive data.",
      cost: "Collection agents use a small amount of compute.",
    },
    traces: {
      what: "Concept: tracing follows one request across services and shows how long each step took. Shown as a design element. My resume lists SigNoz for dashboards, not tracing.",
      scaling: "Usually sampled, because tracing every request is expensive.",
      failure: "Missing context propagation breaks the trace into pieces.",
      tradeoffs: [
        "Traces answer “where is the time going?” better than anything else, at the price of instrumentation work.",
        "Sampling saves cost but can miss rare slow requests.",
      ],
      reliability: "Propagate trace context consistently and sample smartly.",
      security: "Don't attach sensitive data to spans.",
      cost: "Storage and processing. Sampling controls it.",
    },
    metrics: {
      what: "Numbers over time (Prometheus, CloudWatch): request rate, errors, latency and saturation.",
      scaling: "Cost follows the number of distinct series, so unbounded labels such as user IDs are dangerous.",
      failure: "If collection stops, graphs go flat and alerts stay silent, which looks like health.",
      tradeoffs: [
        "Metrics are cheap and fast for detection, but can't explain what happened.",
        "Short retention is cheap; long retention supports trends and capacity planning.",
      ],
      reliability: "Highly available collection, and an alert on missing data.",
      security: "Keep it internal and avoid sensitive labels.",
      cost: "Grows with series count and retention.",
    },
    logs: {
      what: "Detailed events from applications and infrastructure (Loki, the ELK stack).",
      scaling: "Volume can grow very fast. Structure, sampling and retention tiers keep it manageable.",
      failure: "A flood of log lines can overload the pipeline during an incident.",
      tradeoffs: [
        "Logs hold the detail needed to explain an incident, but are expensive to keep and slow to search at volume.",
        "Structured logs are easy to query; free text is hard.",
      ],
      reliability: "Buffer in the shipper and set limits so a flood can't take the pipeline down.",
      security: "Mask sensitive fields and control who can search production logs.",
      cost: "Often the largest part of observability spend. Tier retention.",
    },
    dash: {
      what: "Dashboards (Grafana) that show the health of a service at a glance and help to triage.",
      scaling: "A few good dashboards beat many. Too many panels slow down both the page and the thinking.",
      failure: "A dashboard nobody trusts is worse than none. Keep them accurate and current.",
      tradeoffs: [
        "Per-team dashboards fit their needs, but standard ones let anyone on call help.",
        "Detail answers more questions but makes it harder to see the headline.",
      ],
      reliability: "Keep dashboards as code so they can be reviewed and restored.",
      security: "Role-based access, and no public links.",
      cost: "Low.",
    },
    alerts: {
      what: "Rules that evaluate metrics and notify the on-call engineer when users are likely to be affected.",
      scaling: "Every alert is a promise that someone will act. Fewer, better alerts scale better than many.",
      failure: "Too many alerts cause fatigue; too few leave blind spots.",
      tradeoffs: [
        "Alerting on symptoms (errors, latency) is less noisy than alerting on causes (CPU), but finds the cause later.",
        "Sensitive thresholds catch problems early and wake people up for nothing.",
      ],
      reliability: "Each alert has an owner, a severity and a link to a runbook; review them regularly.",
      security: "Don't send sensitive data in notifications.",
      cost: "The real cost is human attention.",
    },
    search: {
      what: "Searching logs (Kibana, or SQL over load balancer logs in Athena) to find what happened to specific requests.",
      scaling: "Query speed depends on indexing and how much data you scan. Narrow the time range first.",
      failure: "Slow or incomplete search during an incident costs time.",
      tradeoffs: [
        "Indexed search is fast but costs more to store; scanning cheap storage is slower but cheaper.",
      ],
      reliability: "Keep saved queries for common questions.",
      security: "Audit who searches, and restrict access to sensitive logs.",
      cost: "Scanning large volumes in Athena is billed by data scanned, so partition your data.",
    },
    runbook: {
      what: "Written steps for handling a known problem: how to check it, how to stop the harm and who to call.",
      scaling: "Scales your best engineer's knowledge to everyone on call.",
      failure: "A runbook that is out of date can do harm. Test it.",
      tradeoffs: [
        "Writing and maintaining runbooks takes time, which pays back at 3 a.m.",
        "Automating a runbook is better than documenting it, once the steps are stable.",
      ],
      reliability: "Link it from the alert, and update it after each incident.",
      security: "Don't store credentials in a runbook.",
      cost: "Engineering time.",
    },
    rca: {
      what: "A root-cause analysis written after the incident: what happened, the timeline, why, and what to change.",
      scaling: "Do a full one for significant incidents and a short one for the rest.",
      failure: "An RCA that blames a person and not a process teaches nothing and discourages honesty.",
      tradeoffs: [
        "Thorough RCAs take time away from other work, but prevent repeat incidents.",
        "Asking “why?” several times finds the cause behind the cause.",
      ],
      reliability: "Record a timeline while it is still fresh.",
      security: "Redact sensitive details if the document is shared widely.",
      cost: "Engineering time, usually well spent.",
    },
    prevent: {
      what: "Concept: actions that come out of an RCA: better alerts, tests, limits and guardrails, tracked until done.",
      scaling: "A short list of follow-through beats a long list nobody finishes.",
      failure: "Actions that aren't owned or tracked never happen.",
      tradeoffs: [
        "Preventive work competes with features, so choose what reduces the most risk.",
        "Some risks are accepted deliberately; write that down.",
      ],
      reliability: "Give each action an owner and a due date.",
      security: "Fix security-relevant gaps first.",
      cost: "Engineering time, against the cost of a repeat incident.",
    },
  },
  decisions: [
    {
      title: "Use all three signals together",
      chose: "Metrics to detect, logs to explain, traces to find slow steps",
      over: "Relying on one signal",
      because: "Each answers a different question, and incidents usually need more than one.",
      cost: "More tools to run and more data to pay for. Traces are a concept in this design.",
      provenance: "concept",
    },
    {
      title: "Alert on symptoms",
      chose: "Alerts for what users experience, such as errors and latency",
      over: "Alerts for every possible cause",
      because: "Fewer pages, and each one means something real. Causes are found during triage.",
      cost: "You learn that something is wrong before you learn why.",
      provenance: "concept",
    },
    {
      title: "Check from the outside too",
      chose: "Independent uptime checks next to internal metrics",
      over: "Only trusting internal monitoring",
      because: "If the monitoring itself fails, an outside check still notices that the site is down.",
      cost: "Checks only cover what you point them at.",
      provenance: "operated",
    },
    {
      title: "Keep runbooks next to the alerts",
      chose: "A runbook linked from each alert",
      over: "Knowledge that lives in people's heads",
      because: "Anyone on call can act, and the response doesn't depend on who is awake.",
      cost: "Upkeep: runbooks go stale if nobody updates them.",
      provenance: "operated",
    },
    {
      title: "Finish every incident with an RCA",
      chose: "A written root-cause analysis with a timeline and actions",
      over: "Fixing it and moving on",
      because: "The fix helps today; the analysis stops the next one.",
      cost: "Time spent after the pressure is gone, when it is easy to skip.",
      provenance: "operated",
    },
    {
      title: "Tier the log retention",
      chose: "Recent logs searchable, older logs in cheaper storage",
      over: "Keeping everything hot forever",
      because: "Most investigations need recent data, and storage cost grows with volume.",
      cost: "Older logs are slower to search.",
      provenance: "concept",
    },
  ],
  walkthrough: {
    title: "Errors climb after a downstream service slows down",
    label:
      "Illustrative scenario — modelled on a common production incident. It is not a record of a real incident.",
    intro:
      "An alert fires: the error rate on a customer-facing service is rising. Follow the response from the page to the follow-up actions.",
    symptoms: [
      "The error-rate alert fires and pages the on-call engineer.",
      "Response times are climbing for many requests.",
      "Request volume looks normal.",
    ],
    evidence: [
      {
        source: "Dashboards",
        finding: "Errors and latency are up. Request rate is flat, so it isn't a traffic spike.",
        command: "sum(rate(http_requests_total{status=~\"5..\"}[5m])) / sum(rate(http_requests_total[5m]))",
      },
      {
        source: "Saturation",
        finding: "The connection pool is almost fully used. CPU and memory are normal.",
      },
      {
        source: "Logs",
        finding: "A surge of “timed out waiting for a connection” messages.",
        command: "{app=\"<service>\"} |= \"timed out waiting for connection\"",
      },
      {
        source: "Dependency",
        finding: "A downstream service answers much more slowly than usual.",
      },
      {
        source: "Release history",
        finding: "The last release added a call to that downstream service.",
      },
    ],
    hypotheses: [
      {
        text: "A traffic spike overloaded the service",
        verdict: "ruled-out",
        because: "Request volume is flat.",
      },
      {
        text: "The hosts ran out of CPU or memory",
        verdict: "ruled-out",
        because: "Resource graphs are normal.",
      },
      {
        text: "A network or DNS problem",
        verdict: "ruled-out",
        because: "Other calls from the same hosts are fast.",
      },
      {
        text: "A slow downstream call with no timeout is exhausting the connection pool",
        verdict: "confirmed",
        because: "Pool saturation, timeout messages and the new call to the slow dependency all line up.",
      },
    ],
    rootCause:
      "A new code path calls a downstream service without a timeout. When that service slowed down, requests piled up waiting for it, used up the connection pool, and made unrelated requests fail.",
    fix: [
      "Switch the new feature off or roll back the release, following the runbook.",
      "Confirm that errors and latency return to normal.",
      "Add a timeout and a circuit breaker around the downstream call, then release again gradually.",
    ],
    prevention: [
      "Set timeouts on every outbound call, and fail fast when a dependency is unhealthy.",
      "Alert on pool saturation and dependency latency, not only on errors.",
      "Test what happens when a dependency is slow, not only when it is down.",
      "Roll out new calls gradually, behind a switch.",
    ],
    focus: {
      symptoms: ["alerts", "oncall"],
      evidence: ["metrics", "dash", "logs", "search"],
      hypotheses: ["metrics", "infra", "logs"],
      rootCause: ["svc"],
      fix: ["runbook", "oncall"],
      prevention: ["rca", "prevent", "alerts"],
    },
    timeline: [
      { phase: "Detect", event: "The error-rate alert fires and pages on-call." },
      { phase: "Triage", event: "Dashboards show errors rising while request volume stays flat." },
      { phase: "Mitigate", event: "The new feature is switched off, following the runbook." },
      { phase: "Resolve", event: "Error rate and latency return to normal." },
      { phase: "Review", event: "The RCA records the cause and the preventive actions." },
    ],
  },
};
