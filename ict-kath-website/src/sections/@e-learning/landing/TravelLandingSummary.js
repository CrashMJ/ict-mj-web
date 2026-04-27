// @mui
import { styled } from '@mui/material/styles';
import { Button, Typography, Container, Stack, Box } from '@mui/material';
// utils
import { fShortenNumber } from '../../../utils/formatNumber';
// components
import { CountUpNumber, Image } from '../../../components';
import YouTube from 'react-youtube';
import { useEffect, useState } from 'react';
// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(8, 0),
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(10, 0),
  },
}));
//

const _onReady = (event) => {
  event.target.pauseVideo();
};

const opts = {
  height: '600',
  width: '100%',
  playerVars: {
    autoplay: 0,
    vq: 'large'
  },
};

// ----------------------------------------------------------------------

export default function TravelLandingSummary(siteContent) {
  const [videoList, setVideos] = useState([]);
  const [videoList2, setVideos2] = useState([]);

  useEffect(() => {
    const videos = [];
    const videos2 = [];
    const finds = ['MAIN_PAGE_MAIN_VIDEO_1'];
    siteContent.siteContent.forEach((element) => {
      if (finds.includes(element.slug)) {
        videos.push(element);
      }
    });
    setVideos(videos);
  }, [JSON.stringify(siteContent)]);

  return (
    // <RootStyle>
    <Container>
      <Stack
        spacing={0}
        sx={{
          mx: 'auto',
          maxWidth: 480,
          textAlign: 'center',
          mb: { xs: 0, md: 0 },
          marginTop: 5,
        }}
      >
        {/* <Typography variant="h2">Our Success</Typography> */}
      </Stack>

      <Box
        sx={{
          display: 'grid',
          gap: { xs: 12, md: 12 },
          gridTemplateColumns: {
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(1, 1fr)',
            md: 'repeat(1, 1fr)',
          },
        }}
      >
        <>
          <Box
            sx={{
              display: 'grid',
              // gap: { xs: 1, md: 6 },
              // display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              alignContent: 'center',
              textAlign: 'center',
              // margin: 'auto',
              gridTemplateColumns: {
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(1, 1fr)',
                md: 'repeat(1, 1fr)',
              },
            }}
          >
            {videoList.map((value) => (
              <div key={value.slug}>
                <YouTube videoId={value.url} opts={opts} onReady={_onReady} />
              </div>
            ))}
          </Box>
        </>
      </Box>

      <Stack
        spacing={3}
        sx={{
          mx: 'auto',
          maxWidth: 300,
          textAlign: 'center',
          mb: { xs: 0, md: 0 },
          marginTop: 0,
        }}
      />
    </Container>
    // </RootStyle>
  );
}
