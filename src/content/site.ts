/**
 * Single source of truth for every factual claim on this site.
 *
 * Rules this file enforces by construction:
 *
 *  1. Every claim that a buyer could audit carries an explicit `state`.
 *     The UI renders the state; it cannot present an unverified claim as
 *     verified, because there is no code path that draws a verified chip
 *     without `state: 'verified'`.
 *
 *  2. `PENDING` is a first-class value. A field that has no real answer
 *     renders as an openly incomplete record, never as filler prose.
 *     An incomplete record is more credible than a completed fiction.
 *
 *  3. Nothing in here is a metric, logo, testimonial, or client name that
 *     has not been supplied by the client and cleared for publication.
 *
 * See README.md § "Before you publish" for the list of fields that must be
 * replaced with client-supplied facts.
 */

export const PENDING = '__PENDING__' as const

export type Maybe = string | typeof PENDING

/** Assurance states, ordered from weakest to strongest evidence. */
export type AssuranceState =
  | 'none' // no work done, no claim made
  | 'designed-around' // controls built with the regime in mind; not an attestation
  | 'scoped' // determined per deployment / per contract
  | 'in-progress' // active, incomplete, with an owner
  | 'available' // implemented and demonstrable in the product today
  | 'verified' // confirmed by a party other than Ayjas Systems

export const ASSURANCE_LABEL: Record<AssuranceState, string> = {
  none: 'Not held',
  'designed-around': 'Designed around',
  scoped: 'Scoped per contract',
  'in-progress': 'In progress',
  available: 'Available',
  verified: 'Independently verified',
}

/* ------------------------------------------------------------------ org --- */

export const org = {
  legalName: 'Ayjas Systems',
  shortName: 'Ayjas',
  wordmark: 'AYJAS SYSTEMS',
  registeredName: PENDING as Maybe, // e.g. "Ayjas Systems Ltd" — CAC-registered name
  rcNumber: PENDING as Maybe, // Nigerian CAC RC number
  tin: PENDING as Maybe,
  founded: PENDING as Maybe,
  headcount: PENDING as Maybe,
  operatingRegion: 'Lagos, Nigeria — remote delivery across West Africa',
  addressLines: ['Lagos, Nigeria'],
  email: 'ayjassystems@gmail.com',
  /** Set once a business mailbox exists; the UI prefers this when present. */
  contractingEmail: PENDING as Maybe,
  phone: PENDING as Maybe,
  hours: 'Monday–Friday, 09:00–18:00 WAT',
} as const

/**
 * The single sentence the whole site has to agree with. Every page is
 * checked against this: if a page implies a different company, it is wrong.
 */
export const positioning = {
  category: 'Operational software for institutions',
  eyebrow: 'Institutional operations · configured deployments',
  headline:
    'Operational software for institutions that must account for every decision.',
  subhead:
    'Ayjas Systems builds one system: a configurable record of service requests, approvals, vendor coordination, and reporting — deployed and configured for a single institution at a time.',
  deliverable:
    'A configured deployment of the Ayjas operations system, plus the implementation work required to put it into service.',
  buyers: 'Administrators, operations leads, and facilities managers',
  notWeDo: [
    'We do not resell third-party software.',
    'We do not bid as a procurement consultancy.',
    'We do not staff facilities operations.',
  ],
} as const

/* --------------------------------------------------------- evidence rail --- */

export type RailItem = { label: string; value: Maybe; note?: string }

export const evidenceRail: RailItem[] = [
  {
    label: 'Delivery model',
    value: 'Configured deployment',
    note: 'One institution per deployment. No shared tenancy.',
  },
  {
    label: 'Primary users',
    value: 'Administrators · field teams · vendors',
  },
  {
    label: 'Assurance status',
    value: 'Controls documented · no external audit',
    note: 'See the assurance register for the state of each control area.',
  },
  {
    label: 'Operating region',
    value: org.operatingRegion,
  },
]

/* ------------------------------------------------------------- controls --- */

export type Control = {
  id: string
  n: string
  name: string
  /** Observable behaviour. Never a benefit claim. */
  behaviour: string
  detail: string[]
  /** Node id in the control map diagram. */
  node: string
}

export const controls: Control[] = [
  {
    id: 'AIS-C-01',
    n: '01',
    name: 'Intake and triage',
    node: 'intake',
    behaviour:
      'Define request types, required fields, attachments, and the queue each type lands in — without changing application code.',
    detail: [
      'Request types are configuration records: fields, validation, required attachments, default priority.',
      'Submission channels: authenticated web form, public form with a per-location code, or bulk import.',
      'Every submission is assigned an immutable identifier at creation and never renumbered.',
      'Triage rules route on location, request type, and declared urgency.',
    ],
  },
  {
    id: 'AIS-C-02',
    n: '02',
    name: 'Approval routing',
    node: 'approval',
    behaviour:
      'Set the approval path per request type, including sequential and parallel steps, spend thresholds, delegation, and escalation on elapsed time.',
    detail: [
      'Paths are declared as ordered steps; each step names a role, not a person.',
      'Threshold rules add or remove steps based on declared cost or category.',
      'Delegation is bounded by date range and recorded as an explicit grant.',
      'Escalation fires on elapsed time in a step and is recorded as a system actor.',
    ],
  },
  {
    id: 'AIS-C-03',
    n: '03',
    name: 'Role-based access',
    node: 'access',
    behaviour:
      'Assign permissions by function and scope them to a location, department, or vendor account. Access to a record requires an explicit grant.',
    detail: [
      'Permissions are function-based: submit, triage, approve, assign, close, report, administer.',
      'Every grant is scoped — a location, a department, or a single vendor account.',
      'Vendor accounts see only the work assigned to them, and only the fields released to them.',
      'There is no implicit administrator view of records outside a granted scope.',
    ],
  },
  {
    id: 'AIS-C-04',
    n: '04',
    name: 'Vendor assignment',
    node: 'vendor',
    behaviour:
      'Maintain a vendor register, assign approved work to a vendor, and hold their acknowledgement, schedule, and completion evidence on the request itself.',
    detail: [
      'The vendor register holds contact, category, and contract reference per vendor.',
      'Assignment requires an approved request; unapproved work cannot be dispatched.',
      'Vendors acknowledge, schedule, and file completion evidence against the request.',
      'Completion evidence is retained with the record, not in a separate mailbox.',
    ],
  },
  {
    id: 'AIS-C-05',
    n: '05',
    name: 'Service-level tracking',
    node: 'sla',
    behaviour:
      'Define response and resolution targets per request type and priority. Elapsed time is measured against the target and breaches are visible before they are historical.',
    detail: [
      'Targets are set per request type and priority, with working-hours calendars.',
      'The clock pauses only on states you designate as waiting-on-requester.',
      'Breach and near-breach states are visible in the queue, not only in reports.',
      'Target changes are versioned; historical measurement uses the target in force at the time.',
    ],
  },
  {
    id: 'AIS-C-06',
    n: '06',
    name: 'Audit and reporting',
    node: 'audit',
    behaviour:
      'Every state change is recorded with actor, timestamp, previous value, and new value. Reports are built from that record and export as CSV or PDF.',
    detail: [
      'The audit record is append-only; there is no interface that edits or deletes an entry.',
      'Entries capture actor, timestamp (UTC, stored with offset), field, previous value, new value.',
      'Standard reports: open load by location, ageing, approval latency, vendor performance, target compliance.',
      'Exports carry the query, the run timestamp, and the requesting actor on the artefact.',
    ],
  },
]

/* ----------------------------------------------------- assurance ledger --- */

export type AssuranceRow = {
  id: string
  area: string
  /** What the system actually does. Present tense, observable. */
  implemented: string
  state: AssuranceState
  /** Why the state is what it is. Shown in full — no softening. */
  qualifier: string
  owner: Maybe
  reviewed: Maybe
}

export const assurance: AssuranceRow[] = [
  {
    id: 'AIS-A-01',
    area: 'Access control',
    implemented:
      'Permissions assigned by function and scoped to location, department, or vendor account.',
    state: 'available',
    qualifier: 'Demonstrable in the product. Not externally assessed.',
    owner: PENDING,
    reviewed: PENDING,
  },
  {
    id: 'AIS-A-02',
    area: 'Auditability',
    implemented:
      'Append-only record of state changes with actor, timestamp, and before/after values.',
    state: 'available',
    qualifier: 'Demonstrable in the product. Not externally assessed.',
    owner: PENDING,
    reviewed: PENDING,
  },
  {
    id: 'AIS-A-03',
    area: 'Authentication',
    implemented:
      'Email-and-password with enforced second factor for accounts holding approve or administer permissions.',
    state: 'available',
    qualifier:
      'Single sign-on against an institutional identity provider is scoped per deployment.',
    owner: PENDING,
    reviewed: PENDING,
  },
  {
    id: 'AIS-A-04',
    area: 'Data residency',
    implemented:
      'Deployment region is fixed at provisioning and recorded in the deployment record.',
    state: 'scoped',
    qualifier:
      'Available regions depend on the hosting provider selected for the contract.',
    owner: PENDING,
    reviewed: PENDING,
  },
  {
    id: 'AIS-A-05',
    area: 'Retention and export',
    implemented:
      'Retention periods and export formats configured per deployment; export is available to the institution at any time.',
    state: 'scoped',
    qualifier: 'Set in the data-processing terms for the specific contract.',
    owner: PENDING,
    reviewed: PENDING,
  },
  {
    id: 'AIS-A-06',
    area: 'Encryption',
    implemented:
      'TLS in transit. Encryption at rest as provided by the hosting platform.',
    state: 'available',
    qualifier:
      'At-rest encryption is inherited from the platform, not independently implemented by Ayjas Systems.',
    owner: PENDING,
    reviewed: PENDING,
  },
  {
    id: 'AIS-A-07',
    area: 'Backup and recovery',
    implemented:
      'Automated daily snapshots with a documented restore procedure.',
    state: 'in-progress',
    qualifier:
      'Restore has not yet been exercised against a production deployment. Do not treat the procedure as tested.',
    owner: PENDING,
    reviewed: PENDING,
  },
  {
    id: 'AIS-A-08',
    area: 'NDPA 2023 (Nigeria)',
    implemented:
      'Lawful-basis record, data-subject request handling, and a documented processing inventory per deployment.',
    state: 'designed-around',
    qualifier:
      'Controls are built with the Act in mind. Ayjas Systems holds no NDPC filing or attestation. This is not a compliance certificate.',
    owner: PENDING,
    reviewed: PENDING,
  },
  {
    id: 'AIS-A-09',
    area: 'SOC 2',
    implemented: 'No independent assessment has been performed.',
    state: 'none',
    qualifier:
      'Ayjas Systems is not SOC 2 audited and does not claim SOC 2 alignment. Earlier marketing that implied otherwise was inaccurate and has been withdrawn.',
    owner: PENDING,
    reviewed: PENDING,
  },
  {
    id: 'AIS-A-10',
    area: 'ISO/IEC 27001',
    implemented: 'No certification held. No audit scheduled.',
    state: 'none',
    qualifier: 'Stated so that a procurement reviewer does not have to ask.',
    owner: PENDING,
    reviewed: PENDING,
  },
  {
    id: 'AIS-A-11',
    area: 'FERPA (United States)',
    implemented:
      'Not applicable to any deployment currently in service. Ayjas Systems operates from Nigeria and holds no US education records.',
    state: 'none',
    qualifier:
      'FERPA obligations would attach only to a US institution deployment. None exists. Any future US engagement requires a separate controls review before this row changes.',
    owner: PENDING,
    reviewed: PENDING,
  },
  {
    id: 'AIS-A-12',
    area: 'Penetration testing',
    implemented: 'No third-party penetration test has been commissioned.',
    state: 'none',
    qualifier:
      'A test can be commissioned as a condition of contract; cost and scope would be quoted separately.',
    owner: PENDING,
    reviewed: PENDING,
  },
]

/** Subprocessors — a procurement reviewer will ask for this list. */
export type Subprocessor = {
  name: Maybe
  purpose: string
  region: Maybe
}

export const subprocessors: Subprocessor[] = [
  { name: PENDING, purpose: 'Application and database hosting', region: PENDING },
  { name: PENDING, purpose: 'Transactional email delivery', region: PENDING },
  { name: PENDING, purpose: 'Error and performance monitoring', region: PENDING },
  { name: PENDING, purpose: 'Object storage for attachments', region: PENDING },
]

/* ------------------------------------------------------------- records --- */

export type EngagementRecord = {
  id: string
  /** True only for records cleared for publication by the named client. */
  published: boolean
  /** A worked example of the format, explicitly not a real engagement. */
  specimen?: boolean
  institutionType: Maybe
  initialState: Maybe
  intervention: Maybe
  measuredResult: Maybe
  deploymentPeriod: Maybe
  referenceStatus: Maybe
}

export const recordRegister = {
  publishedCount: 0,
  /**
   * Why the register is empty. This paragraph is the point of the page:
   * a stated reason beats an anonymous testimonial.
   */
  statement:
    'No engagement records are published. Ayjas Systems will not publish an anonymous case study, an unnamed logo, or a metric it cannot produce the underlying report for. The register below stays empty until a client clears a record for publication, at which point it is filled in the format shown.',
  policy: [
    'A record is published only with the named institution’s written clearance.',
    'A measured result is published only when the report it came from can be produced on request.',
    'Where a client cannot be named, the record is withheld entirely rather than anonymised.',
    'Reference calls are arranged directly with the institution, not brokered through us.',
  ],
}

export const specimenRecord: EngagementRecord = {
  id: 'AIS–SPEC–000',
  published: false,
  specimen: true,
  institutionType: 'Multi-campus education organisation',
  initialState:
    'Maintenance requests distributed across email, WhatsApp, and three spreadsheets. No single list of open work.',
  intervention:
    'Centralised intake with per-campus codes; two-step approval above a spend threshold; vendor accounts for four contractors.',
  measuredResult:
    'Stated as a figure with the report that produced it — e.g. "median approval latency, measured from the audit record, first 90 days versus the preceding manual baseline."',
  deploymentPeriod: 'Stated as an actual date range',
  referenceStatus: 'Public · under NDA · unavailable — stated explicitly',
}

/* ------------------------------------------------ implementation planes --- */

export type Plane = {
  n: string
  name: string
  duration: Maybe
  inputs: string[]
  outputs: string[]
  responsible: { ayjas: string; institution: string }
  acceptance: string
}

export const planes: Plane[] = [
  {
    n: '01',
    name: 'Operational discovery',
    duration: PENDING,
    inputs: [
      'Current request channels and volumes',
      'Org chart with approval authority',
      'Vendor list with contract references',
      'Existing forms and spreadsheets',
    ],
    outputs: [
      'Request-type inventory',
      'Approval authority matrix',
      'Data inventory with sensitivity classification',
      'Named rollout owner inside the institution',
    ],
    responsible: {
      ayjas: 'Runs the sessions, writes the inventory',
      institution: 'Supplies the authority matrix and names the rollout owner',
    },
    acceptance:
      'The institution signs off the request-type inventory and the approval authority matrix. Configuration does not start without both.',
  },
  {
    n: '02',
    name: 'Workflow and permission model',
    duration: PENDING,
    inputs: [
      'Signed request-type inventory',
      'Signed approval authority matrix',
      'Spend thresholds and delegation rules',
    ],
    outputs: [
      'Approved workflow map per request type',
      'Role-to-permission table with scopes',
      'Service-level targets per type and priority',
      'Retention and export schedule',
    ],
    responsible: {
      ayjas: 'Drafts the model, walks it through step by step',
      institution: 'Approves each path and each permission scope',
    },
    acceptance:
      'Every request type has a declared path, a named responsible role per step, and an escalation condition. No path is left implicit.',
  },
  {
    n: '03',
    name: 'System configuration',
    duration: PENDING,
    inputs: [
      'Approved workflow map',
      'Role-to-permission table',
      'User and location lists',
      'Vendor register data',
    ],
    outputs: [
      'Configured deployment in a staging environment',
      'Loaded users, locations, and vendors',
      'Deployment record: region, retention, subprocessors',
      'Configuration change log from this point forward',
    ],
    responsible: {
      ayjas: 'Configures the deployment, records the deployment record',
      institution: 'Validates against the approved model',
    },
    acceptance:
      'The institution walks a request of each type end to end in staging and confirms the audit record matches what happened.',
  },
  {
    n: '04',
    name: 'Controlled rollout',
    duration: PENDING,
    inputs: [
      'Accepted staging configuration',
      'Named pilot scope: locations and request types',
      'Trained users for the pilot scope',
    ],
    outputs: [
      'Production deployment limited to pilot scope',
      'Baseline measurements taken before cutover',
      'Defect log with severities and owners',
      'Go / no-go decision record for wider rollout',
    ],
    responsible: {
      ayjas: 'Runs cutover, holds the defect log, trains users',
      institution: 'Decides go / no-go and owns the pilot scope',
    },
    acceptance:
      'The pilot scope runs for an agreed period with no open severity-1 defect, and a baseline exists to measure against later.',
  },
  {
    n: '05',
    name: 'Monitoring and iteration',
    duration: PENDING,
    inputs: [
      'Production deployment',
      'Service-level targets in force',
      'Support channel and response commitments',
    ],
    outputs: [
      'Monthly operations report from the audit record',
      'Configuration change log, reviewed with the institution',
      'Exercised restore procedure',
      'Documented exit and export path',
    ],
    responsible: {
      ayjas: 'Produces the report, holds the change log, maintains the deployment',
      institution: 'Reviews the report and approves configuration changes',
    },
    acceptance:
      'The institution can produce its own data, its own audit record, and its own reports without asking Ayjas Systems to do it.',
  },
]

/* --------------------------------------------------------- procurement --- */

export type DocState = 'available' | 'on-request' | 'drafting' | 'unavailable'

export const DOC_STATE_LABEL: Record<DocState, string> = {
  available: 'Available now',
  'on-request': 'On request',
  drafting: 'Drafting',
  unavailable: 'Not produced',
}

export type ProcurementDoc = {
  id: string
  title: string
  summary: string
  state: DocState
  revision: Maybe
  owner: Maybe
  /** Only set when state === 'available'. */
  href?: string
}

export const procurementDocs: ProcurementDoc[] = [
  {
    id: 'AIS–DOC–01',
    title: 'Capability statement',
    summary:
      'What the system does, who it is for, what a deployment includes, and what is out of scope. Two pages.',
    state: 'drafting',
    revision: PENDING,
    owner: PENDING,
  },
  {
    id: 'AIS–DOC–02',
    title: 'Security overview',
    summary:
      'The assurance register in document form, with the same states — including the areas where nothing is held.',
    state: 'drafting',
    revision: PENDING,
    owner: PENDING,
  },
  {
    id: 'AIS–DOC–03',
    title: 'Data-processing terms',
    summary:
      'Roles, lawful basis, subprocessors, retention, export, breach notification, and deletion on termination.',
    state: 'drafting',
    revision: PENDING,
    owner: PENDING,
  },
  {
    id: 'AIS–DOC–04',
    title: 'Implementation brief',
    summary:
      'The five deployment planes with inputs, outputs, responsible parties, and acceptance criteria, scoped to your institution.',
    state: 'on-request',
    revision: PENDING,
    owner: PENDING,
  },
  {
    id: 'AIS–DOC–05',
    title: 'Vendor identifiers',
    summary:
      'Registered name, CAC registration number, TIN, and bank details for contracting.',
    state: 'on-request',
    revision: PENDING,
    owner: PENDING,
  },
  {
    id: 'AIS–DOC–06',
    title: 'Reference list',
    summary:
      'Contactable references. Empty while the engagement register is empty — see the record register.',
    state: 'unavailable',
    revision: PENDING,
    owner: PENDING,
  },
]

/* ------------------------------------------------------------- reports --- */

/** Standard report set — the shape of what comes out of the audit record. */
export const reports: { id: string; name: string; grain: string; fields: string }[] = [
  {
    id: 'R-01',
    name: 'Open load by location',
    grain: 'One row per location',
    fields: 'open · in approval · assigned · overdue · oldest open',
  },
  {
    id: 'R-02',
    name: 'Ageing',
    grain: 'One row per request',
    fields: 'age · current state · time in state · target · breach flag',
  },
  {
    id: 'R-03',
    name: 'Approval latency',
    grain: 'One row per approval step',
    fields: 'step · role · elapsed · escalated · delegated',
  },
  {
    id: 'R-04',
    name: 'Vendor performance',
    grain: 'One row per vendor per period',
    fields: 'assigned · acknowledged · completed · median completion · reopened',
  },
  {
    id: 'R-05',
    name: 'Target compliance',
    grain: 'One row per request type per period',
    fields: 'volume · met · breached · rate · target in force',
  },
  {
    id: 'R-06',
    name: 'Audit extract',
    grain: 'One row per state change',
    fields: 'record · actor · timestamp · field · previous · new',
  },
]

/* ------------------------------------------------------------------ nav --- */

export const nav = [
  { to: '/capabilities', label: 'Capabilities' },
  { to: '/assurance', label: 'Assurance' },
  { to: '/implementation', label: 'Implementation' },
  { to: '/records', label: 'Records' },
  { to: '/procurement', label: 'Procurement' },
] as const

export const siteUrl = 'https://jacobfv.github.io/ayjas-systems'
