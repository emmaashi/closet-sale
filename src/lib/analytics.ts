const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID?.trim();

type DataLayerEntry = [command: string, ...parameters: unknown[]];

declare global {
  interface Window {
    dataLayer?: DataLayerEntry[];
    gtag?: (...args: DataLayerEntry) => void;
  }
}

export function initializeAnalytics() {
  if (
    !import.meta.env.PROD ||
    !measurementId ||
    !/^G-[A-Z0-9]+$/i.test(measurementId) ||
    document.querySelector("script[data-google-analytics]")
  ) {
    return;
  }

  window.dataLayer ??= [];
  window.gtag = (...args) => window.dataLayer?.push(args);
  window.gtag("js", new Date());
  window.gtag("config", measurementId);

  const script = document.createElement("script");
  script.async = true;
  script.dataset.googleAnalytics = "true";
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  document.head.append(script);
}
