# Especificação — Jornada de inscrição em creche

## Problem Statement

O responsável por uma criança precisa realizar e acompanhar uma inscrição em creche principalmente pelo celular, mas a jornada atual exige que ele interprete regras, critérios, documentos, unidades e estados operacionais sem contexto suficiente. Isso aumenta erros de cadastro, escolhas pouco informadas, perda de prazos e insegurança sobre o que acontecerá depois do envio.

Ao mesmo tempo, a solução de hackathon não pode depender de uma integração imediata e ampla com os sistemas da Prefeitura. Ela precisa demonstrar valor com dados anonimizados já disponíveis, deixar explícito o que é histórico ou simulado e preservar pontos de integração seguros para uma evolução conjunta com a SME.

## Solution

Criar uma jornada mobile-first, guiada e salvável de inscrição em creche. O responsável cadastra até cinco crianças, recebe feedback sobre grupamento e critérios, preenche o endereço com assistência por CEP e escolhe livremente até cinco unidades compatíveis por criança.

A solução organiza sugestões por motivos distintos — proximidade, confirmação histórica, menor disputa e tentativa anterior — sem tomar decisões pelo responsável. Antes do envio, apresenta uma revisão editável, canais de comunicação, documentos previstos e a ordem das preferências. Depois, gera um protocolo demonstrativo e centraliza o acompanhamento em estados reconhecíveis.

A demo assume uma identidade autenticada antes da jornada, mas não implementa login. Indicadores são derivados das bases anonimizadas e rotulados como históricos; disponibilidade, reserva, classificação oficial e comunicação real ficam para integrações futuras.

## User Stories

1. As a responsible person, I want the demo to begin after an assumed authenticated access, so that I can focus on the creche application instead of a fake login flow.
2. As a responsible person, I want to understand that the prototype is not an official channel, so that I do not mistake the demo for a real application.
3. As a responsible person, I want to accept the important conditions before beginning, so that deadlines, evidence and historical indicators do not surprise me later.
4. As a responsible person, I want my draft saved on the device, so that closing the browser does not force me to restart a long mobile form.
5. As a returning responsible person, I want to resume from the last relevant step, so that I can continue quickly.
6. As a responsible person, I want to register more than one child in the same session, so that I do not repeat all family data for siblings.
7. As a responsible person, I want each child to have an independent application, so that differences in age, schedule, score and preferred units are respected.
8. As a responsible person, I want to register up to five children, so that the common sibling scenario is supported without making the session unbounded.
9. As a responsible person, I want dates to be entered with an accessible date control, so that day, month and year are less likely to be confused on mobile.
10. As a responsible person, I want to see the child's eligible grouping as soon as I enter the birth date, so that I understand which offer applies.
11. As a responsible person, I want to see the child's age at the process cutoff, so that the grouping rule is transparent.
12. As a responsible person, I want clear feedback when a child is too young or too old for the creche process, so that I know the appropriate next path.
13. As a responsible person, I want to identify a child with CPF or DNV, so that a missing CPF does not block a newborn's registration.
14. As a responsible person, I want invalid CPF and DNV values identified before submission, so that document errors do not invalidate later work.
15. As a responsible person, I want duplicate child CPFs prevented, so that siblings are not accidentally registered with the same identity.
16. As a responsible person, I want to choose integral or partial schedule per child, so that only compatible units are presented.
17. As a responsible person, I want to be warned when changing schedule clears incompatible choices, so that the loss of a list is understandable.
18. As a responsible person, I want socio-economic criteria to be optional, so that I can proceed when none applies.
19. As a responsible person, I want a clear warning before proceeding without criteria, so that I understand that the estimated socio-economic score will be zero.
20. As a responsible person, I want family criteria answered once, so that the same information is not repeated for every sibling.
21. As a responsible person, I want child-specific criteria answered separately, so that one child's condition does not incorrectly affect another.
22. As a responsible person, I want to see the points and tie-break effect of each criterion, so that I understand its role in classification.
23. As a responsible person, I want to see an estimated score per child, so that different applications remain understandable.
24. As a responsible person, I want to see which evidence each marked criterion requires, so that I can prepare before the deadline.
25. As a responsible person, I want historical criteria clearly identified by reference year, so that I do not assume they are guaranteed current rules.
26. As a responsible person, I want to enter a CEP and have street and neighborhood filled automatically, so that address entry is faster on a phone.
27. As a responsible person, I want visible loading and success feedback during CEP lookup, so that I know whether the system is working.
28. As a responsible person, I want a clear error when a CEP cannot be found, so that I know what needs correction.
29. As a responsible person, I want to fill or edit the address manually when lookup fails or is incomplete, so that an external service never blocks the application.
30. As a responsible person, I want to be warned when the CEP appears to be outside Rio de Janeiro, so that I can check a likely mistake without silently applying a new eligibility rule.
31. As a responsible person, I want to understand that my address personalizes suggestions but does not limit my choices, so that I remain in control.
32. As a responsible person, I want to enter responsible-person identity and contact data separately from child data, so that the application has a clear accountable contact.
33. As a responsible person, I want CPF, e-mail, phone and optional NIS validated, so that the main communication and identity fields are usable.
34. As a responsible person, I want to choose one or more communication channels, so that important updates can reach me in a practical way.
35. As a responsible person, I want to switch between children while selecting units, so that I can build each application without losing context.
36. As a responsible person, I want to see only units that historically offered the child's grouping and schedule, so that obviously incompatible options are not selectable.
37. As a responsible person, I want to know how many compatible units are available in the historical catalog, so that I understand the breadth of the search.
38. As a responsible person, I want suggestions grouped by reason instead of a single opaque ranking, so that I can compare trade-offs.
39. As a responsible person, I want nearby-unit suggestions, so that daily travel can be considered.
40. As a responsible person, I want historical confirmation-rate suggestions, so that I can inspect units with comparatively favorable past outcomes.
41. As a responsible person, I want lower-dispute suggestions, so that I can inspect units with fewer first-choice candidates per occupied place.
42. As a responsible person, I want eligible previous-attempt units highlighted when history is available, so that continuity with an earlier wait is visible.
43. As a responsible person, I want every suggestion to explain its data and limitations, so that a historical signal is not mistaken for a promise.
44. As a responsible person, I want to search all compatible units by name, neighborhood or code, so that recommendations do not hide the full catalog.
45. As a responsible person, I want to see compatible units on a map relative to my approximate neighborhood, so that geography is easier to understand.
46. As a responsible person, I want distance rings and a readable number of map markers, so that the mobile map is useful instead of visually saturated.
47. As a responsible person, I want to tap a map marker for details, so that I can inspect a unit in geographic context.
48. As a responsible person, I want an explicit “add” action, so that viewing a unit never changes my application by accident.
49. As a responsible person, I want to choose up to five units per child, so that I can express a meaningful order of preference.
50. As a responsible person, I want an attempted sixth choice blocked without losing the first five, so that the rule is safe and predictable.
51. As a responsible person, I want duplicate unit choices prevented, so that all five positions can represent distinct preferences.
52. As a responsible person, I want to reorder choices with accessible controls, so that preference order can be changed without drag-and-drop.
53. As a responsible person, I want to remove a unit and immediately free a position, so that I can revise my strategy.
54. As a responsible person, I want at least one unit required for every child, so that no incomplete child application is submitted.
55. As a responsible person, I want a complete review before submission, so that I can catch mistakes across family, child, criteria and unit data.
56. As a responsible person, I want to edit one review block and return directly to the review, so that I do not replay the entire journey.
57. As a responsible person, I want the review to show each child's score and ordered units, so that independent applications remain clear.
58. As a responsible person, I want the review to show evidence requirements and communication channels, so that post-submission obligations are visible.
59. As a responsible person, I want to acknowledge that submission is simulated, so that a synthetic protocol cannot be confused with an official one.
60. As a responsible person, I want a protocol after submission, so that the completion state is concrete and demonstrable.
61. As a responsible person, I want one receipt to summarize all child applications, so that a sibling session remains manageable.
62. As a responsible person, I want the receipt to repeat ordered preferences and required documents, so that I do not depend on memory.
63. As a responsible person, I want to see the current application status with the exact operational vocabulary, so that the tracking view aligns with familiar official states.
64. As a responsible person, I want a timeline that explains possible next states, so that I know when action may be required.
65. As a responsible person, I want each child's status visible separately, so that one sibling's outcome is not confused with another's.
66. As a responsible person, I want to update contact information without recreating the application, so that communications remain reliable.
67. As a responsible person, I want the future proposal for remaining preferences explained separately from current official operation, so that product vision and present rule are not conflated.
68. As a demo evaluator, I want all historical and synthetic information labeled, so that feasibility is demonstrated without overstating integration.
69. As a demo evaluator, I want the solution to use real anonymized catalog structure, so that the concept is grounded in available SME data.
70. As a demo evaluator, I want the core journey to work without a live Prefeitura integration, so that the prototype can be evaluated immediately.
71. As a future integration team member, I want authentication to be an upstream seam, so that a real identity provider can replace the demo assumption without rewriting the application journey.
72. As a future integration team member, I want unit catalog and process rules versioned by reference year, so that each official process can replace historical configuration safely.
73. As a future integration team member, I want submission isolated behind an application API contract, so that simulated persistence can be replaced by an official adapter.
74. As a future integration team member, I want CEP lookup isolated server-side, so that provider changes and failure policies do not leak into form components.
75. As a future integration team member, I want domain rules independent from page components, so that Forms output or official APIs can map into one stable contract.
76. As a mobile user, I want controls sized and ordered for touch, so that the full journey remains usable on a small screen.
77. As a keyboard or assistive-technology user, I want standard accessible UI primitives for dates, tabs, dialogs, choices and progress, so that the journey does not depend on custom interaction behavior.
78. As a user on an unstable connection, I want external lookup failures to preserve entered data, so that intermittent connectivity does not destroy progress.

## Implementation Decisions

- The application will use Nuxt as the full-stack framework and Nuxt UI as the default component system.
- A native Nuxt UI component takes precedence whenever the catalog offers the required interaction. Dates use `UInputDate`; choices, tabs, dialogs, empty states, progress, forms and timelines use their corresponding Nuxt UI primitives.
- The map is the deliberate exception to the Nuxt UI rule and uses MapLibre because the component catalog has no map primitive.
- The primary domain contract is a complete `Inscricao` aggregate containing responsible person, address, one to five children, criteria, channels, protocol and submission state.
- A child owns birth data, requested schedule, historical attempts and an ordered list of unit codes. Unit options are not stored globally on the family.
- Application rules live in shared domain modules rather than pages. Pages orchestrate inputs and display results; they do not independently reimplement CPF, grouping, scoring, eligibility or suggestion logic.
- Birth and responsible-person dates are represented by accessible calendar values in the interface and normalized to `YYYY-MM-DD` at the domain boundary.
- Grouping windows and score weights are loaded from process metadata. The demo shifts the observed reference process to its demonstration process year and labels that projection.
- Family criteria apply to all children; child criteria apply only to explicitly selected child IDs. Tie-break criteria are stored but do not add points.
- Unchecking the decision to provide socio-economic criteria clears previously selected criteria to prevent hidden scoring state.
- Changing a child's schedule clears its selected unit list because eligibility depends on schedule.
- Unit eligibility requires both the child's grouping and requested schedule to appear in the historical unit record.
- Suggestions never mutate the ordered preference list. An explicit add action is required from cards or map popups.
- Suggestions are separate groups, not one authoritative score: eligible previous attempts, proximity, historical confirmation rate and lower first-choice competition.
- Historical confirmation suggestions require a minimum historical sample. Competition suggestions require a usable occupied-place proxy and exclude records without that denominator.
- Merit-based suggestions are constrained to a practical radius before ranking, expanding the radius only when necessary to provide enough options.
- The responsible person may search the complete compatible catalog regardless of suggestion groups.
- The unit map uses an approximate neighborhood centroid because anonymized data does not provide a family street coordinate. The interface states this limitation.
- The map renders no more than 45 compatible units, opens at the smallest supported 2, 5 or 10 km radius with a useful number of options and always includes already selected units.
- The CEP provider is accessed through a server API. The client validates eight digits, debounces automatic lookup and keeps all address fields editable.
- CEP lookup failure is non-blocking; manual address entry remains available. A non-Rio response triggers a warning rather than silently inventing an eligibility rule.
- Draft persistence is local to the browser and versioned. It is a demonstration of continuity, not authenticated server storage.
- Authentication, official persistence and notifications are upstream/downstream adapters. The demo does not simulate their security semantics.
- Submission uses a server contract even while persistence is synthetic, creating one high-level replacement seam for an official application service.
- Editing from the review or tracking screen carries a return destination so a corrected block returns to its calling context.
- API and UI copy use observed historical status names where applicable. Any proposed continuation through remaining choices is labeled as future product behavior.
- Dataset synchronization imports the colleague prototype's generated criteria, process metadata and enriched unit catalog. Runtime behavior does not depend on the sibling folder because generated artifacts live with the app.
- No historical metric may be described as current vacancy, guaranteed probability, reservation or official classification.

## Testing Decisions

- Tests should assert externally meaningful domain behavior, not Vue component internals or private helper structure.
- The primary automated seam is the complete `Inscricao` aggregate passed through shared validation, grouping, scoring, eligibility, suggestion and readiness functions. This is the highest existing seam that remains deterministic and independent from browser rendering.
- Selection tests cover explicit add, duplicate prevention, sixth-option rejection, removal, reordering and independent lists across children.
- Identity tests cover CPF check digits, repeated digits, duplicate child CPF, optional CPF/DNV alternatives, DNV length, phone, e-mail, CEP and optional NIS.
- Grouping tests cover every configured birth window boundary, too-young, too-old, malformed dates and age at the March 31 cutoff.
- Scoring tests cover family criteria shared across siblings, child criteria isolation, tie-break criteria, zero criteria, document deduplication and document deadline calculation.
- Unit tests cover grouping-plus-schedule eligibility, accent-insensitive search by name/neighborhood/code, neighborhood-origin fallback, separate suggestion groups, historical minimum sample, competition denominator and radius expansion.
- Suggestion tests explicitly assert that producing suggestions does not add or reorder selected units.
- Map-data tests cover the 45-marker ceiling, smallest useful 2/5/10 km radius and inclusion of already selected units by the page-level composition.
- Server contract tests should cover a valid submission, incomplete child application, zero communication channels and invalid domain data after structural parsing.
- CEP API tests should mock the upstream provider and cover valid Rio response, valid non-Rio response, not-found response, invalid format and provider timeout.
- A manual or automated browser acceptance pass must exercise the highest user seam: start-to-protocol navigation at a mobile viewport.
- The browser acceptance pass must include one and multiple children, with and without criteria, valid and failed CEP lookup, five options and a sixth attempt, schedule change after selection, review editing, protocol and tracking.
- Accessibility acceptance checks include keyboard operation of date segments, tabs, radio/checkbox groups and modal; visible focus; semantic form errors; and touch targets that remain usable at the minimum supported width.
- Existing pure Vitest domain tests are the prior art. They should be updated to the enriched `Unidade` and `Inscricao` contracts rather than preserved through compatibility aliases.
- Completion requires passing unit tests, Nuxt type checking and production build, followed by a mobile visual pass with no runtime console errors.

## Out of Scope

- Implementing login, account creation, password recovery, session management or an identity provider.
- Sending personal data to, or writing applications into, official Prefeitura systems.
- Real-time vacancy availability, reservation, allocation, matching or classification.
- Guaranteeing that historical criteria, weights, deadlines, groupings or unit offers are the current official rules.
- Uploading, scanning, validating or approving socio-economic evidence.
- Sending real e-mail, WhatsApp, SMS or push notifications.
- Exact street-level geocoding, route duration, transit directions or travel-time optimization.
- A production database, cross-device drafts, authenticated persistence or audit logs.
- Production security, privacy, consent and LGPD implementation beyond honest prototype disclosures.
- Creche-team dashboards, operational communications and Prefeitura network cockpit in the primary hackathon demo.
- Changing current official cancellation/reactivation operation. Keeping remaining preferences active is a future proposal to validate with the SME.
- Building a rules administration interface for future process years.
- Treating first appearance in the dataset as proof that a unit is newly opened.

## Further Notes

- The primary demo persona is the responsible person. Creche staff and Prefeitura personas remain relevant future consumers but should not dilute the mobile application journey.
- The enriched catalog uses the colleague prototype's 2025 process extraction: 836 units, 820 with coordinates and 13 socio-economic criteria. These values must remain data-driven rather than copied into page logic.
- The original public data source is the [CIT-SME-RJ Dados Creche repository](https://github.com/CIT-SME-RJ/dadoscreche). Product framing and hackathon context also reference [taicor-ai/claude-impact-lab-rio-2](https://github.com/taicor-ai/claude-impact-lab-rio-2).
- ViaCEP is a convenience provider for the prototype. A real deployment should decide provider, rate policy and authoritative address validation with the integration team.
- This file is the versioned specification source. A corresponding project issue should carry the `ready-for-agent` label for agent execution and traceability.
