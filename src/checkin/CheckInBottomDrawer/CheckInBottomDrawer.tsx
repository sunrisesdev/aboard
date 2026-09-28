"use client";

import { Drawer } from "@base-ui/react/drawer";
import { useState } from "react";
import { submitCheckinAction } from "@/checkin/actions";
import { Button } from "@/components/Button/Button";
import { cleanStationName } from "@/helpers/cleanStationName";
import { formatTime } from "@/helpers/formatTime";
import type { StopoverResource } from "@/lib/traewelling";
import styles from "./CheckInBottomDrawer.module.css";

export function CheckInBottomDrawer({
  open,
  onOpenChange,
  tripId,
  lineName,
  destinationName,
  startStation,
  endStation,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tripId: string;
  lineName: string;
  destinationName: string;
  startStation: StopoverResource;
  endStation?: StopoverResource;
}) {
  const [body, setBody] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const departureTime = startStation.departureReal ?? startStation.departurePlanned;
  const arrivalTime = endStation?.arrivalReal ?? endStation?.arrivalPlanned;

  async function handleSubmit() {
    if (!endStation || !departureTime || !arrivalTime) {
      return;
    }

    setIsSubmitting(true);
    setError(null);
    const result = await submitCheckinAction({
      tripId,
      lineName,
      start: startStation.station.id,
      destination: endStation.station.id,
      departure: departureTime,
      arrival: arrivalTime,
      body: body || null,
    });
    setIsSubmitting(false);

    if (!result.success) {
      setError(result.message);
      return;
    }

    setBody("");
    onOpenChange(false);
  }

  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange}>
      <Drawer.VirtualKeyboardProvider>
        <Drawer.Portal>
          <Drawer.Backdrop className={styles.backdrop} />
          <Drawer.Viewport className={styles.viewport}>
            <Drawer.Popup className={styles.popup}>
              <Drawer.Content className={styles.content}>
                <div className={styles.summary}>
                  <span>
                    {lineName} nach {cleanStationName(destinationName)}
                  </span>
                  <span>
                    Einstieg: {cleanStationName(startStation.station.name)}
                    {departureTime && (
                      <>
                        {" "}
                        um{" "}
                        <time dateTime={departureTime}>
                          {formatTime(departureTime)}
                        </time>
                      </>
                    )}
                  </span>
                  {endStation && (
                    <span>
                      Ausstieg: {cleanStationName(endStation.station.name)}
                      {arrivalTime && (
                        <>
                          {" "}
                          um{" "}
                          <time dateTime={arrivalTime}>
                            {formatTime(arrivalTime)}
                          </time>
                        </>
                      )}
                    </span>
                  )}
                </div>
                <textarea
                  value={body}
                  onChange={(event) => setBody(event.target.value)}
                  placeholder="Was gibt's Neues?"
                  maxLength={280}
                  className={styles.textarea}
                />
                {error && <p>{error}</p>}
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  Einchecken
                </Button>
              </Drawer.Content>
            </Drawer.Popup>
          </Drawer.Viewport>
        </Drawer.Portal>
      </Drawer.VirtualKeyboardProvider>
    </Drawer.Root>
  );
}
