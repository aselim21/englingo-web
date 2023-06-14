import * as React from 'react';
// import TrendingUp from '@mui/icons-material/TrendingUp';
import { Box, Button, Typography } from '@mui/material';
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "../utils/theme";


export function Header() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline enableColorScheme />
            <Box
                sx={{
                    bgcolor: 'primary.main',
                    color: 'text.secondary',
                    width: 1,
                    mx: 0,
                }}
            >
                <Typography sx={{
                    mx: 5
                }}
                    variant="logo">
                        Englingo
                </Typography>

            </Box>

            <Button variant="contained" color="secondary">
                Button
            </Button>
        </ThemeProvider>
        // <Box
        //   sx={{
        //     bgcolor: 'background.paper',
        //     boxShadow: 1,
        //     borderRadius: 1,
        //     p: 2,
        //     minWidth: 300,
        //   }}
        // >
        //   <Box sx={{ color: 'text.secondary' }}>Sessions</Box>
        //   <Box sx={{ color: 'text.primary', fontSize: 34, fontWeight: 'medium' }}>
        //     98.3 K
        //   </Box>

        //   <Box
        //     sx={{
        //       color: 'success.dark',
        //       display: 'inline',
        //       fontWeight: 'medium',
        //       mx: 0.5,
        //     }}
        //   >
        //     18.77%
        //   </Box>
        //   <Box sx={{ color: 'text.secondary', display: 'inline', fontSize: 12 }}>
        //     vs. last week
        //   </Box>
        // </Box>
    );
}