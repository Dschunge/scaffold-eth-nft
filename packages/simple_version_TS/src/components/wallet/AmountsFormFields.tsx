import React, { useState, useEffect, Ref } from 'react'
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import { formatEther } from '@ethersproject/units';
import { NETWORKS } from '../../web3-rect-utils/utils'
// Hooks
import { useExchangeEthPrice } from "eth-hooks/dapps/dex";
import {
    Link,
    Stack,
    TextField,
    InputAdornment,
    Box,
    Grid,
    Paper
} from '@mui/material';
import { styled } from '@mui/material/styles';;

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    paddingRight: theme.spacing(0),
    textAlign: 'right',
    color: theme.palette.text.secondary,
    backgroundColor: 'transparent'
}));

export interface BalanceHeaderFieldProps {
    children?: React.ReactNode;
    formik: any;
}

export default function AmountsFormFields(props: BalanceHeaderFieldProps, ref: Ref<any>) {
    const { children, formik, ...other } = props;
    const { errors, touched, values, handleChange, isSubmitting, handleSubmit, getFieldProps } = formik;

    const setMaxAmount = (event: React.SyntheticEvent) => {
        event.preventDefault();
        console.log('setMaxAmount')
        formik.setFieldValue('amountUSD', fiatBalance)
        formik.setFieldValue('amountETH', etherBalance)
    };

    const onChangeAmountETH = (e: any) => {
        handleChange(e);
        const { value } = e.target
        const amountFIAT = (parseFloat(value) * price).toFixed(2)
        formik.setFieldValue("amountUSD", amountFIAT);
    }

    const onChangeAmountUSD = (e: any) => {
        handleChange(e);
        const { value } = e.target
        const amountETH = (parseFloat(value) / price).toFixed(2)
        formik.setFieldValue("amountETH", amountETH);
    }

    const { account, library, chainId } = useWeb3React()
    const provider = new ethers.providers.StaticJsonRpcProvider(process.env.REACT_APP_RPC_URL_1)
    const price = useExchangeEthPrice(NETWORKS.mainnet, provider);
    const [etherBalance, setEtherBalance] = useState<string>('');
    const [fiatBalance, setFiatBalance] = useState<string>('');

    useEffect((): any => {
        if (!!account && !!library) {
            let stale = false

            library
                .getBalance(account)
                .then((balance: any) => {
                    if (!stale) {
                        //setBalance(balance)
                        const ether = parseFloat(formatEther(balance)).toFixed(4);
                        setEtherBalance(ether);
                        if (price) {
                            const fiat = (parseFloat(etherBalance) * price).toFixed(2);
                            setFiatBalance(fiat);
                        }
                    }
                })
                .catch(() => {
                    if (!stale) {
                        //setBalance(undefined)
                    }
                })

            return () => {
                stale = true
                // setBalance(undefined)
            }
        }
    }, [account, library, chainId, price]) // ensures refresh if referential identity of library doesn't change across chainIds   

    return (
        <>
            <Stack spacing={2} direction="row" alignItems="top" justifyContent="space-between" sx={{ marginTop: 2 }}>
                <Box sx={{ flexGrow: 1 }}>
                    <Grid container spacing={0}>
                        <Grid item xs={10}>
                            <Item>Balance: {'Ξ '} {etherBalance}</Item>
                        </Grid>
                        <Grid item xs={2}>
                            <Item><Link onClick={setMaxAmount} href="#">MAX</Link></Item>
                        </Grid>
                    </Grid>
                    <TextField
                        fullWidth
                        autoComplete=""
                        type="text"
                        //label="Amount in ETH"
                        {...getFieldProps('amountETH')}
                        InputProps={{
                            // startAdornment: <InputAdornment position="start">ETH</InputAdornment>,
                            endAdornment: <InputAdornment position="end" > ETH</InputAdornment>
                        }}
                        onChange={onChangeAmountETH}
                        error={Boolean(touched.amountETH && errors.amountETH)}
                        helperText={touched.amountETH && errors.amountETH}
                    />
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                    <Grid container spacing={1}>
                        <Grid item xs={10}>
                            <Item>Balance: {'$ '} {fiatBalance}</Item>
                        </Grid>
                        <Grid item xs={2}>
                            <Item><Link onClick={setMaxAmount} href="#">MAX</Link></Item>
                        </Grid>
                    </Grid>
                    <TextField
                        fullWidth
                        autoComplete=""
                        type="text"
                        //label="Amount in USD"
                        {...getFieldProps('amountUSD')}
                        InputProps={{
                            // startAdornment: <InputAdornment position="start">ETH</InputAdornment>,
                            endAdornment: <InputAdornment position="end" > $</InputAdornment>
                        }}
                        onChange={onChangeAmountUSD}
                        error={Boolean(touched.amountUSD && errors.amountUSD)}
                        helperText={touched.amountUSD && errors.amountUSD}
                    />
                </Box>
            </Stack>
        </>
    )
}
