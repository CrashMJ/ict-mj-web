import { useState, useEffect } from 'react';
// @mui
import { Box, IconButton } from '@mui/material';
// hooks
import useResponsive from '../hooks/useResponsive';
// components
import Iconify from './Iconify';
import { DialogAnimate } from './animate';

// ----------------------------------------------------------------------

export default function HomeModal() {
  const [open, setOpen] = useState(false);
  const isMobile = useResponsive('down', 'sm');

  useEffect(() => {
    const timer = setTimeout(() => {
      setOpen(true);
    }, 1500); // Open after 1.5 seconds

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <DialogAnimate
      open={open}
      onClose={handleClose}
      fullScreen={isMobile}
      maxWidth="md"
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : 2,
          bgcolor: 'transparent',
          boxShadow: 'none',
          overflow: 'visible',
          backgroundImage: 'none',
          width: 'auto',
          m: 0,
          ...(isMobile ? { height: '100%', width: '100%' } : { maxHeight: '90vh' }),
        },
      }}
    >
      <Box
        sx={{
          position: 'relative',
          p: 0,
          overflow: 'hidden',
          borderRadius: isMobile ? 0 : 2,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          bgcolor: 'transparent',
          height: isMobile ? '100%' : 'auto',
          width: '100%',
        }}
      >
        <IconButton
          onClick={handleClose}
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            zIndex: 9,
            color: 'common.white',
            bgcolor: 'rgba(0,0,0,0.5)',
            transition: (theme) => theme.transitions.create('all'),
            '&:hover': {
              bgcolor: 'rgba(0,0,0,0.8)',
              transform: 'scale(1.1)',
            },
          }}
        >
          <Iconify icon="eva:close-fill" width={24} height={24} />
        </IconButton>

        <Box
          component="img"
          alt="Promotional Modal"
          src="/assets/results_modal.jpeg"
          sx={{
            cursor: 'pointer',
            width: '100%',
            height: isMobile ? '100%' : 'auto',
            maxHeight: isMobile ? '100%' : '90vh',
            objectFit: 'contain',
            transition: (theme) => theme.transitions.create('all'),
            '&:hover': {
              opacity: 0.95,
            },
          }}
        />
      </Box>
    </DialogAnimate>
  );
}
