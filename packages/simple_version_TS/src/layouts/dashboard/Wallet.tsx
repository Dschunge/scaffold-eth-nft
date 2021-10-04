import { useRef, useState, useEffect } from 'react';
// material
import { alpha } from '@mui/material/styles';
import { Avatar, Button, Box, Divider, Typography, Grid, Stack } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import LaunchIcon from '@mui/icons-material/Launch';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import Tooltip from '@mui/material/Tooltip';

// components
import MenuPopover from '../../components/MenuPopover';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { NETWORK, getErrorMessage, ConnectorNames, connectorsByName } from '../../web3-rect-utils/utils';
import CustomizedSnackbar from '../../components/CustomizedSnackbar';
import Account from '../../components/Account';
import { useEagerConnect, useInactiveListener } from '../../web3-rect-utils/hooks';

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'left',
  color: theme.palette.text.secondary,
}));

export default function Wallet() {
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

  const anchorRef = useRef(null);
  const snackBarRef = useRef(null);
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const GetAddress = () => {
    const address: string = account === undefined || account === null ? '' : account
    const displayAddress = `${address.substring(0, 6)}...${address.substring(address.length - 4)}`

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
        <Stack direction="row" spacing={0}>
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
        <Stack direction="row" spacing={1}>
          <FiberManualRecordIcon sx={{ fontSize: '14px !important', color: '#00e676' }} />
          <Typography sx={{ fontSize: '12px !important' }} variant="subtitle1" noWrap>
            {networkname ? networkname.toUpperCase() : 'UNKNOWN'}
          </Typography>
          <Typography sx={{ fontSize: '12px !important' }} variant="subtitle1" noWrap>
            Blocknumber: {BlockNumber()}
          </Typography>
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
          //anchorEl={anchorEl}
          sx={{ width: 300 }}
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
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Avatar
                  alt="Remy Sharp"
                  src="/static/images/avatar/1.jpg"
                  sx={{ width: 46, height: 46 }}
                />
              </Grid>
              <Grid item xs={8}>
                <GetAddress />
              </Grid>
            </Grid>
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
