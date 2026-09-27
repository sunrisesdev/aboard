"use client";

import { Drawer } from "@base-ui/react/drawer";
import { useState } from "react";
import { submitCheckinAction } from "@/checkin/actions";
import { Button } from "@/components/Button/Button";
import { formatTime } from "@/helpers/formatTime";
import styles from "./CheckInBottomDrawer.module.css";

export type StopStation = {
  stationId: number;
  stationName: string;
  plannedAt: string | null;
  actualAt: string | null;
};

export function CheckInBottomDrawer({
  open,
  onOpenChange,
  tripId,
  lineName,
  destinationName,
  departure,
  arrival,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tripId: string;
  lineName: string;
  destinationName: string;
  departure: StopStation;
  arrival: StopStation;
}) {
  const [body, setBody] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const departureTime = departure.actualAt ?? departure.plannedAt;
  const arrivalTime = arrival.actualAt ?? arrival.plannedAt;

  async function handleSubmit() {
    if (!departureTime || !arrivalTime) {
      return;
    }

    setIsSubmitting(true);
    setError(null);
    const result = await submitCheckinAction({
      tripId,
      lineName,
      start: departure.stationId,
      destination: arrival.stationId,
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
                    {lineName} nach {destinationName}
                  </span>
                  <span>
                    Einstieg: {departure.stationName}
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
                  <span>
                    Ausstieg: {arrival.stationName}
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
