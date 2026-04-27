// @mui
import { styled } from '@mui/material/styles';
// config
import { HEADER_MOBILE_HEIGHT, HEADER_DESKTOP_HEIGHT } from '../src/config';
// _data
import { _testimonials, _members, _brandsColor } from '../_data/mock';
// layouts
import Layout from '../src/layouts';
import { Grid, Button, Box, Card, Stack, Container, Typography } from '@mui/material';
import { Image } from '../src/components';
// components
import { Page } from '../src/components';
// sections
import { useRequest } from '../src/hooks';
import NextLink from 'next/link';
// ----------------------------------------------------------------------
import { HOST_API } from '../src/config';

const RootStyle = styled('div')(({ theme }) => ({
  paddingTop: HEADER_MOBILE_HEIGHT,
  [theme.breakpoints.up('md')]: {
    paddingTop: HEADER_DESKTOP_HEIGHT,
  },
}));

// ----------------------------------------------------------------------

export default function MarketingAboutUsPage2() {
  const { data: feedbacks = [], error3 } = useRequest({
    url: `/api/testimonials`,
  });

  console.log(feedbacks);

  return (
    <Page title="Student Reviews">
      <RootStyle>
        <RootStyle>
          <Container>
            <Grid container spacing={3} justifyContent="space-between" alignItems="center">
              <Grid item xs={12} md={12} lg={12}>
                <Stack spacing={2} sx={{ mb: 5, textAlign: { xs: 'center', md: 'left' } }}>
                  <Typography variant="overline" color="text.disabled"/>
                  <Typography variant="h2">Student Reviews</Typography>
                </Stack>
                <Box
                  sx={{
                    py: { xs: 8, md: 10 },
                    display: 'grid',
                    rowGap: { xs: 4, md: 5 },
                    columnGap: 4,
                    gridTemplateColumns: {
                      xs: 'repeat(1, 1fr)',
                      sm: 'repeat(2, 1fr)',
                      md: 'repeat(3, 1fr)',
                    },
                  }}
                >
                  {feedbacks.map((feedback) => (
                    <Card
                      key={feedback.id}
                      sx={{
                        boxShadow: (theme) => theme.customShadows.z8,
                        '&:hover': {
                          boxShadow: (theme) => theme.customShadows.z24,
                        },
                      }}
                    >
                      <Stack sx={{ p: 3, pb: 0 }}>
                        <Stack spacing={0.5} sx={{ mt: 3, mb: 2 }}>
                          <Typography variant="h6" asLink line={1}>
                            - {feedback.student_name}
                          </Typography>

                          <Image
                            placeholderSrc=""
                            alt="teacher"
                            src={`${HOST_API.gStorage}${feedback.photo}`}
                            sx={{ width: '100%' }}
                          />
                        </Stack>
                      </Stack>
                    </Card>
                  ))}
                </Box>
              </Grid>
            </Grid>
            <Stack
              spacing={3}
              sx={{
                textAlign: 'center',
                alignItems: 'center',
                // paddingLeft: 10,
                // backgroundColor: 'red',
                // paddingRight: 10,
                paddingBottom: 10,
              }}
            >
              <NextLink
                href={'https://www.facebook.com/media/set/?set=a.4910257172348555&type=3'}
                prefetch={false}
                passHref
                sx={{
                  textAlign: 'center',
                  // display: 'flow-root',
                  // maxWidth: '30%',
                }}
              >
                <Button
                  color="inherit"
                  variant="outlined"
                  sx={{
                    color: 'text.primary',
                    maxWidth: '50%',
                    // maxWidth: '30%',
                  }}
                >
                  View More Feedbacks
                </Button>
              </NextLink>
            </Stack>
          </Container>
        </RootStyle>
      </RootStyle>
    </Page>
  );
}

// ----------------------------------------------------------------------

MarketingAboutUsPage2.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
