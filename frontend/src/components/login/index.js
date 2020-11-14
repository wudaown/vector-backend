import React, { useState, useContext } from "react";
import { Container, Paper, Grid, CssBaseline, TextField, Button, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Context } from "../../contexts";
import { LoginAPI } from "../../api";

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(10),
    marginBottom: theme.spacing(10),
  },
  title: {
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(5),
  },
  paper: {
    paddingBottom: theme.spacing(5),
  },
}));

export default function Login(props) {
  const { setIsAuthenticated } = useContext(Context);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const [loginBtnText, setLoginBtnText] = useState("login");

  const handleChangeInput = e => {
    const { name, value } = e.target;
    if (loginBtnText !== "Login") {
      setLoginBtnText("Login");
    }
    if (error) {
      setError(false);
    }
    if (name === "username") {
      setUsername(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const handleSubmit = async () => {
    if (username.length === 0 || password.length === 0) {
      setError(true);
    } else {
      setError(false);
      setLoading(true);
      setLoginBtnText("loading");
      try {
        const res = await LoginAPI({ username, password });
        sessionStorage.setItem("token", res.token);
        sessionStorage.setItem("isAuthenticated", true);
        setLoading(false);
        setLoginBtnText("logined");
        setIsAuthenticated(true);
        props.history.replace("/");
      } catch (err) {
        setError(true);
        setLoading(false);
        setLoginBtnText("username or password incorrect");
      }
    }
  };
  const classes = useStyles();
  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="xs" className={classes.root}>
        <Paper className={classes.paper}>
          <Grid container direction="column" spacing={2}>
            <Grid container item justify="center" spacing={0}>
              <Grid item xs={12}>
                <Typography className={classes.title} variant="h5" align="center">
                  LOGIN
                </Typography>
              </Grid>
            </Grid>
            <Grid container item justify="center" spacing={0}>
              <Grid item xs={8}>
                <TextField
                  label="username"
                  name="username"
                  fullWidth
                  value={username}
                  error={username.length === 0 && error}
                  onChange={e => {
                    handleChangeInput(e);
                  }}
                />
              </Grid>
            </Grid>
            <Grid container item justify="center" spacing={0}>
              <Grid item xs={8}>
                <TextField
                  label="password"
                  type="password"
                  name="password"
                  fullWidth
                  value={password}
                  error={password.length === 0 && error}
                  onKeyPress={e => {
                    if (e.key === "Enter") {
                      handleSubmit();
                    }
                  }}
                  onChange={e => {
                    handleChangeInput(e);
                  }}
                />
              </Grid>
            </Grid>
            <Grid container item justify="center" spacing={0}>
              <Grid item xs={8}>
                <Button
                  variant="contained"
                  fullWidth
                  color="primary"
                  disabled={loading && error}
                  onClick={() => handleSubmit()}
                >
                  {loginBtnText}
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </React.Fragment>
  );
}
