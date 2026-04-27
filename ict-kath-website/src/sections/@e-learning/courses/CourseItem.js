import PropTypes from 'prop-types';
import { useState } from 'react';
// icons
import locationIcon from '@iconify/icons-carbon/location';
import timeIcon from '@iconify/icons-carbon/time';
import increaseLevel from '@iconify/icons-carbon/increase-level';
import moneyIcon from '@iconify/icons-carbon/money';
import userIcon from '@iconify/icons-carbon/user';
// next
import NextLink from 'next/link';
// @mui
import { Divider, Stack, Card, Typography, Grid } from '@mui/material';
// routes
import Routes from '../../../routes';
// utils
import { fDate } from '../../../utils/formatTime';
import { fCurrency } from '../../../utils/formatNumber';
// components
import {
  Image,
  Label,
  Iconify,
  TextMaxLine,
  TextIconLabel,
  FavoriteButton,
} from '../../../components';

// ----------------------------------------------------------------------

CourseItem.propTypes = {
  course: PropTypes.shape({
    class_date_en: PropTypes.string,
    class_delivery_type: PropTypes.string,
    class_grade: PropTypes.string,
    class_time: PropTypes.string,
    language: PropTypes.string,
    id: PropTypes.number,
    name_en: PropTypes.string,
    title_tag_en: PropTypes.string,
    icon: PropTypes.string,
    course_fee: PropTypes.number,
  }),
};

export default function CourseItem({ course }) {
  const {
    id,
    class_date_en,
    class_delivery_type,
    class_grade,
    class_time,
    language,
    name_en,
    title_tag_en,
    icon,
    course_fee,
  } = course;

  return (
    <Card
      sx={{
        boxShadow: (theme) => theme.customShadows.z8,
        '&:hover': {
          boxShadow: (theme) => theme.customShadows.z24,
        },
      }}
    >
      <Stack sx={{ p: 3, pb: 0 }}>
        <Stack direction="row" alignItems="center" spacing={2.5}>
          <Image
            alt={title_tag_en}
            src={
              icon !== ''
                ? icon
                : 'https://w7.pngwing.com/pngs/392/371/png-transparent-book-library-five-flat-books-angle-text-comic-book.png'
            }
            sx={{ width: 48, height: 48, borderRadius: 1 }}
          />
          {class_delivery_type == 'online' ? (
            <Label color="info">online</Label>
          ) : (
            <Label color="error">Physical</Label>
          )}
        </Stack>

        <Stack spacing={0.5} sx={{ mt: 3, mb: 2 }}>
          <NextLink as={Routes.career.job(id)} href={Routes.career.job('[id]')} passHref>
            <TextMaxLine variant="h6" asLink line={1}>
              {name_en}
            </TextMaxLine>
          </NextLink>

          <Typography variant="body3" sx={{ color: 'secondary.main' }}>
            {title_tag_en}
          </Typography>

          <TextIconLabel
            icon={<Iconify icon={locationIcon} sx={{ mr: 0.5, width: 18, height: 18 }} />}
            value={name_en}
            sx={{ typography: 'body3', color: 'text.secondary' }}
          />
        </Stack>
      </Stack>

      <Divider sx={{ borderStyle: 'dashed', my: 2 }} />

      <Grid
        container
        spacing={1.5}
        sx={{
          p: 3,
          pt: 0,
          typography: 'body3',
          color: 'text.secondary',
          textTransform: 'capitalize',
        }}
      >
        <Grid item xs={6}>
          <TextIconLabel
            icon={<Iconify icon={increaseLevel} sx={{ width: 20, height: 20, mr: 1 }} />}
            value={class_grade}
          />
        </Grid>

        <Grid item xs={6}>
          <TextIconLabel
            icon={<Iconify icon={timeIcon} sx={{ width: 20, height: 20, mr: 1 }} />}
            value={class_time}
          />
        </Grid>

        <Grid item xs={6}>
          <TextIconLabel
            icon={<Iconify icon={moneyIcon} sx={{ width: 20, height: 20, mr: 1 }} />}
            value={`Rs. ${course_fee}`}
          />
        </Grid>

        <Grid item xs={6}>
          <TextIconLabel
            icon={<Iconify icon={userIcon} sx={{ width: 20, height: 20, mr: 1 }} />}
            value={language}
          />
        </Grid>
      </Grid>
    </Card>
  );
}
