import React, { useState, useEffect, Ref } from 'react'
import {
    TextField,
    InputAdornment,
    Paper,
    Button,
    Avatar,
    Box
} from '@mui/material';
import Blockies from 'react-blockies';
import QrReader from "react-qr-reader";
import useSound from 'use-sound';
//import beep from './scanner-beep.mp3';


import { styled } from '@mui/material/styles';

// import { useWeb3React } from '@web3-react/core';
// import { Web3Provider } from '@ethersproject/providers'
// import { ethers } from 'ethers';
// import { formatEther } from '@ethersproject/units';
// import { NETWORKS } from '../../web3-rect-utils/utils'
import QrCodeIcon from '@mui/icons-material/QrCode';

const beep = require("./scanner-beep.mp3");

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(0),
    textAlign: 'right',
    color: theme.palette.text.secondary,


}));

export interface BalanceHeaderFieldProps {
    children?: React.ReactNode;
    formik: any;
}

export default function AddressFormField(props: BalanceHeaderFieldProps, ref: Ref<any>) {
    const { children, formik, ...other } = props;
    const { errors, touched, getFieldProps, handleChange } = formik;

    const [addr, setaddress] = useState('');
    const [scan, setScan] = useState(false);
    const soundUrl = './scanner-beep.mp3';

    const [play] = useSound(
        //'./scanner-beep.mp3',
        beep,
        { volume: 1 }
    );

    const OpenScanner = () => {
        console.log('scan: ', beep)
        // setScan(!scan);
        play()
    }

    const onAdressChange = (e: any) => {
        handleChange(e);
        const { value } = e.target;
        setaddress(value);
    }

    const scanner = scan ? (
        <Box
            sx={{
                zIndex: 256,
                position: "absolute",
                left: 0,
                top: 0,
                width: 500,
                height: 500,
                bgcolor: 'primary.dark',
                '&:hover': {
                    backgroundColor: 'primary.main',
                    opacity: [0.9, 0.8, 0.7],
                },
            }}
            onClick={() => {
                setScan(false);
            }}
        >
            <QrReader
                delay={250}
                resolution={1200}
                onError={(e: any) => {
                    console.log("SCAN ERROR", e);
                    setScan(false);
                }}
                onScan={(newValue: string) => {
                    if (newValue) {
                        console.log("SCAN VALUE", newValue);
                        let possibleNewValue = newValue;
                        if (possibleNewValue.indexOf("/") >= 0) {
                            possibleNewValue = possibleNewValue.substr(possibleNewValue.lastIndexOf("0x"));
                            console.log("CLEANED VALUE", possibleNewValue);
                        }
                        setScan(false);
                        setaddress(possibleNewValue);

                        //updateAddress(possibleNewValue);
                    }
                }}
                style={{ width: "100%" }}
            />
        </Box>
    ) : (
        ""
    );

    return (
        <>
            {scanner}
            <TextField
                fullWidth
                autoComplete="address"
                type="text"
                label="Address or ENS"
                {...getFieldProps('address')}
                onChange={onAdressChange}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <Avatar sx={{ width: 30, height: 30 }}>
                                <Blockies seed={addr} size={10} scale={3} />
                            </Avatar>
                        </InputAdornment>
                    ),
                    endAdornment: (
                        <InputAdornment position="end">
                            <Button onClick={OpenScanner} size="small" variant="contained" startIcon={< QrCodeIcon />}>
                                Scan
                            </Button>
                        </InputAdornment>
                    )
                }}
                error={Boolean(touched.address && errors.address)}
                helperText={touched.address && errors.address ? errors.address : 'Enter a valid Ether address. It must start with 0x'}
            />
        </>
    )
}
