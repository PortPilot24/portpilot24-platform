// src/components/PrivacyPolicy.jsx
import React, { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Checkbox,
  FormControlLabel,
  Button,
  Divider,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const PrivacyPolicy = ({ onAgree }) => {
  const [agreeAll, setAgreeAll] = useState(false);
  const [agrees, setAgrees] = useState({
    clause1: false,
    clause2: false,
    clause3: false,
    clause4: false,
  });

  const handleAllChange = () => {
    const next = !agreeAll;
    setAgreeAll(next);
    setAgrees({
      clause1: next,
      clause2: next,
      clause3: next,
      clause4: next,
    });
  };

  const handleClauseChange = (key) => {
    setAgrees(prev => {
      const next = { ...prev, [key]: !prev[key] };
      setAgreeAll(Object.values(next).every(v => v));
      return next;
    });
  };

  const handleSubmit = () => {
    if (Object.values(agrees).every(v => v)) {
      onAgree();
    } else {
      alert('모든 항목에 동의하셔야 회원가입을 진행할 수 있습니다.');
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 6, mb: 6 }}>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom>
          개인정보처리방침
        </Typography>

        <Box mb={2}>
          <FormControlLabel
            control={<Checkbox checked={agreeAll} onChange={handleAllChange} />}
            label="전체 동의합니다"
          />
        </Box>
        <Divider sx={{ mb: 2 }} />

        {/* 제1조 (목적) */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>제1조 (목적)</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Paper
              variant="outlined"
              sx={{
                maxHeight: 150,
                overflow: 'auto',
                p: 2,
                backgroundColor: '#fafafa',
              }}
            >
              <Typography variant="body2" paragraph>
                개인정보보호법에 따라 이용자의 개인정보를 보호하고 이와 관련한 고충을
                신속하고 원활하게 처리할 수 있도록 하기 위하여 개인정보 처리방침을
                다음과 같이 수립·공개합니다.
              </Typography>
            </Paper>
            <FormControlLabel
              control={
                <Checkbox
                  checked={agrees.clause1}
                  onChange={() => handleClauseChange('clause1')}
                />
              }
              label="동의합니다"
              sx={{ mt: 1 }}
            />
          </AccordionDetails>
        </Accordion>

        {/* 제2조 (개인정보의 처리 및 보유 기간) */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>제2조 (개인정보의 처리 및 보유 기간)</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Paper
              variant="outlined"
              sx={{
                maxHeight: 150,
                overflow: 'auto',
                p: 2,
                backgroundColor: '#fafafa',
              }}
            >
              <Typography variant="body2">
                여수광양항만공사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터
                개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를
                처리·보유합니다.
              </Typography>
            </Paper>
            <FormControlLabel
              control={
                <Checkbox
                  checked={agrees.clause2}
                  onChange={() => handleClauseChange('clause2')}
                />
              }
              label="동의합니다"
              sx={{ mt: 1 }}
            />
          </AccordionDetails>
        </Accordion>

        {/* 제3조 (보유 및 이용 기간) */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>제3조 (보유 및 이용 기간)</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box
              sx={{
                maxHeight: 150,
                overflow: 'auto',
                p: 2,
                backgroundColor: '#fafafa',
              }}
            >
              <Typography variant="body2">
                ① 개인정보는 동의일로부터 서비스 제공 목적 달성 시까지 보유합니다.
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                ② 법령에 특별한 규정이 있을 경우 해당 기간 동안 보관합니다.
              </Typography>
            </Box>
            <FormControlLabel
              control={
                <Checkbox
                  checked={agrees.clause3}
                  onChange={() => handleClauseChange('clause3')}
                />
              }
              label="동의합니다"
              sx={{ mt: 1 }}
            />
          </AccordionDetails>
        </Accordion>

        {/* 제4조 (정보주체의 권리·의무 및 행사방법) */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>제4조 (정보주체의 권리·의무 및 행사방법)</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box
              sx={{
                maxHeight: 150,
                overflow: 'auto',
                p: 2,
                backgroundColor: '#fafafa',
              }}
            >
              <Typography variant="body2">
                ① 이용자는 언제든지 개인정보 열람·정정·삭제·처리정지 등을 요구할 수 있습니다.
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                ② 요구 시 지체 없이 조치하며, 처리 결과를 통지합니다.
              </Typography>
            </Box>
            <FormControlLabel
              control={
                <Checkbox
                  checked={agrees.clause4}
                  onChange={() => handleClauseChange('clause4')}
                />
              }
              label="동의합니다"
              sx={{ mt: 1 }}
            />
          </AccordionDetails>
        </Accordion>

        <Box textAlign="center" mt={4}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            sx={{ px: 5, py: 1.5 }}
          >
            동의하고 회원가입 진행
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default PrivacyPolicy;
