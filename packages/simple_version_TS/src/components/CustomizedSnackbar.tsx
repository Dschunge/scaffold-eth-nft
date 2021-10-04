import React, { forwardRef, useImperativeHandle, Ref } from 'react'
import Stack from '@mui/material/Stack';
import Snackbar, { SnackbarOrigin } from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

// type RtlLayoutProps = {
//     children?: ReactNode;
//     title?: string;
// };

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export interface State extends SnackbarOrigin {
    open: boolean;
}

function CustomizedSnackbar(props: any, ref: Ref<any>) {
    //const [open, setOpen] = useState(false);
    const [state, setState] = React.useState<State>({
        open: false,
        vertical: 'bottom',
        horizontal: 'left',
    });
    const { vertical, horizontal, open } = state;

    useImperativeHandle(ref, () => ({
        showSnackBar: () => {
            console.log(`click snackbar!`);
            //setOpen(!open)
            setState({
                open: true, ...{
                    vertical: 'bottom',
                    horizontal: 'center',
                }
            });
        }
    }));

    const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setState({ ...state, open: false });
    };

    return (
        <>
            {/* <Stack spacing={2} sx={{ width: '100%' }}> */}
            <Snackbar open={open} anchorOrigin={{ vertical, horizontal }} key={vertical + horizontal} autoHideDuration={2000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                    Address is copied to clipboard
                </Alert>
            </Snackbar>
            {/* </Stack> */}
        </>
    )
}

export default forwardRef(CustomizedSnackbar);
