'use server';

import { TrwlLineColorDefinition } from '@/traewelling-sdk/types';
import Papa from 'papaparse';

export const fetchTrwlLineColorDefinitions = async () => {
  const url = new URL(
    'https://raw.githubusercontent.com/Traewelling/line-colors/main/line-colors.csv'
  );

  const res = await fetch(url, {
    method: 'GET',
    next: {
      revalidate: 60 * 60 * 24 * 7, // 1 week
      tags: ['trwl-line-colors'],
    },
  });

  const data = await res.text();

  if (res.status === 200) {
    const result = Papa.parse<TrwlLineColorDefinition>(data, {
      header: true,
      skipEmptyLines: true,
    });

    return result.data;
  }

  throw { message: data, status: res.status };
};
