import PropTypes from 'prop-types';
import { memo } from 'react';
// next
import NextLink from 'next/link';
// @mui
import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/material';

// ----------------------------------------------------------------------

Logo.propTypes = {
  isSimple: PropTypes.bool,
  onDark: PropTypes.bool,
  sx: PropTypes.object,
};

function Logo({ onDark = false, isSimple = false, sx }) {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';

  const PRIMARY_MAIN = theme.palette.primary.main;
  const LIGHT_COLOR = theme.palette.common.white;
  const DARK_COLOR = theme.palette.grey[800];

  return (
    <NextLink href="/" passHref>
      <Box
      component="img"
      src="/assets/newLogo.png"
      alt="ICT Kathurusinghe"
      sx={{
            width: { xs: 100, sm: 120, md: 130 }, // 📱 smaller on mobile, 130px on desktop
            height: 'auto',
          }}
    />
      {/* <Box
        translate="no"
        sx={{
          // width: isSimple ? 64 : 75,
          // lineHeight: 0,
          cursor: 'pointer',
          display: 'inline-flex',
          fontWeight: 700,
          ...sx,
        }}
      >
        ICT{'  '}&nbsp;
        <Box component="span" sx={{ color: 'primary.main' }} translate="no">
          KATHURUSINGHA{' '}
        </Box>
      </Box> */}
    </NextLink>
  );
}

export default memo(Logo);
