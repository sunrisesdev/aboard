import { Overlay, SHEET_HEADER_HEIGHT } from '@/components/Overlay/Overlay';
import { StationSelector } from '@/components/StationSelector/StationSelector';
import { useCheckIn } from '@/hooks/useCheckIn/useCheckIn';
import { useRecentStations } from '@/hooks/useRecentStations/useRecentStations';
import { useStationSearch } from '@/hooks/useStationSearch/useStationSearch';
import { radioCanada } from '@/styles/fonts';
import { NearbyResponse } from '@/traewelling-sdk/functions/trains';
import { AboardStation } from '@/types/aboard';
import { debounce } from '@/utils/debounce';
import { ChangeEventHandler, forwardRef, useRef, useState } from 'react';
import { MdMyLocation, MdSearch } from 'react-icons/md';
import { SheetRef } from 'react-modal-sheet';
import styles from './SelectOrigin.module.scss';
import { SelectOriginOverlayProps } from './types';

export const SelectOriginOverlay = forwardRef<
  HTMLInputElement,
  SelectOriginOverlayProps
>(({ onComplete, ...overlayProps }, ref) => {
  const { selectOrigin } = useCheckIn();

  const sheetRef = useRef<SheetRef>();

  const [query, setQuery] = useState('');
  const { isLoading: isLoadingRecentStations, recentStations } =
    useRecentStations();
  const { isLoading: isLoadingStations, stations } = useStationSearch(query);

  const handleNearbyClicked = () => {
    navigator.geolocation.getCurrentPosition(async ({ coords }) => {
      const response = await fetch(
        `/traewelling/stations/nearby?latitude=${coords.latitude}&longitude=${coords.longitude}`
      );

      if (!response.ok) {
        return;
      }

      const station = (await response.json()) as NearbyResponse;
    });
  };

  const handleOriginSelected = (origin: AboardStation) => {
    selectOrigin({ origin });
    onComplete();
  };

  const handleQueryChange: ChangeEventHandler<HTMLInputElement> = ({
    target,
  }) => {
    debounce(() => setQuery(target.value), 500)();
  };

  const handleQueryFocus = () => {
    sheetRef.current?.snapTo(0);
  };

  return (
    <Overlay
      {...overlayProps}
      className={radioCanada.className}
      collapsedSnapHeight={SHEET_HEADER_HEIGHT + 60}
      initialSnapPosition={0}
      ref={sheetRef}
      staticBackdrop
    >
      <header>
        <label className={styles.searchBar}>
          <span className={styles.leftAddon}>
            <MdSearch size={20} />
          </span>

          <input
            className={styles.input}
            onChange={handleQueryChange}
            onFocus={handleQueryFocus}
            placeholder="Wo bist du?"
            ref={ref}
          />

          <button className={styles.rightAddon} onClick={handleNearbyClicked}>
            <MdMyLocation size={20} />
          </button>
        </label>
      </header>

      <Overlay.ScrollArea>
        <section className={styles.section}>
          <div className={styles.label}>Suchergebnisse</div>
          <div>
            <StationSelector
              onSelect={handleOriginSelected}
              query={query}
              stations={stations ?? []}
            />
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.label}>Favoriten</div>
        </section>

        <section className={styles.section}>
          <div className={styles.label}>Letzte Stationen</div>
        </section>
      </Overlay.ScrollArea>
    </Overlay>
  );
});

SelectOriginOverlay.displayName = 'SelectOriginOverlay';
