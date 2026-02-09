# AI Learning Process Record (ALPR) Schema
## A Portable, Verifiable Schema for Capturing Pedagogical Process in AI-Assisted Learning

**Version:** 0.1 Draft  
**Date:** February 2026  
**Author:** Isaac Pattis / OUP AI-ELT Product

---

## 1. Problem Statement

Educational evaluation currently relies on transcripts (grades, test scores) and essays — both of which are **outcome-focused** and increasingly complicated by AI. A student who uses ChatGPT to write their essay and a student who uses it as a thinking partner to develop their own argument produce the same artefact but demonstrate fundamentally different capabilities.

What evaluators actually need to see is **process**: how a student thinks, struggles, iterates, self-corrects, and grows. AI-assisted learning interactions are, paradoxically, the richest source of this process data we've ever had — every prompt, revision, scaffolded hint, and breakthrough is logged.

**The gap:** No standard exists for capturing, verifying, and portably sharing the *process* of AI-assisted learning in a way that's meaningful for evaluation.

---

## 2. Design Principles

1. **Process over product** — Capture *how* students learn, not just *what* they produce.
2. **Student-owned and student-curated** — The learner controls what to share (selective disclosure). This is a portfolio, not surveillance.
3. **Platform-agnostic via MCP** — An MCP server per platform provider (Khan Academy, Duolingo, ChatGPT, Claude, Khanmigo, etc.) normalises data into the common schema.
4. **Aligned to existing standards** — Built as an extension to xAPI + CLR 2.0 + Open Badges 3.0, not a replacement.
5. **Evaluator-usable** — Designed to be scannable in under 5 minutes per applicant, with drill-down available.
6. **Anti-gaming** — Captures behavioural signals that are hard to fake (timing, revision patterns, help-seeking behaviour).
7. **Privacy-first** — Conversation content is summarised/abstracted, never raw-dumped. Students choose what to include.

---

## 3. Architecture Overview

The schema operates across three layers that map to existing standards:

```
┌─────────────────────────────────────────────────────────┐
│  LAYER 3: VERIFIABLE CREDENTIAL LAYER                   │
│  (CLR 2.0 / Open Badges 3.0 / W3C VC)                  │
│                                                         │
│  Portable, signed, evaluation-ready package              │
│  → "AI Learning Portfolio Credential"                   │
└──────────────────────┬──────────────────────────────────┘
                       │ aggregates
┌──────────────────────▼──────────────────────────────────┐
│  LAYER 2: PROCESS EVIDENCE LAYER  ← THE NEW PART       │
│  (ALPR Schema — this document)                          │
│                                                         │
│  Structured summaries of learning behaviours, patterns, │
│  and metacognitive signals extracted from interactions   │
│  → "Learning Process Records"                           │
└──────────────────────┬──────────────────────────────────┘
                       │ derived from
┌──────────────────────▼──────────────────────────────────┐
│  LAYER 1: INTERACTION LOG LAYER                         │
│  (xAPI statements via MCP connectors)                   │
│                                                         │
│  Raw interaction events from each AI platform           │
│  → Actor-Verb-Object statements                         │
└─────────────────────────────────────────────────────────┘
```

### MCP Connector Role

Each AI platform exposes an MCP server that:
- Emits xAPI-compatible interaction events (Layer 1)
- Computes derived process metrics (Layer 2)
- Signs and packages records as verifiable credentials (Layer 3)

The student's **ALPR Wallet** aggregates records from multiple platform MCPs into a unified portfolio.

---

## 4. Layer 1: Interaction Events (xAPI Extension)

Standard xAPI `Actor → Verb → Object` statements, extended with AI-specific context. These are the raw material; students never share this layer directly.

### 4.1 Custom Verb Vocabulary

Beyond standard xAPI verbs (`completed`, `attempted`, `answered`), the ALPR profile defines:

| Verb IRI | Label | Description |
|---|---|---|
| `alpr:prompted` | Prompted | Student issued a prompt to an AI system |
| `alpr:refined-prompt` | Refined Prompt | Student revised their prompt after seeing output |
| `alpr:challenged` | Challenged | Student questioned or pushed back on AI output |
| `alpr:requested-scaffolding` | Requested Scaffolding | Student asked for hints/steps rather than answers |
| `alpr:self-corrected` | Self-Corrected | Student identified and fixed own error before AI did |
| `alpr:synthesised` | Synthesised | Student combined AI output with other sources |
| `alpr:abandoned-ai-output` | Abandoned AI Output | Student discarded AI suggestion and went own way |
| `alpr:reflected` | Reflected | Student engaged in explicit metacognitive reflection |
| `alpr:iterated` | Iterated | Student revised their work incorporating feedback |
| `alpr:transferred` | Transferred | Student applied a concept from one context to another |

### 4.2 Context Extensions

Each xAPI statement carries additional context:

```json
{
  "actor": {
    "mbox": "mailto:student@example.edu",
    "name": "Student Name"
  },
  "verb": {
    "id": "https://alpr.schema.org/verbs/refined-prompt",
    "display": { "en": "Refined Prompt" }
  },
  "object": {
    "id": "https://platform.example.com/session/abc123/turn/7",
    "definition": {
      "type": "https://alpr.schema.org/activity-types/ai-dialogue-turn",
      "name": { "en": "Prompt refinement in essay brainstorming session" }
    }
  },
  "context": {
    "extensions": {
      "https://alpr.schema.org/ext/platform": "claude.ai",
      "https://alpr.schema.org/ext/session-id": "abc123",
      "https://alpr.schema.org/ext/turn-number": 7,
      "https://alpr.schema.org/ext/subject-domain": "argumentative-writing",
      "https://alpr.schema.org/ext/cognitive-demand": "analysis",
      "https://alpr.schema.org/ext/scaffolding-level": "moderate",
      "https://alpr.schema.org/ext/time-before-action-ms": 45000,
      "https://alpr.schema.org/ext/revision-depth": "structural"
    }
  },
  "timestamp": "2026-01-15T14:23:00Z"
}
```

---

## 5. Layer 2: Process Evidence Records (The Core Schema)

This is the novel contribution. Process Evidence Records are **derived summaries** that capture learning behaviours meaningful to evaluators. They abstract away raw conversation content while preserving pedagogically significant signals.

### 5.1 Top-Level Schema

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://alpr.schema.org/v0.1/process-evidence-record",
  "title": "AI Learning Process Evidence Record",
  "type": "object",
  "required": ["id", "learner", "metadata", "engagement_summary", "process_dimensions"],
  "properties": {

    "id": {
      "type": "string",
      "format": "uri",
      "description": "Unique identifier for this record"
    },

    "learner": {
      "$ref": "#/$defs/LearnerProfile"
    },

    "metadata": {
      "$ref": "#/$defs/RecordMetadata"
    },

    "engagement_summary": {
      "$ref": "#/$defs/EngagementSummary"
    },

    "process_dimensions": {
      "$ref": "#/$defs/ProcessDimensions"
    },

    "learning_episodes": {
      "type": "array",
      "items": { "$ref": "#/$defs/LearningEpisode" },
      "description": "Curated episodes the student selects to highlight"
    },

    "growth_trajectories": {
      "type": "array",
      "items": { "$ref": "#/$defs/GrowthTrajectory" },
      "description": "Longitudinal progressions across a skill or behaviour"
    },

    "student_reflection": {
      "$ref": "#/$defs/StudentReflection"
    },

    "verification": {
      "$ref": "#/$defs/VerificationBlock"
    }
  }
}
```

### 5.2 Key Sub-Schemas

#### 5.2.1 Process Dimensions

These are the core metrics that tell evaluators how a student engages with AI. Each dimension maps to skills that evaluators value.

```json
{
  "$defs": {
    "ProcessDimensions": {
      "type": "object",
      "description": "Behavioural dimensions derived from AI interaction patterns",
      "properties": {

        "intellectual_autonomy": {
          "type": "object",
          "description": "Does the student think for themselves or outsource cognition?",
          "properties": {
            "prompt_specificity_trend": {
              "type": "string",
              "enum": ["increasingly_specific", "stable", "increasingly_vague"],
              "description": "Are prompts getting more precise over time?"
            },
            "ai_output_acceptance_rate": {
              "type": "number", "minimum": 0, "maximum": 1,
              "description": "Proportion of AI outputs accepted without modification"
            },
            "independent_reasoning_episodes": {
              "type": "integer",
              "description": "Count of times student reached conclusion before/without AI"
            },
            "challenge_frequency": {
              "type": "number",
              "description": "How often the student pushes back on AI outputs (per session)"
            }
          }
        },

        "metacognitive_awareness": {
          "type": "object",
          "description": "Does the student think about their own thinking?",
          "properties": {
            "self_assessment_accuracy": {
              "type": "number", "minimum": 0, "maximum": 1,
              "description": "Correlation between student's self-rated understanding and demonstrated performance"
            },
            "strategy_switching_count": {
              "type": "integer",
              "description": "Times student changed approach after recognising current one wasn't working"
            },
            "reflection_depth": {
              "type": "string",
              "enum": ["surface", "moderate", "deep"],
              "description": "Quality of metacognitive reflections when prompted"
            },
            "help_seeking_appropriateness": {
              "type": "number", "minimum": 0, "maximum": 1,
              "description": "Proportion of help requests that were well-timed (not premature, not too late)"
            }
          }
        },

        "productive_struggle": {
          "type": "object",
          "description": "Does the student persist through difficulty or give up?",
          "properties": {
            "average_attempts_before_help": {
              "type": "number",
              "description": "Mean number of independent attempts before requesting AI assistance"
            },
            "time_in_struggle_zone_pct": {
              "type": "number", "minimum": 0, "maximum": 1,
              "description": "Proportion of learning time spent working on challenging material"
            },
            "abandonment_rate": {
              "type": "number", "minimum": 0, "maximum": 1,
              "description": "Proportion of challenging tasks abandoned vs. completed"
            },
            "scaffolding_preference": {
              "type": "string",
              "enum": ["hints_preferred", "examples_preferred", "full_solutions_preferred"],
              "description": "What level of help the student typically requests"
            }
          }
        },

        "iterative_refinement": {
          "type": "object",
          "description": "Does the student revise and improve, or accept first drafts?",
          "properties": {
            "average_revision_cycles": {
              "type": "number",
              "description": "Mean number of revision passes per piece of work"
            },
            "revision_depth_distribution": {
              "type": "object",
              "properties": {
                "surface": { "type": "number" },
                "structural": { "type": "number" },
                "conceptual": { "type": "number" }
              },
              "description": "Proportion of revisions at each depth level"
            },
            "self_initiated_revision_rate": {
              "type": "number", "minimum": 0, "maximum": 1,
              "description": "Proportion of revisions initiated by student vs. prompted by AI"
            }
          }
        },

        "knowledge_transfer": {
          "type": "object",
          "description": "Does the student apply learning across contexts?",
          "properties": {
            "cross_domain_application_count": {
              "type": "integer",
              "description": "Times student applied concept learned in one domain to another"
            },
            "decreasing_scaffolding_for_repeated_skills": {
              "type": "boolean",
              "description": "Does the student need less help on recurring skill types?"
            },
            "analogical_reasoning_instances": {
              "type": "integer",
              "description": "Times student drew analogies between different domains unprompted"
            }
          }
        },

        "ai_literacy": {
          "type": "object",
          "description": "How effectively does the student use AI as a tool?",
          "properties": {
            "prompt_engineering_sophistication": {
              "type": "string",
              "enum": ["basic", "intermediate", "advanced"],
              "description": "Quality and intentionality of prompting strategies"
            },
            "output_verification_rate": {
              "type": "number", "minimum": 0, "maximum": 1,
              "description": "How often the student fact-checks or verifies AI outputs"
            },
            "appropriate_tool_selection": {
              "type": "number", "minimum": 0, "maximum": 1,
              "description": "How often the student chooses the right AI tool/approach for the task"
            },
            "limitation_awareness_score": {
              "type": "number", "minimum": 0, "maximum": 1,
              "description": "Demonstrated understanding of when AI is/isn't appropriate"
            }
          }
        }
      }
    }
  }
}
```

#### 5.2.2 Learning Episode

A curated vignette that tells a story. The student selects their most meaningful learning moments to include.

```json
{
  "LearningEpisode": {
    "type": "object",
    "required": ["episode_id", "title", "domain", "episode_type", "timeline", "outcome"],
    "properties": {
      "episode_id": { "type": "string", "format": "uri" },

      "title": {
        "type": "string",
        "description": "Student-authored title for this episode"
      },

      "domain": {
        "type": "string",
        "description": "Subject area (aligned to standard taxonomy, e.g., CEFR for language, CCSS for math)"
      },

      "episode_type": {
        "type": "string",
        "enum": [
          "breakthrough_moment",
          "productive_failure",
          "concept_mastery",
          "creative_synthesis",
          "perspective_shift",
          "debugging_journey",
          "research_deep_dive",
          "collaborative_construction"
        ]
      },

      "platforms_involved": {
        "type": "array",
        "items": { "type": "string" },
        "description": "AI platforms used during this episode"
      },

      "timeline": {
        "type": "object",
        "properties": {
          "start": { "type": "string", "format": "date-time" },
          "end": { "type": "string", "format": "date-time" },
          "total_active_minutes": { "type": "integer" },
          "sessions_count": { "type": "integer" }
        }
      },

      "interaction_summary": {
        "type": "object",
        "properties": {
          "total_turns": { "type": "integer" },
          "student_initiated_turns_pct": { "type": "number" },
          "key_pivot_points": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "turn_number": { "type": "integer" },
                "description": { "type": "string" },
                "significance": { "type": "string" }
              }
            },
            "description": "Moments where the student's thinking visibly shifted"
          }
        }
      },

      "cognitive_arc": {
        "type": "object",
        "description": "The trajectory of understanding through the episode",
        "properties": {
          "entry_understanding": {
            "type": "string",
            "enum": ["none", "misconception", "partial", "surface", "emerging"]
          },
          "exit_understanding": {
            "type": "string",
            "enum": ["surface", "procedural", "conceptual", "transferable", "generative"]
          },
          "blooms_peak": {
            "type": "string",
            "enum": ["remember", "understand", "apply", "analyse", "evaluate", "create"]
          }
        }
      },

      "student_annotation": {
        "type": "string",
        "description": "Student's own reflection on why this episode matters to them"
      },

      "evidence_artifacts": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "type": {
              "type": "string",
              "enum": ["conversation_excerpt", "work_sample", "before_after_comparison", "diagram", "code_diff"]
            },
            "uri": { "type": "string", "format": "uri" },
            "description": { "type": "string" }
          }
        }
      },

      "outcome": {
        "type": "object",
        "properties": {
          "competency_demonstrated": { "type": "string" },
          "verified_by": {
            "type": "string",
            "enum": ["platform_assessment", "teacher_review", "peer_review", "self_assessed"]
          }
        }
      }
    }
  }
}
```

#### 5.2.3 Growth Trajectory

Longitudinal view of skill development — the most powerful signal for evaluators.

```json
{
  "GrowthTrajectory": {
    "type": "object",
    "required": ["trajectory_id", "skill", "data_points"],
    "properties": {
      "trajectory_id": { "type": "string" },

      "skill": {
        "type": "string",
        "description": "Skill or competency being tracked"
      },

      "framework_alignment": {
        "type": "object",
        "properties": {
          "framework": { "type": "string", "description": "e.g., CEFR, CCSS, NGSS, ISTE" },
          "level_start": { "type": "string" },
          "level_current": { "type": "string" }
        }
      },

      "data_points": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "date": { "type": "string", "format": "date" },
            "proficiency_estimate": { "type": "number", "minimum": 0, "maximum": 1 },
            "scaffolding_level_needed": {
              "type": "string",
              "enum": ["full", "high", "moderate", "minimal", "none"]
            },
            "evidence_episode_id": { "type": "string" },
            "platform": { "type": "string" }
          }
        }
      },

      "velocity": {
        "type": "object",
        "description": "Rate of improvement metrics",
        "properties": {
          "overall_slope": { "type": "number" },
          "acceleration": { "type": "number", "description": "Is learning speeding up or slowing?" },
          "consistency": { "type": "number", "minimum": 0, "maximum": 1 }
        }
      },

      "notable_patterns": {
        "type": "array",
        "items": { "type": "string" },
        "description": "e.g., 'Rapid improvement after switching from answer-seeking to explanation-seeking prompts'"
      }
    }
  }
}
```

#### 5.2.4 Student Reflection

The student's own voice — critical for humanising the data.

```json
{
  "StudentReflection": {
    "type": "object",
    "properties": {
      "learning_philosophy": {
        "type": "string",
        "description": "Student's statement on how they approach learning with AI (500 words max)"
      },
      "selected_highlights": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "episode_ref": { "type": "string" },
            "why_it_matters": { "type": "string" }
          }
        }
      },
      "challenges_faced": {
        "type": "string",
        "description": "Student's honest account of struggles and how they addressed them"
      },
      "future_goals": {
        "type": "string",
        "description": "What the student wants to learn next and why"
      }
    }
  }
}
```

---

## 6. Layer 3: Verifiable Credential Packaging

The ALPR wraps into a **CLR 2.0 ClrCredential** containing:

```json
{
  "@context": [
    "https://www.w3.org/ns/credentials/v2",
    "https://purl.imsglobal.org/spec/clr/v2p0/context-2.0.0.json",
    "https://alpr.schema.org/v0.1/context.json"
  ],
  "type": ["VerifiableCredential", "ClrCredential"],
  "issuer": {
    "id": "did:web:platform.example.com",
    "name": "Platform Name",
    "type": ["Profile"]
  },
  "validFrom": "2026-01-15T00:00:00Z",
  "credentialSubject": {
    "type": ["ClrSubject"],
    "achievement": [
      {
        "type": ["Achievement"],
        "achievementType": "alpr:LearningProcessPortfolio",
        "name": "AI-Assisted Learning Process Record",
        "description": "Verified record of learning process across AI platforms",
        "criteria": {
          "narrative": "This credential attests to verified AI learning interaction patterns..."
        }
      }
    ],
    "verifiableCredential": [
      "... individual OpenBadgeCredentials for specific achievements ..."
    ],
    "association": [
      {
        "type": "alpr:ProcessEvidenceRecord",
        "targetId": "https://alpr.example.com/records/student123"
      }
    ]
  },
  "proof": {
    "type": "DataIntegrityProof",
    "cryptosuite": "eddsa-rdfc-2022",
    "created": "2026-01-15T00:00:00Z",
    "verificationMethod": "did:web:platform.example.com#key-1",
    "proofPurpose": "assertionMethod",
    "proofValue": "..."
  }
}
```

---

## 7. What Evaluators See

The schema is designed to render into a **scannable dashboard** with drill-down capability:

### 7.1 At-a-Glance View (30 seconds)

| Signal | What it tells the evaluator |
|---|---|
| **Process Dimensions Radar** | 6-axis visualisation of intellectual autonomy, metacognition, productive struggle, iteration, transfer, AI literacy |
| **Growth Sparklines** | Mini line charts showing trajectory of key skills over time |
| **Platform Diversity** | Which AI tools the student uses and how |
| **Engagement Depth Score** | Composite metric: (time × cognitive demand × autonomy) / sessions |

### 7.2 Episode Drill-Down (2-3 minutes)

Evaluator selects a curated Learning Episode and sees:
- Student's own annotation of why it matters
- Timeline of the cognitive arc (where they started → where they ended)
- Key pivot points with brief descriptions
- Before/after work samples
- Which process dimensions were demonstrated

### 7.3 Comparative Context (1 minute)

Anonymous percentile rankings against cohort for each process dimension, allowing evaluators to calibrate.

---

## 8. Anti-Gaming Considerations

| Threat | Mitigation |
|---|---|
| Student scripts fake interactions | Timing analysis: genuine learning has characteristic pause patterns, revision timing |
| Student cherry-picks only best episodes | Platform-level aggregate metrics are signed and can't be selectively excluded |
| Coaching services game the metrics | Cross-platform consistency checks; sudden behavioural changes flagged |
| Students avoid AI to look "independent" | The schema rewards *effective* AI use, not avoidance; low engagement is itself a data point |
| Platforms inflate metrics to attract users | Third-party verification; evaluators can check issuer reputation |

---

## 9. MCP Connector Specification

Each AI platform MCP server implements these capabilities:

```
Tool: get_learning_sessions
  → Returns session metadata for date range

Tool: get_interaction_events  
  → Returns xAPI statements for a session (Layer 1)

Tool: compute_process_dimensions
  → Returns ProcessDimensions for date range (Layer 2)

Tool: get_learning_episodes
  → Returns candidate episodes for student curation

Tool: export_alpr_credential
  → Returns signed CLR 2.0 credential (Layer 3)

Tool: get_growth_trajectory
  → Returns longitudinal data for a skill

Resource: alpr://schema/process-dimensions
  → Returns the platform's supported dimension computations

Resource: alpr://learner/{id}/summary
  → Returns current aggregate metrics
```

### Platform-Specific Adaptations

| Platform Type | Key Signals Available |
|---|---|
| **AI Tutors** (Khan Academy, Duolingo) | Scaffolding level progression, mastery curves, hint usage |
| **General LLMs** (ChatGPT, Claude) | Prompt refinement, challenge frequency, synthesis patterns |
| **Code Assistants** (Copilot, Cursor) | Independence ratio, debugging approach, code review engagement |
| **Research Tools** (Elicit, Consensus) | Source evaluation, cross-referencing, synthesis quality |
| **Writing Assistants** (Grammarly AI, Notion AI) | Revision depth, editing autonomy, style development |

---

## 10. Privacy Architecture

### Student Control Points

1. **Session opt-in**: Student chooses which sessions to include
2. **Episode curation**: Student selects which episodes to highlight
3. **Content abstraction**: Raw conversations are never shared; only derived metrics and student-annotated summaries
4. **Selective disclosure**: Student can share different subsets with different institutions
5. **Expiry**: Records carry an expiry date; student can revoke at any time
6. **Right to be forgotten**: Platform MCPs must support full deletion

### Data Minimisation

The schema deliberately captures **behavioural patterns** rather than **content**:
- ✅ "Student refined their prompt 3 times before getting a useful response"
- ❌ "Student asked about photosynthesis and the AI responded with..."

---

## 11. Implementation Roadmap

### Phase 1: Specification & Pilot (Q2-Q3 2026)
- Finalise JSON-LD context and JSON Schema
- Build reference MCP connectors for 2-3 platforms
- Pilot with 3-5 schools, gather evaluator feedback

### Phase 2: Evaluator Tooling (Q4 2026)
- Build evaluator dashboard renderer
- Develop cohort benchmarking data
- Publish evaluator interpretation guide

### Phase 3: Ecosystem Growth (2027)
- Open specification for community contribution
- Certification programme for MCP connector compliance
- Integration with Common App or equivalent

### Phase 4: Standards Body Alignment (2027-2028)
- Submit ALPR profile to 1EdTech for consideration as CLR extension
- Align with xAPI profile registry
- Seek AACRAO endorsement

---

## 12. Relationship to Existing Standards

| Standard | Role in ALPR |
|---|---|
| **xAPI 1.0.3** | Layer 1 interaction events use xAPI statement format with ALPR verb profile |
| **CLR 2.0** | Layer 3 packaging uses ClrCredential as the verifiable envelope |
| **Open Badges 3.0** | Individual competency achievements can be issued as OpenBadgeCredentials within the CLR |
| **W3C Verifiable Credentials 2.0** | Underlying trust/verification layer for all credentials |
| **CASE (Competencies & Academic Standards Exchange)** | Alignment of process dimensions to recognised competency frameworks |
| **IEEE P9274.1.1 (xAPI)** | Formal standards alignment for the interaction data layer |

---

## 13. Open Questions

1. **Who computes the process dimensions?** The platform (via MCP), a trusted third party, or the student's wallet? Each has different trust/bias tradeoffs.

2. **How do we handle multi-platform episodes?** A student might start research in Elicit, brainstorm in Claude, and write in Google Docs with Gemini. The MCP orchestration layer needs cross-platform session linking.

3. **What's the minimum viable dataset?** How many interactions/hours constitute a meaningful record? Need empirical research.

4. **Cultural bias in "good" learning signals** — "productive struggle" and "challenge frequency" may be culturally loaded. The dimension weights should be configurable by the evaluating institution.

5. **Longitudinal identity** — How does a student's DID persist across years and platform changes? Need alignment with emerging decentralised identity standards.

---

## Appendix A: Example Evaluator Report Rendering

```
╔══════════════════════════════════════════════════════╗
║  AI LEARNING PROCESS RECORD — Jane Doe              ║
║  Period: Sep 2025 – Jan 2026 | Platforms: 4         ║
╠══════════════════════════════════════════════════════╣
║                                                      ║
║  PROCESS DIMENSIONS           ▼ Expand               ║
║  ┌──────────────────────┐                            ║
║  │ Intellectual Autonomy │ ████████░░  82nd %ile      ║
║  │ Metacognition         │ ██████████  95th %ile      ║
║  │ Productive Struggle   │ ███████░░░  71st %ile      ║
║  │ Iterative Refinement  │ █████████░  88th %ile      ║
║  │ Knowledge Transfer    │ ██████░░░░  64th %ile      ║
║  │ AI Literacy           │ █████████░  91st %ile      ║
║  └──────────────────────┘                            ║
║                                                      ║
║  HIGHLIGHTED EPISODES (3 of 12 curated)              ║
║  ┌──────────────────────────────────────────────┐    ║
║  │ ★ "When the AI Was Wrong About DNA"          │    ║
║  │   Type: Perspective Shift | Domain: Biology  │    ║
║  │   "I realised I understood replication better │    ║
║  │    than Claude did and had to explain why..."│    ║
║  │   [View Episode →]                           │    ║
║  ├──────────────────────────────────────────────┤    ║
║  │ ★ "Building My First Neural Network"         │    ║
║  │   Type: Debugging Journey | Domain: CS       │    ║
║  │   12 sessions, 47 revision cycles            │    ║
║  │   Scaffolding: high → minimal over 3 weeks   │    ║
║  │   [View Episode →]                           │    ║
║  └──────────────────────────────────────────────┘    ║
║                                                      ║
║  GROWTH TRAJECTORY — Argumentative Writing           ║
║  ┌──────────────────────────────────────────────┐    ║
║  │ Level  ▲                     ╭──────  B2     │    ║
║  │        │              ╭─────╯                │    ║
║  │        │        ╭────╯                       │    ║
║  │        │  ╭────╯                    A2→B2    │    ║
║  │        │──╯                        in 4 mo   │    ║
║  │        └─────────────────────────────→ Time  │    ║
║  └──────────────────────────────────────────────┘    ║
║                                                      ║
║  STUDENT REFLECTION                                  ║
║  "AI taught me that learning is a conversation,     ║
║   not a download. The moments I learned most were   ║
║   when I disagreed with it and had to figure out    ║
║   why I was right..."                                ║
║                                                      ║
║  Verified by: Khan Academy, Claude, Duolingo         ║
║  Credential: did:web:alpr.example.com/jdoe/2026     ║
╚══════════════════════════════════════════════════════╝
```

---

## Appendix B: Comparison with Existing Approaches

| Approach | What it captures | What it misses | ALPR advantage |
|---|---|---|---|
| **Transcripts** | Course completion, grades | Process, struggle, growth rate | Captures *how*, not just *what* |
| **Essays** | Writing quality, voice | AI involvement unclear | Verifiable process trail |
| **Standardised tests** | Point-in-time knowledge | Growth, metacognition, AI skills | Longitudinal + behavioural |
| **Portfolios (traditional)** | Selected work samples | Process, interaction patterns | Machine-readable, cross-platform |
| **AI-generated transcripts** | Raw interaction logs | Too much data, privacy risk | Abstracted, student-curated |
| **Open Badges** | Achievement attestation | Process evidence, learning journey | Richer narrative + process data |

---

*This document is a working draft. Feedback welcome.*
