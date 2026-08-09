import type { Employer } from "./types";

/**
 * Twelve organizations, all invented.
 *
 * One of them — Portway Community College — has nothing open. That is
 * deliberate: an employer page with no current openings is a state the
 * design has to have an answer for, and if every employer is hiring
 * nobody ever sees it.
 */
export const employers: Employer[] = [
  {
    id: "wrenfield",
    slug: "wrenfield-county",
    name: "Wrenfield County",
    kind: "County government",
    place: "Wrenfield, OH",
    about:
      "A county of about 190,000 people on the western edge of the Alleghenies, running everything from solid waste to adult protective services. The county moved most office staff to two days on site in 2024 and kept it. Board meetings are the first and third Tuesday, and they are long.",
    staff: "3,400 employees",
    founded: 1808,
    site: "wrenfieldcounty.gov.example",
  },
  {
    id: "calderbrook",
    slug: "calderbrook-health",
    name: "Calderbrook Health",
    kind: "Health system",
    place: "Calderbrook, PA",
    about:
      "A nonprofit health system running one regional medical center, two critical access hospitals and a network of clinics across the valley. Around 4,000 staff and roughly 400,000 patient encounters a year. Pay bands are set by a compensation committee, which is why the ranges here look like they were set by a committee: they were.",
    staff: "4,100 employees",
    founded: 1921,
    site: "calderbrookhealth.example",
  },
  {
    id: "ashgrove",
    slug: "ashgrove-state-university",
    name: "Ashgrove State University",
    kind: "University",
    place: "Ashgrove, MI",
    about:
      "A mid-sized public university with particular strength in environmental science, public health and archaeology. Eighteen thousand students, a library that keeps a working bindery, and a campus that is mostly 1920s brick with some regrettable additions from the 1960s.",
    staff: "2,600 employees",
    founded: 1907,
    site: "ashgrove.edu.example",
  },
  {
    id: "halden",
    slug: "halden-museum-of-making",
    name: "Halden Museum of Making",
    kind: "Museum",
    place: "Halden, MA",
    about:
      "A museum of industry and craft in a former worsted mill, holding around 90,000 objects and a substantial archive of pattern books. Free admission, funded by a mix of endowment, earned revenue and grants. The collection is still catalogued partly on index cards, which is one of the jobs below.",
    staff: "80 staff, 140 volunteers",
    founded: 1969,
    site: "haldenmuseum.example",
  },
  {
    id: "fernbank",
    slug: "fernbank-housing-authority",
    name: "Fernbank Housing Authority",
    kind: "Housing authority",
    place: "Fernbank, IL",
    about:
      "A public housing authority with 11,000 units, about a third of them built before 1945. Fernbank has spent the last four years weatherizing its worst-performing stock and has committed to bringing the whole portfolio up to standard by 2030, which shapes most of what it hires for.",
    staff: "620 employees",
    founded: 1938,
    site: "fernbankhousing.example",
  },
  {
    id: "woldwater",
    slug: "wold-and-water-alliance",
    name: "Wold & Water Alliance",
    kind: "Nonprofit",
    place: "the Wold River watershed, WI",
    about:
      "A watershed nonprofit working across a single river basin: water quality monitoring, streambank planting, dam removal and a volunteer network of about 300 people who pull monthly samples. Small, technical and unusually well organized for its size.",
    staff: "34 employees",
    founded: 1996,
    site: "woldandwater.example",
  },
  {
    id: "kestrel",
    slug: "kestrel-center",
    name: "Kestrel Center for Young Caregivers",
    kind: "Nonprofit",
    place: "Trentmoor, MN",
    about:
      "Support for people under 18 who look after a family member — respite programs, advocacy in schools, and a helpline staffed until nine in the evening. Around 900 young caregivers on the rolls at any time, in a county that has identified perhaps a third of the ones it has.",
    staff: "48 employees",
    founded: 2003,
    site: "kestrelcenter.example",
  },
  {
    id: "larkmead",
    slug: "larkmead-public-schools",
    name: "Larkmead Public Schools",
    kind: "School district",
    place: "Larkmead, MN",
    about:
      "Nine schools — six elementary, two high schools and one special education center — sharing a central office for finance, facilities, HR and data. The district runs its own school improvement function rather than buying one in, and is candid that two of its schools are in difficulty.",
    staff: "1,150 employees",
    founded: 1953,
    site: "larkmeadschools.example",
  },
  {
    id: "coppice",
    slug: "coppice-land-trust",
    name: "The Coppice Land Trust",
    kind: "Land trust",
    place: "Halden, MA",
    about:
      "Owns and manages 7,000 acres of woodland, wetland and rough pasture, most of it acquired in the 1990s. Runs a working woodlot on a fifteen-year rotation, sells cordwood and fence rails at a small profit, and takes on roughly 40 seasonal crew a year.",
    staff: "56 employees",
    founded: 1991,
    site: "coppicelandtrust.example",
  },
  {
    id: "trentmoor",
    slug: "trentmoor-regional-council",
    name: "Trentmoor Regional Council",
    kind: "Regional authority",
    place: "Trentmoor, MN",
    about:
      "A council of governments covering four counties and 1.2 million people, holding federal and state money for transit, workforce training and housing investment. Small central staff, large budgets, and the usual difficulty of being accountable for outcomes it does not directly control.",
    staff: "310 employees",
    founded: 1968,
    site: "trentmoorcouncil.gov.example",
  },
  {
    id: "hollowell",
    slug: "hollowell-hospice",
    name: "Hollowell Hospice",
    kind: "Nonprofit",
    place: "Hollowell, NC",
    about:
      "Sixteen inpatient beds, a day program and a home team covering 200 square miles. About 30% of the running cost is raised locally rather than reimbursed, which means the development team is not a nice-to-have and is treated accordingly.",
    staff: "210 staff, 400 volunteers",
    founded: 1984,
    site: "hollowellhospice.example",
  },
  {
    id: "portway",
    slug: "portway-community-college",
    name: "Portway Community College",
    kind: "Community college",
    place: "Portway, NC",
    about:
      "A two-year college of 1,400 students, most of them from the four high schools in the county. Strong in nursing and the trades, and rebuilding a music program that nearly closed in 2019.",
    staff: "180 employees",
    founded: 1972,
    site: "portwaycc.edu.example",
  },
];

export const employerById = new Map(employers.map((e) => [e.id, e]));
