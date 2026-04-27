import PropTypes from 'prop-types';
// @mui
import { styled } from '@mui/material/styles';
import { Typography, Stack, Container, Grid, Paper, Button, Box } from '@mui/material';
// components
import { TextMaxLine } from '../../../components';

// ----------------------------------------------------------------------

const RootStyle = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(10, 0),
  backgroundColor: theme.palette.background.neutral,
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(15, 0),
  },
}));

// ----------------------------------------------------------------------

ElearningLandingCategories.propTypes = {
  categories: PropTypes.array,
};

export default function ElearningLandingCategories({ categories }) {
  return (
    <RootStyle>
      <Container>
        <Grid container spacing={{ xs: 12, lg: 12 }} justifyContent={{ lg: 'space-between' }}>
          <Grid
            item
            xs={12}
            lg={12}
            sx={{
              textAlign: 'center',
            }}
          >
            <Typography variant="h2">Class Categories</Typography>
          </Grid>

          <Grid item xs={12} lg={12}>
            <Box
              sx={{
                display: 'grid',
                gap: 3,
                gridTemplateColumns: {
                  xs: 'repeat(2, 1fr)',
                  md: 'repeat(3, 1fr)',
                },
              }}
            >
              {categories.map((category) => (
                <CategoryItem key={category.id} category={category} />
              ))}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </RootStyle>
  );
}

// ----------------------------------------------------------------------

CategoryItem.propTypes = {
  category: PropTypes.shape({
    name: PropTypes.string,
    students: PropTypes.number,
  }),
};

function CategoryItem({ category }) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 3,
        borderRadius: 1.5,
        cursor: 'pointer',
        bgcolor: 'transparent',
        transition: (theme) =>
          theme.transitions.create('all', {
            duration: theme.transitions.duration.enteringScreen,
          }),
        '&:hover': {
          bgcolor: 'background.paper',
          boxShadow: (theme) => theme.customShadows.z24,
          '& h6': {
            color: 'primary.main',
          },
        },
      }}
    >
      <TextMaxLine variant="h6" line={1} gutterBottom>
        {category.class}
      </TextMaxLine>

      <Typography variant="body3" sx={{ color: 'text.disabled' }}>
        {category.language}
      </Typography>
    </Paper>
  );
}
