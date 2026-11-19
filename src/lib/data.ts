// Single source of truth for all portfolio content.
// Edit this file to update the site — every section reads from here.

export const profile = {
  name: "Darren James Gendron",
  shortName: "Darren Gendron",
  initials: "dg",
  role: "Senior Golang Software Engineer",
  location: "Pinehurst, NC",
  email: "darrengendron56@gmail.com",
  // TODO: paste your real profile URLs here. Empty strings are hidden in the UI.
  linkedin: "",
  github: "",
  since: 2017,
  tagline:
    "I build the backend systems that move money — concurrent, event-driven, and calm under load.",
  summary:
    "Experienced backend engineer specializing in Golang, with deep expertise in Node.js and Python for building scalable microservices, distributed systems, and event-driven architectures. I design high-performance APIs, real-time data pipelines, and cloud-native applications with Kafka, gRPC, Kubernetes, and Terraform — and I'm comfortable in React and Angular when the system needs an end-to-end owner.",
};

export const stats = [
  { value: "9+", label: "years shipping backend systems" },
  { value: "3", label: "fintech & payments platforms" },
  { value: "3", label: "clouds — AWS, GCP, Azure" },
  { value: "11", label: "industry certifications" },
];

export type Job = {
  id: string;
  company: string;
  role: string;
  location: string;
  start: string; // YYYY-MM
  end: string | null; // null = present
  service: string; // span name shown in the trace view
  blurb: string;
  highlights: string[];
  stack: string[];
};

export const PRESENT = "2026-11";

export const jobs: Job[] = [
  {
    id: "fanatics",
    company: "Fanatics",
    role: "Senior Golang Software Engineer",
    location: "Pinehurst, NC",
    start: "2020-05",
    end: null,
    service: "fanatics.senior-golang-engineer",
    blurb:
      "Architecting Go microservices for the Digital One Omni Channel project — high-volume transactions across mobile, web, and ATM channels.",
    highlights: [
      "Architected Go microservices with goroutines and worker pools, gRPC for low-latency service-to-service calls, and Redis caching for high-volume transactions.",
      "Built a fault-tolerant real-time transaction processor on Go's CSP model — channels and select — cutting synchronization overhead.",
      "Designed an event-driven architecture on Kafka and RabbitMQ with idempotent handlers and the outbox pattern for eventual consistency.",
      "Shipped streaming pipelines with Kafka Streams and Redis Streams, using log-based CDC for real-time fraud detection and reconciliation.",
      "Tuned PostgreSQL with advanced indexing, EXPLAIN ANALYZE, pgBouncer pooling, and partitioning for large-scale transactional data.",
      "Enforced observability: OpenTelemetry tracing, Prometheus metrics, ELK logging, and structured logs with Zerolog.",
      "Reduced heap allocations with sync.Pool, struct alignment, and escape analysis to ease GC pressure in high-throughput services.",
      "Led Kubernetes (EKS) deployments with Helm, HPA, and blue-green releases through ArgoCD; provisioned infra with Terraform and AWS CDK.",
    ],
    stack: ["Go", "gRPC", "Kafka", "RabbitMQ", "Redis", "PostgreSQL", "Kubernetes", "Terraform", "OpenTelemetry", "FastAPI", "React"],
  },
  {
    id: "tebra",
    company: "Tebra",
    role: "Software Engineer",
    location: "Pinehurst, NC",
    start: "2019-05",
    end: "2020-05",
    service: "tebra.software-engineer",
    blurb:
      "Real-time credit card payment processing, fraud detection, and settlement — plus migrating a Rails monolith to Go.",
    highlights: [
      "Developed Go microservices for real-time card payment processing using worker pools, buffered channels, and mutex locking.",
      "Built a high-frequency fraud detection system with bloom filters, probabilistic data structures, and sliding-window rate limiting.",
      "Designed event-driven flows on NATS and AWS SNS/SQS with at-least-once delivery and dead-letter queues.",
      "Engineered a multi-region ledger on PostgreSQL + TimescaleDB with partitioning and point-in-time recovery.",
      "Replaced Redis with an LSM-tree cache on RocksDB where fraud queries needed persistence and fast lookups.",
      "Refactored monolithic Ruby on Rails components into Go microservices with backward-compatible, phased migration.",
      "Built rate limiting with token buckets and sliding log windows to stop brute-force and fraudulent bursts.",
      "Automated canary releases and rollbacks with GitLab CI/CD and Tekton on AWS ECS (Fargate).",
    ],
    stack: ["Go", "NATS", "SNS/SQS", "Kafka", "Flink", "RocksDB", "TimescaleDB", "FastAPI", "Node.js", "Ruby on Rails"],
  },
  {
    id: "luxoft",
    company: "Luxoft",
    role: "Software Engineer",
    location: "Pinehurst, NC",
    start: "2017-09",
    end: "2019-05",
    service: "luxoft.software-engineer",
    blurb:
      "A real-time financial risk modeling platform for institutional investors — market data in, risk exposure out.",
    highlights: [
      "Developed Go microservices for real-time risk modeling with worker pools, goroutines, and memory-optimized data structures.",
      "Deployed a risk assessment engine in Python (FastAPI) and Go, integrating Monte Carlo simulations and Bayesian inference.",
      "Engineered a high-throughput ingestion pipeline on Kafka and TimescaleDB with partitioning, compression, and parallel queries.",
      "Integrated Bloomberg, NASDAQ, and FINRA data providers over OAuth 2.0, WebSockets, and GraphQL.",
      "Tuned Go and Node.js with GC strategy, struct alignment, and pprof CPU profiling for expensive financial calculations.",
      "Built an event-driven trade settlement system on AWS Lambda, DynamoDB Streams, and SQS with FIX protocol integration.",
      "Deployed on Kubernetes (AKS) with Helm, Istio service mesh, and autoscaling to absorb market volatility.",
      "Managed multi-cloud infrastructure across AWS, GCP, and Azure with Pulumi (TypeScript).",
    ],
    stack: ["Go", "Python", "Kafka", "TimescaleDB", "AWS Lambda", "DynamoDB", "Istio", "Pulumi", "PyTorch", "React"],
  },
];

export type System = {
  id: string;
  title: string;
  company: string;
  summary: string;
  pipeline: string[];
  points: string[];
  tags: string[];
  tone: "go" | "amber" | "green" | "violet";
};

export const systems: System[] = [
  {
    id: "txn-core",
    title: "Omni-channel transaction core",
    company: "Fanatics",
    summary:
      "Go microservices handling high-volume transactions across mobile, web, and ATM channels — with consistency guaranteed by idempotent events and the outbox pattern.",
    pipeline: ["channels", "gateway", "go services", "kafka", "consumers"],
    points: [
      "gRPC between services, Redis read-through cache in front",
      "CSP-style processing with channels and select",
      "Batch settlement engine on worker pools and buffered channels",
    ],
    tags: ["Go", "gRPC", "Kafka", "RabbitMQ", "Redis"],
    tone: "go",
  },
  {
    id: "fraud",
    title: "High-frequency fraud detection",
    company: "Tebra",
    summary:
      "Near-instant anomaly detection on card transactions using probabilistic data structures, with an LSM-tree cache where persistence and speed both mattered.",
    pipeline: ["card txn", "bloom filter", "sliding window", "risk engine", "alert"],
    points: [
      "Bloom filters and sliding-window rate limiting in Go",
      "RocksDB cache replacing Redis for persistent lookups",
      "Risk engine in Python streaming from Kafka",
    ],
    tags: ["Go", "RocksDB", "Kafka", "Flink", "scikit-learn"],
    tone: "amber",
  },
  {
    id: "risk",
    title: "Real-time risk modeling platform",
    company: "Luxoft",
    summary:
      "Market data ingestion and risk assessment for institutional investors — Monte Carlo simulation and Bayesian inference over streaming trades.",
    pipeline: ["market feeds", "kafka", "risk engine", "timescaledb", "dashboard"],
    points: [
      "Bloomberg, NASDAQ, and FINRA integrations",
      "In-memory LRU cache in Go for pre-computed risk results",
      "pprof-driven GC and struct-alignment tuning",
    ],
    tags: ["Go", "Python", "Kafka", "TimescaleDB", "WebSockets"],
    tone: "violet",
  },
  {
    id: "platform",
    title: "Observability & zero-downtime delivery",
    company: "Fanatics · Luxoft",
    summary:
      "Tracing, metrics, and logs wired into every service — and deploy pipelines that ship blue-green without anyone noticing.",
    pipeline: ["commit", "ci tests", "argo cd", "blue / green", "telemetry"],
    points: [
      "OpenTelemetry tracing, Prometheus metrics, ELK logging",
      "Helm + HPA on EKS and AKS, ArgoCD blue-green rollouts",
      "Terraform, AWS CDK, and Pulumi for infrastructure as code",
    ],
    tags: ["Kubernetes", "ArgoCD", "OpenTelemetry", "Prometheus", "Terraform"],
    tone: "green",
  },
];

export const skillGroups: { id: string; label: string; items: string[] }[] = [
  {
    id: "languages",
    label: "Languages",
    items: ["Golang", "TypeScript", "Python", "Node.js", "Ruby on Rails", "Bash", "Shell"],
  },
  {
    id: "backend",
    label: "Backend & APIs",
    items: ["Microservices", "REST", "gRPC", "GraphQL", "WebSockets", "FastAPI", "OAuth 2.0", "JWT", "OIDC", "mTLS", "Goroutines", "Worker Pools", "Channels"],
  },
  {
    id: "events",
    label: "Messaging & Streams",
    items: ["Apache Kafka", "Kafka Streams", "RabbitMQ", "NATS", "Pulsar", "AWS SNS/SQS", "Apache Flink", "AWS Kinesis"],
  },
  {
    id: "cloud",
    label: "Cloud & Infra",
    items: ["AWS", "Google Cloud", "Azure", "AWS Lambda", "Cloud Functions", "Terraform", "Pulumi", "AWS CDK", "Docker", "Kubernetes", "EKS · AKS · GKE", "Helm"],
  },
  {
    id: "data",
    label: "Data & Storage",
    items: ["PostgreSQL", "MySQL", "Amazon Aurora", "TimescaleDB", "DynamoDB", "MongoDB", "Cassandra", "CockroachDB", "Redis", "Memcached", "RocksDB", "MinIO", "S3"],
  },
  {
    id: "devops",
    label: "CI/CD & Observability",
    items: ["GitHub Actions", "GitLab CI/CD", "Jenkins", "ArgoCD", "Tekton", "Blue-Green", "Canary", "Feature Flags", "Prometheus", "Grafana", "OpenTelemetry", "ELK Stack", "Loki", "Jaeger", "Zipkin"],
  },
  {
    id: "testing",
    label: "Testing",
    items: ["GoMock", "Jest", "PyTest", "TestContainers", "Postman", "Supertest", "K6", "Locust", "JMeter", "wrk", "Cypress", "Selenium"],
  },
  {
    id: "security",
    label: "Security & Compliance",
    items: ["OWASP", "RBAC", "API Hardening", "HashiCorp Vault", "AWS KMS", "SonarQube", "Checkmarx", "Trivy", "Aqua Security", "PCI-DSS", "SOC 2", "GDPR", "HIPAA"],
  },
  {
    id: "frontend",
    label: "Frontend",
    items: ["React", "Redux", "Angular", "RxJS", "D3.js", "SSR", "Lazy Loading"],
  },
];

export const marquee = [
  "Golang", "Kafka", "gRPC", "Kubernetes", "Terraform", "PostgreSQL", "Redis", "AWS",
  "OpenTelemetry", "NATS", "TypeScript", "Python", "RabbitMQ", "ArgoCD", "Docker", "Flink",
];

export const certifications = [
  { name: "Certified Golang Developer", issuer: "Google" },
  { name: "AWS Certified Developer – Associate", issuer: "Amazon Web Services" },
  { name: "HashiCorp Certified: Terraform Associate", issuer: "HashiCorp" },
  { name: "Microsoft Certified: Azure Fundamentals", issuer: "Microsoft" },
  { name: "Certified ScrumMaster (CSM)", issuer: "Scrum Alliance" },
  { name: "React Certified Developer", issuer: "Meta" },
  { name: "Google Mobile Web Specialist", issuer: "Google" },
  { name: "JavaScript Certification", issuer: "W3C & Udemy" },
  { name: "Certified Web Professional – Web Developer", issuer: "International Web Association" },
  { name: "Frontend Web Development", issuer: "freeCodeCamp" },
  { name: "Responsive Web Design", issuer: "freeCodeCamp" },
];

export const education = {
  school: "Medaille University",
  place: "Buffalo, New York",
  degree: "B.S. in Computer Science",
  period: "2013 – 2017",
};

export const sections = [
  { id: "about", label: "About" },
  { id: "playground", label: "Playground" },
  { id: "experience", label: "Experience" },
  { id: "systems", label: "Systems" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
];
