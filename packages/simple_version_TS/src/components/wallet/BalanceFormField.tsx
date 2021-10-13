import React, { useState, useEffect, Ref } from 'react'
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
import { Icon } from '@iconify/react';
import eyeFill from '@iconify/icons-eva/eye-fill';
import closeFill from '@iconify/icons-eva/close-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';

import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers'
import { ethers } from 'ethers';
import { formatEther } from '@ethersproject/units';
import { NETWORKS } from '../../web3-rect-utils/utils'
// Hooks
import { useExchangeEthPrice } from "eth-hooks/dapps/dex";

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(0),
    textAlign: 'right',
    color: theme.palette.text.secondary,


}));

export interface BalanceHeaderFieldProps {
    children?: React.ReactNode;
    formik: any;
    // amount: number;  
    // onMaxAmount: (amount: number) => void;
}

export default function BalanceFormField(props: BalanceHeaderFieldProps, ref: Ref<any>) {
    const { children, formik, ...other } = props;

    const { errors, touched, values, handleChange, isSubmitting, handleSubmit, getFieldProps } = formik;


    const setMaxAmount = (event: React.SyntheticEvent) => {
        event.preventDefault();
        console.log('setMaxAmount')
        formik.setFieldValue('amount', (price && dollarMode ? floatBalance * price : floatBalance))
    };

    const setCurrency = () => {
        setDollarMode(!dollarMode)
    }

    const { account, library, chainId } = useWeb3React()
    const provider = new ethers.providers.StaticJsonRpcProvider(process.env.REACT_APP_RPC_URL_1)
    const price = useExchangeEthPrice(NETWORKS.rinkeby, provider);
    const [balance, setBalance] = useState()
    const [dollarMode, setDollarMode] = useState(false);

    useEffect((): any => {
        if (!!account && !!library) {
            let stale = false

            library
                .getBalance(account)
                .then((balance: any) => {
                    if (!stale) {
                        setBalance(balance)
                    }
                })
                .catch(() => {
                    if (!stale) {
                        setBalance(undefined)
                    }
                })

            return () => {
                stale = true
                setBalance(undefined)
            }
        }
    }, [account, library, chainId]) // ensures refresh if referential identity of library doesn't change across chainIds   
    let floatBalance = parseFloat("0.00");
    if (balance) {
        const etherBalance = formatEther(balance);
        parseFloat(etherBalance)
        floatBalance = parseFloat(etherBalance);
    }

    let displayBalance = floatBalance.toFixed(4);
    if (price && dollarMode) {
        displayBalance = (floatBalance * price).toFixed(4);
    }
    return (
        <>
            <Box sx={{ flexGrow: 1, marginBottom: '20px' }}>
                <Grid container spacing={0}>
                    <Grid item xs={11}>
                        <Item>Balance: {dollarMode ? '$ ' : 'Ξ '} {displayBalance}</Item>
                    </Grid>
                    <Grid item xs={1}>
                        <Item><Link onClick={setMaxAmount} href="#">MAX</Link></Item>
                    </Grid>
                </Grid>
                <TextField
                    fullWidth
                    autoComplete="amount"
                    type="text"
                    label="Amount"
                    {...getFieldProps('amount')}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <Button onClick={setCurrency} size="small" variant="outlined">{dollarMode ? 'ETH' : 'USD'}</Button>
                            </InputAdornment>
                        )
                    }}
                    error={Boolean(touched.amount && errors.amount)}
                    helperText={touched.amount && errors.amount}
                />
            </Box>
        </>
    )
}
