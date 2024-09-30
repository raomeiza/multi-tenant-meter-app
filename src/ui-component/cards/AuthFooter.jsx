// material-ui
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

// ==============================|| FOOTER - AUTHENTICATION 2 & 3 ||============================== //

const AuthFooter = () => (
  <Stack direction="row" justifyContent="space-between">
    <Typography variant="subtitle2" component={Link} href="https://github.com/raomeiza" target="_blank" underline="hover">
      R A Omeiza
    </Typography>
    <Typography variant="subtitle2" component={Link} href="https://futminna.edu.ng" target="_blank" underline="hover">
      &copy; FUTMX
    </Typography>
  </Stack>
);

export default AuthFooter;
