/* global google */
import PropTypes from 'prop-types';
// next
import NextLink from 'next/link';
// @mui
import { useTheme } from '@mui/material/styles';
import { Box, Stack, Button, AppBar, Divider, Container } from '@mui/material';
// hooks
import { useOffSetTop, useResponsive } from '../../hooks';
// routes
import Routes from '../../routes';
// config
import { HEADER_DESKTOP_HEIGHT } from '../../config';
// components
import { Logo, Label } from '../../components';
//
import Searchbar from '../Searchbar';
import LanguagePopover from '../LanguagePopover';
import { NavMobile, NavDesktop, navConfig } from '../nav';
import { ToolbarStyle, ToolbarShadowStyle } from './HeaderToolbarStyle';
import { HOST_API } from '../../config';
import { useEffect } from 'react';
import { setCookies } from 'cookies-next';
// ----------------------------------------------------------------------

Header.propTypes = {
  transparent: PropTypes.bool,
};

export default function Header({ transparent }) {
  const theme = useTheme();

  const isDesktop = useResponsive('up', 'md');

  const isLight = theme.palette.mode === 'light';

  const isScrolling = useOffSetTop(HEADER_DESKTOP_HEIGHT);

  const studentAppBaseURL = HOST_API.studentAppBaseURL;

  useEffect(() => {
    var addScript = document.createElement('script');

    addScript.setAttribute(
      'src',
      '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
    );
    document.body.appendChild(addScript);
    window.googleTranslateElementInit = googleTranslateElementInit;
  }, []);

  const googleTranslateElementInit = () => {
    new window.google.translate.TranslateElement(
      {
        pageLanguage: 'en',
        defaultLocale: 'en',
        includedLanguages: 'en,si,ta', // include this for selected languages
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: true,
      },
      'google_translate_element'
    );
  };

  return (
    <AppBar sx={{ boxShadow: 0, bgcolor: 'transparent' }}>
      <ToolbarStyle disableGutters transparent={transparent} scrolling={isScrolling}>
        <Container
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
          }}
        >
          <Box sx={{ lineHeight: 0, position: 'relative' }}>
            <Logo />

            {/* <Label
              color="info"
              sx={{
                ml: 0.5,
                px: 0.5,
                top: -14,
                left: 64,
                height: 20,
                fontSize: 11,
                position: 'absolute',
              }}
            >
              #1
            </Label> */}
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          <Stack spacing={2} direction="row" alignItems="center">
            {isDesktop && (
              <NavDesktop
                isScrolling={isScrolling}
                isTransparent={transparent}
                navConfig={navConfig}
              />
            )}
            {/* <LanguagePopover
              sx={{
                ...(isScrolling && { color: 'text.primary' }),
              }}
            /> */}

            <Divider orientation="vertical" sx={{ height: 24 }} />

            {isDesktop && (
              <Stack direction="row" spacing={1}>
                <Button
                  variant="contained"
                  href={studentAppBaseURL + 'auth/login'}
                  target="_blank"
                  rel="noopener"
                >
                  Login
                </Button>
              </Stack>
            )}
            {/* <div
              sx={{
                ml: 1,
              }}
              id="google_translate_element"
            > */}
              {' '}
            {/* </div> */}
          </Stack>

          {!isDesktop && (
            <NavMobile
              navConfig={navConfig}
              sx={{
                ml: 1,
                ...(isScrolling && { color: 'text.primary' }),
              }}
            />
          )}
        </Container>
      </ToolbarStyle>

      {isScrolling && <ToolbarShadowStyle />}
    </AppBar>
  );
}
