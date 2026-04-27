import { useState } from 'react';
// icons
import playIcon from '@iconify/icons-carbon/play';
import chevronRight from '@iconify/icons-carbon/chevron-right';
// @mui
import { styled } from '@mui/material/styles';
import { Typography, Stack, Container, Box, Grid, Divider, Button } from '@mui/material';
// utils
import { fShortenNumber } from '../../../utils/formatNumber';
// _data
import _mock from '../../../../_data/mock';
// assets
import { ElearningHeroIllustration } from '../../../assets';
// components
import { Iconify, TextIconLabel, PlayerWithButton } from '../../../components';
import { FabButtonAnimate } from '../../../components/animate';
import { TravelLandingSummary } from '../index';
import { LoginForm } from '../../../../src/sections/auth';
// ----------------------------------------------------------------------

const RootStyle = styled(Stack)(({ theme }) => ({
  overflow: 'hidden',
  paddingTop: theme.spacing(15),
  paddingBottom: theme.spacing(10),
  [theme.breakpoints.up('md')]: {
    minHeight: '100vh',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: theme.spacing(15),
  },
}));

// ----------------------------------------------------------------------

export default function ElearningLandingHero({ siteContent }) {
  const [openVideo, setOpenVideo] = useState(false);
  // console.log(siteContent);
  const handleOpenVideo = () => {
    setOpenVideo(true);
  };

  const handleCloseVideo = () => {
    setOpenVideo(false);
  };

  return (
    <>
      <RootStyle>
        <Container>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={5}>
              <Stack
                sx={{
                  textAlign: { xs: 'center', md: 'unset' },
                }}
              >
                <Typography variant="h1" translate="no">
                  ICT
                  <Box component="span" sx={{ color: 'text.disabled' }}>
                    {' '}
                  </Box>
                  <Box component="span" sx={{ color: 'primary.main', textDecoration: 'underline' }}>
                    KATHURUSINGHA{' '}
                  </Box>
                </Typography>
                {/* <Typography sx={{ color: 'text.secondary', mt: 3, mb: 2 }}>
                  100% success, one and the best I.C.T Class in Sri Lanka 100% success, one and the
                  best I.C.T Class in Sri Lanka 100% success 100% success, one and the best I.C.T
                  Class in Sri Lanka 100% success, one and the best I.C.T Class in Sri Lanka
                </Typography>
                <Divider sx={{ borderStyle: 'dashed', mb: 2 }} />
                <PlayerWithImage
                  imgPath="/assets/video_banner.jpg"
                  videoPath={'https://youtu.be/cpnf2qYfrT4'}
                  ratio="16/9"
                /> */}
                <Grid
                  item
                  xs={12}
                  md={12}
                  lg={12}
                  sx={{
                    marginTop: 5,
                  }}
                >
                  <Stack
                    spacing={4}
                    sx={{
                      p: 4,
                      textAlign: { xs: 'center', md: 'left' },
                      borderRadius: 2,
                      boxShadow: (theme) => theme.customShadows.z24,
                    }}
                  >
                    <div>
                      <Typography variant="h3" paragraph>
                        Login/Register
                      </Typography>
                    </div>

                    <LoginForm />
                  </Stack>
                </Grid>
              </Stack>
            </Grid>

            <Grid item xs={12} md={6} lg={7} sx={{ display: { xs: 'none', md: 'block' } }}>
              <ElearningHeroIllustration />
            </Grid>
          </Grid>
        </Container>
        <TravelLandingSummary siteContent={siteContent} />
      </RootStyle>

      <PlayerWithButton open={openVideo} onClose={handleCloseVideo} videoPath={_mock.video} />
    </>
  );
}

// ----------------------------------------------------------------------

function SummarySection() {
  return (
    <Stack
      spacing={{ xs: 3, sm: 10 }}
      direction="row"
      justifyContent={{ xs: 'center', md: 'unset' }}
    >
      {SummaryItem(14000, 'Learners', 'warning')}
      {SummaryItem(1050, 'Courses', 'error')}
      {SummaryItem(59000, 'Graduates', 'success')}
    </Stack>
  );
}

function SummaryItem(total, label, color) {
  return (
    <Stack spacing={0.5} sx={{ position: 'relative' }}>
      <Box
        sx={{
          top: 8,
          left: -4,
          width: 24,
          height: 24,
          zIndex: -1,
          opacity: 0.24,
          borderRadius: '50%',
          position: 'absolute',
          bgcolor: (theme) => theme.palette[color].main,
        }}
      />
      <Typography variant="h3">{fShortenNumber(total)}+</Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        {label}
      </Typography>
    </Stack>
  );
}
