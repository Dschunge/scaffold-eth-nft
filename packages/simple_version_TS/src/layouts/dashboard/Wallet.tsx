import { Avatar } from '@mui/material';
import Chip from '@mui/material/Chip';

export default function Wallet() {
  const onConnectClick = () => {
    console.log('click');
  };
  return (
    <Chip
      onClick={onConnectClick}
      sx={
        {
          // bgcolor: 'primary.main',
          // color: 'white'
        }
      }
      label="Connect Wallet"
      variant="outlined"
      avatar={
        <Avatar src="https://images.pexels.com/photos/8647814/pexels-photo-8647814.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500" />
      }
    />
  );
}
