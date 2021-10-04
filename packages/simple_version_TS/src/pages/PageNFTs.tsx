// material
import { Container, Typography } from '@mui/material';
// hooks
import useSettings from '../hooks/useSettings';
// components
import Page from '../components/Page';

// ----------------------------------------------------------------------

export default function PageNFTs() {
  const { themeStretch } = useSettings();

  return (
    <Page title="Page Two | Minimal-UI">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Typography variant="h3" component="h1" paragraph>
          Page NFTs
        </Typography>
        <Typography gutterBottom>NFT's comes here</Typography>
      </Container>
    </Page>
  );
}
