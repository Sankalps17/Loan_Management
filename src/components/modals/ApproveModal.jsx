import PropTypes from 'prop-types';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Stack,
  Typography
} from '@mui/material';
import { formatCurrency } from '../../utils/currency.js';
import { formatDate } from '../../utils/dateHelpers.js';

const ApproveModal = ({ open, onClose, loan, onApprove, onReject }) => {
  if (!loan) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="approve-loan-dialog"
      fullWidth
      maxWidth="sm"
      slotProps={{
        backdrop: { sx: { zIndex: 60 } },
        paper: { sx: { borderRadius: 3, zIndex: 70 } }
      }}
    >
      <DialogTitle id="approve-loan-dialog">Review Loan Application</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={1.5}>
          <Typography variant="subtitle2" color="text.secondary">
            Applicant
          </Typography>
          <Typography variant="h6">{loan.applicantName}</Typography>
          <Divider />
          <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap' }}>
            <InfoBlock label="Loan Amount" value={formatCurrency(loan.amount)} />
            <InfoBlock label="Tenure" value={`${loan.tenureMonths} months`} />
            <InfoBlock label="Interest" value={`${loan.interestRate}%`} />
          </Stack>
          <DialogContentText>{loan.purpose}</DialogContentText>
          <Typography variant="caption" color="text.secondary">
            Submitted {formatDate(loan.createdAt)}
          </Typography>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={() => onReject(loan.id)} color="error" variant="outlined">
          Reject
        </Button>
        <Button onClick={() => onApprove(loan.id)} color="primary" variant="contained">
          Approve
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const InfoBlock = ({ label, value }) => (
  <Stack spacing={0.5}>
    <Typography variant="caption" color="text.secondary">
      {label}
    </Typography>
    <Typography variant="subtitle1" fontWeight={600}>
      {value}
    </Typography>
  </Stack>
);

ApproveModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onApprove: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired,
  loan: PropTypes.shape({
    id: PropTypes.string.isRequired,
    applicantName: PropTypes.string,
    amount: PropTypes.number,
    tenureMonths: PropTypes.number,
    interestRate: PropTypes.number,
    purpose: PropTypes.string,
    createdAt: PropTypes.string
  })
};

InfoBlock.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired
};

export default ApproveModal;
