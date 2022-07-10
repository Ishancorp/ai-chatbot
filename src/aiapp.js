import React, { useState } from 'react';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import { FormControl, FormLabel } from '@mui/material';
import Stack from '@mui/material/Stack';

import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Divider from '@mui/material/Divider';

import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';

import Paper from '@mui/material/Paper';
import CssBaseline from '@mui/material/CssBaseline';



const pageTheme = createTheme({
    palette: {
        background: {
            backdrop: "#FAFAFA",
            default: "#F0F0F0"
        },
    },
});

function getCurrentTime(){

    let newDate = new Date()
    let hrs = newDate.getHours();
    let mins = newDate.getMinutes();

    return `${hrs}:${mins}`;
}

const RightPaper = (props) => {
    return (
        <Paper elevation={0} sx={{ bgcolor: 'background.backdrop' }} style={{ padding: 3, margin: 10 }}>
            <Stack direction="row" spacing={2}>
                <Paper elevation={0} sx={{ bgcolor: 'background.backdrop' }} style={{ padding: 3, margin: 0, marginTop: 5 }}>
                    <Avatar
                        sx={{ width: 24, height: 24 }}
                            src="./OpenAI_Logo.png" />
                </Paper>
                <Paper style={{
                    backgroundColor: "#E0E0E0",
                    padding: 4,
                    margin: 0,
                    marginLeft: 5,
                    maxWidth: "60%",
                    width: "max-content",
                    borderRadius: "20px"
                }}><Typography variant="body2" style={{padding:7}}>{props.children}</Typography></Paper>
            </Stack>
        </Paper>
    );
}

const LeftPaper = (props) => {
    return (
        <Paper style={{
            backgroundColor: "#67daff",
            padding: 4,
            margin: 10,
            marginLeft: "auto",
            maxWidth: "60%",
            width: "max-content",
            borderRadius: "20px"
        }}><Typography variant="body2" style={{ padding: 7 }}>{props.children}</Typography></Paper>
    );
}


function PromptForm(props) {
    const [value, setValue] = useState("");
    const [textInput, setTextInput] = useState("");

    const handleSubmit = event => {
        event.preventDefault();
        const data = {
            prompt: value,
            temperature: 0.5,
            max_tokens: 64,
            top_p: 1,
            frequency_penalty: 0.0,
            presence_penalty: 0.0
        };

        const fetchData = async () => {
            console.log(props.resps);

            const response = await fetch("https://api.openai.com/v1/engines/text-curie-001/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer process.env.AI_KEY`,// Authorization: `Bearer ${API_KEY}`
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                let nu_resp = await response.json();
                console.log(nu_resp["choices"][0].text);
                props.isClicked({ prompt: value, response: nu_resp["choices"][0].text });
                //resps.push({ prompt: this.state.value, response: nu_resp["choices"][0].text });
            }
            setTextInput("");
            setValue("");
        }
        fetchData();
    };

    const handleMessageChange = event => {
        setTextInput(event.target.value);
        setValue(event.target.value);
    };

    const handleKeyPress = event => {
        console.log(1);
        if (event.key === 'Enter') {
            handleSubmit(event);
        }
    };
    
    return (
        <FormControl>
            <Stack direction="row">
                <TextField
                        id="filled-textarea"
                        label="Chat with the AI"
                        placeholder=""
                        multiline
                        variant="standard"
                        value={textInput}
                        onChange={handleMessageChange}
                    onKeyPress={handleKeyPress}
                    style={{ width:"47vh" }}
                    
                />
                <IconButton
                    color="primary" 
                    disabled={value.trim() === ""}
                    className="btn btn-primary mb-3"
                    variant="contained"
                    value="Submit"
                    onClick={handleSubmit}
                ><ArrowForwardIosRoundedIcon /></IconButton>
            </Stack>
        </FormControl>
    );
}

function ResponseList (props) {
        console.log(2);
        console.log(props.resps);
        return (
            <div className="container" id="output">
                {props.resps.map((resp) =>
                    <div>
                        <LeftPaper>{resp.prompt}</LeftPaper>
                        <RightPaper>{resp.response}</RightPaper>
                    </div>
                )}
            </div>

        );
}

class AIApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = { resps: [] }
    };

    handleNewResp = (newResp) => {
        console.log(0);
        var newResps = this.state.resps;
        console.log(1);
        newResps.push(newResp);
        console.log(13);
        console.log(newResps);
        this.setState({ resps: newResps });
        console.log(this.state.resps);
    }

    render() {
        return (
            <ThemeProvider theme={pageTheme }>
                <CssBaseline/>
                <Typography align="center" variant="h4" component="div" gutterBottom>
                    OpenAI Chatbot
                </Typography>
                <Paper elevation={6} sx={{ bgcolor: 'background.backdrop' }} style={{ padding: 4, margin : "auto", width: "30vw", minWidth: "400px" }} >
                    <Paper
                        m={5}
                        sx={{ bgcolor: 'background.backdrop' }}
                        style={{
                            height: "75vh",
                            margin: 5,
                            overflowY: "auto"
                        }}>
                            <ResponseList resps={this.state.resps} />
                    </Paper>
                    <Box m={1} sx={{ bgcolor: 'background.backdrop' }}>
                        <PromptForm isClicked={this.handleNewResp} />
                    </Box>
                    </Paper>
            </ThemeProvider>
        );
    }
}

export default AIApp;