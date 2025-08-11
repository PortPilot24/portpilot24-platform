import React, { useEffect, useState } from 'react';
import { Container, Grid, Paper, Typography, Box, CircularProgress } from '@mui/material';
import axios from 'axios';

function PredictainerPage() {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('predictainer/predict')
      .then((res) => {
        setPredictions(res.data.predictions);
        setLoading(false);
      })
      .catch((err) => {
        console.error('데이터 요청 실패:', err);
        setLoading(false);
      });
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        일별 컨테이너 반입 예측
      </Typography>

      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="subtitle1">
          <strong>모델 성능</strong> | MSE: 144105.20 | MAE: 292.85 | MAPE: 24.56% | R²: 0.3913 |
        </Typography>

        <Typography variant="body2" color="text.secondary">
          예측 데이터는 10분마다 실시간으로 업데이트됩니다.
        </Typography>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid
          container
          spacing={4}
          justifyContent="center" // ✅ 추가: 수평 가운데 정렬
          alignItems="stretch"     // ✅ (선택) 높이 맞춤
        >
          {predictions.map((item, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  // height: 320, // 🎯 고정 높이 지정
                }}
              >
                <Typography variant="h6" color="primary" gutterBottom>
                  📅 {item.date}
                </Typography>

                <Box sx={{ mb: 1 }}>
                  <Typography variant="subtitle1">🌤 날씨 정보</Typography>
                  <Typography>평균 온도: {Number(item.weather.avg_temp).toFixed(1)}°C</Typography>
                  <Typography>
                    최저 / 최고: {Number(item.weather.min_temp).toFixed(1)}°C / {Number(item.weather.max_temp).toFixed(1)}°C
                  </Typography>
                  <Typography>강수량: {Number(item.weather.precipitation).toFixed(1)}mm</Typography>
                  <Typography>풍속: {Number(item.weather.wind_speed).toFixed(1)} m/s</Typography>
                  <Typography>습도: {Number(item.weather.humidity).toFixed(1)}%</Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle1">📦 예측 결과</Typography>
                  <Typography>
                    <strong>{item.prediction.Ensemble - 293} ~ {item.prediction.Ensemble + 293}건</strong>
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}

export default PredictainerPage;