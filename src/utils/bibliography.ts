import { CitationData } from '../types';

export type BibFormat = 'apa7' | 'mla9' | 'chicago17' | 'plain';

export function formatCitation(data: CitationData, format: BibFormat): string {
  const { title, authors, year, journal, volumeIssuePages, doi } = data;

  switch (format) {
    case 'apa7': {
      // Authors (Year). Title. Journal, Volume(Issue), Pages. DOI
      let cite = `${authors || '[Author]'} (${year || 'n.d.'}). ${title || '[Title]'}.`;
      if (journal) cite += ` *${journal}*`;
      if (volumeIssuePages) cite += `, ${volumeIssuePages}`;
      if (doi) cite += `. ${doi}`;
      return cite;
    }
    case 'mla9': {
      // Authors. "Title." Journal, vol./no., year, pp. DOI.
      let cite = `${authors || '[Author]'}. "${title || '[Title]'}."`;
      if (journal) cite += ` *${journal}*,`;
      if (volumeIssuePages) cite += ` ${volumeIssuePages},`;
      cite += ` ${year || 'n.d.'}`;
      if (doi) cite += `. ${doi}`;
      return cite + '.';
    }
    case 'chicago17': {
      // Authors. "Title." Journal Volume, no. Issue (Year): Pages. DOI.
      let cite = `${authors || '[Author]'}. "${title || '[Title]'}."`;
      if (journal) cite += ` *${journal}*`;
      if (volumeIssuePages) cite += ` ${volumeIssuePages}`;
      cite += ` (${year || 'n.d.'})`;
      if (doi) cite += `. ${doi}`;
      return cite + '.';
    }
    case 'plain':
    default:
      return `${title || '[Title]'} — ${authors || '[Author]'} (${year || 'n.d.'})`;
  }
}

export function generateBibliography(citationNodes: any[], format: BibFormat): string {
  const entries = citationNodes
    .filter(n => n.data?.isCitation && n.data?.citationData)
    .map((n, i) => `${i + 1}. ${formatCitation(n.data.citationData, format)}`);
  return entries.join('\n\n');
}
