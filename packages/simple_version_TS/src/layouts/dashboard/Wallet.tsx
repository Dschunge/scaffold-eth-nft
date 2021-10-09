import { useRef, useState, useEffect } from 'react';
// material
import { alpha } from '@mui/material/styles';
import { Avatar, Button, Box, Divider, Typography, Grid, Stack, Chip } from '@mui/material';
import { makeStyles } from '@mui/styles';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import SendIcon from '@mui/icons-material/Send';
import AddIcon from '@mui/icons-material/Add';
import LaunchIcon from '@mui/icons-material/Launch';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import { purple } from '@mui/material/colors';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import Tooltip from '@mui/material/Tooltip';
import { Link as RouterLink, useLocation } from 'react-router-dom';

// components
import MenuPopover from '../../components/MenuPopover';
import Paper from '@mui/material/Paper';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { NETWORK, NETWORKS, getErrorMessage, ConnectorNames, connectorsByName } from '../../web3-rect-utils/utils';
import CustomizedSnackbar from '../../components/CustomizedSnackbar';
import Account from '../../components/Account';
import { useEagerConnect, useInactiveListener } from '../../web3-rect-utils/hooks';
import Blockies from 'react-blockies';

import {
  useGasPrice,
} from "eth-hooks";

const useStyles = makeStyles((theme: any) => ({
  gasGauge: {
    marginTop: theme.spacing(1),
  },
  blockNumber: {
    marginRight: theme.spacing(0.5)
  },
  gasStationIcon: {
    color: purple[500]
  }
}));

export default function Wallet() {
  const classes = useStyles();
  const context = useWeb3React<Web3Provider>()
  const { connector, library, chainId, account, activate, deactivate, active, error } = context

  // handle logic to recognize the connector currently being activated
  const [activatingConnector, setActivatingConnector] = useState<any>()
  useEffect(() => {
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
  const address: string = account === undefined || account === null ? '' : account

  const anchorRef = useRef(null);
  const snackBarRef = useRef(null);
  const [open, setOpen] = useState(false);

  const networkdata: any = chainId ? NETWORK(chainId) : null
  const networkname: string = networkdata && networkdata.name ? networkdata.name : '';
  const gasPrice = useGasPrice(NETWORKS.rinkeby, "fast");

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const GetAddress = () => {
    //const address: string = account === undefined || account === null ? '' : account
    const displayAddress = `${address.substring(0, 7)}...${address.substring(address.length - 7)}`

    function openOnEtherscanLink() {
      const networkdata: any = chainId ? NETWORK(chainId) : null
      const etherscan: any = networkdata && networkdata.blockExplorer ? networkdata.blockExplorer : null;
      console.log('link: ', etherscan)
      const link = `${etherscan || "https://etherscan.io/"}${"address/"}${address}`
      window.open(link, "_blank")
    }

    function copToClipboard() {
      navigator.clipboard.writeText(address);
      // @ts-ignore
      snackBarRef.current.showSnackBar();
    }
    return (
      <>
        <CustomizedSnackbar ref={snackBarRef} />
        <Stack direction="row" spacing={1}>
          <Typography sx={{ fontSize: '15px !important' }} variant="h6" component="h6" noWrap>
            {displayAddress}
          </Typography>
          <Tooltip title="Copy to clipboard" placement="bottom">
            <ContentCopyIcon onClick={copToClipboard} sx={{ marginTop: "5px !important", fontSize: '15px !important' }} />
          </Tooltip>
          <Tooltip title="Show on Etherscan: " placement="bottom">
            <LaunchIcon onClick={() => { openOnEtherscanLink() }} sx={{ marginTop: "5px !important", fontSize: '15px !important' }} />
          </Tooltip>
        </Stack>
        <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
          METAMASK
        </Typography>
      </>
    )
  }

  const GetNetwork = () => {

    const networkdata: any = chainId ? NETWORK(chainId) : null
    const networkname: string = networkdata && networkdata.name ? networkdata.name : '';

    return (
      <>

        <Typography variant="subtitle1" noWrap>
          Network
        </Typography>
        {/* <Stack direction="row" spacing={1}>
          <FiberManualRecordIcon sx={{ fontSize: '14px !important', color: '#00e676' }} />
          <Typography sx={{ fontSize: '12px !important' }} variant="subtitle1" noWrap>
            {networkname ? networkname.toUpperCase() : 'UNKNOWN'}
          </Typography>
          <Typography sx={{ fontSize: '12px !important' }} variant="subtitle1" noWrap>
            Blocknumber: {BlockNumber()}
          </Typography>
        </Stack> */}
        <Stack direction="row" spacing={0}>
          <div className={classes.gasGauge}>
            <Chip
              clickable
              className={classes.blockNumber}
              variant="outlined"
              icon={<FiberManualRecordIcon sx={{ fontSize: '14px !important', color: '#00e676' }} />}
              label={networkname ? networkname.toUpperCase() : 'UNKNOWN'}
            />
            <Chip
              clickable
              className={classes.blockNumber}
              variant="outlined"
              icon={<AccountTreeIcon />}
              label={BlockNumber()}
            />
            <Chip
              clickable
              // className={classes.blockNumber}
              variant="outlined"
              onClick={() => {
                window.open("https://ethgasstation.info/");
              }}
              // size="small"
              deleteIcon={<LocalGasStationIcon />}
              icon={<LocalGasStationIcon
                sx={{
                  color: `${purple[500]} !important`
                }}
              />}
              // icon={<LocalGasStationIcon className={classes.gasStationIcon} />}
              label={typeof gasPrice === "undefined" ? 0 : (parseInt(gasPrice.toString(), 10) / 10 ** 9) + ' Gwei'}
            />
          </div>
        </Stack>
      </>
    )
  }

  function BlockNumber() {
    const { chainId, library } = useWeb3React()

    const [blockNumber, setBlockNumber] = useState<number>()
    useEffect((): any => {
      if (!!library) {
        let stale = false

        library
          .getBlockNumber()
          .then((blockNumber: number) => {
            if (!stale) {
              setBlockNumber(blockNumber)
            }
          })
          .catch(() => {
            if (!stale) {
              setBlockNumber(undefined)
            }
          })

        const updateBlockNumber = (blockNumber: number) => {
          setBlockNumber(blockNumber)
        }
        library.on('block', updateBlockNumber)

        return () => {
          stale = true
          library.removeListener('block', updateBlockNumber)
          setBlockNumber(undefined)
        }
      }
    }, [library, chainId]) // ensures refresh if referential identity of library doesn't change across chainIds

    return (
      blockNumber === null ? 'Error' : blockNumber ?? ''
    )
  }

  return (
    <>
      <Account onClick={handleOpen} ref={anchorRef} />
      {connected && !error && (
        <MenuPopover
          open={open}
          onClose={handleClose}
          anchorEl={anchorRef.current}
          sx={{ width: 370 }}
        >
          <Box sx={{ my: 1.5, px: 2.5 }}>
            <Grid container spacing={2}>
              <Grid item xs={8}>
                <Typography variant="subtitle1" noWrap>
                  Account
                </Typography>
              </Grid>
              <Grid item xs={4}>
                {(active || error) && (
                  <Button onClick={() => { deactivate(); setOpen(false) }} size="small" variant="outlined">
                    Disconnect
                  </Button>
                )}
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ my: 1 }} />

          <Box sx={{ my: 1.5, px: 2.5 }}>
            <Grid container spacing={0}>
              <Grid item xs={3}>
                <Avatar>
                  <Blockies seed={address} size={10} scale={3} />
                </Avatar>
              </Grid>
              <Grid item xs={9}>
                <GetAddress />
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ my: 1 }} />

          <Box sx={{ p: 1, pt: 1.5 }}>
            <Stack direction="row" spacing={1}>
              <Button onClick={() => { setOpen(false) }} component={RouterLink} to="/dashboard/buycrypto" variant="contained" startIcon={<AddIcon />} >Buy Crypto</Button>
              <Button onClick={() => { setOpen(false) }} component={RouterLink} to="/dashboard/sendcrypto" variant="contained" endIcon={<SendIcon />}>
                Send
              </Button>
              <Button onClick={() => { setOpen(false) }} component={RouterLink} to="/dashboard/sendcrypto" variant="contained" endIcon={<QrCode2Icon />}>
                Receive
              </Button>
            </Stack>
          </Box>

          <Divider sx={{ my: 1 }} />

          <Box sx={{ p: 2, pt: 1.5 }}>
            <GetNetwork />
          </Box>
        </MenuPopover>
      )}
    </>
  );
}
