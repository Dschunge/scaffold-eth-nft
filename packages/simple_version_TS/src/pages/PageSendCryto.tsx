import * as Yup from 'yup';
import { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { Link as RouterLink } from 'react-router-dom';
import { useFormik, useField, FormikProps, Form, FormikProvider } from 'formik';
import { Icon } from '@iconify/react';
import eyeFill from '@iconify/icons-eva/eye-fill';
import closeFill from '@iconify/icons-eva/close-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import QrCodeIcon from '@mui/icons-material/QrCode';
// material
import {
  Link,
  Stack,
  Alert,
  Checkbox,
  TextField,
  IconButton,
  InputAdornment,
  FormControlLabel,
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Button
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
// material
// hooks
import useSettings from '../hooks/useSettings';
// components
import Page from '../components/Page';
// hooks
import useIsMountedRef from '../hooks/useIsMountedRef';
//
import { MIconButton } from '../components/@material-extend';

import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers'
import { ethers } from 'ethers';
import { formatEther } from '@ethersproject/units'

import BalanceFormField from 'components/wallet/BalanceFormField';
import AddressFormField from 'components/wallet/AddressFormField';
import AmountsFormFields from 'components/wallet/AmountsFormFields';
// ----------------------------------------------------------------------

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(0),
  textAlign: 'right',
  color: theme.palette.text.secondary,


}));

type InitialValues = {
  address: string;
  amountETH: number | undefined;
  amountUSD: number | undefined;
  // amount?: number;
  rememberAddress: boolean;
  afterSubmit?: string;
};

export default function PageSendCrypto() {
  const { chainId, account, library, active } = useWeb3React<Web3Provider>()
  const { themeStretch } = useSettings();
  const isMountedRef = useIsMountedRef();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  // const provider = new ethers.providers.StaticJsonRpcProvider(process.env.REACT_APP_RPC_URL_1)
  // const signer = provider.getSigner();

  const [tranactionError, setTranactionError] = useState<string>('');
  const [txs, setTxs] = useState<string>('');

  //let address: string = '';
  //let address = account && account ? account : ''

  const sendPayment = async ({ setTranactionError, setTxs, amount, addr }: { setTranactionError: any, setTxs: any, amount: any, addr: string }) => {
    console.log('sendPayment: ', amount)
    try {
      //@ts-ignore
      if (!window.ethereum)
        throw new Error("No crypto wallet found. Please install it.");
      const signer = library ? library.getSigner() : null;
      if (signer) {
        const tx = await signer.sendTransaction({
          to: addr,
          value: ethers.utils.parseEther(amount)
        });
        console.log({ amount, addr });
        console.log("tx", tx);
        setTxs(tx);
      }
    } catch (err: any) {
      setTranactionError(err.message);
    }
  };

  const SendTransactionSchema = Yup.object().shape({
    address: Yup.string()
      .required('Address or ENS is required')
      .matches(/0x[a-fA-F0-9]{40}/g, "Address is incorrect.")
      .length(42, 'Address is invalid (incorrect length).'),
    amountETH: Yup.number().required('Amount in ETH is required').positive().typeError('Must be a number'),
    amountUSD: Yup.number().required('Amount in USD is required').positive().typeError('Must be a number'),
    //amount: Yup.number().required('Amount in USD is required').positive().typeError('Must be a number')
  });

  const formik = useFormik<InitialValues>({
    initialValues: {
      address: '0x30EdcaD91A1cB80a88AbA225d6b5Ab51213B9787',
      //samount: 0,
      amountETH: 0,
      amountUSD: 0,
      rememberAddress: false
    },
    validationSchema: SendTransactionSchema,

    onSubmit: async (values, { setErrors, setSubmitting, resetForm }) => {
      try {
        // await login(values.email, values.password);
        console.log('values: ', values)
        await sendPayment({ setTranactionError, setTxs, amount: values.amountETH, addr: values.address })
        await new Promise((resolve) => setTimeout(resolve, 1500))
        setTranactionError('');
        setTxs('')
        resetForm();
        enqueueSnackbar('Transaction success', {
          variant: 'success',
          action: (key: any) => (
            <MIconButton size="small" onClick={() => closeSnackbar(key)}>
              <Icon icon={closeFill} />
            </MIconButton>
          )
        });
        if (isMountedRef.current) {
          setSubmitting(false);
        }
      } catch (error: any) {
        console.error(error);
        resetForm();
        if (isMountedRef.current) {
          setSubmitting(false);
          setErrors({ afterSubmit: error.message });
        }
      }
    },
  });

  const { errors, touched, values, handleChange, isSubmitting, handleSubmit, getFieldProps } = formik;

  return (
    <Page title="Send transaction">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Typography variant="h3" component="h1" paragraph>
          Send Crypto Currencies
        </Typography>
        <Typography gutterBottom>Send Crypto Currencies & NFT's</Typography>
        <Box
          sx={{
            width: 560,
            height: 500,
            m: 10
          }}
        >
          {tranactionError.length > 0 && (<Alert severity="error">{tranactionError}</Alert>)}
          {txs.length > 0 && (<Alert severity="success">{txs}</Alert>)}
          <FormikProvider value={formik}>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
              <Stack spacing={0}>
                {errors.afterSubmit && <Alert severity="error">{errors.afterSubmit}</Alert>}
                <AddressFormField formik={formik} />
                <AmountsFormFields formik={formik} />
                {/* <BalanceFormField formik={formik} /> */}
              </Stack>

              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
                <FormControlLabel
                  control={<Checkbox {...getFieldProps('remember')} checked={values.rememberAddress} />}
                  label="Remember address"
                />

                <Link component={RouterLink} variant="subtitle2" to={''}>
                  Some Link
                </Link>
              </Stack>

              <LoadingButton
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                loading={isSubmitting}
              >
                Send
              </LoadingButton>
            </Form>
          </FormikProvider>
        </Box>
      </Container>
    </Page >
  );
}
