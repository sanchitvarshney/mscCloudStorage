import { FC, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
  Rating,
  IconButton,
} from "@mui/material";
import { Close, Send } from "@mui/icons-material";

interface SendFeedbackDialogProps {
  open: boolean;
  onClose: () => void;
}

const SendFeedbackDialog: FC<SendFeedbackDialogProps> = ({ open, onClose }) => {
  const [feedbackType, setFeedbackType] = useState("general");
  const [rating, setRating] = useState<number | null>(null);
  const [feedback, setFeedback] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = () => {
    // Handle feedback submission
    console.log({
      type: feedbackType,
      rating,
      feedback,
      email,
    });
    // Reset form
    setFeedbackType("general");
    setRating(null);
    setFeedback("");
    setEmail("");
    onClose();
  };

  const handleClose = () => {
    // Reset form on close
    setFeedbackType("general");
    setRating(null);
    setFeedback("");
    setEmail("");
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 1,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 500, color: "#202124" }}>
          Send Feedback
        </Typography>
        <IconButton
          onClick={handleClose}
          size="small"
          sx={{
            color: "#5f6368",
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.04)",
            },
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Rating */}
          <Box>
            <Typography
              variant="subtitle2"
              sx={{ mb: 1, color: "#202124", fontWeight: 500 }}
            >
              How would you rate your experience?
            </Typography>
            <Rating
              value={rating}
              onChange={(_, newValue) => setRating(newValue)}
              size="large"
              sx={{
                "& .MuiRating-iconFilled": {
                  color: "#1976d2",
                },
              }}
            />
          </Box>

          {/* Feedback Type */}
          <FormControl>
            <FormLabel
              sx={{
                mb: 1,
                color: "#202124",
                fontWeight: 500,
                "&.Mui-focused": {
                  color: "#202124",
                },
              }}
            >
              What would you like to share?
            </FormLabel>
            <RadioGroup
              value={feedbackType}
              onChange={(e) => setFeedbackType(e.target.value)}
            >
              <FormControlLabel
                value="general"
                control={<Radio size="small" />}
                label="General feedback"
              />
              <FormControlLabel
                value="bug"
                control={<Radio size="small" />}
                label="Report a bug"
              />
              <FormControlLabel
                value="feature"
                control={<Radio size="small" />}
                label="Suggest a feature"
              />
              <FormControlLabel
                value="other"
                control={<Radio size="small" />}
                label="Other"
              />
            </RadioGroup>
          </FormControl>

          {/* Feedback Text */}
          <TextField
            label="Your feedback"
            multiline
            rows={6}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Please share your thoughts, suggestions, or report any issues..."
            fullWidth
            variant="outlined"
            sx={{
              "& .MuiOutlinedInput-root": {
                "&:hover fieldset": {
                  borderColor: "#1976d2",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#1976d2",
                },
              },
            }}
          />

          {/* Email (Optional) */}
          <TextField
            label="Email (optional)"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your.email@example.com"
            fullWidth
            variant="outlined"
            helperText="We may contact you for more details about your feedback"
            sx={{
              "& .MuiOutlinedInput-root": {
                "&:hover fieldset": {
                  borderColor: "#1976d2",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#1976d2",
                },
              },
            }}
          />

          {/* Info Box */}
          <Box
            sx={{
              p: 2,
              bgcolor: "#e8f0fe",
              borderRadius: 1,
            }}
          >
            <Typography variant="caption" sx={{ color: "#5f6368" }}>
              Your feedback helps us improve Drive. We read all feedback but
              may not respond to every submission.
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          py: 2,
          borderTop: "1px solid rgba(0, 0, 0, 0.12)",
        }}
      >
        <Button onClick={handleClose} sx={{ color: "#5f6368" }}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          startIcon={<Send />}
          disabled={!feedback.trim()}
          sx={{
            bgcolor: "#1976d2",
            "&:hover": {
              bgcolor: "#1565c0",
            },
            textTransform: "none",
          }}
        >
          Send Feedback
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SendFeedbackDialog;
