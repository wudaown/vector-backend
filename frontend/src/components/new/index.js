import React, { useEffect, useState } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
import CardMedia from "@material-ui/core/CardMedia";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";

import Cards from "./Card";

import { GetClientsAPI, CreateClientAPI, DeleteClientAPI } from "../../api";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    marginTop: theme.spacing(2),
  },
  cardMedia: {
    height: "30vh",
  },
  firstElement: {
    marginTop: theme.spacing(2),
  },
  form: {
    paddingRight: theme.spacing(2),
  },
}));

export default function NewClient(props) {
  const classes = useStyles();

  const [clients, setClients] = useState([]);
  const [client, setClient] = useState({ device: "", platform: "", mode: "", range: "" });
  const [error, setError] = useState(false);

  const deleteClient = id => {
    DeleteClientAPI(id)
      .then(res => {
        if (res.status === 204) {
          getClients();
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  const createClient = () => {
    if (
      client.device.lenght === 0 ||
      client.platform.length === 0 ||
      client.mode.length === 0
      // Do not check for length for range
      // since it is defined as extra range
    ) {
      setError(true);
    } else {
      CreateClientAPI(client)
        .then(() => {
          setClient({ device: "", platform: "", mode: "", range: "" });
          getClients();
        })
        .catch(err => {
          console.log(err);
        });
    }
  };
  const getClients = () => {
    GetClientsAPI()
      .then(res => setClients(res))
      .catch(err => console.log(err));
  };

  useEffect(() => {
    getClients();
  }, []);

  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="lg" className={classes.root}>
        <Paper className={classes.form}>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              {client.platform === "linux" && <CardMedia className={classes.cardMedia} image="./linux.png" />}
              {client.platform === "mac" && <CardMedia className={classes.cardMedia} image="./mac_black.png" />}
              {client.platform === "windows" && <CardMedia className={classes.cardMedia} image="./windows_grey.png" />}
            </Grid>
            <Grid item xs={8}>
              <Grid container justify="center" spacing={3}>
                <Grid item xs={12} className={classes.firstElement}>
                  <TextField
                    error={client.device.length === 0 && error}
                    label="Device Name"
                    fullWidth
                    name="device"
                    value={client.device}
                    onChange={e => setClient({ ...client, device: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel htmlFor="platform-select">Platform</InputLabel>
                    <Select
                      error={client.platform.length === 0 && error}
                      value={client.platform}
                      autoWidth
                      onChange={e => setClient({ ...client, platform: e.target.value })}
                      inputProps={{
                        name: "platform",
                        id: "platform-select",
                      }}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      <MenuItem value="linux">Linux</MenuItem>
                      <MenuItem value="mac">Mac</MenuItem>
                      <MenuItem value="windows">Windows</MenuItem>
                      <MenuItem value="ios">iOS</MenuItem>
                      <MenuItem value="android">Android</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel htmlFor="mode-select">Mode</InputLabel>
                    <Select
                      value={client.mode}
                      error={client.mode.length === 0 && error}
                      onChange={e => setClient({ ...client, mode: e.target.value })}
                      autoWidth
                      inputProps={{
                        name: "mode",
                        id: "mode-select",
                      }}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      <MenuItem value="lan">LAN</MenuItem>
                      <MenuItem value="wan">WAN</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    error={client.range.length === 0 && error}
                    label="Extra IP Range"
                    placeholder="192.168.0.0/24, 172.0.0.0/24"
                    fullWidth
                    name="range"
                    value={client.range}
                    onChange={e => setClient({ ...client, range: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button variant="contained" color="primary" fullWidth onClick={createClient}>
                    Submit
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </Container>
      <Cards clients={clients} deleteClient={deleteClient} />
    </React.Fragment>
  );
}
