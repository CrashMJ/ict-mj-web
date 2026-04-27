import PropTypes from 'prop-types';
// icons
import directionStraightRight from '@iconify/icons-carbon/direction-straight-right';
// next
import NextLink from 'next/link';
// @mui
import { styled, alpha } from '@mui/material/styles';
import { Grid, Container, Stack, Button, Typography, Box } from '@mui/material';
// routes
import Routes from '../../../routes';
// theme
import cssStyles from '../../../utils/cssStyles';
// components
import { Iconify } from '../../../components';
//
import CourseItem from '../courses/CourseItem';
import { green } from '@mui/material/colors';
import { useState, useEffect } from 'react';

// ----------------------------------------------------------------------

const RootStyle = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(5, 0),
  backgroundColor: theme.palette.background.neutral,
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(5, 0),
  },
}));

// ----------------------------------------------------------------------

CourseListView.propTypes = {
  courses: PropTypes.array,
};

const classTypes = {
  main: [
    { slug: 'al', label_en: 'Advanced Level' },
    { slug: 'ol', label_en: 'Ordinary Level' },
  ],
  ol: [
    { slug: 'online', label_en: 'Online Class' },
    { slug: 'physical', label_en: 'Physical Class' },
  ],
  al: [
    { slug: 'online', label_en: 'Online Class' },
    { slug: 'physical', label_en: 'Physical Class' },
  ],
  ol_sinhala: [
    { slug: 'online', label_en: 'Online Class' },
    { slug: 'physical', label_en: 'Physical Class' },
  ],
  ol_english: [
    { slug: 'online', label_en: 'Online Class' },
    { slug: 'physical', label_en: 'Physical Class' },
  ],
};

export default function CourseListView({ courses }) {
  const [mainCat, setMainCat] = useState(null);
  const [medium, setMedium] = useState(null);
  const [type, setType] = useState(null);

  const [filteredClasses, setFilteredClasses] = useState(courses);

  useEffect(() => {
    var filteredClass = [];
    courses.forEach((element) => {
      if (mainCat && medium && type) {
        if (
          element.class_grade == mainCat &&
          element.language == medium &&
          element.class_delivery_type == type
        ) {
          filteredClass.push(element);
        }
      } else if (mainCat && medium) {
        if (element.class_grade == mainCat && element.language == medium) {
          filteredClass.push(element);
        }
      } else if (mainCat) {
        if (element.class_grade == mainCat) {
          filteredClass.push(element);
        }
      } else {
        filteredClass.push(element);
      }
    });
    console.log('******************************************************');
    console.log(filteredClass);
    setFilteredClasses(filteredClass);
  }, [mainCat, medium, type, JSON.stringify(courses)]);

  const filter = () => {
    // var filteredClasses = [];
    // courses.forEach((element) => {
    //   if (mainCat && medium && type) {
    //     if (
    //       element.class_grade == mainCat &&
    //       element.language == medium &&
    //       element.class_delivery_type == type
    //     ) {
    //       filteredClasses.push(element);
    //     }
    //   } else if (mainCat && medium) {
    //     if (element.class_grade == mainCat && element.language == medium) {
    //       filteredClasses.push(element);
    //     }
    //   } else if (mainCat) {
    //     if (element.class_grade == mainCat) {
    //       filteredClasses.push(element);
    //     }
    //   }
    // });
    // console.log('******************************************************');
    // console.log(filteredClasses);
  };
  // console.log(courses);
  return (
    <RootStyle>
      <Container>
        <Stack
          spacing={3}
          sx={{
            textAlign: 'center',
          }}
        >
          <Typography variant="h2">Find The Class</Typography>
          <Typography variant="h4">
            {mainCat == 'al' && medium == 'sinhala'
              ? 'Advanced Level >> Sinhala'
              : mainCat == 'al' && medium == 'english'
              ? 'Advanced Level >> English'
              : mainCat == 'ol' && medium == 'sinhala'
              ? 'Ordinary Level >> Sinhala'
              : mainCat == 'al' && medium == 'sinhala'
              ? 'Ordinary Level >> English'
              : mainCat == 'al'
              ? 'Advanced Level'
              : mainCat == 'ol'
              ? 'Ordinary Level'
              : ''}
          </Typography>
          {mainCat ? (
            <Typography
              sx={{
                cursor: 'pointer',
                color: 'red',
              }}
              variant="h6"
              onClick={() => {
                setMainCat(null);
                setMedium(null);
                setType(null);
                filter();
              }}
            >
              Clear Filter
            </Typography>
          ) : (
            <></>
          )}
        </Stack>
        {!mainCat ? (
          <Box
            sx={{
              py: { xs: 2, md: 2 },
              display: 'grid',
              rowGap: { xs: 2, md: 2 },
              columnGap: 4,
              gridTemplateColumns: {
                xs: 'repeat(2, 1fr)',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(2, 1fr)',
              },
            }}
          >
            <Button
              sx={{
                padding: '20px',
                fontSize: '25px',
              }}
              variant={mainCat == 'al' ? 'contained' : 'outlined'}
              onClick={() => {
                setMainCat('al');
                setMedium(null);
                setType(null);
                filter('al');
              }}
              target="_blank"
              rel="noopener"
            >
              Advanced Level
            </Button>
            <Button
              sx={{
                padding: '20px',
                fontSize: '25px',
              }}
              variant={mainCat == 'ol' ? 'contained' : 'outlined'}
              onClick={() => {
                setMainCat('ol');
                setMedium(null);
                setType(null);
                filter('ol');
              }}
              target="_blank"
              rel="noopener"
            >
              Ordinary Level
            </Button>
          </Box>
        ) : (
          <></>
        )}
        {mainCat && !medium ? (
          <Box
            sx={{
              py: { xs: 2, md: 2 },
              display: 'grid',
              rowGap: { xs: 2, md: 2 },
              columnGap: 4,
              gridTemplateColumns: {
                xs: 'repeat(2, 1fr)',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(2, 1fr)',
              },
            }}
          >
            <Button
              sx={{
                padding: '20px',
                fontSize: '25px',
              }}
              variant={medium == 'sinhala' ? 'contained' : 'outlined'}
              onClick={() => {
                setMedium('sinhala');
                setType(null);
                filter();
              }}
              target="_blank"
              rel="noopener"
            >
              Sinhala Medium
            </Button>
            <Button
              sx={{
                padding: '20px',
                fontSize: '25px',
              }}
              variant={medium == 'english' ? 'contained' : 'outlined'}
              onClick={() => {
                setMedium('english');
                setType(null);
                filter();
              }}
              target="_blank"
              rel="noopener"
            >
              English Medium
            </Button>
          </Box>
        ) : (
          <></>
        )}

        {mainCat && medium ? (
          <Box
            sx={{
              py: { xs: 2, md: 2 },
              display: 'grid',
              rowGap: { xs: 2, md: 2 },
              columnGap: 4,
              gridTemplateColumns: {
                xs: 'repeat(2, 1fr)',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(2, 1fr)',
              },
            }}
          >
            <Button
              sx={{
                padding: '20px',
                fontSize: '25px',
              }}
              variant={type == 'online' ? 'contained' : 'outlined'}
              onClick={() => {
                setType('online');
                filter();
              }}
              target="_blank"
              rel="noopener"
            >
              Online Class
            </Button>
            <Button
              sx={{
                padding: '20px',
                fontSize: '25px',
              }}
              variant={type == 'physical' ? 'contained' : 'outlined'}
              onClick={() => {
                setType('physical');
                filter();
              }}
              target="_blank"
              rel="noopener"
            >
              Physical Class
            </Button>
          </Box>
        ) : (
          <></>
        )}

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
          {filteredClasses.map((course) => (
            <CourseItem key={course.updated_at + ''} course={course} />
          ))}
        </Box>
      </Container>
    </RootStyle>
  );
}
