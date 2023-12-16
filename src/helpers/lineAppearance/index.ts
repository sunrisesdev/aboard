import { transformTrwlLineShape } from '@/traewelling-sdk/transformers';
import { TrwlLineColorDefinition } from '@/traewelling-sdk/types';
import { AboardLine, AboardLineAppearance } from '@/types/aboard';
import colorConvert from 'color-convert';
import { getContrastColor } from '../getContrastColor';
import {
  FALLBACK_METHOD_APPERANCES,
  LINE_APPEARANCE_OVERRIDES,
} from './consts';
import { fetchTrwlLineColorDefinitions } from './fetcher';

export const createLineAppearanceDataset = async () => {
  const trwlLineColorDefinitions = await fetchTrwlLineColorDefinitions();
  const dataset = trwlLineColorDefinitions.map((definition) => {
    const overrides = LINE_APPEARANCE_OVERRIDES.filter(([pattern]) =>
      pattern.test(definition.hafasLineId)
    ).map(([, override]) => override);

    const accentColor = determineAccentColor(definition);
    const [accentR, accentG, accentB] = colorConvert.hex.rgb(accentColor);

    const appearance: Partial<AboardLineAppearance> = Object.assign(
      {
        accentColor,
        background: definition.backgroundColor,
        border: definition.borderColor,
        color: definition.textColor,
        contrastColor: getContrastColor(accentR, accentG, accentB),
        lineName: definition.lineName,
        shape: transformTrwlLineShape(definition.shape),
      } satisfies Partial<AboardLineAppearance>,
      ...overrides
    );

    return {
      appearance,
      lineId: definition.hafasLineId,
      operatorId: definition.hafasOperatorCode,
    };
  });

  return {
    getAppearanceForLine: (line: AboardLine): AboardLineAppearance => {
      const fromDataset = dataset.find(
        ({ lineId, operatorId }) =>
          lineId === line.id &&
          ((operatorId !== '' && line.operator.id === '') ||
            operatorId === line.operator.id)
      );

      if (fromDataset) {
        return Object.assign(line.appearance, fromDataset.appearance);
      }

      return Object.assign(
        line.appearance,
        FALLBACK_METHOD_APPERANCES[line.method]
      );
    },
  };
};

const determineAccentColor = (definition: TrwlLineColorDefinition) => {
  const palette = [
    definition.backgroundColor.toLowerCase(),
    definition.borderColor.toLowerCase(),
    definition.textColor.toLowerCase(),
  ]
    .filter((color) => !!color && color !== '#fff' && color !== '#ffffff')
    .sort((a, b) => {
      const [, aS, aL] = colorConvert.hex.hsl(a);
      const [, bS, bL] = colorConvert.hex.hsl(b);

      return 2 * bS * bL - 2 * aS * aL;
    });

  return palette[0];
};
