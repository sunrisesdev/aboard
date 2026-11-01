'use client';

import { useSyncExternalStore } from 'react';

const storageKey = 'aboard:pinnedLines';
// The storage event only fires in other tabs, so changes within this tab are announced separately
const changeEvent = 'aboard:pinnedLinesChange';

type PinnedLines = Record<string, string[]>;

function readPinnedLines(serialized: string | null): PinnedLines {
  if (!serialized) return {};

  try {
    return JSON.parse(serialized);
  } catch {
    return {};
  }
}

function getSnapshot() {
  try {
    return localStorage.getItem(storageKey);
  } catch {
    return null;
  }
}

function subscribe(onChange: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === storageKey) onChange();
  };

  window.addEventListener('storage', onStorage);
  window.addEventListener(changeEvent, onChange);

  return () => {
    window.removeEventListener('storage', onStorage);
    window.removeEventListener(changeEvent, onChange);
  };
}

export function usePinnedLines(stationId: string) {
  const serialized = useSyncExternalStore(subscribe, getSnapshot, () => null);
  const pinnedLines = readPinnedLines(serialized)[stationId] ?? [];

  const togglePinnedLine = (lineName: string) => {
    const allPinnedLines = readPinnedLines(getSnapshot());
    const nextLines = pinnedLines.includes(lineName)
      ? pinnedLines.filter((name) => name !== lineName)
      : [...pinnedLines, lineName];

    if (nextLines.length) {
      allPinnedLines[stationId] = nextLines;
    } else {
      delete allPinnedLines[stationId];
    }

    try {
      if (Object.keys(allPinnedLines).length) {
        localStorage.setItem(storageKey, JSON.stringify(allPinnedLines));
      } else {
        localStorage.removeItem(storageKey);
      }
    } catch {
      return;
    }

    window.dispatchEvent(new Event(changeEvent));
  };

  return { pinnedLines, isPinned: (lineName: string) => pinnedLines.includes(lineName), togglePinnedLine };
}
