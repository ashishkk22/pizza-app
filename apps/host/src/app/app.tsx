import * as React from 'react';
import { Route, Routes, BrowserRouter, Link } from 'react-router-dom';
import Navbar from './components/navbar/Navbar';
import {
  ColorScheme,
  MantineProvider,
  ColorSchemeProvider,
  Button,
  Loader,
} from '@mantine/core';
import { useHotkeys, useLocalStorage } from '@mantine/hooks';
import Banner from './components/banner/Banner';
import { CenterLoader } from '@pizza-app/ui-shared';
import { theme } from '@pizza-app/ui-shared';
import { StoreProvider } from '@pizza-app/redux-store';

const Shop = React.lazy(() => import('shop/Module'));
const Auth = React.lazy(() => import('./components/auth/Auth'));
const Cart = React.lazy(() => import('./components/cart/Cart'));

export function App() {
  return (
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
        <BrowserRouter>
          <React.Suspense fallback={<CenterLoader />}>
            <Navbar />
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <Banner />
                    <Shop />
                  </>
                }
              />
              <Route path="/cart" element={<Cart />} />
              <Route path="/shop" element={<></>} />
              <Route
                path="/auth/*"
                element={
                  <React.Suspense fallback={<CenterLoader />}>
                    <Auth />
                  </React.Suspense>
                }
              />
            </Routes>
          </React.Suspense>
        </BrowserRouter>
      </MantineProvider>
    </StoreProvider>
  );
}

export default App;
