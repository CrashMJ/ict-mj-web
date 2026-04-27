// @mui
import { styled } from '@mui/material/styles';
// config
import { HEADER_MOBILE_HEIGHT, HEADER_DESKTOP_HEIGHT } from '../src/config';
// _data
import { _testimonials, _members, _brandsColor } from '../_data/mock';
// layouts
import Layout from '../src/layouts';
// components
import { Page } from '../src/components';
// sections
import {
    MarketingHelps,
} from '../src/sections/@marketing';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  paddingTop: HEADER_MOBILE_HEIGHT,
  [theme.breakpoints.up('md')]: {
    paddingTop: HEADER_DESKTOP_HEIGHT,
  },
}));

// ----------------------------------------------------------------------

export default function MarketingAboutUsPage() {
  return (
    <Page title="Help">
      <RootStyle>
        <MarketingHelps />
      </RootStyle>
    </Page>
  );
}

// ----------------------------------------------------------------------

MarketingAboutUsPage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
