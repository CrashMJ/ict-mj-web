import { useState } from 'react';
// icons
import MenuBookIcon from '@mui/icons-material/MenuBook';
import SchoolIcon from '@mui/icons-material/School';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CloseIcon from '@mui/icons-material/Close'; // Import CloseIcon
// @mui
import { styled } from '@mui/material/styles';
import {
  Grid,
  Stack,
  Container,
  Typography,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  useMediaQuery,
  useTheme,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
// components
import { Iconify, Image } from '../../components';
import { useRequest } from '../../../src/hooks';
// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  // height: '100vh', // Ensure the RootStyle takes the full viewport height
}));

const DrawerStyle = styled(Drawer)(({ theme }) => ({
  width: 240,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: 240,
    boxSizing: 'border-box',
    top: theme.spacing(15),
    overflowY: 'auto', // Ensure vertical scrolling
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      top: theme.spacing(10),
    },
  },
}));

const MainContentStyle = styled('main')(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(8, 3),
  marginLeft: 240, // Space for the side menu on desktop
  overflowY: "auto",
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(6, 1),
    marginLeft: 0, // No margin for mobile view
  },
}));

const MobileMenuButton = styled(IconButton)(({ theme }) => ({
  display: 'none',
  [theme.breakpoints.down('sm')]: {
    display: 'block',
    position: 'absolute',
    top: theme.spacing(10),
    left: theme.spacing(2),
    zIndex: theme.zIndex.drawer - 1, // Ensure button is under the drawer
  },
}));

const SideMenu = styled('nav')(({ theme }) => ({
  width: 300,
  bottom: 0,
  top: theme.spacing(15),
  position: 'scroll',
  boxShadow: theme.shadows[4],
  padding: theme.spacing(2),
  overflowY: 'auto', // Enable scrolling if needed
  [theme.breakpoints.down('sm')]: {
    display: 'none',
  },
}));

// Close button style
const CloseButtonStyle = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(2),
  right: theme.spacing(2),
  zIndex: theme.zIndex.drawer + 1, // Ensure button is above the drawer content
}));

// ----------------------------------------------------------------------

export default function MarketingPapers() {

    const { data: finalPapers , error } = useRequest({
        url: `api/open-resources/papers-wise/all`,
      });
  const [activeTab, setActiveTab] = useState('al-past-papers'); // Default tab
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState('all');

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleGradeChange = (event) => {
    setSelectedGrade(event.target.value);
  };

  const filterPapersByGrade = (papers) => {

    if (selectedGrade === 'all') return papers;
    return papers.filter((paper) => {
        return paper?.items.some(item => item.grade === selectedGrade)
    });
  };

  const formatGrade = (grade) => {
    // Use a regular expression to find the digits and format them
    return grade.replace(/(\d+)/, ' $1').replace(/^./, str => str.toUpperCase());
  };
    console.log('finalPapers',finalPapers)
  
  // ----------------------------past paper------------------------------------------
  const renderALPastPapers = () => (
    <>
      <Stack spacing={2} sx={{ mb: 5, textAlign: { xs: 'center', md: 'left' } }}>
        <Typography variant="overline" color="text.disabled">
          Past Papers
        </Typography>
        <Typography variant="h2">A/L Past Papers</Typography>
      </Stack>

      {finalPapers?.alPastPapers?.sort((a, b) => {
          // Extract the year number from the title (assuming title includes year)
          const yearA = parseInt(a.title.match(/\d{4}/)[0], 10);
          const yearB = parseInt(b.title.match(/\d{4}/)[0], 10);
          return yearB - yearA; // ascending order
        }).map((paper, index) => (
          <Grid container spacing={2} key={index} sx={{mb:5, border: '2px solid #d1cece', borderRadius: 2}}>
            <Grid item xs={12}>
              <Typography variant="h5" sx={{ flexGrow: 1 }}>
                {paper.title}
              </Typography>
            </Grid>
            {paper.items.sort((a, b) => {
          const order = { english: 1, sinhala: 2 }; // other = 3 by default
          return (order[a.medium] || 3) - (order[b.medium] || 3);
        }).map((item) => (
              <Grid item xs={12} sm={6} md={3} key={item.id} sx={{mb:3}}>
                <Button
                  variant="contained"
                  href={item.url}
                  target="_blank"
                  sx={{ width: '100%' }}
                >
                  {item.medium}
                </Button>
              </Grid>
            ))}
          </Grid>
      ))}
    </>
  );

  const renderOLPastPapers = () => (
    <>
      <Stack spacing={2} sx={{ mb: 5, textAlign: { xs: 'center', md: 'left' } }}>
        <Typography variant="overline" color="text.disabled">
          Past Papers
        </Typography>
        <Typography variant="h2">O/L Past Papers</Typography>
        <FormControl fullWidth>
          <InputLabel id="grade-select-label">Grade</InputLabel>
          <Select
            labelId="grade-select-label"
            id="grade-select"
            value={selectedGrade}
            label="Grade"
            onChange={handleGradeChange}
          >
            <MenuItem key="" value="all">
                All
            </MenuItem>
            {finalPapers?.olGrades.map((grade, index) => (
            <MenuItem key={index} value={grade.grade}>
                {formatGrade(grade.grade)}
            </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

      {filterPapersByGrade(finalPapers?.olPastPapers).map((paper, index) => (
        <Grid container spacing={2} key={index} sx={{mb:5, border: '2px solid #d1cece', borderRadius: 2}}>
          <Grid item xs={12}>
            <Typography variant="h5" sx={{ flexGrow: 1 }}>
              {paper.title}
            </Typography>
          </Grid>
          {paper.items.map((item) => (
            <Grid item xs={12} sm={6} md={3} key={item.id} sx={{mb:3}}>
              <Button
                variant="contained"
                href={item.url}
                target="_blank"
                sx={{ width: '100%' }}
              >
                {item.medium}
              </Button>
            </Grid>
          ))}
        </Grid>
      ))}
    </>
  );

  // -------------------------------model papers---------------------------------------

  const renderALModelPapers = () => (
    <>
      <Stack spacing={2} sx={{ mb: 5, textAlign: { xs: 'center', md: 'left' } }}>
        <Typography variant="overline" color="text.disabled">
          Model Papers
        </Typography>
        <Typography variant="h2">A/L Model Papers</Typography>
      </Stack>

      {finalPapers?.alModelPapers.map((paper, index) => (
        <Grid container spacing={2} key={index} sx={{mb:5, border: '2px solid #d1cece', borderRadius: 2}}>
          <Grid item xs={12}>
            <Typography variant="h5" sx={{ flexGrow: 1 }}>
              {paper.title}
            </Typography>
          </Grid>
          {paper.items.map((item) => (
            <Grid item xs={12} sm={6} md={3} key={item.id} sx={{mb:3}}>
              <Button
                variant="contained"
                href={item.url}
                target="_blank"
                sx={{ width: '100%' }}
              >
                {item.medium}
              </Button>
            </Grid>
          ))}
        </Grid>
      ))}
    </>
  );

  const renderOLModelPapers = () => (
    <>
      <Stack spacing={2} sx={{ mb: 5, textAlign: { xs: 'center', md: 'left' } }}>
        <Typography variant="overline" color="text.disabled">
        Model Papers
        </Typography>
        <Typography variant="h2">O/L Model Papers</Typography>
        <FormControl fullWidth>
          <InputLabel id="grade-select-label">Grade</InputLabel>
          <Select
            labelId="grade-select-label"
            id="grade-select"
            value={selectedGrade}
            label="Grade"
            onChange={handleGradeChange}
          >
            <MenuItem key="" value="all">
                All
            </MenuItem>
            {finalPapers?.olGrades.map((grade, index) => (
            <MenuItem key={index} value={grade.grade}>
                {formatGrade(grade.grade)}
            </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

      {filterPapersByGrade(finalPapers?.olModelPapers).map((paper, index) => (
        <Grid container spacing={2} key={index} sx={{mb:5, border: '2px solid #d1cece', borderRadius: 2}}>
          <Grid item xs={12}>
            <Typography variant="h5" sx={{ flexGrow: 1 }}>
              {paper.title}
            </Typography>
          </Grid>
          {paper.items.map((item) => (
            <Grid item xs={12} sm={6} md={3} key={item.id} sx={{mb:3}}>
              <Button
                variant="contained"
                href={item.url}
                target="_blank"
                sx={{ width: '100%' }}
              >
                {item.medium}
              </Button>
            </Grid>
          ))}
        </Grid>
      ))}
    </>
  );

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <RootStyle>
      {isMobile && (
        <>
          <MobileMenuButton onClick={handleDrawerToggle}>
            <MenuIcon />
          </MobileMenuButton>
          <DrawerStyle
            variant="temporary"
            anchor="left"
            open={drawerOpen}
            onClose={handleDrawerToggle}
            TransitionProps={{ mountOnEnter: true, unmountOnExit: true }}
          >
            <CloseButtonStyle onClick={handleDrawerToggle}>
              <CloseIcon />
            </CloseButtonStyle>
            <List>
              <Typography variant="h6" sx={{ mb: 2, ml: 3, mt:3, textAlign:'left' }}>Past Papers</Typography>
              <Divider />
              <ListItem button onClick={() => setActiveTab('al-past-papers')}>
                <ListItemIcon><MenuBookIcon /></ListItemIcon>
                <ListItemText primary="A/L Past Papers" />
              </ListItem>
              <ListItem button onClick={() => setActiveTab('ol-past-papers')}>
                <ListItemIcon><MenuBookIcon /></ListItemIcon>
                <ListItemText primary="O/L Past Papers" />
              </ListItem>
              <Typography variant="h6" sx={{ mb: 2, ml: 3, mt:3, textAlign:'left' }}>Model Papers</Typography>
              <Divider />
              <ListItem button onClick={() => setActiveTab('al-model-papers')}>
                <ListItemIcon><MenuBookIcon /></ListItemIcon>
                <ListItemText primary="A/L Model Papers" />
              </ListItem>
              <ListItem button onClick={() => setActiveTab('ol-model-papers')}>
                <ListItemIcon><MenuBookIcon /></ListItemIcon>
                <ListItemText primary="O/L Model Papers" />
              </ListItem>
            </List>
          </DrawerStyle>
        </>
      )}
      {!isMobile && (
        <SideMenu>
          <List>
            <Typography variant="h6" sx={{ mb: 2, ml: 3, mt:3, textAlign:'left' }}>Past Papers</Typography>
            <Divider />
            <ListItem button onClick={() => setActiveTab('al-past-papers')}>
              <ListItemIcon><MenuBookIcon /></ListItemIcon>
              <ListItemText primary="A/L Past Papers" />
            </ListItem>
            <ListItem button onClick={() => setActiveTab('ol-past-papers')}>
              <ListItemIcon><MenuBookIcon /></ListItemIcon>
              <ListItemText primary="O/L Past Papers" />
            </ListItem>
            <Typography variant="h6" sx={{ mb: 2, ml: 3, mt:3, textAlign:'left' }}>Model Papers</Typography>
              <Divider />
              <ListItem button onClick={() => setActiveTab('al-model-papers')}>
                <ListItemIcon><MenuBookIcon /></ListItemIcon>
                <ListItemText primary="A/L Model Papers" />
              </ListItem>
              <ListItem button onClick={() => setActiveTab('ol-model-papers')}>
                <ListItemIcon><MenuBookIcon /></ListItemIcon>
                <ListItemText primary="O/L Model Papers" />
              </ListItem>
          </List>
        </SideMenu>
      )}
      <MainContentStyle>
        <Container>
          <Grid container spacing={3} justifyContent="space-between" alignItems="center">
            <Grid item xs={12}>
              {activeTab === 'al-past-papers' && renderALPastPapers()}
              {activeTab === 'ol-past-papers' && renderOLPastPapers()}
              {activeTab === 'al-model-papers' && renderALModelPapers()}
              {activeTab === 'ol-model-papers' && renderOLModelPapers()}
            </Grid>
          </Grid>
        </Container>
      </MainContentStyle>
    </RootStyle>
  );
}
