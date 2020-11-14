import React from "react";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";

import { mediaPrefix } from "../../utils/constants";

const useStyles = makeStyles(theme => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  cardMedia: {
    // paddingTop: "56.25%" // 16:9
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(2),
    width: "40px",
    height: "40px",
    // height: "20vh"
  },
  cardContent: {
    flexGrow: 1,
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
  cardHeader: {
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(2),
  },
}));

export default function Cards(props) {
  const classes = useStyles();

  const { clients } = props;

  const { deleteClient } = props;

  return (
    <React.Fragment>
      <CssBaseline />
      <main>
        <Container className={classes.cardGrid} maxWidth="lg">
          {/* End hero unit */}
          <Grid container spacing={4}>
            {clients.map(client => (
              <Grid item key={client.id} xs={12} sm={4} md={4}>
                <Card className={classes.card}>
                  <Grid item xs={12}>
                    <Grid container>
                      <Grid item xs={4}>
                        {client.platform === "linux" && <CardMedia className={classes.cardMedia} image="./linux.png" />}
                        {client.platform === "mac" && (
                          <CardMedia className={classes.cardMedia} image="./mac_black.png" />
                        )}
                        {client.platform === "windows" && (
                          <CardMedia className={classes.cardMedia} image="./windows_grey.png" />
                        )}
                      </Grid>
                      <Grid item xs={8}>
                        <Typography gutterBottom variant="h5" component="h2" className={classes.cardHeader}>
                          {client.device}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  <CardContent className={classes.cardContent}>
                    {/* <Typography gutterBottom variant="h5" component="h2">
                      {client.device}
                    </Typography> */}
                    <Typography>IP: {client.ip}</Typography>
                    <Typography>Platform: {client.platform}</Typography>
                    <Typography>Mode: {client.mode}</Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      color="primary"
                      onClick={() => {
                        window.open(`${mediaPrefix}${client.device}_${client.platform}.conf`);
                      }}
                    >
                      Download
                    </Button>
                    <Button
                      size="small"
                      color="primary"
                      onClick={() => {
                        deleteClient(client.id);
                      }}
                    >
                      Delete
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </main>
    </React.Fragment>
  );
}
