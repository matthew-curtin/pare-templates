import type { Vacancy } from "./types";

/**
 * Twenty-two vacancies, all invented, and tuned rather than sprinkled.
 *
 * The board has states that only exist if the data contains them, so
 * the data contains them on purpose and `scripts/check-listings.mjs`
 * asserts every one. In particular: exactly one closes today, exactly
 * one closes tomorrow, three have already closed, exactly two have no
 * salary on them, one is unpaid, one is casual and therefore has no
 * annual figure at all, one is a job share, and one employer has
 * nothing open.
 *
 * The descriptions are deliberately uneven in length. Real boards carry
 * a 700-word advert next to a two-line one that says "see the job pack",
 * and a design that only ever sees full ones has not been tested.
 */
export const vacancies: Vacancy[] = [
  {
    id: "v01",
    slug: "head-of-housing-standards-wrenfield",
    title: "Head of Housing Standards",
    employerId: "wrenfield",
    sector: "Local government",
    contract: "Permanent",
    pattern: "Hybrid",
    hours: { kind: "Full time" },
    pay: { kind: "range", min: 58000, max: 63500, grade: "Grade 13" },
    place: "Wrenfield",
    posted: "2026-09-09",
    closes: "2026-10-02",
    reference: "WBC/2691",
    featured: true,
    interviews: "Panel interviews on 20 and 21 October, in person.",
    summary:
      "Lead the borough's private rented sector enforcement — 14 officers, a licensing scheme covering 4,000 properties, and a members' commitment to double inspections by 2028.",
    sections: [
      {
        heading: "About the role",
        body: [
          "Wrenfield has one of the largest private rented sectors in the region and, until recently, one of the smallest teams looking at it. That has changed: the service has grown from six officers to fourteen in two years, a selective licensing scheme went live across three wards in April, and cabinet has agreed funding to extend it in 2027.",
          "What it has not had is somebody to hold the whole thing together. You would be accountable for enforcement policy, the licensing scheme's finances, the relationship with the courts, and — the part most people underestimate — the relationship with landlords who are doing the right thing and resent being treated like the ones who are not.",
        ],
      },
      {
        heading: "What you would be responsible for",
        points: [
          "A team of fourteen across enforcement, licensing administration and a two-person tribunal case team",
          "A licensing budget of £1.9m over the scheme's five years, including its cost-recovery position",
          "Prosecutions and civil penalty decisions up to £30,000, taken personally under delegated authority",
          "The council's statutory returns on housing conditions, and the member briefings that follow them",
          "Extending the scheme to a further four wards, including the consultation",
        ],
      },
      {
        heading: "What we are looking for",
        points: [
          "Substantial experience of housing enforcement in a regulatory setting, including having taken cases to conclusion",
          "EHORB registration or an equivalent professional qualification",
          "Experience managing a team through a period of growth, which is a different job from managing a settled one",
          "A clear view on when enforcement is the right tool and when it is not",
          "Desirable: experience of designing or extending a selective licensing scheme",
        ],
      },
      {
        heading: "How to apply",
        body: [
          "Apply through the council's recruitment portal with a CV and a supporting statement of no more than two sides. We do not use application forms for posts at this grade.",
          "Informal conversations are welcome and genuinely are informal — contact the Director of Place through the switchboard.",
        ],
      },
    ],
  },
  {
    id: "v02",
    slug: "interim-assistant-director-housing-delivery-fernbank",
    title:
      "Interim Assistant Director of Housing Delivery and Regeneration (Maternity Cover)",
    employerId: "fernbank",
    sector: "Housing",
    contract: "Interim",
    pattern: "Hybrid",
    hours: { kind: "Full time" },
    pay: { kind: "daily", rate: 465 },
    place: "Fernbank, two days a week",
    posted: "2026-08-24",
    closes: "2026-09-16",
    reference: "FHA/INT/114",
    term: "12 months",
    summary:
      "Cover for a 12-month maternity leave, holding a development programme of 340 homes across four sites and a retrofit pipeline that is behind schedule.",
    sections: [
      {
        heading: "About the role",
        body: [
          "This is a genuine interim, not a permanent post with a temporary label. The postholder returns in October 2027 and you would be handing back a programme, so the brief is to keep it moving and leave it legible rather than to reinvent it.",
          "Two things are difficult and we would rather say so now. The Marsh Lane site has a contractor in difficulty. And the retrofit programme is roughly nine months behind the trajectory in the board paper, for reasons that are mostly not the team's fault but are now the team's problem.",
        ],
      },
      {
        heading: "What you would be responsible for",
        points: [
          "Four live development sites totalling 340 homes, two of them on site",
          "The retrofit programme and its reporting to the regulator",
          "A directorate of 38 people across development, asset strategy and compliance",
          "Board and committee reporting, including one difficult paper in November",
        ],
      },
      {
        heading: "What we are looking for",
        points: [
          "Development or regeneration leadership in a registered provider or local authority",
          "Experience taking over a programme mid-flight, which is a specific skill",
          "Comfort with a contractor insolvency conversation",
          "Availability to start within four weeks of offer",
        ],
      },
      {
        heading: "How to apply",
        body: [
          "Send a CV and a short note — half a page is plenty — through the portal. We will shortlist within two working days of closing because the timescale is tight.",
        ],
      },
    ],
  },
  {
    id: "v03",
    slug: "rivers-officer-catchment-monitoring",
    title: "Rivers Officer (Catchment Monitoring)",
    employerId: "woldwater",
    sector: "Environment",
    contract: "Fixed term",
    pattern: "On site",
    hours: { kind: "Full time" },
    pay: { kind: "range", min: 29400, max: 32100 },
    place: "The Wold catchment, from the Halden office",
    posted: "2026-08-27",
    closes: "2026-09-17",
    reference: "WWT/26/09",
    term: "2 years, with a strong intention to extend",
    interviews: "One stage, in the field, on 25 September. Bring boots.",
    summary:
      "Run the trust's water quality monitoring across 46 sample points and the volunteer network that collects most of it. Two-year post, funded to 2028.",
    sections: [
      {
        heading: "About the role",
        body: [
          "The trust has eleven years of monthly phosphate and nitrate data for this catchment, which is unusual for an organisation this size and is the reason it gets listened to. Most of that data is collected by about 300 volunteers, and the officer who has held this post since 2019 is moving to a university research group.",
          "The job is roughly half field and analysis, half people. The analysis matters, but the network is the asset — if the volunteers stop, the dataset stops, and eleven years becomes a historical curiosity.",
        ],
      },
      {
        heading: "What you would be doing",
        points: [
          "Maintaining the sampling programme across 46 fixed points and around 20 event-based ones",
          "Quality assurance on volunteer returns, and the awkward conversations that sometimes follow",
          "Training and equipping new volunteers, roughly 60 a year",
          "Writing the annual catchment report and presenting it to the partnership",
          "Supporting the trust's responses to consultations and permit applications",
        ],
      },
      {
        heading: "What we are looking for",
        points: [
          "A degree in environmental science, ecology, geography or similar, or equivalent practical experience",
          "Confident with spreadsheets and at least one of R, Python or equivalent",
          "A full driving licence — the catchment is 40 miles end to end and the buses are theoretical",
          "Desirable: experience working with volunteers, and a first aid certificate",
        ],
      },
      {
        heading: "How to apply",
        body: [
          "Application form on the trust's site. We do not accept CVs, because the form is scored blind and a CV cannot be.",
        ],
      },
    ],
  },
  {
    id: "v04",
    slug: "collections-documentation-assistant-halden",
    title: "Collections Documentation Assistant",
    employerId: "halden",
    sector: "Culture & heritage",
    contract: "Fixed term",
    pattern: "On site",
    hours: { kind: "Part time", hoursPerWeek: 22.2 },
    pay: { kind: "range", min: 25900, max: 28300 },
    place: "Halden",
    posted: "2026-09-02",
    closes: "2026-09-18",
    reference: "HMM/2026/17",
    term: "18 months",
    summary:
      "Retrospective documentation of roughly 9,000 objects, most of them currently described on index cards written between 1971 and 1994.",
    sections: [
      {
        heading: "About the role",
        body: [
          "The museum's catalogue is in three places: a modern collections management system, a card index, and — for about 900 objects — a series of ledgers in a hand that takes practice to read. This post exists to reduce that to one place.",
          "It is careful, repetitive, quietly satisfying work, and it is the kind of post people take at the start of a museum career. We will say plainly that it is 18 months and we cannot promise what follows, but everyone who has held it has moved on to something better.",
        ],
      },
      {
        heading: "What you would be doing",
        points: [
          "Transcribing and enhancing records for around 9,000 objects, working to SPECTRUM standards",
          "Photographing objects to the museum's documentation standard, not exhibition standard",
          "Reconciling location data against an audit that found 4% of objects are not where the system says",
          "Flagging objects with unclear title or provenance to the Collections Manager",
        ],
      },
      {
        heading: "What we are looking for",
        points: [
          "Accuracy, and the temperament for detailed work over a long period",
          "Familiarity with a collections management system, or the obvious aptitude to learn one",
          "Desirable: a museum studies qualification, or experience of handling nineteenth-century industrial material",
        ],
      },
      {
        heading: "How to apply",
        body: [
          "Application form and equal opportunities monitoring through the museum's site. The post is 0.6 of full time, and our advert quotes the full-time band as museums generally do.",
        ],
      },
    ],
  },
  {
    id: "v05",
    slug: "staff-nurse-acute-medical-unit-calderbrook",
    title: "Staff Nurse, Acute Medical Unit",
    employerId: "calderbrook",
    sector: "Health",
    contract: "Permanent",
    pattern: "On site",
    hours: { kind: "Full time" },
    pay: { kind: "range", min: 31049, max: 37796, grade: "Band 5" },
    place: "Calderbrook General Hospital",
    posted: "2026-09-07",
    closes: "2026-09-21",
    reference: "CAL-3117-AMU",
    interviews: "Rolling. We interview within a week of application.",
    summary:
      "A 32-bed acute medical unit taking direct GP admissions and ED transfers. Full rotation including nights. Band 5 with a Band 6 development pathway.",
    sections: [
      {
        heading: "About the unit",
        body: [
          "The AMU takes around 60 admissions a day and aims to discharge or move on 40% of them within 24 hours, which makes it fast, varied and — the honest word — relentless. It is a good unit to consolidate in and a hard one to be new in without support, so we run a supernumerary period of six weeks rather than the two the policy requires.",
        ],
      },
      {
        heading: "What we are looking for",
        points: [
          "NMC registration, or an application in progress with a confirmed date",
          "Post-registration acute experience, or a recent placement on a medical ward",
          "Willingness to work a full rotation, including nights and weekends",
          "Desirable: ALERT or equivalent deteriorating patient training",
        ],
      },
      {
        heading: "What we offer",
        points: [
          "Six weeks supernumerary, not two",
          "Funded Band 6 development pathway with a named mentor",
          "NHS pension, and the usual Agenda for Change terms",
        ],
      },
      {
        heading: "How to apply",
        body: [
          "Through NHS Jobs, quoting the reference. Applications are reviewed as they arrive, so the post may close early if filled.",
        ],
      },
    ],
  },
  {
    id: "v06",
    slug: "data-analyst-adult-social-care-wrenfield",
    title: "Data Analyst, Adult Social Care",
    employerId: "wrenfield",
    sector: "Local government",
    contract: "Permanent",
    pattern: "Hybrid",
    hours: { kind: "Job share", hoursPerWeek: 18.5 },
    pay: { kind: "range", min: 38626, max: 41511, grade: "Grade 9" },
    place: "Wrenfield, two days in the office",
    posted: "2026-09-01",
    closes: "2026-09-22",
    reference: "WBC/2704",
    summary:
      "Half of a job share supporting the adult social care directorate — statutory returns, waiting-list analysis, and the numbers that go in front of members.",
    sections: [
      {
        heading: "About the role",
        body: [
          "This is one half of an existing job share. Your counterpart works Wednesday to Friday and has been in post for six years; the arrangement works well and both parties would like to keep it that way, so we are recruiting for Monday, Tuesday and Wednesday morning rather than for a full-time post we would then split.",
          "The work is a mix of the statutory — SALT and ASC-FR returns, which have immovable deadlines — and the useful, which is mostly helping operational managers understand their own waiting lists.",
        ],
      },
      {
        heading: "What we are looking for",
        points: [
          "SQL to the level of writing and debugging your own joins, not just running saved queries",
          "One of Power BI, Tableau or equivalent",
          "The judgement to say when a number is too weak to put in front of a committee",
          "Desirable: adult social care data, or another statutory returns regime",
        ],
      },
      {
        heading: "How to apply",
        body: [
          "Council application form. The post is 18.5 hours a week and our advert quotes the full-time band, as council adverts always do.",
        ],
      },
    ],
  },
  {
    id: "v07",
    slug: "lecturer-environmental-science-ashgrove",
    title: "Lecturer in Environmental Science",
    employerId: "ashgrove",
    sector: "Education",
    contract: "Permanent",
    pattern: "On site",
    hours: { kind: "Full time" },
    pay: { kind: "range", min: 45585, max: 54395, grade: "Grade 8" },
    place: "Ashgrove",
    posted: "2026-08-19",
    closes: "2026-09-23",
    reference: "AG/ENV/0912",
    interviews: "Week commencing 12 October, including a teaching observation.",
    summary:
      "Teaching and research in freshwater or soil systems, with a substantial share of the department's fieldwork teaching. Balanced pathway.",
    sections: [
      {
        heading: "About the department",
        body: [
          "Environmental Science at Ashgrove is 31 academic staff and around 400 students, with long-running field sites in the Wold catchment and on the western moors. The department is deliberately field-heavy at a time when others are cutting residential teaching, and that is not going to change.",
        ],
      },
      {
        heading: "What we are looking for",
        points: [
          "A PhD in a relevant discipline and a developing publication record",
          "Capacity to lead residential field teaching, including the logistics and the risk assessments",
          "A research direction that complements freshwater or soil systems rather than duplicating them",
          "Desirable: fellowship of the higher education academy, or willingness to work towards it",
        ],
      },
      {
        heading: "How to apply",
        body: [
          "Through the university's recruitment system: CV, publication list, a two-page research statement and a one-page teaching statement.",
        ],
      },
    ],
  },
  {
    id: "v08",
    slug: "retrofit-coordinator-fernbank",
    title: "Retrofit Coordinator",
    employerId: "fernbank",
    sector: "Housing",
    contract: "Permanent",
    pattern: "Hybrid",
    hours: { kind: "Full time" },
    pay: { kind: "exact", amount: 44200 },
    place: "Fernbank and across the North West",
    posted: "2026-09-14",
    closes: "2026-09-25",
    reference: "FHA/2026/88",
    summary:
      "PAS 2035 coordination across a programme of about 400 homes a year, most of them solid wall, most of them occupied throughout.",
    sections: [
      {
        heading: "About the role",
        body: [
          "Fernbank has committed to EPC C across 11,000 homes by 2030 and is roughly on track, which is a better position than it sounds because the easy third is done and what is left is solid wall, mixed tenure blocks and a lot of listed frontages.",
          "You would be the retrofit coordinator on that programme: assessments, designs, the risk of unintended consequences, and the sign-off. It is a technical post with a lot of resident contact, because these homes are occupied while the work happens.",
        ],
      },
      {
        heading: "What we are looking for",
        points: [
          "Retrofit Coordinator qualification (Level 5 diploma) and TrustMark registration",
          "PAS 2035 experience on occupied stock, particularly solid wall",
          "A clear approach to moisture risk that you can explain to a resident, not just to an assessor",
          "Full driving licence",
        ],
      },
      {
        heading: "How to apply",
        body: [
          "CV and covering note through the portal. This is a single salary point rather than a band, so there is nothing to negotiate and we would rather say so.",
        ],
      },
    ],
  },
  {
    id: "v09",
    slug: "trustee-kestrel-trust",
    title: "Trustee (Finance)",
    employerId: "kestrel",
    sector: "Charity",
    contract: "Voluntary",
    pattern: "Hybrid",
    hours: { kind: "Part time", hoursPerWeek: 4 },
    pay: {
      kind: "voluntary",
      note: "Unpaid, as trustee roles are. Travel, childcare and care costs are reimbursed in full, and we mean it — the last board lost two people because it did not.",
    },
    place: "Trentmoor, four board meetings a year",
    posted: "2026-09-15",
    closes: "2026-10-09",
    reference: "KT/BOARD/03",
    summary:
      "A trustee with a finance background to chair the finance and risk committee. Four board meetings and four committee meetings a year, roughly a day a month all told.",
    sections: [
      {
        heading: "About the board",
        body: [
          "Nine trustees, of whom three are former young carers, which the board considers the most important thing about it. The current finance chair steps down in March after six years and has offered to hand over properly rather than on the day.",
          "The charity's income is £2.1m, about 60% from a county council contract that is up for renewal in 2028. Understanding what that means is most of the job.",
        ],
      },
      {
        heading: "What we are looking for",
        points: [
          "A recognised accountancy qualification, or equivalent senior finance experience",
          "The confidence to disagree with an executive team you like",
          "Around a day a month, including reading time, which people consistently underestimate",
          "We particularly welcome applications from people with direct experience of caring",
        ],
      },
      {
        heading: "How to apply",
        body: [
          "A CV and a short letter to the chair. Informal conversations first are encouraged.",
        ],
      },
    ],
  },
  {
    id: "v10",
    slug: "woodland-ranger-coppice",
    title: "Woodland Ranger",
    employerId: "coppice",
    sector: "Environment",
    contract: "Permanent",
    pattern: "On site",
    hours: { kind: "Full time" },
    pay: { kind: "range", min: 27600, max: 30200 },
    place: "Halden and the western hills",
    posted: "2026-08-31",
    closes: "2026-09-28",
    reference: "CLT/R/2026/4",
    summary:
      "Practical management of about 600 hectares of the trust's woodland, including the working coppice, plus supervision of trainees and volunteer parties.",
    sections: [
      {
        heading: "About the role",
        body: [
          "Chainsaw work, coppice rotation, deer management, ride maintenance, and roughly one day a week supervising trainees or volunteer groups. The trust runs a genuine working coppice on a fifteen-year cycle and sells the product, so the standard is commercial rather than demonstrative.",
        ],
      },
      {
        heading: "What we are looking for",
        points: [
          "NPTC chainsaw certificates including felling to 380mm, or willingness to gain them within six months",
          "Practical woodland management experience",
          "Comfortable leading volunteer groups of mixed ability",
          "Deer stalking certificate desirable; we will fund it otherwise",
        ],
      },
      {
        heading: "How to apply",
        body: ["Application form on the trust's site. Interviews are practical."],
      },
    ],
  },
  {
    id: "v11",
    slug: "casual-visitor-assistant-halden",
    title: "Visitor Assistant (Casual)",
    employerId: "halden",
    sector: "Culture & heritage",
    contract: "Casual",
    pattern: "On site",
    hours: {
      kind: "Casual",
      note: "Weekends and school holidays, as required. Shifts are offered a month ahead and you are free to decline them.",
    },
    pay: { kind: "hourly", rate: 13.85 },
    place: "Halden",
    posted: "2026-09-04",
    closes: "2026-10-05",
    reference: "HMM/2026/21",
    summary:
      "Front of house on the museum's busiest days — welcome desk, galleries, and the demonstration floor when the looms are running.",
    sections: [
      {
        heading: "About the role",
        body: [
          "A casual contract with no guaranteed hours. We are saying that plainly rather than in the small print, because a job board that lets it hide is not much use to anyone.",
          "In practice most of the team work two weekend days a fortnight and more in the holidays. Shifts go out a month ahead.",
        ],
      },
      {
        heading: "What we are looking for",
        points: [
          "Warmth with the public, including on a wet Sunday in February",
          "Availability on weekends",
          "No museum experience needed — training is provided, including on the looms",
        ],
      },
    ],
  },
  {
    id: "v12",
    slug: "digital-content-officer-trentmoor",
    title: "Digital Content Officer",
    employerId: "trentmoor",
    sector: "Local government",
    contract: "Fixed term",
    pattern: "Remote",
    hours: { kind: "Full time" },
    pay: { kind: "range", min: 33100, max: 36400 },
    place: "Remote, with one day a month in Trentmoor",
    posted: "2026-09-08",
    closes: "2026-09-30",
    reference: "TCA/COM/26/12",
    term: "12 months",
    summary:
      "Rewrite the authority's public-facing content for the transport devolution launch. Fully remote, one day a month in person.",
    sections: [
      {
        heading: "About the role",
        body: [
          "The authority takes on bus franchising powers in 2027 and its website currently explains them in language borrowed from the legislation. This post exists to fix that before a million people need to use it.",
          "It is a genuinely remote post — the team is spread across four council areas already — with one day a month together, which is not optional because it is the only day everyone is in the room.",
        ],
      },
      {
        heading: "What we are looking for",
        points: [
          "Content design experience, ideally in government or another regulated setting",
          "Evidence you have written for people who did not want to read it",
          "Comfort with user research findings that contradict the brief",
          "Desirable: experience of a service assessment",
        ],
      },
    ],
  },
  {
    id: "v13",
    slug: "community-fundraising-manager-hollowell",
    title: "Community Fundraising Manager",
    employerId: "hollowell",
    sector: "Charity",
    contract: "Permanent",
    pattern: "Hybrid",
    hours: { kind: "Full time" },
    pay: { kind: "range", min: 36000, max: 39500 },
    place: "Hollowell",
    posted: "2026-09-10",
    closes: "2026-10-07",
    reference: "HH/FR/26/2",
    summary:
      "Lead community and events fundraising — about £1.4m a year, four staff, and a volunteer committee network that has been running some of these events since the 1980s.",
    sections: [
      {
        heading: "About the role",
        body: [
          "Seventy per cent of what it costs to run this hospice is raised locally, and about a third of that comes through this team. That makes it a serious job with a real number attached, and it also makes it a job about relationships with people who have been doing this a long time and have views.",
        ],
      },
      {
        heading: "What we are looking for",
        points: [
          "Community or events fundraising experience with accountability for a target",
          "Line management, including of volunteers who are not line-managed in any normal sense",
          "A driving licence and a tolerance for evening and weekend events",
          "Desirable: experience in a hospice or health charity",
        ],
      },
      {
        heading: "How to apply",
        body: [
          "Application form and supporting statement. We are happy to talk before you apply.",
        ],
      },
    ],
  },
  {
    id: "v14",
    slug: "teaching-assistant-sen-larkmead",
    title: "Teaching Assistant (Special Educational Needs)",
    employerId: "larkmead",
    sector: "Education",
    contract: "Permanent",
    pattern: "On site",
    hours: { kind: "Part time", hoursPerWeek: 27.75 },
    pay: { kind: "range", min: 24404, max: 25183, grade: "Band 4" },
    place: "Larkmead",
    posted: "2026-09-03",
    closes: "2026-10-12",
    reference: "LAT/TA/117",
    summary:
      "One-to-one support in a mainstream primary for two pupils with EHCPs, 27.75 hours a week.",
    sections: [
      {
        heading: "About the role",
        body: [
          "Supporting two pupils in Years 3 and 5, both with education, health and care plans, in a two-form entry primary with a strong inclusion record and an honest recognition that it is under strain.",
        ],
      },
      {
        heading: "What we are looking for",
        points: [
          "Experience supporting children with additional needs, in a school or otherwise",
          "Level 3 teaching assistant qualification, or willingness to work towards it",
          "Patience, and the ability to keep a plan going when the day has not gone to plan",
        ],
      },
      {
        heading: "How to apply",
        body: [
          "Trust application form. The salary shown is the full-time band; this post is 27.75 hours a week and paid pro rata, so the figure at the top of this page is what it actually pays.",
        ],
      },
    ],
  },
  {
    id: "v15",
    slug: "archivist-pattern-books-halden",
    title: "Archivist (Pattern Books Project)",
    employerId: "halden",
    sector: "Culture & heritage",
    contract: "Fixed term",
    pattern: "On site",
    hours: { kind: "Part time", hoursPerWeek: 18.5 },
    pay: {
      kind: "unstated",
      note: "The employer has not given a figure. This listing predates our salary policy; we have asked them to add one and will update it when they do.",
    },
    place: "Halden",
    posted: "2026-08-12",
    closes: "2026-10-14",
    reference: "HMM/2026/09",
    term: "2 years",
    summary:
      "Catalogue and rehouse an archive of about 1,200 worsted pattern books, 1840 to 1961, ahead of digitisation.",
    sections: [
      {
        heading: "About the role",
        body: [
          "The pattern books are the most requested part of the museum's archive and the least accessible: uncatalogued, stored in three locations, and physically fragile in a way that means every consultation is a small negotiation.",
          "This post catalogues them to ISAD(G), rehouses them, and prepares a digitisation specification. A grant application for the digitisation itself goes in next autumn, and the quality of this work is most of what it will stand on.",
        ],
      },
      {
        heading: "What we are looking for",
        points: [
          "A recognised archives qualification, or substantial equivalent experience",
          "Cataloguing to ISAD(G) or RAD",
          "Desirable: textile or design history, and experience of preservation surveys",
        ],
      },
    ],
  },
  {
    id: "v16",
    slug: "interim-head-of-finance-larkmead",
    title: "Interim Head of Finance",
    employerId: "larkmead",
    sector: "Education",
    contract: "Interim",
    pattern: "Hybrid",
    hours: { kind: "Full time" },
    pay: { kind: "daily", rate: 525 },
    place: "Larkmead, three days a week on site",
    posted: "2026-09-11",
    closes: "2026-10-16",
    reference: "LAT/INT/09",
    term: "6 months",
    interviews: "Two stages, both remote, week commencing 26 October.",
    summary:
      "Six-month interim covering the trust's central finance function through the ESFA return and a deficit recovery plan at two schools.",
    sections: [
      {
        heading: "About the role",
        body: [
          "The trust's finance director left in July and the recruitment for a permanent successor is under way. This post holds the function until they arrive, which means the annual accounts, the ESFA return, and a deficit recovery plan at two of the nine schools.",
          "We would rather have someone who has done this before than someone who is stretching into it, and we are paying accordingly.",
        ],
      },
      {
        heading: "What we are looking for",
        points: [
          "Qualified accountant with academy trust experience — the regime is specific and there is no time to learn it here",
          "Experience of a deficit recovery plan that was actually delivered",
          "Available to start in November",
        ],
      },
    ],
  },
  {
    id: "v17",
    slug: "health-improvement-practitioner-calderbrook",
    title: "Health Improvement Practitioner (Tobacco Dependency)",
    employerId: "calderbrook",
    sector: "Health",
    contract: "Fixed term",
    pattern: "Hybrid",
    hours: { kind: "Full time" },
    pay: { kind: "range", min: 29970, max: 36483, grade: "Band 5" },
    place: "Calderbrook, across all three hospital sites",
    posted: "2026-09-05",
    closes: "2026-09-29",
    reference: "CAL-3140-PH",
    term: "3 years",
    summary:
      "Deliver the trust's inpatient tobacco dependency service — bedside intervention, pharmacotherapy and follow-up, across three sites.",
    sections: [
      {
        heading: "About the role",
        body: [
          "Every admitted smoker should be offered treatment, and at present about 40% are. The service is funded to 2029 to close that gap.",
          "The work is mostly at the bedside, and the difficult part is not the pharmacology — it is having a useful conversation with someone who has just been admitted and did not ask for this one.",
        ],
      },
      {
        heading: "What we are looking for",
        points: [
          "NCSCT practitioner certification, or completion within three months of starting",
          "Experience of behaviour change work in a clinical or community setting",
          "Comfort working across ward teams who are busy and will not always prioritise you",
        ],
      },
    ],
  },
  {
    id: "v18",
    slug: "estates-officer-compliance-portway",
    title: "Estates Officer (Compliance)",
    employerId: "portway",
    sector: "Education",
    contract: "Permanent",
    pattern: "On site",
    hours: { kind: "Full time" },
    pay: { kind: "range", min: 31200, max: 34800 },
    place: "Portway",
    posted: "2026-08-14",
    closes: "2026-09-11",
    reference: "PSC/EST/26/1",
    summary:
      "Statutory compliance across the college estate — water hygiene, fire, asbestos, gas and electrical — on a site with buildings from 1972, 1998 and 2019.",
    sections: [
      {
        heading: "About the role",
        body: [
          "Responsibility for the college's statutory compliance regime and the records that prove it, working to the Director of Finance and Resources.",
        ],
      },
      {
        heading: "What we are looking for",
        points: [
          "Experience of statutory compliance in an education, healthcare or similar estate",
          "IOSH or NEBOSH certificate",
          "Enhanced DBS check, which the college pays for",
        ],
      },
    ],
  },
  {
    id: "v19",
    slug: "library-assistant-ashgrove",
    title: "Library Assistant (Evenings)",
    employerId: "ashgrove",
    sector: "Education",
    contract: "Permanent",
    pattern: "On site",
    hours: { kind: "Part time", hoursPerWeek: 14.8 },
    pay: { kind: "range", min: 23881, max: 24800, grade: "Grade 3" },
    place: "Ashgrove",
    posted: "2026-08-10",
    closes: "2026-09-14",
    reference: "AG/LIB/0877",
    summary:
      "Evening desk cover in the main library, 4pm to 8pm, four days a week during term.",
    sections: [
      {
        heading: "About the role",
        body: [
          "Desk enquiries, shelving, and closing the building. Full details are in the job pack.",
        ],
      },
    ],
  },
  {
    id: "v20",
    slug: "volunteer-coordinator-hollowell",
    title: "Volunteer Coordinator",
    employerId: "hollowell",
    sector: "Charity",
    contract: "Permanent",
    pattern: "Hybrid",
    hours: { kind: "Part time", hoursPerWeek: 22.2 },
    pay: { kind: "range", min: 29000, max: 31600 },
    place: "Hollowell",
    posted: "2026-08-03",
    closes: "2026-08-28",
    reference: "HH/VOL/26/1",
    summary:
      "Recruit, induct and support the hospice's 400 volunteers across the inpatient unit, the shops and the transport service.",
    sections: [
      {
        heading: "About the role",
        body: [
          "The hospice would not run without its volunteers and does not pretend otherwise. This post looks after all of them, from recruitment and DBS through to the parts nobody puts in a job description, like noticing when someone has stopped coming.",
        ],
      },
      {
        heading: "What we are looking for",
        points: [
          "Volunteer management experience, or strong transferable people experience",
          "Organised enough to run 400 people's records and rotas",
          "Desirable: experience in palliative care or a bereavement setting",
        ],
      },
    ],
  },
  {
    id: "v21",
    slug: "housing-options-adviser-wrenfield",
    title: "Housing Options Adviser",
    employerId: "wrenfield",
    sector: "Housing",
    contract: "Permanent",
    pattern: "On site",
    hours: { kind: "Full time" },
    pay: {
      kind: "unstated",
      note: "The employer has not given a figure. We have asked. Until they do, this listing sits at the bottom of the pay sort and is excluded from any salary filter, which we think is the honest place for it.",
    },
    place: "Wrenfield",
    posted: "2026-09-15",
    closes: "2026-10-05",
    reference: "WBC/2711",
    summary:
      "Front-line homelessness prevention — duty desk, personalised housing plans, and the statutory decisions that follow.",
    sections: [
      {
        heading: "About the role",
        body: [
          "Wrenfield takes around 2,400 homelessness approaches a year and prevents roughly half. This is the post that does that, on a duty rota, in a service that is honest about being under pressure.",
        ],
      },
      {
        heading: "What we are looking for",
        points: [
          "Working knowledge of Part 7 of the Housing Act 1996 as amended",
          "Experience of assessment and decision-making, or a strong advice background",
          "Resilience, in the specific sense of being able to do this on a Friday afternoon",
        ],
      },
    ],
  },
  {
    id: "v22",
    slug: "senior-ecologist-wold-and-water",
    title: "Senior Ecologist",
    employerId: "woldwater",
    sector: "Environment",
    contract: "Permanent",
    pattern: "Hybrid",
    hours: { kind: "Full time" },
    pay: { kind: "range", min: 41000, max: 46300 },
    place: "Halden, with fieldwork across the catchment",
    posted: "2026-09-13",
    closes: "2026-10-12",
    reference: "WWT/26/11",
    featured: true,
    interviews: "Single stage, 22 October, at the Halden office.",
    summary:
      "Lead the trust's ecological work — survey, restoration design and the technical case for barrier removal on three tributaries.",
    sections: [
      {
        heading: "About the role",
        body: [
          "The trust has restoration funding for three tributaries and a barrier removal programme that needs a technical lead who can hold their own with the regulator, the landowners and the anglers, sometimes in the same meeting.",
          "It is a senior post in a small organisation, which means real influence and no department to hide behind.",
        ],
      },
      {
        heading: "What you would be doing",
        points: [
          "Designing and overseeing restoration works on three tributaries",
          "The technical case for barrier removal, including the fish passage modelling",
          "Protected species survey programme and the licences that go with it",
          "Supervising two ecologists and a seasonal survey team",
          "Representing the trust in the catchment partnership",
        ],
      },
      {
        heading: "What we are looking for",
        points: [
          "CIEEM full membership or eligibility",
          "River restoration design experience, on the ground rather than on paper",
          "Protected species licences — water vole, otter or crayfish",
          "A driving licence and a tolerance for standing in rivers",
        ],
      },
      {
        heading: "How to apply",
        body: [
          "CV and a covering letter of no more than two pages, to the director. We read every one.",
        ],
      },
    ],
  },
];

export const vacancyBySlug = new Map(vacancies.map((v) => [v.slug, v]));
