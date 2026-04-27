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
    <Page title="Terms">
      <RootStyle>
        <RootStyle>
          <Container>
            <Grid container spacing={3} justifyContent="space-between" alignItems="center">
              <Grid item xs={12} md={12} lg={12}>
                <Stack spacing={2} sx={{ mb: 8, textAlign: { xs: 'center', md: 'left' } }}>
                  <Typography variant="overline" color="text.disabled">
                    ICT KATHURUSINGHA T & C
                  </Typography>
                  <Typography variant="h2">Terms & Conditions</Typography>
                </Stack>
              </Grid>
            </Grid>
            <section>
              <Stack spacing={2} sx={{ mb: 5, textAlign: { xs: 'center', md: 'left' } }}>
                <Typography variant="h4" paragraph translate="no">
                  1. Introduction
                </Typography>
                <Typography translate="no">
                  Welcome to ictkathurusingha.com (“Company”, “we”, “our”, “us”)! These Terms of Service
                  (“Terms”, “Terms of Service”) govern your use of our website located at
                  ictkathurusingha.com (together or individually “Service”) operated by ICT Kathurusingha.
                  <br />
                  <br />
                  Our Privacy Policy also governs your use of our Service and explains how we
                  collect, safeguard and disclose information that results from your use of our web
                  pages.
                  <br />
                  <br />
                  Your agreement with us includes these Terms and our Privacy Policy (“Agreements”).
                  You acknowledge that you have read and understood Agreements, and agree to be
                  bound of them.
                  <br />
                  <br />
                  If you do not agree with (or cannot comply with) Agreements, then you may not use
                  the Service, but please let us know by emailing at inquiry@ictkathurusingha.com so we can try
                  to find a solution. These Terms apply to all visitors, users and others who wish
                  to access or use Service.
                </Typography>
              </Stack>
              <Stack spacing={2} sx={{ mb: 5, textAlign: { xs: 'center', md: 'left' } }}>
                <Typography variant="h4" paragraph translate="no">
                  2. Communications
                </Typography>
                <Typography translate="no">
                  By using our Service, you agree to subscribe to newsletters, marketing or
                  promotional materials and other information we may send. However, you may opt out
                  of receiving any, or all, of these communications from us by following the
                  unsubscribe link or by emailing at inquiry@ictkathurusingha.com.
                </Typography>
              </Stack>
              <Stack spacing={2} sx={{ mb: 5, textAlign: { xs: 'center', md: 'left' } }}>
                <Typography variant="h4" paragraph translate="no">
                  3. Contests, Sweepstakes and Promotions
                </Typography>
                <Typography translate="no">
                  Any contests, sweepstakes or other promotions (collectively, “Promotions”) made
                  available through Service may be governed by rules that are separate from these
                  Terms of Service. If you participate in any Promotions, please review the
                  applicable rules as well as our Privacy Policy. If the rules for a Promotion
                  conflict with these Terms of Service, Promotion rules will apply.
                </Typography>
              </Stack>
              <Stack spacing={2} sx={{ mb: 5, textAlign: { xs: 'center', md: 'left' } }}>
                <Typography variant="h4" paragraph translate="no">
                  4. Prohibited Uses
                </Typography>
                <Typography translate="no">
                  You may use Service only for lawful purposes and in accordance with Terms. You
                  agree not to use Service:
                  <br />
                  <br />
                  0.1In any way that violates any applicable national or international law or
                  regulation. <br />
                  0.2. For the purpose of exploiting, harming, or attempting to exploit or harm
                  minors in any way by exposing them to inappropriate content or otherwise.
                  <br />
                  0.3. To transmit, or procure the sending of, any advertising or promotional
                  material, including any “junk mail”, “chain letter,” “spam,” or any other similar
                  solicitation.
                  <br />
                  0.4. To impersonate or attempt to impersonate Company, a Company employee, another
                  user, or any other person or entity
                  <br />
                  0.5. In any way that infringes upon the rights of others, or in any way is
                  illegal, threatening, fraudulent, or harmful, or in connection with any unlawful,
                  illegal, fraudulent, or harmful purpose or activity.
                  <br />
                  0.6. To engage in any other conduct that restricts or inhibits anyone’s use or
                  enjoyment of Service, or which, as determined by us, may harm or offend Company or
                  users of Service or expose them to liability.
                  <br /> <br />
                  Additionally, you agree not to: <br /> <br />
                  0.1. Use Service in any manner that could disable, overburden, damage, or impair
                  Service or interfere with any other party’s use of Service, including their
                  ability to engage in real time activities through Service.
                  <br />
                  0.2. Use any robot, spider, or other automatic device, process, or means to access
                  Service for any purpose, including monitoring or copying any of the material on
                  Service.
                  <br />
                  0.3. Use any manual process to monitor or copy any of the material on Service or
                  for any other unauthorized purpose without our prior written consent.
                  <br />
                  0.4. Use any device, software, or routine that interferes with the proper working
                  of Service.
                  <br />
                  0.5. Introduce any viruses, trojan horses, worms, logic bombs, or other material
                  which is malicious or technologically harmful.
                  <br />
                  0.6. Attempt to gain unauthorized access to, interfere with, damage, or disrupt
                  any parts of Service, the server on which Service is stored, or any server,
                  computer, or database connected to Service.
                  <br />
                  0.7. Attack Service via a denial-of-service attack or a distributed
                  denial-of-service attack.
                  <br />
                  0.8. Take any action that may damage or falsify Company rating.
                  <br />
                  0.9. Otherwise attempt to interfere with the proper working of Service.
                </Typography>
              </Stack>
              <Stack spacing={2} sx={{ mb: 5, textAlign: { xs: 'center', md: 'left' } }}>
                <Typography variant="h4" paragraph translate="no">
                  5. Analytics
                </Typography>
                <Typography translate="no">
                  We may use third-party Service Providers to monitor and analyze the use of our
                  Service
                </Typography>
              </Stack>
              <Stack spacing={2} sx={{ mb: 5, textAlign: { xs: 'center', md: 'left' } }}>
                <Typography variant="h4" paragraph translate="no">
                  6. Accounts
                </Typography>
                <Typography translate="no">
                  When you create an account with us, you guarantee that you are above the age of
                  12, and that the information you provide us is accurate, complete, and current at
                  all times. Inaccurate, incomplete, or obsolete information may result in the
                  immediate termination of your account on Service.
                  <br />
                  <br />
                  You are responsible for maintaining the confidentiality of your account and
                  password, including but not limited to the restriction of access to your computer
                  and/or account. You agree to accept responsibility for any and all activities or
                  actions that occur under your account and/or password, whether your password is
                  with our Service or a third-party service. You must notify us immediately upon
                  becoming aware of any breach of security or unauthorized use of your account.
                  <br />
                  <br />
                  You may not use as a username the name of another person or entity or that is not
                  lawfully available for use, a name or trademark that is subject to any rights of
                  another person or entity other than you, without appropriate authorization. You
                  may not use as a username any name that is offensive, vulgar or obscene.
                  <br />
                  <br />
                  We reserve the right to refuse service, terminate accounts, remove or edit
                  content, or cancel orders in our sole discretion.
                </Typography>
              </Stack>
              <Stack spacing={2} sx={{ mb: 5, textAlign: { xs: 'center', md: 'left' } }}>
                <Typography variant="h4" paragraph translate="no">
                  7. Copyright Policy
                </Typography>
                <Typography translate="no">
                  We respect the intellectual property rights of others. It is our policy to respond
                  to any claim that Content posted on Service infringes on the copyright or other
                  intellectual property rights (“Infringement”) of any person or entity.
                  <br />
                  <br />
                  If you are a copyright owner, or authorized on behalf of one, and you believe that
                  the copyrighted work has been copied in a way that constitutes copyright
                  infringement, please submit your claim via email to inquiry@ictkathurusingha.com, with the
                  subject line: “Copyright Infringement” and include in your claim a detailed
                  description of the alleged Infringement as detailed below, under “DMCA Notice and
                  Procedure for Copyright Infringement Claims”
                  <br />
                  <br />
                  You may be held accountable for damages (including costs and attorneys’ fees) for
                  misrepresentation or bad-faith claims on the infringement of any Content found on
                  and/or through Service on your copyright.
                </Typography>
              </Stack>

              <Stack spacing={2} sx={{ mb: 5, textAlign: { xs: 'center', md: 'left' } }}>
                <Typography variant="h4" paragraph translate="no">
                  8. DMCA Notice and Procedure for Copyright Infringement Claims
                </Typography>
                <Typography translate="no">
                  You may submit a notification pursuant to the Digital Millennium Copyright Act
                  (DMCA) by providing our Copyright Agent with the following information in writing
                  (see 17 U.S.C 512(c)(3) for further detail):
                  <br />
                  <br />
                  0.1. an electronic or physical signature of the person authorized to act on behalf
                  of the owner of the copyright’s interest;
                  <br />
                  0.2. a description of the copyrighted work that you claim has been infringed,
                  including the URL (i.e., web page address) of the location where the copyrighted
                  work exists or a copy of the copyrighted work;
                  <br />
                  0.3. identification of the URL or other specific location on Service where the
                  material that you claim is infringing is located;
                  <br />
                  0.4. your address, telephone number, and email address;
                  <br />
                  0.5. a statement by you that you have a good faith belief that the disputed use is
                  not authorized by the copyright owner, its agent, or the law;
                  <br />
                  0.6. a statement by you, made under penalty of perjury, that the above information
                  in your notice is accurate and that you are the copyright owner or authorized to
                  act on the copyright owner’s behalf.
                </Typography>
              </Stack>
              <Stack spacing={2} sx={{ mb: 5, textAlign: { xs: 'center', md: 'left' } }}>
                <Typography variant="h4" paragraph translate="no">
                  9. Error Reporting and Feedback
                </Typography>
                <Typography translate="no">
                  You may provide us either directly at inquiry@ictkathurusingha.com or via third party sites
                  and tools with information and feedback concerning errors, suggestions for
                  improvements, ideas, problems, complaints, and other matters related to our
                  Service (“Feedback”). You acknowledge and agree that: (i) you shall not retain,
                  acquire or assert any intellectual property right or other right, title or
                  interest in or to the Feedback; (ii) Company may have development ideas similar to
                  the Feedback; (iii) Feedback does not contain confidential information or
                  proprietary information from you or any third party; and (iv) Company is not under
                  any obligation of confidentiality with respect to the Feedback. In the event the
                  transfer of the ownership to the Feedback is not possible due to applicable
                  mandatory laws, you grant Company and its affiliates an exclusive, transferable,
                  irrevocable, free-of-charge, sub-licensable, unlimited and perpetual right to use
                  (including copy, modify, create derivative works, publish, distribute and
                  commercialize) Feedback in any manner and for any purpose.
                </Typography>
              </Stack>
              <Stack spacing={2} sx={{ mb: 5, textAlign: { xs: 'center', md: 'left' } }}>
                <Typography variant="h4" paragraph translate="no">
                  10. Governing Law
                </Typography>
                <Typography translate="no">
                  These Terms shall be governed and construed in accordance with the laws of Sri
                  Lanka, which governing law applies to agreement without regard to its conflict of
                  law provisions.
                  <br />
                  <br />
                  Our failure to enforce any right or provision of these Terms will not be
                  considered a waiver of those rights. If any provision of these Terms is held to be
                  invalid or unenforceable by a court, the remaining provisions of these Terms will
                  remain in effect. These Terms constitute the entire agreement between us regarding
                  our Service and supersede and replace any prior agreements we might have had
                  between us regarding Service.
                </Typography>
              </Stack>
              <Stack spacing={2} sx={{ mb: 5, textAlign: { xs: 'center', md: 'left' } }}>
                <Typography variant="h4" paragraph translate="no">
                  11. Amendments To Terms
                </Typography>
                <Typography translate="no">
                  We may amend Terms at any time by posting the amended terms on this site. It is
                  your responsibility to review these Terms periodically.
                  <br />
                  <br />
                  Your continued use of the Platform following the posting of revised Terms means
                  that you accept and agree to the changes. You are expected to check this page
                  frequently so you are aware of any changes, as they are binding on you.
                  <br />
                  <br />
                  By continuing to access or use our Service after any revisions become effective,
                  you agree to be bound by the revised terms. If you do not agree to the new terms,
                  you are no longer authorized to use Service.
                </Typography>
              </Stack>
              <Stack spacing={2} sx={{ mb: 5, textAlign: { xs: 'center', md: 'left' } }}>
                <Typography variant="h4" paragraph translate="no">
                  12. Payment Options & Refund Policy
                </Typography>
                <Typography translate="no">
                  In ictkathurusingha.com website there are two ways to make payments,<br /><br />
                   1. Payhere - Online credit/debit card payments 
                  <br />2. Bank payments 
                  <br />
                  <br />There is no refund of payments
                  will be made for any reason if you are using payhere to make payments.
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
