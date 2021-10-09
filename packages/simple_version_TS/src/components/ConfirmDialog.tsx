import React from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, IconButton, Button } from '@mui/material'
import { makeStyles } from '@mui/styles';
//import Controls from "./controls/Controls";
import NotListedLocationIcon from '@mui/icons-material/NotListedLocation';

const useStyles = makeStyles((theme: any) => ({
    dialog: {
        padding: theme.spacing(2),
        position: 'absolute',
        top: theme.spacing(5)
    },
    dialogTitle: {
        textAlign: 'center'
    },
    dialogContent: {
        textAlign: 'center'
    },
    dialogAction: {
        justifyContent: 'center'
    },
    titleIcon: {
        backgroundColor: theme.palette.secondary.light,
        color: theme.palette.secondary.main,
        '&:hover': {
            backgroundColor: theme.palette.secondary.light,
            cursor: 'default'
        },
        '& .MuiSvgIcon-root': {
            fontSize: '8rem',
        }
    }
}))

export default function ConfirmDialog(props: any) {

    const { confirmDialog, setConfirmDialog } = props;
    const classes = useStyles();

    return (
        <Dialog open={confirmDialog.isOpen} classes={{ paper: classes.dialog }}>
            <DialogTitle className={classes.dialogTitle}>
                <IconButton disableRipple className={classes.titleIcon}>
                    <NotListedLocationIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent className={classes.dialogContent}>
                <Typography variant="h6">
                    {confirmDialog.title}
                </Typography>
                <Typography variant="subtitle2">
                    {confirmDialog.subTitle}
                </Typography>
            </DialogContent>
            <DialogActions className={classes.dialogAction}>
                <Button
                    variant="contained"
                    color="success"
                    onClick={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}>
                    No
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
                    //onClick={confirmDialog.onConfirm} 
                    onClick={() => {
                        confirmDialog.onConfirm()
                        setConfirmDialog({ ...confirmDialog, isOpen: false })
                    }}>
                    Yes
                </Button>
            </DialogActions>
        </Dialog>
    )
}