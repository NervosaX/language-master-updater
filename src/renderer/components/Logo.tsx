import Box from '@mui/system/Box';
import logo from '../../../assets/rooster-logo.png';

export default function Logo() {
  return (
    <Box
      sx={{
        backgroundImage: `url(${logo})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        width: '100%',
        height: 100,
      }}
    />
  );
}
