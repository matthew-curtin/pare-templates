/**
 * Content shapes that are not the model's own.
 *
 * `Item`, `Line`, `Order` and `Commitment` live in `src/lib/bom.ts`
 * because the model is defined in terms of them and a zero-import
 * module cannot reach up here for a type. Everything below is content
 * that hangs off those — who we buy from, what the shots are of, what
 * the site says about itself.
 */

export type Supplier = {
  id: string;
  name: string;
  place: string;
  /** What they are for, in one line. Shown on a part's page, because
   *  "who is this and why them" is the question a shortage raises. */
  note: string;
  /** Days from a purchase order to a delivery, typically. Individual
   *  parts carry their own; this is what to expect from the account. */
  typicalLead: number;
};

/** §6: a photograph does narrative work or it is decoration. `job` is
 *  what this one is for, written before the caption and used to reject
 *  candidates. */
export type Shot = { alt: string; caption: string; job: string };

export type NavItem = { to: string; label: string };
