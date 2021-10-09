import { useState, useEffect, Ref, forwardRef, useImperativeHandle } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';
import QR from 'qrcode.react';

const useStyles = makeStyles((theme: any) => ({
    MuiDialogActions: {
        styleOverrides: {
            root: {
                marginTop: theme.spacing(0),
                padding: theme.spacing(0)
            }
        }
    }
}));

export interface DialogProps {
    id: string;
    children?: React.ReactNode;
    title: string;
    content: string;
    qrcode: string;
    defaultOpen?: boolean;
    onClose: () => void;
}

function QrCodeDialog(props: DialogProps, ref: Ref<any>) {
    const { children, title, content, qrcode, defaultOpen, onClose, ...other } = props;
    const classes = useStyles();
    const [open, setOpen] = useState(false);

    useImperativeHandle(ref, () => ({
        OpenDialog() {
            setOpen(true)
        }
    }), [])

    useEffect(() => {
        if (defaultOpen) setOpen(true)
    }, []);

    const handleClose = () => {
        onClose();
        setOpen(false);
    };

    return (
        <div>
            <Dialog
                sx={{ textAlign: "center" }}
                open={open}
                onClose={handleClose}
                aria-labelledby="qrcode-dialog-title"
                aria-describedby="qrcode-dialog-description"
            >
                <DialogTitle id="qrcode-dialog-title">
                    <Typography color="text.primary" variant="h4" component="h3" paragraph>
                        {title}
                    </Typography>
                </DialogTitle>
                <DialogContent dividers={false}>
                    <DialogContentText id="qrcode-dialog-description">
                        <Typography color="text.primary" variant="subtitle1">
                            {content}
                        </Typography>
                    </DialogContentText>
                    <Container>
                        <Box sx={{ justifyContent: 'center', marginTop: '13px', marginBottom: '13px', display: 'flex', alignItems: 'center' }} >
                            <QR
                                value={qrcode}
                                size="350"
                                level="H"
                                // includeMargin
                                renderAs="svg"
                                imageSettings={{ excavate: false }}
                            />
                        </Box>
                        <Typography color="text.primary" variant="subtitle1">
                            {qrcode}
                        </Typography>
                    </Container>
                    <Divider variant="middle" />
                </DialogContent>
                <DialogActions disableSpacing={true} className={classes.MuiDialogActions} sx={{ justifyContent: 'center', padding: '0 !importannt', margin: '0 !importannt' }} >
                    <Button variant="outlined" color={'primary'} onClick={handleClose} autoFocus>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default forwardRef(QrCodeDialog);