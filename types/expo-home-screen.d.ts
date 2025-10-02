declare module 'expo-home-screen' {
  export interface WidgetTimelineParams {
    kind: string;
  }

  export const updateTimelinesAsync: (params: WidgetTimelineParams) => Promise<void>;
  export const setItemAsync: (key: string, value: string) => Promise<void>;
  export const getItemAsync: (key: string) => Promise<string | null>;
  export const deleteItemAsync: (key: string) => Promise<void>;
}

declare module 'expo-home-screen/defineWidget' {
  import type { ReactNode } from 'react';

  interface TimelineEntry {
    date: Date;
    content: () => ReactNode;
  }

  interface WidgetDefinition {
    name: string;
    displayName: string;
    description: string;
    kind: string;
    supportedFamilies: string[];
    timeline: TimelineEntry[];
  }

  interface WidgetContext {
    getItemAsync?: (key: string) => Promise<string | null>;
  }

  export default function defineWidget(
    factory: (context: WidgetContext) => Promise<WidgetDefinition>
  ): unknown;
}
