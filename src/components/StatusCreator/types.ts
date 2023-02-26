export type StatusCreatorProps = {
  message: string;
  onMessageChange: (message: string) => void;
  onTravelTypeChange: (travelType: number) => void;
  travelType: number;
};
