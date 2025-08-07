import React, { useState } from 'react';
import axios from 'axios';
import {
  Container,
  Box,
  Typography,
  Button,
  CircularProgress,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import ReviewResultDisplay from '/src/pages/ReviewResultDisplay';

export default function CustomsReviewPage() {
  const [file, setFile] = useState(null);
  const [reviewResult, setReviewResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selected = e.target.files;
    if (selected && selected.length > 0) setFile(selected[0]);
  };

  const handleSubmit = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      setLoading(true);
      const { data } = await axios.post('http://localhost:8000/api/customs_review', formData);
      setReviewResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" disableGutters>
      <Box
        sx={{
          minHeight: '100vh',
          bgcolor: 'grey.100',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2,
        }}
      >
        <Paper elevation={8} sx={{ width: '100%', p: 4, borderRadius: 2 }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <DescriptionIcon sx={{ fontSize: 48, color: 'primary.main' }} />
            <Typography variant="h5" sx={{ mt: 2, fontWeight: 700 }}>
              세관 서류 검토
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              OCR + LLM 기반 자동 검증
            </Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Button
              component="label"
              variant="contained"
              fullWidth
              startIcon={<UploadFileIcon />}
            >
              {file ? file.name : '서류 업로드'}
              <input
                type="file"
                accept="image/*,application/pdf"
                hidden
                onChange={handleFileChange}
              />
            </Button>
          </Box>

          <Button
            variant="contained"
            fullWidth
            onClick={handleSubmit}
            disabled={!file || loading}
            sx={{ height: 44 }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : '검토 시작'}
          </Button>

          {reviewResult && (
            <ReviewResultDisplay reviewResult={reviewResult} />
          )}
        </Paper>
      </Box>
    </Container>
  );
}
