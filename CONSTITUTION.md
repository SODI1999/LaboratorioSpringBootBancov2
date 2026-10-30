# CONSTITUTION — LaboratorioSpringBootBancov2

> Project engineering agreement. Apply it within the user's instructions and authorized scope; resolve material conflicts explicitly rather than silently overriding decisions.

---

## 1. Governance & Code Surgery (Constitutional Foundation)

1. **Pre-Execution Diagnostic:** Before making any non-trivial change, present a structured assessment: *Problem, Proposed Solution, and Consequences/Risks*.
2. **Strict Non-Destructive Policy:** Destructive changes, large refactors, or database modifications require explicit approval.
3. **Evidence and uncertainty:** Distinguish verified facts, hypotheses and unresolved decisions. Inspect repository evidence first; ask the user about material ambiguity. Never invent business rules or claim certainty from a structural audit.
4. **Minimal Touch Surgery:** Modify exclusively the files necessary to achieve the verified objective. Do not touch adjacent working code or reformat unrelated modules.
5. **Demonstrable Quality Gates:** Record actual results and pre-existing failures. Automated gates must pass for automated verification; when none apply, document explicitly labeled manual evidence. A checklist is not proof of behavior.
6. **Backend Pragmatic Craft & Zero Code Slop:**
   - *Strict YAGNI & Direct Implementation:* Never add speculative abstraction layers, premature interfaces, DTOs, factories, or wrapper classes when a direct, idiomatic function or standard module satisfies the acceptance criteria.
   - *Zero Comment Slop:* Avoid comments that only narrate syntax. Preserve accurate API documentation and explanations of purpose, contracts and non-obvious domain constraints.
   - *Fail-Fast & Transparent Failures:* Strictly forbid defensive `try/catch` wrappers that swallow exceptions, return dummy nulls, or silently mask errors without a documented business requirement.
   - *Zero Spec & Plan Slop:* Specifications and plans must maintain high technical density: tabular evidence, explicit non-goals, and atomic, falsable criteria (`AC-01`). No marketing fluff, corporate filler, or conversational apologies.

---

## 2. Domain & Regulatory Invariants (General software project)

### 2.1 Applicable security boundaries
* Review what data and capabilities this project actually exposes. If authorization applies, enforce it at the trusted boundary and test unauthorized access.
* If the project is multi-tenant, document and test tenant isolation; do not introduce tenancy into a single-user tool.
* Avoid exposing secrets or sensitive data in logs and outputs.
### 2.2 Changes and recovery
* If persistence exists, preserve its documented integrity constraints and concurrency behavior.
* For migrations, choose and test a recovery strategy appropriate to the data and deployment; a down.sql file is not universally appropriate.
* If no database, UI or remote service exists, record N/A rather than creating one to satisfy a template.

These profile controls are review prompts; applicability must be established for this project. They do not certify regulatory compliance.

---

## 3. Technology Stack & Documentation Standards

* **Primary Tech Stack:** `Unknown / existing project`
* **Documentation Standard:** `Project conventions (review required)` (All public APIs, exported interfaces, and complex functions must follow this convention).

Agree and record the documentation convention per module/language: JSDoc for JavaScript, TSDoc or the project's established convention for TypeScript, Javadoc for Java, and the ecosystem equivalent elsewhere. Document public/exported APIs, components/hooks and nontrivial internal contracts with purpose, parameters, return value, errors, side effects and invariants where relevant. Keep signatures, types and examples accurate as code changes. Avoid syntax-narrating comments; this never excuses removing useful API documentation. Check the available documentation/lint tooling and review semantic accuracy; counting tags does not establish correctness.

### Supported technology decisions
Never select or pin a dependency or runtime version from memory: consult current official sources and the package registry, record the dated sources with the approval or delegation (decision-record), and prefer runtime-native APIs when they suffice. Without web access the choice stays provisional.

### Clarification and setup
Use the host's native structured question tool when it is actually available and permitted in the current mode; otherwise ask in the same chat or interactive console. Do not invent a tool name or require a particular host. Group a small number of material questions, explain the recommendation and trade-offs in plain language, and let the user delegate technical choices. A suggested option or silence is not approval.
Inspect before asking; reuse confirmed answers. Ask about goals, constraints and consequences, not facts discoverable from files. Continue independent work while an answer is pending; block only decisions that depend on it. Record the answer or explicit delegation and its scope. Do not repeatedly ask for authorization already given.
Setup, Git, the commit convention and session capabilities follow guide setup.

---

## 4. Delivery Quality Gates

The following commands must run and pass cleanly before considering any task or Pull Request complete:

```bash
# Not configured. Review project evidence with /omni-init.
```

---

## 5. UI Ergonomics & Frontend Craft (Anti-Slop)

Interface work follows guide design: references, direction, applicable states and rendered and interaction evidence. Changes without an interface do not load it.
