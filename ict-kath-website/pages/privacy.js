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
import { TeamMarketingAbout } from '../src/sections/team';
import { NewsletterMarketing } from '../src/sections/newsletter';
import { OurClientsMarketingAbout } from '../src/sections/our-clients';
import { TestimonialsMarketing } from '../src/sections/testimonials';
import {
  MarketingFaqs,
  MarketingAbout,
  MarketingFreeSEO,
  MarketingAboutStory,
  MarketingAboutOurVision,
  MarketingAboutCoreValues,
} from '../src/sections/@marketing';
import { Typography, Container, Stack, Grid } from '@mui/material';
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
    <Page title="Privacy">
      <RootStyle>
        <RootStyle>
          <Container>
            <Grid container spacing={3} justifyContent="space-between" alignItems="center">
              <Grid item xs={12} md={12} lg={12}>
                <Stack spacing={2} sx={{ mb: 8, textAlign: { xs: 'center', md: 'left' } }}>
                  <Typography variant="overline" color="text.disabled">
                    ICT KATHURUSINGHA PRIVACY POLICY
                  </Typography>
                  <Typography variant="h2">PRIVACY POLICY</Typography>
                </Stack>
              </Grid>
            </Grid>
            <section>
              <Stack spacing={2} sx={{ mb: 5, textAlign: { xs: 'center', md: 'left' } }}>
                <Typography translate="no">
                  This Privacy Policy governs the manner in which ictkathurusingha.com collects, uses,
                  maintains and discloses information collected from users (each, a “User”) of the
                  ictkathurusingha.com / website (“Site”). This privacy policy applies to the Site and all
                  products and services offered by the ICT Kathurusingha.
                  <br /> <br />
                  We may collect personal identification information from Users in a variety of
                  ways, including, but not limited to, when Users visit our site, register on the
                  site, subscribe to the newsletter, respond to a survey, fill out a form, and in
                  connection with other activities, services, features or resources we make
                  available on our Site. Users may be asked for, as appropriate, name, email
                  address, mailing address, phone number. Users may, however, visit our Site
                  anonymously. We will collect personal identification information from Users only
                  if they voluntarily submit such information to us. Users can always refuse to
                  supply personally identification information, except that it may prevent them from
                  engaging in certain Site related activities. <br /> <br />
                  We may collect non-personal identification information about Users whenever they
                  interact with our Site. Non-personal identification information may include the
                  browser name, the type of computer and technical information about Users means of
                  connection to our Site, such as the operating system and the Internet service
                  providers’ utilized and other similar information. <br /> <br />
                  Our Site may use “cookies” to enhance User experience. User’s web browser places
                  cookies on their hard drive for record-keeping purposes and sometimes to track
                  information about them. User may choose to set their web browser to refuse
                  cookies, or to alert you when cookies are being sent. If they do so, note that
                  some parts of the Site may not function properly. <br /> <br />
                  We may use the email address to respond to their inquiries, questions, and/or
                  other requests. If User decides to opt-in to our mailing list, they will receive
                  emails that may include company news, updates, related product or service
                  information, etc. If at any time the User would like to unsubscribe from receiving
                  future emails, we include detailed unsubscribe instructions at the bottom of each
                  email or User may contact us via our Site.
                  <br /> <br />
                  We adopt appropriate data collection, storage and processing practices and
                  security measures to protect against unauthorized access, alteration, disclosure
                  or destruction of your personal information, username, password, transaction
                  information and data stored on our Site.
                  <br /> <br />
                  We do not sell, trade, or rent Users personal identification information to
                  others. We may share generic aggregated demographic information not linked to any
                  personal identification information regarding visitors and users with our business
                  partners, trusted affiliates and advertisers for the purposes outlined above. We
                  may use third party service providers to help us operate our business and the Site
                  or administer activities on our behalf, such as sending out newsletters or
                  surveys. We may share your information with these third parties for those limited
                  purposes provided that you have given us your permission.
                  <br /> <br />
                  Users may find advertising or other content on our Site that link to the sites and
                  services of our partners, advertisers, sponsors, and other third parties. We do
                  not control the content or links that appear on these sites and are not
                  responsible for the practices employed by websites linked to or from our Site. In
                  addition, these sites or services, including their content and links, may be
                  constantly changing. These sites and services may have their own privacy policies
                  and customer service policies. Browsing and interaction on any other website,
                  including websites which have a link to our Site, is subject to that website’s own
                  terms and policies.
                  <br /> <br />
                </Typography>
              </Stack>
            </section>
          </Container>
        </RootStyle>
      </RootStyle>
    </Page>
  );
}

// ----------------------------------------------------------------------

MarketingAboutUsPage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
