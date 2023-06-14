import * as React from 'react';
// import TrendingUp from '@mui/icons-material/TrendingUp';
import {
    Box,
    Button,
    Typography,
    Avatar,
    CssBaseline,
    ThemeProvider,
    Grid,
    Paper,
    Grow,
    Popper,
    MenuItem,
    MenuList,
    ClickAwayListener
} from '@mui/material';


export function Header() {

    const [open, setOpen] = React.useState(false);

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };
    const anchorRef = React.useRef<HTMLButtonElement>(null);

    const handleClose = (event: Event | React.SyntheticEvent) => {
        if (
            anchorRef.current &&
            anchorRef.current.contains(event.target as HTMLElement)
        ) {
            return;
        }

        setOpen(false);
    };

    return (
        <>
            <Box
                sx={{
                    bgcolor: 'primary.main',
                    color: 'text.secondary',
                    width: 1,
                    mx: 0,
                }}
            >
                <Grid container
                    spacing={2}
                    justifyContent="space-between"
                    alignItems="center"
                >
                    {/* ---------------------------------------------------------Englingo Logo-------------------------------------------------------------------- */}
                    <Grid item >

                        <Typography
                            sx={{
                                mx: 5,
                                fontSize: 40
                            }}
                            variant="logo"
                        >
                            Englingo
                        </Typography>

                    </Grid>

                    <Grid item >

                        {/* -----------------------------------------------------------Avatar------------------------------------------------------------------ */}
                        <Button
                            ref={anchorRef}
                            id="composition-button"
                            aria-controls={open ? 'composition-menu' : undefined}
                            aria-expanded={open ? 'true' : undefined}
                            aria-haspopup="true"
                            onClick={handleToggle}
                            sx={{
                                right: 0,
                                mx: 5,
                            }}
                        >
                            <Avatar
                                alt="User"
                                src="https://assets.stickpng.com/images/585e4bf3cb11b227491c339a.png"
                            />
                        </Button>

                        {/* ---------------------------------------------------------Popping Menu-------------------------------------------------------------------- */}
                        <Popper
                            open={open}
                            anchorEl={anchorRef.current}
                            role={undefined}
                            placement="bottom-start"
                            transition
                            disablePortal
                        >
                            {({ TransitionProps, placement }) => (
                                <Grow
                                    {...TransitionProps}
                                    style={{
                                        transformOrigin:
                                            placement === 'bottom-start' ? 'left top' : 'left bottom',
                                    }}
                                >
                                    <Paper>
                                        <ClickAwayListener onClickAway={handleClose}>
                                            <MenuList
                                                autoFocusItem={open}
                                                id="composition-menu"
                                                aria-labelledby="composition-button"
                                            // onKeyDown={handleListKeyDown}
                                            >
                                                {/* ---------------------------------------------------------ACH - TODO-------------------------------------------------------------------- */}
                                                <MenuItem onClick={handleClose}>Profile</MenuItem>
                                                <MenuItem onClick={handleClose}>My account</MenuItem>
                                                <MenuItem onClick={handleClose}>Logout</MenuItem>
                                            </MenuList>
                                        </ClickAwayListener>
                                    </Paper>
                                </Grow>
                            )}
                        </Popper>

                    </Grid>
                </Grid>




            </Box>

        </>
    );
}