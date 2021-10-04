// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import SvgIconStyle from '../../components/SvgIconStyle';

// ----------------------------------------------------------------------

const getIcon = (name: string) => (
  <SvgIconStyle src={`/static/icons/navbar/${name}.svg`} sx={{ width: '100%', height: '100%' }} />
);

const ICONS = {
  user: getIcon('ic_user'),
  ecommerce: getIcon('ic_ecommerce'),
  analytics: getIcon('ic_analytics'),
  dashboard: getIcon('ic_dashboard')
};

const sidebarConfig = [
  // GENERAL
  // ----------------------------------------------------------------------
  {
    subheader: 'general',
    items: [
      { title: 'Wallet', path: PATH_DASHBOARD.general.pageWallet, icon: ICONS.analytics },
      { title: 'Profile', path: PATH_DASHBOARD.general.pageProfile, icon: ICONS.dashboard },
      { title: 'NFTs', path: PATH_DASHBOARD.general.pageNFTs, icon: ICONS.ecommerce },
      { title: 'PDF', path: PATH_DASHBOARD.general.pagePDF, icon: ICONS.ecommerce }
    ]
  },

  // MANAGEMENT
  // ----------------------------------------------------------------------
  {
    subheader: 'management',
    items: [
      {
        title: 'user',
        path: PATH_DASHBOARD.app.root,
        icon: ICONS.user,
        children: [
          { title: 'Four', path: PATH_DASHBOARD.app.pageFour },
          { title: 'Five', path: PATH_DASHBOARD.app.pageFive },
          { title: 'Six', path: PATH_DASHBOARD.app.pageSix }
        ]
      }
    ]
  }
];

export default sidebarConfig;
