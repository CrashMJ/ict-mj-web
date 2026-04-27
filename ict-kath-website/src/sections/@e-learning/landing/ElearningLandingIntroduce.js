// @mui
import { styled } from '@mui/material/styles';
import { Typography, Stack, Container, Grid, Box } from '@mui/material';
// components
import { Image } from '../../../components';

// ----------------------------------------------------------------------

const RootStyle = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(8, 0),
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(15, 0),
  },
}));

// ----------------------------------------------------------------------

export default function ElearningLandingIntroduce() {
  return (
    <RootStyle>
      <Container>
        <Grid
          container
          spacing={3}
          alignItems={{ md: 'center' }}
          justifyContent={{ md: 'space-between' }}
        >
          <Grid item xs={12} md={6} lg={5} display={{ xs: 'none', md: 'block' }}>
            <Image alt="about" src="/assets/banner2.jpg" ratio="4/6" sx={{ borderRadius: 2 }} />
          </Grid>

          <Grid item xs={12} md={6} lg={6}>
            <Typography variant="h3" sx={{ mb: 10 }}>
              Learn form the best teacher to achieve a top result for ICT
            </Typography>

            <Grid container lg={12} spacing={{ xs: 2, md: 2 }}>
              <Grid item xs={12} md={6} lg={6}>
                <Stack spacing={3}>
                  <Box sx={{ width: 24, height: 3, bgcolor: 'primary.main' }} />
                  <Typography sx={{ color: 'text.secondary' }}>
                    No 1 ICT teacher in Sri Lanka
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} md={6} lg={6}>
                <Stack spacing={3}>
                  <Box sx={{ width: 24, height: 3, bgcolor: 'primary.main' }} />
                  <Typography sx={{ color: 'text.secondary' }}>
                    100% success guaranteed for the exams
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} md={6} lg={6}>
                <Stack spacing={3}>
                  <Box sx={{ width: 24, height: 3, bgcolor: 'primary.main' }} />
                  <Typography sx={{ color: 'text.secondary' }}>
                    The best online ICT learning portal
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} md={6} lg={6}>
                <Stack spacing={3}>
                  <Box sx={{ width: 24, height: 3, bgcolor: 'primary.main' }} />
                  <Typography sx={{ color: 'text.secondary' }}>
                    To the point exam discussions
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} md={6} lg={6}>
                <Stack spacing={3}>
                  <Box sx={{ width: 24, height: 3, bgcolor: 'primary.main' }} />
                  <Typography sx={{ color: 'text.secondary' }}>
                    Online and Bank payments options
                  </Typography>
                </Stack>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </RootStyle>
  );
}
