// scroll bar
import 'simplebar/src/simplebar.css';

// lightbox
import 'react-image-lightbox/style.css';

// slick-carousel
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// lazy image
import 'react-lazy-load-image-component/src/effects/blur.css';
import 'react-lazy-load-image-component/src/effects/opacity.css';
import 'react-lazy-load-image-component/src/effects/black-and-white.css';

// ----------------------------------------------------------------------

import PropTypes from 'prop-types';
// next
import Head from 'next/head';
// @mui
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
// contexts
import { SettingsProvider } from '../src/contexts/SettingsContext';
// theme
import ThemeProvider from '../src/theme';
// utils
import axios from '../src/utils/axios';
// components
import Settings from '../src/components/settings';
import RtlLayout from '../src/components/RtlLayout';
import ProgressBar from '../src/components/ProgressBar';
import ThemeColorPresets from '../src/components/ThemeColorPresets';
import MotionLazyContainer from '../src/components/animate/MotionLazyContainer';

// ----------------------------------------------------------------------
import '../public/styles.scss';

MyApp.propTypes = {
  Component: PropTypes.func,
  pageProps: PropTypes.object,
};

export default function MyApp(props) {
  const { Component, pageProps } = props;

  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
        <meta
          name="keywords"
          content="ICT, ICT Sri Lanka, Advanced level ict, AL ict, A/L ICT, ol ict, o/L ict, Ordinary level ict, information technology, ictkathurusingha, kathurusingha, online ict, online ict class, online ict class sri lanka"
        />
        <meta name="description" content="ICT Kathurusingha Website" />
      </Head>

      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <SettingsProvider>
          <ThemeProvider>
            <ThemeColorPresets>
              <MotionLazyContainer>
                <RtlLayout>
                  <Settings />
                  <ProgressBar />
                  {getLayout(<Component {...pageProps} />)}
                </RtlLayout>
              </MotionLazyContainer>
            </ThemeColorPresets>
          </ThemeProvider>
        </SettingsProvider>
      </LocalizationProvider>
    </>
  );
}
