import PropTypes from 'prop-types';
// @mui
import { styled } from '@mui/material/styles';
// config
import { HEADER_MOBILE_HEIGHT, HEADER_DESKTOP_HEIGHT } from '../../src/config';
// hooks
import { useRequest } from '../../src/hooks';
// utils
import { getAllPosts } from '../../src/utils/get-mardown/e-learning/posts';
// _data
import { _testimonials, _members, _brandsColor, _coursesByCategories } from '../../_data/mock';
// layouts
import Layout from '../../src/layouts';
// components
import { Page, ErrorScreen } from '../../src/components';
// sections
import { TeamElearningLanding } from '../../src/sections/team';
import { OurClientsElearning } from '../../src/sections/our-clients';
import { BlogElearningLatestPosts } from '../../src/sections/blog';
import { NewsletterElearning } from '../../src/sections/newsletter';
import { DownloadAppElearning } from '../../src/sections/download-app';
import { TestimonialsElearning } from '../../src/sections/testimonials';
import {
  ElearningLandingHero,
  ElearningLandingIntroduce,
  ElearningLandingCategories,
  ElearningLandingFeaturedCourses,
  HomeCombination,
  CourseListView,
} from '../../src/sections/@e-learning';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  paddingTop: HEADER_MOBILE_HEIGHT,
  [theme.breakpoints.up('md')]: {
    paddingTop: HEADER_DESKTOP_HEIGHT,
  },
}));

// ----------------------------------------------------------------------

ElearningLandingPage.propTypes = {
  posts: PropTypes.array.isRequired,
};

export default function ElearningLandingPage({ posts }) {
  const { data: courses = [], error } = useRequest({
    url: `api/courses`,
  });

  // const { data: jobs = [], error2 } = useRequest({
  //   url: `/api/career/jobs`,
  // });

  if (error) {
    return <ErrorScreen />;
  }

  // console.log(courses);

  return (
    <Page title="Home">
      <RootStyle>
        <ElearningLandingHero />

        {/* <OurClientsElearning brands={_brandsColor} /> */}
        {/* <ElearningLandingFeaturedCourses courses={courses} /> */}
        <CourseListView courses={courses} />

        <ElearningLandingIntroduce />

        <ElearningLandingCategories categories={_coursesByCategories} />

        {/* <TeamElearningLanding members={_members.slice(0, 4)} /> */}

        <TestimonialsElearning testimonials={_testimonials} />

        <BlogElearningLatestPosts posts={posts.slice(0, 4)} />

        <HomeCombination />
      </RootStyle>
    </Page>
  );
}

// ----------------------------------------------------------------------

ElearningLandingPage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export async function getStaticProps() {
  return {
    props: {
      posts: getAllPosts(),
    },
  };
}
