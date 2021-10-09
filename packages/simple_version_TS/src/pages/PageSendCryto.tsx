// material
import { Container, Typography } from '@mui/material';
// hooks
import useSettings from '../hooks/useSettings';
// components
import Page from '../components/Page';

// ----------------------------------------------------------------------

export default function PageSendCrypto() {
  const { themeStretch } = useSettings();

  return (
    <Page title="Page Three | Minimal-UI">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Typography variant="h3" component="h1" paragraph>
          Send Crypto Currencies
        </Typography>
        <Typography gutterBottom>Send Crypto Currencies & NFT's</Typography>
      </Container>
    </Page>
  );
}
