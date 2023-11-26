const useUmami = () => {
  return {
    trackEvent: (event: string, data: any) => {
      try {
        window.umami.track(event, data);
      } catch (e) {
        console.error(e);
      }
    },
    simpleEvent: (event: string) => {
      try {
        window.umami.track(event);
      } catch (e) {
        console.error(e);
      }
    },
  };
};

export default useUmami;
