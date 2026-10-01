/*
 * Ported from db-clean-station-name 1.2.0 (https://github.com/juliuste/db-clean-station-name)
 *
 * Copyright (c) 2019, Julius Tens
 *
 * Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby
 * granted, provided that the above copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
 * INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN
 * AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
 * PERFORMANCE OF THIS SOFTWARE.
 */

type Step = (name: string) => string;

const pipe =
  (...steps: Step[]): Step =>
  (name) =>
    steps.reduce((result, step) => step(result), name);

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const replaceUnderscores: Step = (name) => name.replace(/_+/g, ' ');

const replaceEscapedLinebreak: Step = (name) => name.replace(/\\n/g, ' ');

const correctApostrophes: Step = (name) => name.replace(/[`´']/g, '’');

const replaceNonRoundBrackets: Step = (name) => name.replace(/[[{]/g, '(').replace(/[\]}]/g, ')');

const removeEmptyBrackets: Step = (name) => name.replace(/\(\s*\)/g, ' ');

const correctWhitespace: Step = (name) => name.replace(/\s+/g, ' ').replace(/^\s+/g, '').replace(/\s+$/g, '');

const removeLeadingAndTrailingRelicts: Step = (name) =>
  name.replace(/^[^\p{L}("'’„\d]+(?=[\p{L}("'’„\d])/giu, '').replace(/(?<=[\p{L})"'’“\d])[^\p{L})"'’“\d]+$/giu, '');

const removeDuplicateSigns: Step = (name) => name.replace(/[,:;]\s+(?=[.,:;])/g, '');

const correctSignWhitespace: Step = (name) =>
  name
    .replace(/\s+(?=[.,:;/])/g, '')
    .replace(/(?<=[,:;])(?=[^\s])/g, ' ')
    .replace(/(?<=[\p{L}])\.(?=[\p{L}]+($|[^\p{L}.]))/gu, '. ')
    .replace(/(?<=[/])\s+(?=\p{L})/gu, '');

const correctBracketWhitespace: Step = (name) =>
  name
    .replace(/(?<=[^\s])\(/g, ' (')
    .replace(/\(\s+/g, '(')
    .replace(/\s+\)/g, ')')
    .replace(/\)(?=[\p{L}])/gu, ') ');

const correctAbbreviatedStreetWhitespace: Step = (name) => name.replace(/\.\sstraße/g, '.straße');

const cleanup = pipe(
  removeEmptyBrackets,
  correctWhitespace,
  replaceEscapedLinebreak,
  removeDuplicateSigns,
  removeLeadingAndTrailingRelicts,
  correctSignWhitespace,
  correctBracketWhitespace,
  correctAbbreviatedStreetWhitespace,
);

const replaceAbzweig: Step = (name) => name.replace(/(?<=^|[^\p{L}])abzw\.?(?=$|[^\p{L}])/giu, 'Abzweig');

const replaceBei: Step = (name) => name.replace(/(?<=^|[^\p{L}])b\.?(?=\s+\p{L}+)/giu, 'bei');

const replaceRichtung: Step = (name) => name.replace(/(?<=^|[^\p{L}])Ri\.?(?=\s+\p{L}+)/giu, 'Richtung');

const replaceStreet: Step = (name) => name.replace(/(?<=str)[.]?(?=($|[^\p{L}]))/giu, 'aße ');

const replaceLocationAbbreviation =
  ({ short, long }: Abbreviation): Step =>
  (name) =>
    name.replace(new RegExp(`\\(${short}\\.?\\)`, 'gi'), `(${long})`);

const replaceAbbreviatedWord =
  ({ short, long }: Abbreviation): Step =>
  (name) =>
    name.replace(
      new RegExp(
        `(?<=(^|[^\\p{L}])${escapeRegExp(short.slice(0, 1))})${escapeRegExp(short.slice(1))}(?=($|[^\\p{L}]))`,
        'giu',
      ),
      long.slice(1),
    );

const removeBracketWithAbbreviation =
  (abbreviation: string): Step =>
  (name) =>
    name.replace(new RegExp(`\\(${escapeRegExp(abbreviation)}\\)`, 'gi'), ' ');

const removeLeadingAbbreviation =
  (abbreviation: string): Step =>
  (name) =>
    name.replace(new RegExp(`(?<=^)${escapeRegExp(abbreviation)}(?=[\\s]+)`, 'gi'), ' ');

const removeLineNames: Step = (name) => name.replace(/(?<=^|[(\s,])[SUsu]\s?[0-9]{0,2}(?=$|[)\s,])/g, ' ');

type Abbreviation = { short: string; long: string };

const locationAbbreviations: Abbreviation[] = [
  { short: 'Westf', long: 'Westfalen' },
  { short: 'Württ', long: 'Württemberg' },
  { short: 'Thür', long: 'Thüringen' },
  { short: 'Meckl', long: 'Mecklenburg' },
  { short: 'Bay', long: 'Bayern' },
  { short: 'Sachs', long: 'Sachsen' },
  { short: 'Anh', long: 'Anhalt' },
  { short: 'Oberpf', long: 'Oberpfalz' },
  { short: 'Schwab', long: 'Schwaben' },
  { short: 'Oberbay', long: 'Oberbayern' },
  { short: 'Holst', long: 'Holstein' },
  { short: 'Braunschw', long: 'Braunschweig' },
  { short: 'Saalkr', long: 'Saalekreis' },
  { short: 'Niederbay', long: 'Niederbayern' },
  { short: 'Schwarzw', long: 'Schwarzwald' },
  { short: 'Oldb', long: 'Oldenburg' },
  { short: 'Uckerm', long: 'Uckermark' },
  { short: 'Rheinl', long: 'Rheinland' },
  { short: 'Oberfr', long: 'Oberfranken' },
  { short: 'Rheinhess', long: 'Rheinhessen' },
  { short: 'Hess', long: 'Hessen' },
  { short: 'Altm', long: 'Altmark' },
  { short: 'Limes', long: 'Limesstadt' },
  { short: 'Vogtl', long: 'Vogtland' },
  { short: 'Mittelfr', long: 'Mittelfranken' },
  { short: 'Dillkr', long: 'Dillkreis' },
  { short: 'Odenw', long: 'Odenwald' },
  { short: 'Erzgeb', long: 'Erzgebirge' },
  { short: 'Prign', long: 'Prignitz' },
  { short: 'Oberhess', long: 'Oberhessen' },
  { short: 'Ostfriesl', long: 'Ostfriesland' },
  { short: 'Schlesw', long: 'Schleswig' },
  { short: 'Unterfr', long: 'Unterfranken' },
  { short: 'Westerw', long: 'Westerwald' },
  { short: 'Dithm', long: 'Dithmarschen' },
];

const otherAbbreviations: Abbreviation[] = [
  { short: 'Hp', long: 'Haltepunkt' },
  { short: 'Hs', long: 'Haltestelle' },
  { short: 'Bf', long: 'Bahnhof' },
  { short: 'Bhf', long: 'Bahnhof' },
  { short: 'Glowny', long: 'Główny' },
  { short: 'Glowna', long: 'Główna' },
];

const replaceAbbreviations = pipe(
  replaceAbzweig,
  replaceBei,
  replaceRichtung,
  ...locationAbbreviations.map(replaceLocationAbbreviation),
  removeBracketWithAbbreviation('S+U'),
  removeBracketWithAbbreviation('Bus'),
  removeBracketWithAbbreviation('Tram'),
  removeBracketWithAbbreviation('S'),
  removeBracketWithAbbreviation('U'),
  removeLeadingAbbreviation('S+U'),
  removeLeadingAbbreviation('S'),
  removeLeadingAbbreviation('U'),
  replaceStreet,
  ...otherAbbreviations.map(replaceAbbreviatedWord),
);

export const cleanStationName = pipe(
  replaceUnderscores,
  correctApostrophes,
  replaceNonRoundBrackets,
  cleanup,
  removeLineNames,
  cleanup,
  replaceAbbreviations,
  cleanup,
);
