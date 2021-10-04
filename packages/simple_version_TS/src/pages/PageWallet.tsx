import React from 'react';
// material
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
// hooks
import useSettings from '../hooks/useSettings';
// components
import Page from '../components/Page';
// ----------------------------------------------------------------------

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  // border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function PageWallet() {
  const { themeStretch } = useSettings();

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  function WalletInfo() {

    return (
      <>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Text in a modal
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
            </Typography>
          </Box>
        </Modal>
      </>
    )
  }

  return (
    <Page title="Wallet Page">
      <WalletInfo />
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Typography variant="h3" component="h1" paragraph>
          Wallet Page
        </Typography>
        <Typography gutterBottom>Wallet comes here</Typography>
        {/* <Account /> */}
        <br />
        <Button onClick={handleOpen}>Open modal</Button>
      </Container>
    </Page>
  );
}
