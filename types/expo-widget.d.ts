declare module 'expo-widget' {
  type TimelineOptions = {
    kind: string;
  };

  export function setItemAsync(key: string, value: string): Promise<void>;
  export function getItemAsync(key: string): Promise<string | null>;
  export function deleteItemAsync?(key: string): Promise<void>;
  export function updateTimelinesAsync(options: TimelineOptions): Promise<void>;
}

declare module 'expo-widget/defineWidget' {
  import type { ReactElement } from 'react';

  type WidgetContext = {
    getItemAsync?: (key: string) => Promise<string | null>;
  };

  type TimelineEntry = {
    date: Date;
    content: () => ReactElement | null;
  };

  type WidgetDefinition = (context: WidgetContext) => Promise<{
    name: string;
    displayName: string;
    description?: string;
    kind: string;
    supportedFamilies: string[];
    timeline: TimelineEntry[];
  }>;

  const defineWidget: (factory: WidgetDefinition) => unknown;
  export default defineWidget;
}
