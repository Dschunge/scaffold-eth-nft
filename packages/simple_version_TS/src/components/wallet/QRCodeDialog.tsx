import { useState, useEffect, Ref, forwardRef, useImperativeHandle } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export interface DialogProps {
    id: string;
    children?: React.ReactNode;
    title: string;
    content: string;
    defaultOpen?: boolean;
    onClose: () => void;
}

function QrCodeDialog(props: DialogProps, ref: Ref<any>) {
    const { children, title, content, defaultOpen, onClose, ...other } = props;

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
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {title}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {content}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Disagree</Button>
                    <Button onClick={handleClose} autoFocus>
                        Agree
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default forwardRef(QrCodeDialog);