import type { SiteConfig } from '@pcl/design-system';

/** Internal href with the base prefix (/lab-website on github.io, '' on the custom domain). */
const u = (p: string) => (import.meta.env.BASE_URL ?? '/lab-website').replace(/\/$/, '') + p;

/** Where "All other inquiries" and the home-page contact card point. Change it here only. */
export const contactEmail = 'elisabeth.irvine@mail.mcgill.ca';

export const site: SiteConfig & { base: string; previewUrl: string } = {
  name: 'The Psychedelics & Contemplation Lab',
  tagline: 'McGill University · Lady Davis Institute',
  url: 'https://psychedelicsandcontemplationlab.com',
  lang: 'en',
  accent: '#4B6A8A',
  affiliation:
    'The Psychedelics & Contemplation Lab is part of the Department of Psychiatry, McGill University, and the Lady Davis Institute for Medical Research, Jewish General Hospital, Montréal.',
  base: '/lab-website',
  previewUrl: 'https://the-psychedelics-and-contemplation-lab.github.io',
  ogImage: 'https://psychedelicsandcontemplationlab.com/og-image.png',
  ogImageAlt: 'The Psychedelics & Contemplation Lab — McGill University and the Lady Davis Institute, Montréal',
  footerLinks: [
    { label: 'Psychedelic research', href: u('/psychedelic-research/') },
    { label: 'Contemplative research', href: u('/contemplative-research/') },
    { label: 'Contact', href: u('/contact/') },
    { label: 'ReSPCT Guidelines', href: 'https://respctguidelines.com', external: true },
    { label: 'StaMPS Data Framework', href: 'https://stamps-website.vercel.app', external: true },
    { label: 'The Montreal Model', href: 'https://montrealmodelketaminetherapy.com', external: true },
  ],
  organizationSchema: {
    '@context': 'https://schema.org',
    '@type': 'ResearchOrganization',
    name: 'The Psychedelics & Contemplation Lab',
    alternateName: 'Psychedelics and Contemplation Lab',
    url: 'https://psychedelicsandcontemplationlab.com',
    description:
      'A collaborative, multidisciplinary research lab exploring the phenomenology of non-ordinary states of consciousness, spiritual practices, and novel clinical interventions.',
    address: { '@type': 'PostalAddress', addressLocality: 'Montréal', addressRegion: 'QC', addressCountry: 'CA' },
    parentOrganization: [
      { '@type': 'CollegeOrUniversity', name: 'McGill University', url: 'https://www.mcgill.ca/' },
      { '@type': 'ResearchOrganization', name: 'Lady Davis Institute for Medical Research', url: 'https://www.ladydavis.ca/' },
    ],
    member: [
      { '@type': 'Person', name: 'Kyle Greenway', jobTitle: 'Lab Director' },
      { '@type': 'Person', name: 'Michael Lifshitz', jobTitle: 'Lab Director' },
    ],
  },
};

/**
 * Primary navigation. `current` is set per page by `navFor()`.
 * The two research strands are deliberately not top-level items: with the long lab name in the
 * header lockup, seven items overflow the design-system header between 1024 and 1320 px. They are
 * one click away on /research/, on the home page and in the footer.
 */
export const navItems = [
  { label: 'Research', href: u('/research/') },
  { label: 'People', href: u('/people/') },
  { label: 'Publications', href: u('/publications/') },
  { label: 'Media', href: u('/media/') },
  { label: 'Contact', href: u('/contact/') },
];
export const nav = navItems;

/** Nav with `current: true` on the item whose path matches the page being rendered. */
export const navFor = (path: string) => navItems.map((n) => ({ ...n, current: n.href === u(path) }));

/** The lab's sister sites, shown on the home page and in the footer. */
export const projects = [
  {
    name: 'The ReSPCT Guidelines',
    eyebrow: 'Reporting standard',
    href: 'https://respctguidelines.com',
    description: 'Reporting of Setting in Psychedelic Clinical Trials — a Delphi consensus of 89 experts on the 30 variables every trial should document.',
  },
  {
    name: 'StaMPS Data Framework',
    eyebrow: 'Standardized measures',
    href: 'https://stamps-website.vercel.app',
    description: 'A standardized framework for collecting data in psychedelic therapy across clinical and research settings, with an interactive online tool.',
  },
  {
    name: 'The Montreal Model',
    eyebrow: 'Ketamine therapy',
    href: 'https://montrealmodelketaminetherapy.com',
    description: 'An intensive, evidence-based program combining low-dose ketamine with psychological support for treatment-resistant depression.',
  },
];
