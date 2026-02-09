# ALPR -- AI Learning Process Record

**An open, portable schema for capturing how students learn with AI.**

ALPR is a specification for creating verifiable, student-owned records of the *process* of AI-assisted learning. It gives students, educators, families, and evaluators a trusted window into how learners think, struggle, iterate, and grow -- moving beyond grades, test scores, and essays that can no longer reliably signal capability in the age of AI.

| | |
|---|---|
| **Version** | 0.1 Draft |
| **Date** | February 2026 |
| **Author** | Isaac Pattis |
| **Status** | Open specification -- seeking feedback and contributors |
| **Site** | [ipattis.github.io/alpr](https://ipattis.github.io/alpr) |

---

## The Problem

Educational evaluation relies on outcome-focused materials -- grades, transcripts, essays, test scores. AI has broken the assumptions underlying all of them:

- A polished essay no longer proves a student can write.
- A high test score doesn't reveal whether understanding is deep or shallow.
- A 4.0 GPA says nothing about how a student thinks or persists.

Meanwhile, every AI-assisted learning interaction generates rich process data: prompts refined, assumptions challenged, scaffolding requested, misconceptions self-corrected. This data is the most detailed record of student thinking we've ever had -- but there is no standard way to capture, verify, or share it.

**ALPR closes that gap.**

---

## How It Works

ALPR operates across three layers that build on established learning data standards:

```
Layer 3: Verifiable Credentials (CLR 2.0 / Open Badges 3.0 / W3C VC)
  Portable, signed, evaluation-ready package
                    |
                    | aggregates
                    v
Layer 2: Process Evidence Records  <-- THE CORE INNOVATION
  Structured summaries of learning behaviors, growth trajectories,
  and curated learning episodes
                    |
                    | derived from
                    v
Layer 1: Interaction Events (xAPI via MCP connectors)
  Raw interaction events from each AI platform
```

### Layer 1 -- Interaction Events

Raw `Actor -> Verb -> Object` xAPI statements captured from AI platforms through MCP (Model Context Protocol) connectors. Custom ALPR verbs include: `prompted`, `refined-prompt`, `challenged`, `self-corrected`, `synthesised`, `reflected`, `iterated`, `abandoned-ai-output`, `requested-scaffolding`, and `transferred`. Students never share this layer directly.

### Layer 2 -- Process Evidence Records

The core innovation. Derived summaries that capture learning behaviors meaningful to evaluators while abstracting away raw conversation content. This layer contains:

- **Six Process Dimensions** -- behavioral metrics across Intellectual Autonomy, Metacognitive Awareness, Productive Struggle, Iterative Refinement, Knowledge Transfer, and AI Literacy
- **Learning Episodes** -- student-curated vignettes of meaningful learning moments (breakthroughs, productive failures, creative syntheses, debugging journeys, etc.)
- **Growth Trajectories** -- longitudinal views of skill development over time
- **Student Reflections** -- the student's own voice on their learning philosophy and highlights

### Layer 3 -- Verifiable Credentials

Signed, portable credentials using W3C Verifiable Credentials, CLR 2.0, and Open Badges 3.0. Each platform signs its portion of the data. Cryptographic proofs ensure the record is authentic and unaltered.

---

## Six Process Dimensions

ALPR captures behavioral patterns across six research-backed dimensions:

| Dimension | What It Measures | Key Metrics |
|---|---|---|
| **Intellectual Autonomy** | Does the student think independently or outsource cognition? | Prompt specificity trend, AI output acceptance rate, challenge frequency, independent reasoning episodes |
| **Metacognitive Awareness** | Does the student reflect on their own thinking? | Self-assessment accuracy, strategy switching, reflection depth, help-seeking appropriateness |
| **Productive Struggle** | Does the student persist through difficulty? | Attempts before help, time in struggle zone, abandonment rate, scaffolding preferences |
| **Iterative Refinement** | Does the student revise and improve work? | Revision cycles, revision depth distribution, self-initiated revision rate |
| **Knowledge Transfer** | Does the student apply concepts across contexts? | Cross-domain application count, decreasing scaffolding rate, analogical reasoning instances |
| **AI Literacy** | How effectively does the student use AI as a tool? | Prompt engineering sophistication, output verification rate, tool selection, limitation awareness |

These dimensions are rendered as a 6-axis radar chart for evaluators, scannable in 30 seconds with drill-down available.

---

## Design Principles

1. **Process over product** -- Capture *how* students learn, not just *what* they produce.
2. **Student-owned and student-curated** -- The learner controls what to share. This is a portfolio, not surveillance.
3. **Platform-agnostic via MCP** -- Each platform implements an MCP server that normalizes data into the common schema.
4. **Aligned to existing standards** -- Extension to xAPI + CLR 2.0 + Open Badges 3.0, not a replacement.
5. **Evaluator-usable** -- Scannable in under 5 minutes per applicant with drill-down capability.
6. **Anti-gaming** -- Captures behavioral signals that are hard to fake (timing, revision patterns, help-seeking).
7. **Privacy-first** -- Behavioral patterns, not content. Conversations are summarized/abstracted, never raw-dumped.

---

## Privacy Architecture

ALPR captures **behavioral patterns**, not **content**:

| ALPR captures | ALPR never captures |
|---|---|
| "Student refined their prompt 3 times" | Raw conversation transcripts |
| "Challenge frequency: 2.3 per session" | What the student actually asked about |
| "Self-initiated revision rate: 68%" | Content of student writing or code |
| "Time in productive struggle: 12 min" | Personal information beyond pseudonymous ID |

### Student control points

- **Session opt-in** -- choose which sessions to include
- **Episode curation** -- select which learning moments to highlight
- **Selective disclosure** -- share different subsets with different institutions
- **Expiry and revocation** -- records carry expiry dates; revoke anytime
- **Right to be forgotten** -- platform MCPs must support full deletion

---

## Anti-Gaming Measures

| Threat | Mitigation |
|---|---|
| Fake interactions | Timing analysis -- genuine learning has characteristic pause patterns |
| Cherry-picked episodes | Platform-level aggregate metrics are signed and can't be selectively excluded |
| Coaching services gaming metrics | Cross-platform consistency checks; sudden behavioral changes are flagged |
| Avoidance of AI to look "independent" | Schema rewards *effective* AI use, not avoidance |
| Platforms inflating metrics | Third-party verification; evaluator reputation checks |

---

## Standards Alignment

ALPR extends established standards rather than reinventing from scratch:

| Standard | Role in ALPR |
|---|---|
| **xAPI 1.0.3** | Layer 1 interaction events use xAPI statement format with ALPR verb profile |
| **CLR 2.0** | Layer 3 packaging uses ClrCredential as verifiable envelope |
| **Open Badges 3.0** | Individual competency achievements as OpenBadgeCredentials within CLR |
| **W3C VC 2.0** | Underlying trust/verification layer for all credentials |
| **CASE** | Alignment of process dimensions to recognized competency frameworks |
| **IEEE P9274.1.1** | Formal standards alignment for interaction data layer |

---

## MCP Connector Specification

Each AI platform implements an MCP server exposing these tools:

| Tool | Purpose |
|---|---|
| `get_learning_sessions` | Session metadata for a date range |
| `get_interaction_events` | xAPI statements (Layer 1) |
| `compute_process_dimensions` | Process dimension computation (Layer 2) |
| `get_learning_episodes` | Candidate episodes for student curation |
| `export_alpr_credential` | Signed CLR 2.0 credential (Layer 3) |
| `get_growth_trajectory` | Longitudinal skill data |

### Platform-specific adaptations

- **AI Tutors** (Khan Academy, Duolingo): Scaffolding progression, mastery curves, hint usage
- **General LLMs** (ChatGPT, Claude): Prompt refinement, challenge frequency, synthesis patterns
- **Code Assistants** (Copilot, Cursor): Independence ratio, debugging approach, code review
- **Research Tools** (Elicit, Consensus): Source evaluation, cross-referencing, synthesis quality
- **Writing Assistants** (Grammarly AI, Notion AI): Revision depth, editing autonomy, style development

---

## Roadmap

| Phase | Timeline | Goals |
|---|---|---|
| **1. Specification & Pilot** | Q2--Q3 2026 | Finalize JSON-LD context and JSON Schema. Build reference MCP connectors for 2--3 platforms. Pilot with 3--5 schools. |
| **2. Evaluator Tooling** | Q4 2026 | Build evaluator dashboard renderer. Develop cohort benchmarking data. Publish evaluator interpretation guide. |
| **3. Ecosystem Growth** | 2027 | Open specification for community contribution. Certification program for MCP connector compliance. Integration with Common App. |
| **4. Standards Body Alignment** | 2027--2028 | Submit to 1EdTech as CLR extension. Register xAPI profile. Seek AACRAO endorsement. |

---

## Repository Structure

```
alpr/
  index.html                        # GitHub Pages site
  css/style.css                     # Site styles
  js/main.js                        # Site interactivity & radar chart
  docs/
    alpr-schema-proposal.md         # Full specification document
    alpr-process-evidence-record.schema.json  # JSON Schema (2020-12)
```

---

## Open Questions

The specification acknowledges several unresolved design decisions:

1. **Who computes process dimensions?** Platform MCP server, trusted third party, or student's wallet?
2. **Multi-platform episodes** -- How to link sessions that span platforms (e.g., Elicit -> Claude -> Google Docs)?
3. **Minimum viable dataset** -- How many interactions or hours constitute a meaningful record?
4. **Cultural bias** -- "Productive struggle" may be culturally loaded. Dimension weights should be configurable by evaluators.
5. **Longitudinal identity** -- How does a student's DID persist across years and platform changes?

---

## Contributing

ALPR is an open specification seeking feedback and contributions from:

- **Educators** -- Does this capture what matters about student learning?
- **Evaluators** -- Would this improve your evaluation workflow?
- **Students and families** -- Does the privacy model protect your interests?
- **AI platform developers** -- Is the MCP connector spec implementable?
- **Standards body members** -- Does the alignment to xAPI/CLR/VC make sense?
- **Equity and policy advocates** -- Are the fairness safeguards sufficient?

To contribute:

1. Read the [full specification](docs/alpr-schema-proposal.md)
2. Review the [JSON Schema](docs/alpr-process-evidence-record.schema.json)
3. [Open an issue](https://github.com/ipattis/alpr/issues) with feedback, questions, or proposals
4. Submit a pull request for spec changes or reference implementations

---

## License

This specification is released as an open standard. See the repository for license details.
