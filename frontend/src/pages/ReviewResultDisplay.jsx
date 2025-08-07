import React from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function ReviewResultDisplay({ reviewResult }) {
  if (!reviewResult) return null;

  const {
    file_name,
    parsed_data: { 서류종류, 필드 },
    validation_result: { error_count, errors, reports },
  } = reviewResult;

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      {/* 1. 파일 이름 */}
      <Typography variant="subtitle1" sx={{ mb: 2 }}>
        📄 파일명: <strong>{file_name}</strong>
      </Typography>

      {/* 2. 파싱된 데이터 */}
      <Paper sx={{ p: 2, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          파싱된 데이터
        </Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>
          • 서류 종류: <strong>{서류종류}</strong>
        </Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>필드명</TableCell>
              <TableCell>값</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(필드).map(([key, value]) => (
              <TableRow key={key}>
                <TableCell>{key}</TableCell>
                <TableCell>
                  {typeof value === 'object'
                    ? Object.entries(value).map(([k, v]) => (
                        <div key={k}>
                          {k}: {v}
                        </div>
                      ))
                    : value}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* 3. 검증 결과 */}
      <Paper sx={{ p: 2, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          검증 결과 (총 오류: {error_count})
        </Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>항목</TableCell>
              <TableCell>입력값</TableCell>
              <TableCell>오류 메시지</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {errors.map((err, idx) => (
              <TableRow key={idx}>
                <TableCell>{err.field_name}</TableCell>
                <TableCell>{err.user_value}</TableCell>
                <TableCell>{err.error_message}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* 4. 스마트 리포트 (Accordion) */}
      <Box>
        <Typography variant="h6" sx={{ mb: 2 }}>
          상세 오류 리포트
        </Typography>
        {reports.map((report, idx) => (
          <Accordion key={idx} sx={{ mb: 1 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>오류 리포트 #{idx + 1}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography
                component="pre"
                sx={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}
              >
                {report}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Container>
  );
}
