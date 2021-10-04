// material
import { Container, Typography } from '@mui/material';
// hooks
import useSettings from '../hooks/useSettings';
// components
import Page from '../components/Page';

// ----------------------------------------------------------------------

export default function PageThree() {
  const { themeStretch } = useSettings();

  return (
    <Page title="Page Three | Minimal-UI">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Typography variant="h3" component="h1" paragraph>
          Page PDF
        </Typography>
        <Typography gutterBottom>PDFs comes here</Typography>
      </Container>
    </Page>
  );
}
