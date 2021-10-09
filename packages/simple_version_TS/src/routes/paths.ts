// ----------------------------------------------------------------------

function path(root: string, sublink: string) {
  return `${root}${sublink}`;
}

const ROOTS_DASHBOARD = '/dashboard';

// ----------------------------------------------------------------------

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  general: {
    pageWallet: path(ROOTS_DASHBOARD, '/wallet'),
    pageProfile: path(ROOTS_DASHBOARD, '/profile'),
    pageNFTs: path(ROOTS_DASHBOARD, '/nfts'),
    pagePDF: path(ROOTS_DASHBOARD, '/pdf'),
    pageBuyCrypto: path(ROOTS_DASHBOARD, '/buycrypto'),
    pageSendCrypto: path(ROOTS_DASHBOARD, '/sendcrypto')
  },
  app: {
    root: path(ROOTS_DASHBOARD, '/app'),
    pageFour: path(ROOTS_DASHBOARD, '/app/four'),
    pageFive: path(ROOTS_DASHBOARD, '/app/five'),
    pageSix: path(ROOTS_DASHBOARD, '/app/six')
  }
};
