import * as React from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import IconButton from "@mui/material/IconButton";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import Popper from '@mui/material/Popper';
import Fade from '@mui/material/Fade';

function Copyright() {
    return (
        <Typography variant="body2" color="text.secondary">
            {'Copyright © '}
            <Link color="inherit" href="https://mui.com/">
                Wellbeing Gallery
            </Link>
            {' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
  );
}

function Footer() {
    const [open, setOpen] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
        setOpen((previousOpen) => !previousOpen);
    };
    const canBeOpen = open && Boolean(anchorEl);
    const id = canBeOpen ? 'transition-popper' : undefined;

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column' }} >
            <Box component="footer" sx={{ py: 1, backgroundColor: "#64748B" }} >
                <Container>
                    <IconButton onClick={handleClick} aria-describedby={id}>
                        <ErrorOutlineIcon />
                        <Typography variant="body1" sx={{ml:1, fontWeight: 'bold', lineHeight: 1.5}}>
                            Privacy Statement
                        </Typography>
                    </IconButton>
                    <Popper id={id} open={open} anchorEl={anchorEl} placement="right-start" transition>
                        {({ TransitionProps }) => (
                        <Fade {...TransitionProps} timeout={350}>
                            <Box sx={{ bgcolor: 'background.paper' }}>
                                DISCLAIMER: Information from this staff website should not be disseminated externally without the document owner's consent and should be treated as Internal. Restricted or Highly Restricted information, including price or commercially sensitive information, should not be displayed on staff websites. All information must comply and be handled in accordance with published Information Security Risk policies.
                            </Box>
                        </Fade>
                        )}
                    </Popper>
                </Container>
            </Box>
        </Box>
  );
}

export default Footer;