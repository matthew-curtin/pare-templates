import type { Vacancy } from "./types";

/**
 * Twenty-two jobs, all invented, and tuned rather than sprinkled.
 *
 * The board has states that only exist if the data contains them, so
 * the data contains them on purpose and `scripts/check-listings.mjs`
 * asserts every one. In particular: exactly one closes today, exactly
 * one closes tomorrow, three have already closed, exactly two have no
 * salary on them, one is unpaid, one is on call and therefore has no
 * annual figure at all, one is a job share, and one employer has
 * nothing open.
 *
 * The descriptions are deliberately uneven in length. Real boards carry
 * a 700-word posting next to a two-line one that says "see the job
 * packet", and a design that only ever sees full ones has not been
 * tested.
 */
export const vacancies: Vacancy[] = [
  {
    id: "v01",
    slug: "director-of-housing-code-enforcement-wrenfield",
    title: "Director of Housing Code Enforcement",
    employerId: "wrenfield",
    sector: "Local government",
    contract: "Regular",
    pattern: "Hybrid",
    hours: { kind: "Full time" },
    pay: { kind: "range", min: 108000, max: 128000, grade: "Grade 27" },
    place: "Wrenfield, OH",
    posted: "2026-09-09",
    closes: "2026-10-02",
    reference: "WC-2691",
    featured: true,
    interviews: "Panel interviews October 20 and 21, in person.",
    summary:
      "Lead the county's rental inspection program — 14 inspectors, a registration ordinance covering 4,000 properties, and a commissioner commitment to double inspections by 2028.",
    sections: [
      {
        heading: "About the role",
        body: [
          "Wrenfield has one of the largest rental markets in the region and, until recently, one of the smallest teams looking at it. That has changed: the division has grown from six inspectors to fourteen in two years, a rental registration ordinance took effect in three townships in April, and the commissioners have funded an expansion in 2027.",
          "What it has not had is somebody to hold the whole thing together. You would be accountable for enforcement policy, the program's finances, the relationship with the prosecutor's office, and — the part most people underestimate — the relationship with landlords who are doing the right thing and resent being treated like the ones who are not.",
        ],
      },
      {
        heading: "What you would be responsible for",
        points: [
          "A team of fourteen across inspection, registration and a two-person hearings unit",
          "A program budget of $1.9M over five years, including its cost-recovery position",
          "Citations and civil penalty decisions up to $30,000, taken personally under delegated authority",
          "The county's reporting on housing conditions, and the board briefings that follow",
          "Extending the ordinance to four more townships, including the public comment period",
        ],
      },
      {
        heading: "What we are looking for",
        points: [
          "Substantial experience of housing code enforcement in a regulatory setting, including having taken cases to conclusion",
          "ICC property maintenance certification, or the ability to obtain it within a year",
          "Experience managing a team through a period of growth, which is a different job from managing a settled one",
          "A clear view on when enforcement is the right tool and when it is not",
          "Preferred: experience designing or expanding a rental registration program",
        ],
      },
      {
        heading: "How to apply",
        body: [
          "Apply through the county's job portal with a résumé and a cover letter of no more than two pages. We do not use supplemental questionnaires for positions at this level.",
          "Informal conversations are welcome and genuinely are informal — ask the switchboard for the Director of Community Development.",
        ],
      },
    ],
  },
  {
    id: "v02",
    slug: "interim-deputy-director-of-housing-development-fernbank",
    title:
      "Interim Deputy Director of Housing Development and Redevelopment (Parental Leave Coverage)",
    employerId: "fernbank",
    sector: "Housing",
    contract: "Interim",
    pattern: "Hybrid",
    hours: { kind: "Full time" },
    pay: { kind: "daily", rate: 720 },
    place: "Fernbank, IL — two days a week on site",
    posted: "2026-08-24",
    closes: "2026-09-16",
    reference: "FHA-INT-114",
    term: "12 months",
    summary:
      "Coverage for a 12-month leave, holding a development pipeline of 340 units across four sites and a weatherization program that is behind schedule.",
    sections: [
      {
        heading: "About the role",
        body: [
          "This is a genuine interim, not a permanent position with a temporary label. The incumbent returns in October 2027 and you would be handing a program back, so the brief is to keep it moving and leave it legible rather than to reinvent it.",
          "Two things are difficult and we would rather say so now. The Marsh Lane site has a general contractor in difficulty. And the weatherization program is roughly nine months behind the schedule in the board packet, for reasons that are mostly not the team's fault but are now the team's problem.",
        ],
      },
      {
        heading: "What you would be responsible for",
        points: [
          "Four live development sites totaling 340 units, two of them under construction",
          "The weatherization program and its reporting to HUD",
          "A division of 38 people across development, asset management and compliance",
          "Board and committee reporting, including one difficult item in November",
        ],
      },
      {
        heading: "What we are looking for",
        points: [
          "Development or redevelopment leadership at a housing authority or a city department",
          "Experience taking over a program mid-flight, which is a specific skill",
          "Comfort with a contractor insolvency conversation",
          "Availability to start within four weeks of offer",
        ],
      },
      {
        heading: "How to apply",
        body: [
          "Send a résumé and a short note — half a page is plenty — through the portal. We will screen within two business days of closing because the timeline is tight.",
        ],
      },
    ],
  },
  {
    id: "v03",
    slug: "watershed-monitoring-specialist",
    title: "Watershed Monitoring Specialist",
    employerId: "woldwater",
    sector: "Environment",
    contract: "Term",
    pattern: "On site",
    hours: { kind: "Full time" },
    pay: { kind: "range", min: 54000, max: 61000 },
    place: "the Wold River watershed, WI",
    posted: "2026-08-27",
    closes: "2026-09-17",
    reference: "WWA-26-09",
    term: "2 years, with a strong intention to extend",
    interviews: "One round, in the field, September 25. Bring boots.",
    summary:
      "Run the alliance's water quality monitoring across 46 sample points and the volunteer network that collects most of it. Two-year position, funded through 2028.",
    sections: [
      {
        heading: "About the role",
        body: [
          "The alliance has eleven years of monthly phosphorus and nitrate data for this basin, which is unusual for an organization this size and is the reason it gets listened to. Most of that data is collected by about 300 volunteers, and the specialist who has held this position since 2019 is moving to a university research group.",
          "The job is roughly half field and analysis, half people. The analysis matters, but the network is the asset — if the volunteers stop, the dataset stops, and eleven years becomes a historical curiosity.",
        ],
      },
      {
        heading: "What you would be doing",
        points: [
          "Maintaining the sampling program across 46 fixed points and around 20 event-based ones",
          "Quality assurance on volunteer returns, and the awkward conversations that sometimes follow",
          "Training and equipping new volunteers, roughly 60 a year",
          "Writing the annual watershed report and presenting it to the partnership",
          "Supporting the alliance's comments on permits and consultations",
        ],
      },
      {
        heading: "What we are looking for",
        points: [
          "A degree in environmental science, ecology, geography or similar, or equivalent practical experience",
          "Confident with spreadsheets and at least one of R, Python or equivalent",
          "A valid driver's license — the basin is 40 miles end to end and there is no transit",
          "Preferred: experience working with volunteers, and a current first aid certificate",
        ],
      },
      {
        heading: "How to apply",
        body: [
          "Application form on the alliance's site. We do not accept résumés alone, because the form is scored blind and a résumé cannot be.",
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
    contract: "Term",
    pattern: "On site",
    hours: { kind: "Part time", hoursPerWeek: 24 },
    pay: { kind: "range", min: 52000, max: 57000 },
    place: "Halden, MA",
    posted: "2026-09-02",
    closes: "2026-09-18",
    reference: "HMM-2026-17",
    term: "18 months",
    summary:
      "Retrospective documentation of roughly 9,000 objects, most of them currently described on index cards typed between 1971 and 1994.",
    sections: [
      {
        heading: "About the role",
        body: [
          "The museum's catalogue is in three places: a modern collections management system, a card index, and — for about 900 objects — a series of ledgers in a hand that takes practice to read. This position exists to reduce that to one place.",
          "It is careful, repetitive, quietly satisfying work, and it is the kind of position people take at the start of a museum career. We will say plainly that it is 18 months and we cannot promise what follows, but everyone who has held it has moved on to something better.",
        ],
      },
      {
        heading: "What you would be doing",
        points: [
          "Transcribing and enhancing records for around 9,000 objects, working to Nomenclature 4.0",
          "Photographing objects to the museum's documentation standard, not exhibition standard",
          "Reconciling location data against an inventory that found 4% of objects are not where the system says",
          "Flagging objects with unclear title or provenance to the Collections Manager",
        ],
      },
      {
        heading: "What we are looking for",
        points: [
          "Accuracy, and the temperament for detailed work over a long period",
          "Familiarity with a collections management system, or the obvious aptitude to learn one",
          "Preferred: a museum studies qualification, or experience handling nineteenth-century industrial material",
        ],
      },
      {
        heading: "How to apply",
        body: [
          "Application and voluntary EEO form through the museum's site. This position is 24 hours a week, and our posting quotes the full-time range as museums generally do.",
        ],
      },
    ],
  },
  {
    id: "v05",
    slug: "registered-nurse-acute-medical-unit-calderbrook",
    title: "Registered Nurse, Acute Medical Unit",
    employerId: "calderbrook",
    sector: "Health",
    contract: "Regular",
    pattern: "On site",
    hours: { kind: "Full time" },
    pay: { kind: "range", min: 78000, max: 96000, grade: "RN II" },
    place: "Calderbrook Regional Medical Center, PA",
    posted: "2026-09-07",
    closes: "2026-09-21",
    reference: "CAL-3117-AMU",
    interviews: "Rolling. We interview within a week of application.",
    summary:
      "A 32-bed acute medical unit taking direct admissions and ED transfers. Full rotation including nights. RN II with a charge nurse development track.",
    sections: [
      {
        heading: "About the unit",
        body: [
          "The AMU takes around 60 admissions a day and aims to discharge or move on 40% of them within 24 hours, which makes it fast, varied and — the honest word — relentless. It is a good unit to consolidate in and a hard one to be new in without support, so we run a six-week orientation rather than the two weeks the policy requires.",
        ],
      },
      {
        heading: "What we are looking for",
        points: [
          "Current RN license in the state, or a compact license and an application in progress",
          "Post-licensure acute experience, or a recent clinical rotation on a medical floor",
          "Willingness to work a full rotation, including nights and weekends",
          "Preferred: ACLS, or willingness to complete it within 90 days",
        ],
      },
      {
        heading: "What we offer",
        points: [
          "Six weeks of orientation, not two",
          "Funded charge nurse development track with a named preceptor",
          "403(b) with match, and the usual health system benefits",
        ],
      },
      {
        heading: "How to apply",
        body: [
          "Through the careers site, quoting the job number. Applications are reviewed as they arrive, so the posting may close early if filled.",
        ],
      },
    ],
  },
  {
    id: "v06",
    slug: "data-analyst-aging-services-wrenfield",
    title: "Data Analyst, Aging Services",
    employerId: "wrenfield",
    sector: "Local government",
    contract: "Regular",
    pattern: "Hybrid",
    hours: { kind: "Job share", hoursPerWeek: 20 },
    pay: { kind: "range", min: 84000, max: 92000, grade: "Grade 19" },
    place: "Wrenfield, OH — two days in the office",
    posted: "2026-09-01",
    closes: "2026-09-22",
    reference: "WC-2704",
    summary:
      "Half of a job share supporting the aging services division — state and federal reporting, waitlist analysis, and the numbers that go in front of the commissioners.",
    sections: [
      {
        heading: "About the role",
        body: [
          "This is one half of an existing job share. Your counterpart works Wednesday through Friday and has been in the position for six years; the arrangement works well and both parties would like to keep it that way, so we are hiring for Monday, Tuesday and Wednesday morning rather than for a full-time position we would then split.",
          "The work is a mix of the mandatory — state reporting with immovable deadlines — and the useful, which is mostly helping program managers understand their own waitlists.",
        ],
      },
      {
        heading: "What we are looking for",
        points: [
          "SQL to the level of writing and debugging your own joins, not just running saved queries",
          "One of Power BI, Tableau or equivalent",
          "The judgment to say when a number is too weak to put in front of a board",
          "Preferred: aging or human services data, or another mandated reporting regime",
        ],
      },
      {
        heading: "How to apply",
        body: [
          "County application. This position is 20 hours a week and our posting quotes the full-time range, as county postings always do.",
        ],
      },
    ],
  },
  {
    id: "v07",
    slug: "assistant-professor-environmental-science-ashgrove",
    title: "Assistant Professor of Environmental Science",
    employerId: "ashgrove",
    sector: "Education",
    contract: "Regular",
    pattern: "On site",
    hours: { kind: "Full time" },
    pay: { kind: "range", min: 82000, max: 98000, grade: "Tenure track" },
    place: "Ashgrove, MI",
    posted: "2026-08-19",
    closes: "2026-09-23",
    reference: "AG-ENV-0912",
    interviews: "Campus visits the week of October 12, including a teaching demonstration.",
    summary:
      "Teaching and research in freshwater or soil systems, with a substantial share of the department's field instruction. Tenure track.",
    sections: [
      {
        heading: "About the department",
        body: [
          "Environmental Science at Ashgrove is 31 faculty and around 400 students, with long-running field sites in the Wold basin and on the western moraine. The department is deliberately field-heavy at a time when others are cutting residential instruction, and that is not going to change.",
        ],
      },
      {
        heading: "What we are looking for",
        points: [
          "A PhD in a relevant discipline and a developing publication record",
          "Capacity to lead residential field courses, including the logistics and the risk assessments",
          "A research direction that complements freshwater or soil systems rather than duplicating them",
          "Preferred: evidence of teaching development, or willingness to work toward it",
        ],
      },
      {
        heading: "How to apply",
        body: [
          "Through the university's system: CV, publication list, a two-page research statement and a one-page teaching statement.",
        ],
      },
    ],
  },
  {
    id: "v08",
    slug: "weatherization-coordinator-fernbank",
    title: "Weatherization Coordinator",
    employerId: "fernbank",
    sector: "Housing",
    contract: "Regular",
    pattern: "Hybrid",
    hours: { kind: "Full time" },
    pay: { kind: "exact", amount: 89000 },
    place: "Fernbank, IL and across the region",
    posted: "2026-09-14",
    closes: "2026-09-25",
    reference: "FHA-2026-88",
    summary:
      "Coordinate weatherization across a program of about 400 units a year, most of them masonry, most of them occupied throughout the work.",
    sections: [
      {
        heading: "About the role",
        body: [
          "Fernbank has committed to bringing 11,000 units up to standard by 2030 and is roughly on track, which is a better position than it sounds because the easy third is done and what is left is solid masonry, mixed-tenure buildings and a lot of landmarked frontages.",
          "You would be the coordinator on that program: assessments, scopes of work, the risk of unintended consequences, and the sign-off. It is a technical position with a lot of resident contact, because these homes are occupied while the work happens.",
        ],
      },
      {
        heading: "What we are looking for",
        points: [
          "BPI Building Analyst certification and demonstrable program experience",
          "Weatherization experience on occupied buildings, particularly solid masonry",
          "A clear approach to moisture risk that you can explain to a resident, not just to an auditor",
          "Valid driver's license",
        ],
      },
      {
        heading: "How to apply",
        body: [
          "Résumé and cover note through the portal. This is a single salary point rather than a range, so there is nothing to negotiate and we would rather say so.",
        ],
      },
    ],
  },
  {
    id: "v09",
    slug: "board-member-finance-kestrel",
    title: "Board Member (Finance)",
    employerId: "kestrel",
    sector: "Nonprofit",
    contract: "Volunteer",
    pattern: "Hybrid",
    hours: { kind: "Part time", hoursPerWeek: 4 },
    pay: {
      kind: "voluntary",
      note: "Unpaid, as board seats are. Travel, childcare and care costs are reimbursed in full, and we mean it — the last board lost two people because it did not.",
    },
    place: "Trentmoor, MN — four board meetings a year",
    posted: "2026-09-15",
    closes: "2026-10-09",
    reference: "KC-BOARD-03",
    summary:
      "A board member with a finance background to chair the finance and risk committee. Four board meetings and four committee meetings a year, roughly a day a month all told.",
    sections: [
      {
        heading: "About the board",
        body: [
          "Nine members, of whom three were young caregivers themselves, which the board considers the most important thing about it. The current finance chair steps down in March after six years and has offered to hand over properly rather than on the day.",
          "The organization's revenue is $2.1M, about 60% from a county contract that is up for renewal in 2028. Understanding what that means is most of the job.",
        ],
      },
      {
        heading: "What we are looking for",
        points: [
          "A CPA, or equivalent senior finance experience",
          "The confidence to disagree with an executive team you like",
          "Around a day a month, including reading time, which people consistently underestimate",
          "We particularly welcome applications from people with direct experience of caregiving",
        ],
      },
      {
        heading: "How to apply",
        body: [
          "A résumé and a short letter to the chair. Informal conversations first are encouraged.",
        ],
      },
    ],
  },
  {
    id: "v10",
    slug: "woodland-crew-lead-coppice",
    title: "Woodland Crew Lead",
    employerId: "coppice",
    sector: "Environment",
    contract: "Regular",
    pattern: "On site",
    hours: { kind: "Full time" },
    pay: { kind: "range", min: 51000, max: 58000 },
    place: "Halden, MA and the western hills",
    posted: "2026-08-31",
    closes: "2026-09-28",
    reference: "CLT-R-2026-4",
    summary:
      "Practical management of about 1,500 acres of the trust's woodland, including the working woodlot, plus supervision of seasonal crew and volunteer parties.",
    sections: [
      {
        heading: "About the role",
        body: [
          "Chainsaw work, rotation cutting, deer management, trail maintenance, and roughly one day a week supervising seasonal crew or volunteer groups. The trust runs a genuine working woodlot on a fifteen-year cycle and sells the product, so the standard is commercial rather than demonstrative.",
        ],
      },
      {
        heading: "What we are looking for",
        points: [
          "Game of Logging Level 3 or S-212 chainsaw certification, or willingness to gain it within six months",
          "Practical woodland management experience",
          "Comfortable leading volunteer groups of mixed ability",
          "Hunter safety certification preferred; we will fund it otherwise",
        ],
      },
      {
        heading: "How to apply",
        body: ["Application on the trust's site. Interviews are practical."],
      },
    ],
  },
  {
    id: "v11",
    slug: "visitor-assistant-on-call-halden",
    title: "Visitor Assistant (On Call)",
    employerId: "halden",
    sector: "Culture & heritage",
    contract: "On call",
    pattern: "On site",
    hours: {
      kind: "Casual",
      note: "Weekends and school vacations, as needed. Shifts are offered a month ahead and you are free to decline them.",
    },
    pay: { kind: "hourly", rate: 21.5 },
    place: "Halden, MA",
    posted: "2026-09-04",
    closes: "2026-10-05",
    reference: "HMM-2026-21",
    summary:
      "Front of house on the museum's busiest days — welcome desk, galleries, and the demonstration floor when the looms are running.",
    sections: [
      {
        heading: "About the role",
        body: [
          "An on-call position with no guaranteed hours. We are saying that plainly rather than in the fine print, because a job board that lets it hide is not much use to anyone.",
          "In practice most of the team work two weekend days a month and more in the vacations. Shifts go out a month ahead.",
        ],
      },
      {
        heading: "What we are looking for",
        points: [
          "Warmth with the public, including on a wet Sunday in February",
          "Weekend availability",
          "No museum experience needed — training is provided, including on the looms",
        ],
      },
    ],
  },
  {
    id: "v12",
    slug: "content-designer-trentmoor",
    title: "Content Designer",
    employerId: "trentmoor",
    sector: "Local government",
    contract: "Term",
    pattern: "Remote",
    hours: { kind: "Full time" },
    pay: { kind: "range", min: 68000, max: 76000 },
    place: "Remote, with one day a month in Trentmoor, MN",
    posted: "2026-09-08",
    closes: "2026-09-30",
    reference: "TRC-COM-26-12",
    term: "12 months",
    summary:
      "Rewrite the council's public-facing content for the regional transit launch. Fully remote, one day a month in person.",
    sections: [
      {
        heading: "About the role",
        body: [
          "The council takes on regional transit coordination in 2027 and its website currently explains it in language borrowed from the enabling statute. This position exists to fix that before a million people need to use it.",
          "It is a genuinely remote position — the team is spread across four counties already — with one day a month together, which is not optional because it is the only day everyone is in the room.",
        ],
      },
      {
        heading: "What we are looking for",
        points: [
          "Content design experience, ideally in government or another regulated setting",
          "Evidence you have written for people who did not want to read it",
          "Comfort with user research findings that contradict the brief",
          "Preferred: experience of a service assessment",
        ],
      },
    ],
  },
  {
    id: "v13",
    slug: "community-giving-manager-hollowell",
    title: "Community Giving Manager",
    employerId: "hollowell",
    sector: "Nonprofit",
    contract: "Regular",
    pattern: "Hybrid",
    hours: { kind: "Full time" },
    pay: { kind: "range", min: 72000, max: 81000 },
    place: "Hollowell, NC",
    posted: "2026-09-10",
    closes: "2026-10-07",
    reference: "HH-DEV-26-2",
    summary:
      "Lead community and events fundraising — about $1.4M a year, four staff, and a network of volunteer committees that have been running some of these events since the 1980s.",
    sections: [
      {
        heading: "About the role",
        body: [
          "Roughly a third of what it costs to run this hospice is raised locally rather than reimbursed, and about a third of that comes through this team. That makes it a serious job with a real number attached, and it also makes it a job about relationships with people who have been doing this a long time and have views.",
        ],
      },
      {
        heading: "What we are looking for",
        points: [
          "Community or events fundraising experience with accountability for a goal",
          "Supervision, including of volunteers who are not supervised in any normal sense",
          "A driver's license and a tolerance for evening and weekend events",
          "Preferred: experience in hospice or another health nonprofit",
        ],
      },
      {
        heading: "How to apply",
        body: [
          "Application and cover letter. We are happy to talk before you apply.",
        ],
      },
    ],
  },
  {
    id: "v14",
    slug: "paraprofessional-special-education-larkmead",
    title: "Paraprofessional (Special Education)",
    employerId: "larkmead",
    sector: "Education",
    contract: "Regular",
    pattern: "On site",
    hours: { kind: "Part time", hoursPerWeek: 30 },
    pay: { kind: "range", min: 44000, max: 47500, grade: "Step 4" },
    place: "Larkmead, MN",
    posted: "2026-09-03",
    closes: "2026-10-12",
    reference: "LPS-PARA-117",
    summary:
      "One-to-one support in a mainstream elementary school for two students with IEPs, 30 hours a week.",
    sections: [
      {
        heading: "About the role",
        body: [
          "Supporting two students in third and fifth grade, both with individualized education programs, in a two-track elementary school with a strong inclusion record and an honest recognition that it is under strain.",
        ],
      },
      {
        heading: "What we are looking for",
        points: [
          "Experience supporting children with additional needs, in a school or otherwise",
          "An associate degree or a passing ParaPro score, or willingness to work toward one",
          "Patience, and the ability to keep a plan going when the day has not gone to plan",
        ],
      },
      {
        heading: "How to apply",
        body: [
          "District application. This position is 30 hours a week and paid prorated, so the figure at the top of this page is what it actually pays.",
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
    contract: "Term",
    pattern: "On site",
    hours: { kind: "Part time", hoursPerWeek: 16 },
    pay: {
      kind: "unstated",
      note: "The employer has not given a figure. This posting predates our salary policy; we have asked them to add one and will update it when they do.",
    },
    place: "Halden, MA",
    posted: "2026-08-12",
    closes: "2026-10-14",
    reference: "HMM-2026-09",
    term: "2 years",
    summary:
      "Catalogue and rehouse an archive of about 1,200 worsted pattern books, 1840 to 1961, ahead of digitization.",
    sections: [
      {
        heading: "About the role",
        body: [
          "The pattern books are the most requested part of the museum's archive and the least accessible: uncatalogued, stored in three locations, and physically fragile in a way that means every consultation is a small negotiation.",
          "This position catalogues them to DACS, rehouses them, and prepares a digitization specification. A grant application for the digitization itself goes in next fall, and the quality of this work is most of what it will stand on.",
        ],
      },
      {
        heading: "What we are looking for",
        points: [
          "An MLIS with an archives concentration, or substantial equivalent experience",
          "Cataloguing to DACS",
          "Preferred: textile or design history, and experience of preservation surveys",
        ],
      },
    ],
  },
  {
    id: "v16",
    slug: "interim-director-of-finance-larkmead",
    title: "Interim Director of Finance",
    employerId: "larkmead",
    sector: "Education",
    contract: "Interim",
    pattern: "Hybrid",
    hours: { kind: "Full time" },
    pay: { kind: "daily", rate: 820 },
    place: "Larkmead, MN — three days a week on site",
    posted: "2026-09-11",
    closes: "2026-10-16",
    reference: "LPS-INT-09",
    term: "6 months",
    interviews: "Two rounds, both remote, the week of October 26.",
    summary:
      "Six-month interim covering the district's business office through the annual audit and a deficit recovery plan at two schools.",
    sections: [
      {
        heading: "About the role",
        body: [
          "The district's finance director left in July and the search for a permanent successor is under way. This position holds the function until they arrive, which means the annual audit, state reporting, and a deficit recovery plan at two of the nine schools.",
          "We would rather have someone who has done this before than someone who is stretching into it, and we are paying accordingly.",
        ],
      },
      {
        heading: "What we are looking for",
        points: [
          "CPA with school district experience — the regime is specific and there is no time to learn it here",
          "Experience of a deficit recovery plan that was actually delivered",
          "Available to start in November",
        ],
      },
    ],
  },
  {
    id: "v17",
    slug: "tobacco-treatment-specialist-calderbrook",
    title: "Tobacco Treatment Specialist",
    employerId: "calderbrook",
    sector: "Health",
    contract: "Term",
    pattern: "Hybrid",
    hours: { kind: "Full time" },
    pay: { kind: "range", min: 62000, max: 74000 },
    place: "Calderbrook, PA — across all three sites",
    posted: "2026-09-05",
    closes: "2026-09-29",
    reference: "CAL-3140-PH",
    term: "3 years",
    summary:
      "Deliver the system's inpatient tobacco treatment service — bedside intervention, pharmacotherapy and follow-up, across three sites.",
    sections: [
      {
        heading: "About the role",
        body: [
          "Every admitted smoker should be offered treatment, and at present about 40% are. The service is funded through 2029 to close that gap.",
          "The work is mostly at the bedside, and the difficult part is not the pharmacology — it is having a useful conversation with someone who has just been admitted and did not ask for this one.",
        ],
      },
      {
        heading: "What we are looking for",
        points: [
          "CTTS certification, or completion within three months of starting",
          "Experience of behavior change work in a clinical or community setting",
          "Comfort working across floor teams who are busy and will not always prioritize you",
        ],
      },
    ],
  },
  {
    id: "v18",
    slug: "facilities-compliance-officer-portway",
    title: "Facilities Compliance Officer",
    employerId: "portway",
    sector: "Education",
    contract: "Regular",
    pattern: "On site",
    hours: { kind: "Full time" },
    pay: { kind: "range", min: 58000, max: 66000 },
    place: "Portway, NC",
    posted: "2026-08-14",
    closes: "2026-09-11",
    reference: "PCC-FAC-26-1",
    summary:
      "Regulatory compliance across the college campus — water systems, fire, asbestos, gas and electrical — on a site with buildings from 1972, 1998 and 2019.",
    sections: [
      {
        heading: "About the role",
        body: [
          "Responsibility for the college's compliance regime and the records that prove it, reporting to the Vice President for Finance and Administration.",
        ],
      },
      {
        heading: "What we are looking for",
        points: [
          "Experience of regulatory compliance in an education, healthcare or similar campus",
          "OSHA 30 or equivalent safety certification",
          "Background check, which the college pays for",
        ],
      },
    ],
  },
  {
    id: "v19",
    slug: "library-assistant-evenings-ashgrove",
    title: "Library Assistant (Evenings)",
    employerId: "ashgrove",
    sector: "Education",
    contract: "Regular",
    pattern: "On site",
    hours: { kind: "Part time", hoursPerWeek: 16 },
    pay: { kind: "range", min: 42000, max: 45000, grade: "Grade 6" },
    place: "Ashgrove, MI",
    posted: "2026-08-10",
    closes: "2026-09-14",
    reference: "AG-LIB-0877",
    summary:
      "Evening desk coverage in the main library, 4pm to 8pm, four days a week during the semester.",
    sections: [
      {
        heading: "About the role",
        body: [
          "Desk questions, shelving, and closing the building. Full details are in the job packet.",
        ],
      },
    ],
  },
  {
    id: "v20",
    slug: "volunteer-coordinator-hollowell",
    title: "Volunteer Coordinator",
    employerId: "hollowell",
    sector: "Nonprofit",
    contract: "Regular",
    pattern: "Hybrid",
    hours: { kind: "Part time", hoursPerWeek: 24 },
    pay: { kind: "range", min: 55000, max: 60000 },
    place: "Hollowell, NC",
    posted: "2026-08-03",
    closes: "2026-08-28",
    reference: "HH-VOL-26-1",
    summary:
      "Recruit, onboard and support the hospice's 400 volunteers across the inpatient unit, the thrift stores and the transportation program.",
    sections: [
      {
        heading: "About the role",
        body: [
          "The hospice would not run without its volunteers and does not pretend otherwise. This position looks after all of them, from recruitment and background checks through to the parts nobody puts in a job description, like noticing when someone has stopped coming.",
        ],
      },
      {
        heading: "What we are looking for",
        points: [
          "Volunteer management experience, or strong transferable people experience",
          "Organized enough to run 400 people's records and schedules",
          "Preferred: experience in palliative care or a bereavement setting",
        ],
      },
    ],
  },
  {
    id: "v21",
    slug: "housing-options-specialist-wrenfield",
    title: "Housing Options Specialist",
    employerId: "wrenfield",
    sector: "Housing",
    contract: "Regular",
    pattern: "On site",
    hours: { kind: "Full time" },
    pay: {
      kind: "unstated",
      note: "The employer has not given a figure. We have asked. Until they do, this posting sits at the bottom of the pay sort and is excluded from any salary filter, which we think is the honest place for it.",
    },
    place: "Wrenfield, OH",
    posted: "2026-09-15",
    closes: "2026-10-05",
    reference: "WC-2711",
    summary:
      "Front-line homelessness prevention — intake desk, housing stability plans, and the eligibility decisions that follow.",
    sections: [
      {
        heading: "About the role",
        body: [
          "Wrenfield takes around 2,400 requests for housing assistance a year and prevents homelessness in roughly half. This is the position that does that, on a rotating intake schedule, in a program that is honest about being under pressure.",
        ],
      },
      {
        heading: "What we are looking for",
        points: [
          "Working knowledge of HUD homelessness assistance rules and continuum-of-care practice",
          "Experience of assessment and decision-making, or a strong advocacy background",
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
    contract: "Regular",
    pattern: "Hybrid",
    hours: { kind: "Full time" },
    pay: { kind: "range", min: 79000, max: 92000 },
    place: "the Wold River watershed, WI",
    posted: "2026-09-13",
    closes: "2026-10-12",
    reference: "WWA-26-11",
    featured: true,
    interviews: "Single round, October 22, at the watershed office.",
    summary:
      "Lead the alliance's ecological work — survey, restoration design and the technical case for dam removal on three tributaries.",
    sections: [
      {
        heading: "About the role",
        body: [
          "The alliance has restoration funding for three tributaries and a dam removal program that needs a technical lead who can hold their own with the state agency, the landowners and the anglers, sometimes in the same meeting.",
          "It is a senior position in a small organization, which means real influence and no department to hide behind.",
        ],
      },
      {
        heading: "What you would be doing",
        points: [
          "Designing and overseeing restoration works on three tributaries",
          "The technical case for dam removal, including the fish passage modeling",
          "Protected species survey program and the permits that go with it",
          "Supervising two ecologists and a seasonal survey crew",
          "Representing the alliance in the watershed partnership",
        ],
      },
      {
        heading: "What we are looking for",
        points: [
          "Certified Ecologist standing with the Ecological Society of America, or eligibility",
          "Stream restoration design experience, on the ground rather than on paper",
          "Federal or state permitting experience for protected species",
          "A driver's license and a tolerance for standing in rivers",
        ],
      },
      {
        heading: "How to apply",
        body: [
          "Résumé and a cover letter of no more than two pages, to the director. We read every one.",
        ],
      },
    ],
  },
];

export const vacancyBySlug = new Map(vacancies.map((v) => [v.slug, v]));
