import React from 'react'

// Material UI components
import CssBaseline from "@material-ui/core/CssBaseline";
import Avatar from "@material-ui/core/Avatar";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import Container from "@material-ui/core/Container";

import styles from "./styles";
import withStyles from '@material-ui/core/styles/withStyles';

const LoginForm = ({loginDetails, classes, errors, handleChange, loading, handleSubmit }) => (
    <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
            <Avatar className={classes.avatar}>
                <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
                Login
            </Typography>
            <form className={classes.form} noValidate>
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    autoFocus
                    helperText={errors.email}
                    error={errors.email ? true : false}
                    onChange={handleChange}
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    helperText={errors.password}
                    error={errors.password ? true : false}
                    onChange={handleChange}
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                    onClick={handleSubmit}
                    disabled={loading || !loginDetails.email || !loginDetails.password}
                >
                    Sign In
                    {loading && <CircularProgress size={30} className={classes.progress} />}
                </Button>
                <Grid container>
                    <Grid item>
                        <Link href="signup" variant="body2">
                            {"Don't have an account? Sign Up"}
                        </Link>
                    </Grid>
                </Grid>
                {errors.general && (
                    <Typography variant="body2" className={classes.customError}>
                        {errors.general}
                    </Typography>
                )}
            </form>
        </div>
    </Container>
)

export default withStyles(styles)(LoginForm);