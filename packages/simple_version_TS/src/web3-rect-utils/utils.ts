import { UnsupportedChainIdError } from '@web3-react/core'
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected
} from '@web3-react/injected-connector'
import { UserRejectedRequestError as UserRejectedRequestErrorWalletConnect } from '@web3-react/walletconnect-connector'
import { UserRejectedRequestError as UserRejectedRequestErrorFrame } from '@web3-react/frame-connector'
import { Web3Provider } from '@ethersproject/providers'

import {
  injected,
  network,
  walletconnect,
  walletlink,
  ledger,
  trezor,
  lattice,
  frame,
  authereum,
  fortmatic,
  magic,
  portis,
  torus
} from '../web3-rect-utils/connectors'

export enum ConnectorNames {
    Injected = 'Injected',
    Network = 'Network',
    WalletConnect = 'WalletConnect',
    WalletLink = 'WalletLink',
    Ledger = 'Ledger',
    Trezor = 'Trezor',
    Lattice = 'Lattice',
    Frame = 'Frame',
    Authereum = 'Authereum',
    Fortmatic = 'Fortmatic',
    Magic = 'Magic',
    Portis = 'Portis',
    Torus = 'Torus'
  }
  
  export const connectorsByName: { [connectorName in ConnectorNames as string]: any } = {
    [ConnectorNames.Injected]: injected,
    [ConnectorNames.Network]: network,
    [ConnectorNames.WalletConnect]: walletconnect,
    [ConnectorNames.WalletLink]: walletlink,
    [ConnectorNames.Ledger]: ledger,
    [ConnectorNames.Trezor]: trezor,
    [ConnectorNames.Lattice]: lattice,
    [ConnectorNames.Frame]: frame,
    [ConnectorNames.Authereum]: authereum,
    [ConnectorNames.Fortmatic]: fortmatic,
    [ConnectorNames.Magic]: magic,
    [ConnectorNames.Portis]: portis,
    [ConnectorNames.Torus]: torus
  }
  
  export function getErrorMessage(error: Error) {
    if (error instanceof NoEthereumProviderError) {
      return 'No Ethereum browser extension detected, install MetaMask on desktop or visit from a dApp browser on mobile.'
    } else if (error instanceof UnsupportedChainIdError) {
      return "You're connected to an unsupported network."
    } else if (
      error instanceof UserRejectedRequestErrorInjected ||
      error instanceof UserRejectedRequestErrorWalletConnect ||
      error instanceof UserRejectedRequestErrorFrame
    ) {
      return 'Please authorize this website to access your Ethereum account.'
    } else {
      console.error(error)
      return 'An unknown error occurred. Check the console for more details.'
    }
  }
  
  export function getLibrary(provider: any): Web3Provider {
    const library = new Web3Provider(provider)
    library.pollingInterval = 12000
    return library
  }

  export const NETWORKS : any = {
    localhost: {
      name: "localhost",
      color: "#666666",
      chainId: 31337,
      blockExplorer: "",
      rpcUrl: "http://" + window.location.hostname + ":8545",
    },
    mainnet: {
      name: "mainnet",
      color: "#ff8b9e",
      chainId: 1,
      rpcUrl: `https://mainnet.infura.io/v3/${process.env.REACT_APP_RPC_URL_1}`,
      blockExplorer: "https://etherscan.io/",
    },
    kovan: {
      name: "kovan",
      color: "#7003DD",
      chainId: 42,
      rpcUrl: `https://kovan.infura.io/v3/${process.env.REACT_APP_RPC_URL_1}`,
      blockExplorer: "https://kovan.etherscan.io/",
      faucet: "https://gitter.im/kovan-testnet/faucet", // https://faucet.kovan.network/
    },
    rinkeby: {
      name: "rinkeby",
      color: "#e0d068",
      chainId: 4,
      rpcUrl: `https://rinkeby.infura.io/v3/${process.env.REACT_APP_RPC_URL_1}`,
      faucet: "https://faucet.rinkeby.io/",
      blockExplorer: "https://rinkeby.etherscan.io/",
    },
    ropsten: {
      name: "ropsten",
      color: "#F60D09",
      chainId: 3,
      faucet: "https://faucet.ropsten.be/",
      blockExplorer: "https://ropsten.etherscan.io/",
      rpcUrl: `https://ropsten.infura.io/v3/${process.env.REACT_APP_RPC_URL_1}`,
    },
    goerli: {
      name: "goerli",
      color: "#0975F6",
      chainId: 5,
      faucet: "https://goerli-faucet.slock.it/",
      blockExplorer: "https://goerli.etherscan.io/",
      rpcUrl: `https://goerli.infura.io/v3/${process.env.REACT_APP_RPC_URL_1}`,
    },
    xdai: {
      name: "xdai",
      color: "#48a9a6",
      chainId: 100,
      price: 1,
      gasPrice: 1000000000,
      rpcUrl: "https://dai.poa.network",
      faucet: "https://xdai-faucet.top/",
      blockExplorer: "https://blockscout.com/poa/xdai/",
    },
    matic: {
      name: "matic",
      color: "#2bbdf7",
      chainId: 137,
      price: 1,
      gasPrice: 1000000000,
      rpcUrl: "https://rpc-mainnet.maticvigil.com",
      faucet: "https://faucet.matic.network/",
      blockExplorer: "https://explorer-mainnet.maticvigil.com//",
    },
    mumbai: {
      name: "mumbai",
      color: "#92D9FA",
      chainId: 80001,
      price: 1,
      gasPrice: 1000000000,
      rpcUrl: "https://rpc-mumbai.maticvigil.com",
      faucet: "https://faucet.matic.network/",
      blockExplorer: "https://mumbai-explorer.matic.today/",
    },
    localArbitrum: {
      name: "localArbitrum",
      color: "#50a0ea",
      chainId: 153869338190755,
      blockExplorer: "",
      rpcUrl: `http://localhost:8547`,
    },
    localArbitrumL1: {
      name: "localArbitrumL1",
      color: "#50a0ea",
      chainId: 44010,
      blockExplorer: "",
      rpcUrl: `http://localhost:7545`,
    },
    rinkebyArbitrum: {
      name: "Arbitrum Testnet",
      color: "#50a0ea",
      chainId: 421611,
      blockExplorer: "https://rinkeby-explorer.arbitrum.io/#/",
      rpcUrl: `https://rinkeby.arbitrum.io/rpc`,
    },
    arbitrum: {
      name: "Arbitrum",
      color: "#50a0ea",
      chainId: 42161,
      blockExplorer: "https://explorer.arbitrum.io/#/",
      rpcUrl: `https://arb1.arbitrum.io/rpc`,
      gasPrice: 0,
    },
    localOptimismL1: {
      name: "localOptimismL1",
      color: "#f01a37",
      chainId: 31337,
      blockExplorer: "",
      rpcUrl: "http://" + window.location.hostname + ":9545",
    },
    localOptimism: {
      name: "localOptimism",
      color: "#f01a37",
      chainId: 420,
      blockExplorer: "",
      rpcUrl: "http://" + window.location.hostname + ":8545",
      gasPrice: 0,
    },
    kovanOptimism: {
      name: "kovanOptimism",
      color: "#f01a37",
      chainId: 69,
      blockExplorer: "https://kovan-optimistic.etherscan.io/",
      rpcUrl: `https://kovan.optimism.io`,
      gasPrice: 0,
    },
    optimism: {
      name: "optimism",
      color: "#f01a37",
      chainId: 10,
      blockExplorer: "https://optimistic.etherscan.io/",
      rpcUrl: `https://mainnet.optimism.io`,
    },
    localAvalanche: {
      name: "localAvalanche",
      color: "#666666",
      chainId: 43112,
      blockExplorer: "",
      rpcUrl: `http://localhost:9650/ext/bc/C/rpc`,
      gasPrice: 225000000000,
    },
    fujiAvalanche: {
      name: "fujiAvalanche",
      color: "#666666",
      chainId: 43113,
      blockExplorer: "https://cchain.explorer.avax-test.network/",
      rpcUrl: `https://api.avax-test.network/ext/bc/C/rpc`,
      gasPrice: 225000000000,
    },
    mainnetAvalanche: {
      name: "mainnetAvalanche",
      color: "#666666",
      chainId: 43114,
      blockExplorer: "https://cchain.explorer.avax.network/",
      rpcUrl: `https://api.avax.network/ext/bc/C/rpc`,
      gasPrice: 225000000000,
    },
    testnetHarmony: {
      name: "Harmony Testnet",
      color: "#00b0ef",
      chainId: 1666700000,
      blockExplorer: "https://explorer.pops.one/",
      rpcUrl: `https://api.s0.b.hmny.io`,
      gasPrice: 1000000000,
    },
    mainnetHarmony: {
      name: "Harmony Mainnet",
      color: "#00b0ef",
      chainId: 1666600000,
      blockExplorer: "https://explorer.harmony.one/",
      rpcUrl: `https://api.harmony.one`,
      gasPrice: 1000000000,
    },
  };
  
  export const NETWORK = (chainId: number) => {
    for (const n in NETWORKS) {
      if (NETWORKS[n].chainId === chainId) {
        return NETWORKS[n];
      }
    }
  };