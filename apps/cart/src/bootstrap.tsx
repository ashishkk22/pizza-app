import React from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { createRouter } from './routing/router-factory';
import { RoutingStrategy } from './routing/types';
import { MantineProvider } from '@mantine/core';
import { theme } from '@pizza-app/ui-shared';
import { StoreProvider } from '@pizza-app/redux-store';
import { Toaster } from 'react-hot-toast';
const mount = ({
  mountPoint,
  initialPathname,
  routingStrategy,
}: {
  mountPoint: HTMLElement;
  initialPathname?: string;
  routingStrategy?: RoutingStrategy;
}) => {
  const router = createRouter({ strategy: routingStrategy, initialPathname });

  const root = createRoot(mountPoint);
  root.render(
    <StoreProvider>
      <MantineProvider
        withNormalizeCSS
        withGlobalStyles
        theme={{
          fontFamily: theme.fontFamily,
          colors: theme.colors as Record<string, any>,
          primaryColor: theme.primaryColor,
        }}
      >
        <Toaster position="top-right" />
        <RouterProvider router={router} />
      </MantineProvider>
    </StoreProvider>
  );

  return () => queueMicrotask(() => root.unmount());
};

export { mount };
