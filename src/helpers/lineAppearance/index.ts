import { transformTrwlLineShape } from '@/traewelling-sdk/transformers';
import { TrwlLineColorDefinition } from '@/traewelling-sdk/types';
import { AboardLine, AboardLineAppearance } from '@/types/aboard';
import colorConvert from 'color-convert';
import { getContrastColor } from '../getContrastColor';
import {
  FALLBACK_METHOD_APPEARANCES,
  LINE_APPEARANCE_OVERRIDES,
} from './consts';
import { fetchTrwlLineColorDefinitions } from './fetcher';

export const createLineAppearanceDataset = async () => {
  // const trwlLineColorDefinitions = await fetchTrwlLineColorDefinitions();
  // const dataset = trwlLineColorDefinitions.map((definition) => {
  //   const overrides = LINE_APPEARANCE_OVERRIDES.filter(([pattern]) =>
  //     pattern.test(definition.hafasLineId)
  //   ).map(([, override]) => override);

  //   const accentColor = determineAccentColor(definition);
  //   const [accentR, accentG, accentB] = colorConvert.hex.rgb(accentColor);

  //   const appearance: Partial<AboardLineAppearance> = Object.assign(
  //     {
  //       accentColor,
  //       background: definition.backgroundColor,
  //       border: definition.borderColor,
  //       color: definition.textColor,
  //       contrastColor: getContrastColor(accentR, accentG, accentB),
  //       lineName: definition.lineName,
  //       shape: transformTrwlLineShape(definition.shape),
  //     } satisfies Partial<AboardLineAppearance>,
  //     ...overrides
  //   );

  //   return {
  //     appearance,
  //     lineId: definition.hafasLineId,
  //     operatorId: definition.hafasOperatorCode,
  //   };
  // });

  return {
    getAppearanceForLine: (line: AboardLine): AboardLineAppearance => {
      // const fromDataset = dataset.find(
      //   ({ lineId, operatorId }) =>
      //     lineId === line.id &&
      //     (operatorId === '' || operatorId === line.operator?.id)
      // );

      // if (fromDataset) {
      //   return Object.assign(line.appearance, fromDataset.appearance);
      // }

      // const overrides = LINE_APPEARANCE_OVERRIDES.filter(([pattern]) =>
      //   pattern.test(line.id)
      // ).map(([, override]) => override);

      const fb = FALLBACK_METHOD_APPEARANCES[line.method];

      line.appearance = {
        lineName: line.appearance.lineName,
        accentColor: line.appearance.accentColor ?? line.appearance.background ?? fb.accentColor,
        background: line.appearance.background ?? fb.background,
        border: fb.border,
        color: line.appearance.color ?? fb.color,
        contrastColor: line.appearance.color ?? fb.contrastColor,
        shape: line.appearance.shape ?? fb.shape,
        productName: '',
      };

      if (!line.appearance.accentColor) {
        line.appearance.accentColor = determineAccentColor({
          backgroundColor: line.appearance.background!,
          borderColor: line.appearance.border!,
          textColor: line.appearance.color!,
        });
      }

      return line.appearance;
    },
  };
};

const determineAccentColor = (definition: Pick<TrwlLineColorDefinition, 'backgroundColor' | 'borderColor' | 'textColor'>) => {
  // Preparations for background gradients
  // const backgroundColors =
  //   definition.backgroundColor.toLowerCase().match(/(#[a-f\d]{3,6})/gi) ?? [];

  const palette = [
    // ...backgroundColors,
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
