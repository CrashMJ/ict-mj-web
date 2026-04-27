import { memo } from 'react';
import { m } from 'framer-motion';
// @mui
import { styled, alpha, useTheme } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
// components
import { Image } from '../../components';
// pattern
import { Icon, Label, Shape, Pattern01, Pattern02 } from '../pattern';

// ----------------------------------------------------------------------

const varUp = {
  animate: { y: [-8, 8, -8], x: [-4, 4, -4] },
  transition: { duration: 8, repeat: Infinity },
};

const varDown = {
  animate: { y: [8, -8, 8], x: [4, -4, 4] },
  transition: { duration: 8, repeat: Infinity },
};

const varLeft = {
  animate: { x: [8, -8, 8], y: [4, -4, 4] },
  transition: { duration: 7, repeat: Infinity },
};

const varRight = {
  animate: { x: [8, -8, 8], y: [4, -4, 4] },
  transition: { duration: 7, repeat: Infinity },
};

const styleIconContent = {
  fontSize: 22,
  color: 'common.black',
  fontWeight: 'fontWeightBold',
};

const RootStyle = styled(Box)(() => ({
  width: 670,
  height: 670,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
}));

// ----------------------------------------------------------------------

function ElearningHeroIllustration({ ...other }) {
  const theme = useTheme();

  const GREEN = theme.palette.success.main;
  const YELLOW = theme.palette.warning.main;
  const BLUE = '#355EC9';
  const PURPLE = '#9B3AB1';

  return (
    <RootStyle {...other}>
      <Box sx={{ position: 'absolute', right: 18, bottom: 28, zIndex: 8 }}>
        <Image
          placeholderSrc=""
          alt="teacher"
          src="/assets/main.png"
          sx={{ width: 546, height: 650 }}
        />
      </Box>

      <Box
        {...varDown}
        component={m.div}
        sx={{ position: 'absolute', left: 115, bottom: 115, zIndex: 8 }}
      >
        <Image
          alt="book icon"
          src="https://zone-assets-api.vercel.app/assets/icons/ic_book.png"
          sx={{ width: 52, height: 62 }}
        />
      </Box>

      <Box
        {...varDown}
        component={m.div}
        sx={{ position: 'absolute', left: 65, bottom: 35, zIndex: 8 }}
      >
        <Image
          alt="book icon"
          src="https://zone-assets-api.vercel.app/assets/icons/ic_pencil.png"
          sx={{ width: 52, height: 62 }}
        />
      </Box>

      <Box
        {...varRight}
        component={m.div}
        sx={{ position: 'absolute', left: 200, top: 56, zIndex: 8 }}
      >
        <Image src="/assets/office.png" sx={{ width: 60, height: 77 }} />
      </Box>

      <Box
        {...varRight}
        component={m.div}
        sx={{ position: 'absolute', left: 50, top: 23, zIndex: 8 }}
      >
        <Image src="/assets/html_css.png" sx={{ width: 80, height: 50 }} />
      </Box>

      <Box
        {...varRight}
        component={m.div}
        sx={{ position: 'absolute', right: 70, bottom: 50, zIndex: 8 }}
      >
        <Image src="/assets/python.png" sx={{ width: '100%', height: 77 }} />
      </Box>

      <Box
        {...varRight}
        component={m.div}
        sx={{ position: 'absolute', right: 72, top: 88, zIndex: 2 }}
      >
        <Image src="/assets/iot.png" sx={{ width: 80, height: 77 }} />
      </Box>

      <Box {...varRight} component={m.div} sx={{ position: 'absolute', right: 90, zIndex: 8 }}>
        <Image
          src="/assets/mysql.png"
          sx={{ width: 80, height: 80, transform: 'scale(1) translateY(20px) rotate(15deg)' }}
        />
      </Box>

      <Box {...varRight} component={m.div} sx={{ position: 'absolute', left: 90, zIndex: 8 }}>
        <Image
          src="/assets/php.png"
          sx={{ width: 80, height: 40, transform: 'scale(1) translateY(20px) rotate(15deg)' }}
        />
      </Box>

      <Pattern01 sx={{ left: 0, top: 0 }} />
      <Pattern02 sx={{ top: 0, left: 0, opacity: 0.24, transform: 'scale(1.2)' }} />
      {/* <Shape sx={{ position: 'absolute', right: 32, bottom: 32 }} /> */}
    </RootStyle>
  );
}

export default memo(ElearningHeroIllustration);
