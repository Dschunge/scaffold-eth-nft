// routes
import Router from './routes';
// theme
import ThemeConfig from './theme';
import GlobalStyles from './theme/globalStyles';
// components
import Settings from './components/settings';
import RtlLayout from './components/RtlLayout';
import ScrollToTop from './components/ScrollToTop';
import { ProgressBarStyle } from './components/LoadingScreen';
import ThemePrimaryColor from './components/ThemePrimaryColor';
import { Web3ReactProvider } from '@web3-react/core'
import NotistackProvider from './components/NotistackProvider';

// ----------------------------------------------------------------------
import { getLibrary } from './web3-rect-utils/utils'

export default function App() {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <ThemeConfig>
        <ThemePrimaryColor>
          <NotistackProvider>
            <RtlLayout>
              <GlobalStyles />
              <ProgressBarStyle />
              <Settings />
              <ScrollToTop />
              <Router />
            </RtlLayout>
          </NotistackProvider>
        </ThemePrimaryColor>
      </ThemeConfig>
    </Web3ReactProvider>
  );
}
