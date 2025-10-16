import { useEffect, useState } from 'react';
import { Alert, Snackbar } from '@mui/material';
import { useSnackbar } from './SnackbarProvider.jsx';

const SnackbarOutlet = () => {
  const { queue, popMessage } = useSnackbar();
  const [current, setCurrent] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open && queue.length > 0) {
      setCurrent(queue[0]);
      setOpen(true);
    }
  }, [queue, open]);

  const handleClose = (_, reason) => {
    if (reason === 'clickaway') return;
    setOpen(false);
    popMessage();
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={3600}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert onClose={handleClose} severity={current?.severity ?? 'info'} variant="filled" sx={{ width: '100%' }}>
        {current?.message}
      </Alert>
    </Snackbar>
  );
};

export default SnackbarOutlet;
