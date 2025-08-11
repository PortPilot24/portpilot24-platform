// src/pages/AffiliationContainerPage.jsx
import { useState, useEffect } from 'react';
import apiClient from '../api/axios';
import {
  Container,
  Typography,
  CircularProgress,
  TextField,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack,
} from '@mui/material';

function AffiliationContainerPage() {
  const [containers, setContainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [affiliation, setAffiliation] = useState(null);
  //const { showNotification } = useNotificationStore();

  useEffect(() => {
    const fetchUserAndContainers = async () => {
      try {
        const userResponse = await apiClient.get('/users/me');
        const userAffiliation = userResponse.data.affiliation;
        setAffiliation(userAffiliation);

        const containerRes = await apiClient.fetch(
          `/containers-by-affiliation?affiliation=${encodeURIComponent(userAffiliation)}`
        );
        const containerData = await containerRes.json();
        if (containerRes.ok) {
          setContainers(containerData.containers || []);
        } else {
          showNotification(containerData.message || "데이터 조회 실패", "error");
        }
      } catch (error) {
        console.error(error);
        showNotification("컨테이너 정보를 불러오는 데 실패했습니다.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndContainers();
  }, []);

  if (loading) return <p>🔄 데이터를 불러오는 중입니다...</p>;

  return (
    <div className="container">
      <h2>🛳 {affiliation} 소속 컨테이너 목록</h2>
      {containers.length === 0 ? (
        <p>표시할 컨테이너가 없습니다.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>선사</th>
              <th>컨테이너번호</th>
              <th>터미널 반입일시</th>
              <th>터미널 반출일시</th>
              <th>상태</th>
              <th>장치장 위치</th>
            </tr>
          </thead>
          <tbody>
            {containers.map((item, idx) => (
              <tr key={idx}>
                <td>{item["선사"]}</td>
                <td>{item["컨테이너번호"]}</td>
                <td>{item["터미널 반입일시"]}</td>
                <td>{item["터미널 반출일시"]}</td>
                <td>{item["상태"]}</td>
                <td>{item["장치장위치"]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AffiliationContainerPage;
