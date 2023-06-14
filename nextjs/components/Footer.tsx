import { Grid, Typography, Box } from "@mui/material";

export function Footer() {
    return (
        <footer>
            <Box
                sx={{
                    width: 1,
                    position: "static",
                    bottom: 0,
                    bgcolor: "primary.contrastText",
                    // marginTop:"calc(10% + 60px)",
                    py: "2rem",
                    boxShadow: "0 50vh 0 50vh #4D4D4D",
                    height: "60px",

                }}>
                <Typography
                    sx={{
                        color: 'text.secondary',
                        textAlign: "center",
                         }}>
                @ 2023 Achelia Selim. All rights reserved.
            </Typography>

        </Box>
        </footer >
    )
}