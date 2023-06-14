import theme from "../utils/theme";

import {
    Box,
    Button,
    Container

} from '@mui/material';




export function Welcome() {

    return (



        <Container sx={{
            p: 30
        }}>
            <h2> Englingo - secure, innovative, playful.</h2>

            <h4> Your best English learning buddy! </h4>
            <ol>
                <li>Choose a topic for a mission.</li>
                <li>Participate with your match in a 10-min video call.</li>
                <li>Get your score.</li>
            </ol>
            <Button variant="contained" color="secondary">
                Button
            </Button>

        </Container>



    )
}