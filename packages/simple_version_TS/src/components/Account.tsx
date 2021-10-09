import React, { useRef, Ref, forwardRef } from 'react'
// Ethers Project
import { Web3Provider } from '@ethersproject/providers'
import { ethers } from 'ethers';
import { formatEther } from '@ethersproject/units'
// Web3 React
import { useWeb3React } from '@web3-react/core'
import { useEagerConnect, useInactiveListener } from '../web3-rect-utils/hooks';
import { NETWORKS, getErrorMessage, ConnectorNames, connectorsByName } from '../web3-rect-utils/utils'
// material
import { Container, Typography, Stack, Chip, ChipProps, Avatar, Tooltip } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
// hooks
import useSettings from '../hooks/useSettings';
// components
import { alpha } from '@mui/material/styles';
// Icons
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
// Hooks
import { useExchangeEthPrice } from "eth-hooks/dapps/dex";
// Customised Components
import CustomizedSnackbar from '../components/CustomizedSnackbar'
import { Spinner } from '../components/Spinner';
import AlertDialog from './AlertDialog';

const styleModal = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const Account = forwardRef<HTMLButtonElement, ChipProps>(
    ({ onClick, children, sx, ...other }, ref: Ref<any>) => {
        const { themeStretch } = useSettings();
        const context = useWeb3React<Web3Provider>()
        const { connector, activate, active, error } = context

        // handle logic to recognize the connector currently being activated
        const [activatingConnector, setActivatingConnector] = React.useState<any>()
        React.useEffect(() => {
            if (activatingConnector && activatingConnector === connector) {
                setActivatingConnector(undefined)
            }
        }, [activatingConnector, connector])

        // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
        const triedEager = useEagerConnect()

        // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
        useInactiveListener(!triedEager || !!activatingConnector)

        const currentConnector = connectorsByName[ConnectorNames.Injected]
        const activating = currentConnector === activatingConnector
        const connected = currentConnector === connector
        // const disabled = !triedEager || !!activatingConnector || connected || !!errorx
        console.log('currentConnector: ', currentConnector)

        const provider = new ethers.providers.StaticJsonRpcProvider(process.env.REACT_APP_RPC_URL_1)
        const price = useExchangeEthPrice(NETWORKS.rinkeby, provider);
        const snackBarRef = useRef(null);

        const { account } = useWeb3React();
        const address: string = account === undefined || account === null ? '' : account
        const displayAddress = `${address.substring(0, 6)}...${address.substring(address.length - 4)}`

        function connectWallet() {
            setActivatingConnector(currentConnector)
            activate(currentConnector)
        }
        // function AccountChip() {
        //     const { account } = useWeb3React();
        //     const address: string = account === undefined || account === null ? '' : account
        //     const displayAddress = `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
        //     return (
        //         <>
        //             <Chip
        //                 ref={ref}
        //                 {...other}
        //                 sx={{
        //                     color: (theme) => alpha(theme.palette.grey[900], 0.72),
        //                     bgcolor: (theme) => alpha(theme.palette.grey[500], 0.72),
        //                     paddingRight: '7px',
        //                 }}
        //                 label={displayAddress}
        //                 //color="primary"
        //                 avatar={<Avatar alt="Natacha" src="/static/MetaMask_Fox.svg" />}
        //                 onDelete={() => {
        //                     console.log('click icon')
        //                     navigator.clipboard.writeText(address);
        //                     // @ts-ignore
        //                     snackBarRef.current.showSnackBar();
        //                 }}
        //                 deleteIcon={
        //                     <Tooltip title="Copy to clipboard" placement="bottom">
        //                         <ContentCopyIcon sx={{ fontSize: '15px !important' }} />
        //                     </Tooltip>
        //                 }
        //                 onClick={handleEvent}
        //             />
        //         </>
        //     )
        // }


        function BalanceChip() {
            const { account, library, chainId } = useWeb3React()
            const [balance, setBalance] = React.useState()
            const [dollarMode, setDollarMode] = React.useState(false);
            React.useEffect((): any => {
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
            // const bal = balance === null ? null : balance ? `${formatEther(balance)}` : null
            // const amount: number = bal === null ? parseInt('0') : (+bal).toFixed(3);

            // if (price && dollarMode) {
            //   const displayBalance = "$" + (amount * price).toFixed(2);
            // }
            let floatBalance = parseFloat("0.00");

            let usingBalance = balance;

            if (usingBalance) {
                const etherBalance = formatEther(usingBalance);
                parseFloat(etherBalance).toFixed(2);
                floatBalance = parseFloat(etherBalance);
            }

            let displayBalance = "Ξ " + floatBalance.toFixed(4);

            //const price = props.price || props.dollarMultiplier;

            if (price && dollarMode) {
                displayBalance = "$ " + (floatBalance * price).toFixed(2);
            }

            const title = dollarMode ? 'Ether' : 'USD'

            return (
                <>
                    <Tooltip title={'Click to show amount in ' + title} placement="bottom">
                        <Chip sx={{
                            // color: (theme) => alpha(theme.palette.text.secondary, 0.72),
                            // bgcolor: (theme) => alpha(theme.palette.success.main, 1),
                            paddingRight: '17px',
                        }}
                            label={displayBalance}
                            variant="outlined"
                            onClick={() => {
                                setDollarMode(!dollarMode);
                                console.log('click balance chip: ', dollarMode)
                            }}
                        />
                    </Tooltip>
                </>
            )
        }

        function SpinnerWithInfo() {
            return (
                <Stack direction="row" spacing={0}>
                    <Spinner color={'black'} style={{ height: '18px' }} />
                    <Typography sx={{ fontSize: '12px' }}>
                        Connect to Wallet...
                    </Typography>
                </Stack>
            )
        }

        const handleEvent = (event: any) => {
            // Pass event to caller via the onChild2Event prop.
            // You can do something with the event, or just pass it.            
            if (onClick) { onClick(event) }
        };

        return (
            <>
                <CustomizedSnackbar ref={snackBarRef} />
                {!!error && <AlertDialog
                    defaultOpen={true}
                    ref={snackBarRef}
                    id='--------'
                    title='Error'
                    content={getErrorMessage(error)}
                    onClose={() => {
                        console.log('AlertDialog close');
                    }} />}
                <Container
                    sx={{
                        mx: { xs: 0, md: 0 },
                        px: { xs: 0, md: 0 }
                    }}
                    maxWidth={themeStretch ? false : 'xl'}
                >
                    <Stack direction="row" spacing={-3}>
                        {connected && !activating && account && (<BalanceChip />)}
                        {connected && !activating && account && (
                            <Chip
                                clickable
                                ref={ref}
                                {...other}
                                sx={{
                                    // color: (theme) => alpha(theme.palette.grey[900], 0.72),
                                    // bgcolor: (theme) => alpha(theme.palette.grey[500], 0.72),
                                    paddingRight: '5px',
                                }}
                                label={displayAddress}
                                //color="primary"
                                avatar={<Avatar alt="Natacha" src="/static/MetaMask_Fox.svg" />}
                                onDelete={() => {
                                    console.log('click icon')
                                    navigator.clipboard.writeText("address");
                                    // @ts-ignore
                                    snackBarRef.current.showSnackBar();
                                }}
                                deleteIcon={
                                    <Tooltip title="Copy to clipboard" placement="bottom">
                                        <ContentCopyIcon sx={{ fontSize: '15px !important' }} />
                                    </Tooltip>
                                }
                                onClick={handleEvent}
                            />)}
                        {((!active || error) &&
                            <Tooltip title="Click to connect to a wallet" placement="bottom">
                                <Chip
                                    sx={{
                                        color: (theme) => alpha(theme.palette.grey[900], 0.72),
                                        //bgcolor: (theme) => alpha(theme.palette.grey[500], 0.72),
                                        paddingRight: '0px',
                                    }}
                                    icon={<AccountBalanceWalletIcon
                                        sx={{
                                            //fontSize: '1px !important'
                                        }}
                                    />}
                                    variant="outlined"
                                    onClick={connectWallet} label="Connect Wallet" />
                            </Tooltip>
                        )}
                    </Stack>
                </Container>
                {activating && <SpinnerWithInfo />}
            </>
        )
    }
);



export default Account
