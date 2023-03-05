export type StopProps = {
  arrivalAt: string | null;
  isCancelled: boolean;
  isDelayed: boolean;
  name: string;
  onClick?: () => void;
  plannedArrivalAt: string | null;
};
