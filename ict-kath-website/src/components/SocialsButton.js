import PropTypes from 'prop-types';
// icons
import logoFacebook from '@iconify/icons-carbon/logo-facebook';
import logoYoutube from '@iconify/icons-carbon/logo-youtube';
import logoInstagram from '@iconify/icons-carbon/logo-instagram';
// import logoWhatsApp from '@iconify/icons-carbon/logo-whatsapp';
// @mui
import { alpha } from '@mui/material/styles';
import { Stack, IconButton, Button, Link } from '@mui/material';
//
import Iconify from './Iconify';

// ----------------------------------------------------------------------

SocialsButton.propTypes = {
  initialColor: PropTypes.bool,
  links: PropTypes.objectOf(PropTypes.string),
  simple: PropTypes.bool,
  sx: PropTypes.object,
};

export default function SocialsButton({
  initialColor = false,
  simple = true,
  links = {},
  sx,
  ...other
}) {
  const SOCIALS = [
    {
      name: 'FaceBook',
      icon: logoFacebook,
      socialColor: '#4267B2',
      path: 'https://www.facebook.com/kathurusingha',
    },
    {
      name: 'Instagram',
      icon: logoInstagram,
      socialColor: '#E02D69',
      path: links.instagram || '#instagram-link',
    },
    // {
    //   name: 'Instagram',
    //   icon: logoInstagram,
    //   socialColor: '#E02D69',
    //   path: links.instagram || '#instagram-link',
    // },
    {
      name: 'Youtube',
      icon: logoYoutube,
      socialColor: '#00AAEC',
      path: 'https://www.youtube.com/user/hashan1995',
    },
  ];

  return (
    <Stack direction="row" flexWrap="wrap" alignItems="center">
      {SOCIALS.map((social) => {
        const { name, icon, path, socialColor } = social;
        return simple ? (
          <Link key={name} href={path}>
            <IconButton
              color="inherit"
              sx={{
                ...(initialColor && {
                  color: socialColor,
                  '&:hover': {
                    bgcolor: alpha(socialColor, 0.08),
                  },
                }),
                ...sx,
              }}
              {...other}
            >
              <Iconify icon={icon} sx={{ width: 30, height: 30 }} />
            </IconButton>
          </Link>
        ) : (
          <Button
            key={name}
            href={path}
            color="inherit"
            variant="outlined"
            size="small"
            startIcon={<Iconify icon={icon} />}
            sx={{
              m: 0.5,
              flexShrink: 0,
              ...(initialColor && {
                color: socialColor,
                borderColor: socialColor,
                '&:hover': {
                  borderColor: socialColor,
                  bgcolor: alpha(socialColor, 0.08),
                },
              }),
              ...sx,
            }}
            {...other}
          >
            {name}
          </Button>
        );
      })}
    </Stack>
  );
}
