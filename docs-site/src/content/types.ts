/** Every content shape in the template, in one place. */

export type NavLink = { label: string; href: string };

export type DocGroup = {
  /** Folder name under src/content/docs — also the group key. */
  dir: string;
  label: string;
};

export type Site = {
  name: string;
  tagline: string;
  description: string;
  apiBase: string;
  currentVersion: string;
  nav: NavLink[];
  footer: { heading: string; links: NavLink[] }[];
};

/** A tabbed code sample — the same task in several languages. */
export type Sample = {
  language: string;
  label: string;
  code: string;
};

export type Param = {
  name: string;
  type: string;
  required?: boolean;
  description: string;
};

export type Endpoint = {
  id: string;
  method: "GET" | "POST" | "PATCH" | "DELETE";
  path: string;
  title: string;
  description: string;
  params: Param[];
  /** A representative response body, shown highlighted as JSON. */
  response: string;
};

export type EndpointGroup = {
  id: string;
  title: string;
  description: string;
  endpoints: Endpoint[];
};

export type Sdk = {
  language: string;
  name: string;
  version: string;
  install: string;
  sampleLanguage: string;
  sample: string;
  notes: string;
};
