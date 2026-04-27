import { useState } from 'react';
// icons
import addIcon from '@iconify/icons-carbon/add';
import subtractIcon from '@iconify/icons-carbon/subtract';
// @mui
import { styled } from '@mui/material/styles';
import {
  Grid,
  Stack,
  Container,
  Accordion,
  Typography,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
// _data
import { _faqs } from '../../../_data/mock';
// components
import { Iconify, Image } from '../../components';
import { useRequest } from '../../hooks';
// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  padding: theme.spacing(8, 0),
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(10, 0, 15, 0),
  },
}));

// ----------------------------------------------------------------------

export default function MarketingHelps() {
  const { data: faqs = [], error } = useRequest({
    url: `api/faqs`,
  });

  console.log(faqs);

  const [expanded, setExpanded] = useState(false);

  const handleChangeExpanded = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <RootStyle>
      <Container>
        <Grid container spacing={3} justifyContent="space-between" alignItems="center">
          <Grid item xs={12} md={12} lg={12}>
            <Stack spacing={2} sx={{ mb: 5, textAlign: { xs: 'center', md: 'left' } }}>
              <Typography variant="overline" color="text.disabled" />
              <Typography variant="h2"> Help & Information</Typography>
            </Stack>
          </Grid>

          <Grid
            item
            xs={12}
            md={12}
            lg={12}
            sx={{
              display: { xs: 'none', md: 'block' },
            }}
          >
            <Image
              alt="faqs"
              src="/assets/guide 2.jpg"
            />
          </Grid>
        </Grid>
      </Container>
    </RootStyle>
  );
}
