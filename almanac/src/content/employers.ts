import type { Employer } from "./types";

/**
 * Twelve organisations, all invented.
 *
 * One of them — Portway Sixth Form College — has nothing open. That is
 * deliberate: an employer page with no current vacancies is a state the
 * design has to have an answer for, and if every employer is hiring
 * nobody ever sees it.
 */
export const employers: Employer[] = [
  {
    id: "wrenfield",
    slug: "wrenfield-borough-council",
    name: "Wrenfield Borough Council",
    kind: "Council",
    place: "Wrenfield",
    about:
      "A unitary authority of about 190,000 people on the edge of the Pennines, running everything from bin collections to adult social care. The council moved to a four-day office week in 2024 and kept it. Most teams work two days from the civic offices on Marker Street and the rest wherever suits.",
    staff: "3,400 staff",
    founded: 1974,
    site: "wrenfield.gov.example",
  },
  {
    id: "calderbrook",
    slug: "calderbrook-nhs-foundation-trust",
    name: "Calderbrook NHS Foundation Trust",
    kind: "NHS trust",
    place: "Calderbrook",
    about:
      "An acute trust running one district general hospital, two community hospitals and a network of clinics across the valley. Around 4,000 staff and roughly 400,000 patient contacts a year. Pay follows Agenda for Change bands, which is why the salary ranges here look like they were set by a committee: they were.",
    staff: "4,100 staff",
    founded: 1948,
    site: "calderbrook.nhs.example",
  },
  {
    id: "ashgrove",
    slug: "university-of-ashgrove",
    name: "University of Ashgrove",
    kind: "University",
    place: "Ashgrove",
    about:
      "A mid-sized civic university with particular strength in environmental science, public health and archaeology. Eighteen thousand students, a library that keeps a working bindery, and a campus that is mostly Edwardian brick with some regrettable additions from the 1960s.",
    staff: "2,600 staff",
    founded: 1907,
    site: "ashgrove.ac.example",
  },
  {
    id: "halden",
    slug: "halden-museum-of-making",
    name: "Halden Museum of Making",
    kind: "Museum",
    place: "Halden",
    about:
      "A museum of industry and craft in a former worsted mill, holding around 90,000 objects and a substantial archive of pattern books. Free to enter, funded by a mix of endowment, trading and grant. The collection is still catalogued partly on index cards, which is one of the jobs below.",
    staff: "80 staff, 140 volunteers",
    founded: 1969,
    site: "haldenmuseum.example",
  },
  {
    id: "fernbank",
    slug: "fernbank-housing-association",
    name: "Fernbank Housing Association",
    kind: "Housing association",
    place: "Fernbank and the North West",
    about:
      "A registered provider with 11,000 homes, about a third of them built before 1945. Fernbank has spent the last four years retrofitting its worst-performing stock and has committed to EPC C across the portfolio by 2030, which shapes most of what it recruits for.",
    staff: "620 staff",
    founded: 1978,
    site: "fernbankhousing.example",
  },
  {
    id: "woldwater",
    slug: "wold-and-water-trust",
    name: "Wold & Water Trust",
    kind: "Charity",
    place: "The Wold catchment",
    about:
      "A rivers trust working across a single catchment: water quality monitoring, riparian planting, barrier removal and a volunteer network of about 300 people who take monthly samples. Small, technical and unusually well organised for its size.",
    staff: "34 staff",
    founded: 1996,
    site: "woldandwater.example",
  },
  {
    id: "kestrel",
    slug: "kestrel-trust",
    name: "Kestrel Trust for Young Carers",
    kind: "Charity",
    place: "Trentmoor",
    about:
      "Support for people under 18 who look after a family member — respite activity, advocacy in schools, and a helpline staffed until nine in the evening. Around 900 young carers on the books at any time, in a county that has identified perhaps a third of the ones it has.",
    staff: "48 staff",
    founded: 2003,
    site: "kestreltrust.example",
  },
  {
    id: "larkmead",
    slug: "larkmead-academy-trust",
    name: "Larkmead Academy Trust",
    kind: "Academy trust",
    place: "Larkmead and Trentmoor",
    about:
      "Nine schools — six primary, two secondary and a special school — sharing a central team for finance, estates, HR and data. The trust runs its own school improvement function rather than buying one in, and is candid that two of its schools are in difficulty.",
    staff: "1,150 staff",
    founded: 2012,
    site: "larkmeadtrust.example",
  },
  {
    id: "coppice",
    slug: "coppice-land-trust",
    name: "The Coppice Land Trust",
    kind: "Charity",
    place: "Halden and the western hills",
    about:
      "Owns and manages 2,800 hectares of woodland, moor and rough grazing, most of it acquired in the 1990s. Runs a working coppice on a fifteen-year rotation, sells charcoal and hurdles at a small profit, and takes on roughly 40 trainees a year.",
    staff: "56 staff",
    founded: 1991,
    site: "coppicelandtrust.example",
  },
  {
    id: "trentmoor",
    slug: "trentmoor-combined-authority",
    name: "Trentmoor Combined Authority",
    kind: "Combined authority",
    place: "Trentmoor",
    about:
      "A strategic authority covering four councils and 1.2 million people, holding devolved budgets for transport, adult education and housing investment. Small central team, large budgets, and the usual difficulty of being accountable for outcomes it does not directly control.",
    staff: "310 staff",
    founded: 2018,
    site: "trentmoor-ca.gov.example",
  },
  {
    id: "hollowell",
    slug: "hollowell-hospice",
    name: "Hollowell Hospice",
    kind: "Charity",
    place: "Hollowell",
    about:
      "Sixteen inpatient beds, a day service and a community team covering 200 square miles. About 70% of the running cost is raised locally, which means the fundraising team is not a nice-to-have and is treated accordingly.",
    staff: "210 staff, 400 volunteers",
    founded: 1984,
    site: "hollowellhospice.example",
  },
  {
    id: "portway",
    slug: "portway-sixth-form-college",
    name: "Portway Sixth Form College",
    kind: "College",
    place: "Portway",
    about:
      "A standalone sixth form of 1,400 students, most of them from the four secondary schools in the town. Strong in maths and the sciences, and rebuilding a music department that nearly closed in 2019.",
    staff: "180 staff",
    founded: 1972,
    site: "portwaysixth.ac.example",
  },
];

export const employerById = new Map(employers.map((e) => [e.id, e]));
