import PropTypes from 'prop-types';
import { useState } from 'react';
// icons
import chevronDown from '@iconify/icons-carbon/chevron-down';
import chevronRight from '@iconify/icons-carbon/chevron-right';
// next
import NextLink from 'next/link';
// @mui
import Masonry from '@mui/lab/Masonry';
import {
  Box,
  Grid,
  Link,
  Stack,
  Button,
  Divider,
  Collapse,
  Container,
  Typography,
  FilledInput,
  InputAdornment,
} from '@mui/material';
// hooks
import { useResponsive } from '../../hooks';
// components
import { Logo, Iconify, SocialsButton, AppStoreButton } from '../../components';
//
import { PageLinks } from '../nav/NavConfig';

// ----------------------------------------------------------------------

export default function Footer() {
  const isDesktop = useResponsive('up', 'md');

  const lists = PageLinks.filter((list) => list.subheader !== 'Coming Soon');

  const renderLists = isDesktop
    ? lists
    : lists.sort((listA, listB) => Number(listA.order) - Number(listB.order));

  return (
    <>
      <Divider />
      <Container sx={{ py: { xs: 8, md: 10 } }}>
        <Grid container spacing={3} justifyContent={{ md: 'space-between' }}>
          <Grid item xs={12} md={6}>
            <Stack alignItems="flex-start" spacing={3}>
              <Logo />
              <Typography variant="body3" sx={{ color: 'text.secondary' }}>
                උසස් පෙළ සහ සාමාන්‍ය පෙළ විභාගය සඳහා පැවැත්වෙන අපගේ පන්ති වලට සහභාගී වීම සඳහා 077 93
                61 706 ට දුරකථන ඇමතුමක් ලබාදෙන්න. නැතිනම් ඔබට සම්බන්ධ වීමට අවශ්‍ය පන්තිය සහ ඔබගේ නම
                පැහැදිලිව සඳහන් කර අපට WhatsApp පණිවුඩයක් එවන්න. අපගේ කණ්ඩායම හැකි ඉක්මනින් ඔබට
                පිළිතුරු ලබාදෙනු ඇත.
              </Typography>
              <Typography variant="body3" sx={{ color: 'text.secondary' }} translate="no">
                KathurusinghaICT <br />
                BSc in Artificial Intelligence & Data Science <br />
                AD.Diploma In Information Communication Technology Sp. Business IT -MDIS University
                (Singapore) <br />
                Diploma B.Sc. Network Engineering (SLIIT) <br />
                Former Lecture <br />
                Former A/L ICT Teacher in Leading
                <br />
                International School C.E.O in Istharam Online Education <br />
                Founder of ICT with Kathurusingha
                <br />
              </Typography>
            </Stack>
          </Grid>

          <Grid item xs={12} md={6}>
            <Stack spacing={2}>
              <Typography variant="h6">Social</Typography>
              <SocialsButton />
            </Stack>
          </Grid>
        </Grid>
      </Container>

      <Divider />

      <Container>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2.5}
          justifyContent="space-between"
          sx={{ py: 3, textAlign: 'center' }}
        >
          <Typography variant="body3" sx={{ color: 'text.secondary' }}>
            © {new Date().getFullYear()}. All rights reserved
          </Typography>
          <Typography variant="body3" sx={{ color: 'text.secondary' }}>
            Developed by VISION8
          </Typography>
          <Stack direction="row" spacing={3} justifyContent="center">
            <Link variant="body3" href="/terms" sx={{ color: 'text.secondary' }}>
              Terms & Conditions
            </Link>
            <Link variant="body3" href="/privacy" sx={{ color: 'text.secondary' }}>
              Privacy Policy
            </Link>
          </Stack>
        </Stack>
      </Container>
    </>
  );
}

// ----------------------------------------------------------------------

NextLinkItem.propTypes = {
  children: PropTypes.node.isRequired,
  sx: PropTypes.object,
};

function NextLinkItem({ children, sx, ...other }) {
  return (
    <NextLink passHref {...other}>
      <Link
        variant="body3"
        sx={{
          mt: 1,
          color: 'text.secondary',
          '&:hover': {
            color: 'text.primary',
          },
          ...sx,
        }}
      >
        {children}
      </Link>
    </NextLink>
  );
}

// ----------------------------------------------------------------------

ListDesktop.propTypes = {
  list: PropTypes.shape({
    items: PropTypes.array,
    subheader: PropTypes.string,
  }),
};

function ListDesktop({ list }) {
  const { subheader, items } = list;

  return (
    <Stack alignItems="flex-start" sx={{ pb: { md: 1 } }}>
      <Typography variant="h6">{subheader}</Typography>
      {items?.map((link) => (
        <NextLinkItem key={link.title} href={link.path}>
          {link.title}
        </NextLinkItem>
      ))}
    </Stack>
  );
}

// ----------------------------------------------------------------------

ListMobile.propTypes = {
  list: PropTypes.shape({
    items: PropTypes.array,
    subheader: PropTypes.string,
  }),
};

function ListMobile({ list }) {
  const { subheader, items } = list;
  const [expand, setExpand] = useState(false);

  const onExpand = () => {
    setExpand(!expand);
  };

  return (
    <Stack spacing={1.5} alignItems="flex-start">
      <Typography
        variant="h6"
        onClick={onExpand}
        sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
      >
        {subheader}
        <Iconify
          icon={expand ? chevronDown : chevronRight}
          sx={{ width: 20, height: 20, ml: 0.5 }}
        />
      </Typography>

      <Collapse in={expand} sx={{ width: 1 }}>
        <Box
          sx={{
            display: 'grid',
            rowGap: 1,
            columnGap: 3,
            gridTemplateColumns: {
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
            },
          }}
        >
          {items?.map((link) => (
            <NextLinkItem key={link.title} href={link.path}>
              {link.title}
            </NextLinkItem>
          ))}
        </Box>
      </Collapse>
    </Stack>
  );
}
