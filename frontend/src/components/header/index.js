import React, { useContext } from "react";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

import { Link } from "react-router-dom";
import { Context } from "../../contexts";

const useStyles = makeStyles(theme => ({
  appBar: {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  toolbar: {
    flexWrap: "wrap",
  },
  toolbarTitle: {
    flexGrow: 1,
  },
  link: {
    margin: theme.spacing(1, 1.5),
    textDecoration: "none",
  },
}));

export default function Header() {
  const classes = useStyles();

  const { isAuthenticated, setIsAuthenticated } = useContext(Context);

  return (
    <React.Fragment>
      <CssBaseline />
      <AppBar position="static" color="default" elevation={0} className={classes.appBar}>
        <Toolbar className={classes.toolbar}>
          <Typography variant="h6" color="inherit" noWrap className={classes.toolbarTitle}>
            <Link to="/" className={classes.link}>
              Vector
            </Link>
          </Typography>
          {isAuthenticated ? (
            <Link to="/login" className={classes.link}>
              <Button
                color="primary"
                variant="outlined"
                className={classes.link}
                onClick={() => {
                  setIsAuthenticated(false);
                  sessionStorage.removeItem("token");
                  sessionStorage.removeItem("isAuthenticated");
                }}
              >
                Logout
              </Button>
            </Link>
          ) : (
            <Link to="/login" className={classes.link}>
              <Button color="primary" variant="outlined" className={classes.link}>
                Login
              </Button>
            </Link>
          )}
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
}
