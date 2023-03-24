interface Window {
  umami: {
    trackEvent: (
      eventName: string,
      data?: {
        type: string;
      } & Record<string, string | number | boolean>
    ) => void;
    trackView: (url: string) => void;
  };
}
