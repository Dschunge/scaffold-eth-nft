import { useState, useRef } from 'react';
// material
import { Container, Typography, Button, Avatar, Chip } from '@mui/material';
// hooks
import useSettings from '../hooks/useSettings';
// components
import Page from '../components/Page';
// import ConfirmDialog from '../components/ConfirmDialog';
import AlertDialog from '../components/AlertDialog';
import QrCodeDialog from '../components/QRCodeDialog';
// Hooks
import useInterval from '../hooks/useInterval';
import useOnlineStatus from '../hooks/OnlineStatus';
import useNetworkStatus from '../hooks/NetworkStatus';
import Blockies from 'react-blockies';
// ----------------------------------------------------------------------

import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { purple } from '@mui/material/colors';

export default function PageProfile() {
  const { themeStretch } = useSettings();
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '', onConfirm: {} })
  const [open, setAlertDialogOpen] = useState(false);
  const snackBarRef = useRef(null);
  const qrcodeDialogRef = useRef(null);
  const [count, setCount] = useState(0);

  useInterval(() => {
    // Your custom logic here
    setCount(count + 1);
    console.log('connection: ', connection)
  }, 3000);
  const online = useOnlineStatus();
  let connection = useNetworkStatus();


  return (
    <Page title="Page Three | Minimal-UI">
      {/* <ConfirmDialog
        confirmDialog={confirmDialog}
        setConfirmDialog={setConfirmDialog}
      /> */}
      <AlertDialog
        defaultOpen={false}
        ref={snackBarRef}
        id='dasddsad'
        title='Error'
        content={'test'}
        onClose={() => {
          console.log('AlertDialog close');
        }} />
      <QrCodeDialog
        defaultOpen={false}
        ref={qrcodeDialogRef}
        id='qrcodedialog'
        title='QR Code'
        content={' Only send ETH or any ERC-20 token to this address!'}
        qrcode={'0x16EdFf02d1607b75a4d847608EaE57F2EB1ca2DA'}
        onClose={() => {
          console.log('QrCodeDialog close');
        }} />

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Typography variant="h3" component="h1" paragraph>
          Page Profile {count}
        </Typography>
        <Typography gutterBottom>Profile comes here {online ? "Online" : "Offline"}</Typography>
        <br />
        <Button
          variant="contained" color="success"
          onClick={() => {
            setConfirmDialog({
              isOpen: true,
              title: 'Are you sure to delete this record?',
              subTitle: "You can't undo this operation",
              onConfirm: () => {
                console.log('object')
              }
            })
          }}
        >
          Open Dialog
        </Button>
        <Button
          variant="contained" color="success"
          onClick={() => {
            // @ts-ignore
            snackBarRef.current.OpenDialog();
          }}
        >
          Open Alert
        </Button>
        <Button
          variant="contained" color="success"
          onClick={() => {
            // @ts-ignore
            qrcodeDialogRef.current.OpenDialog();
          }}
        >
          Open Qr Code Dialog
        </Button>
        <br /> <br /> <br />
        <Avatar>
          <Blockies seed={'0x16EdFf02d1607b75a4d847608EaE57F2EB1ca2DA'} size={15} scale={3} />
        </Avatar>
        <br />
        <Chip
          clickable
          variant="outlined"
          icon={<AccountBalanceWalletIcon
            sx={{
              color: `${purple[500]} !important`
            }}
          />}
          label={' 123 Gwei'}
          onDelete={() => { }}
          deleteIcon={<AccountBalanceWalletIcon />}
        />
      </Container>
    </Page>
  );
}
