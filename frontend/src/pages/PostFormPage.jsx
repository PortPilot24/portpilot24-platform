import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../api/axios';
import useNotificationStore from '../store/notificationStore';
import { Container, Typography, Box, TextField, Button, Stack, CircularProgress } from '@mui/material';

function PostFormPage() {
  const { id } = useParams(); // 수정일 경우 URL에 id가 있음
  const isEditMode = Boolean(id); // id 유무로 작성/수정 모드 구분
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const { showNotification } = useNotificationStore();

  const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'pdf', 'docx'];
  const MAX_FILE_SIZE_MB = 20; // 최대 20MB

  useEffect(() => {
    if (isEditMode) {
      const fetchPostData = async () => {
        try {
          const response = await apiClient.get(`/posts/${id}`);
          setTitle(response.data.title);
          setContent(response.data.content);
        } catch (error) {
          showNotification('게시글 정보를 불러오는 데 실패했습니다.', 'error');
        }
      };
      fetchPostData();
    }
  }, [id, isEditMode, showNotification]);

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    const validFiles = [];

    for (let file of selectedFiles) {
      const extension = file.name.split('.').pop().toLowerCase();
      const sizeMB = file.size / (1024 * 1024);

      if (!ALLOWED_EXTENSIONS.includes(extension)) {
        showNotification(`허용되지 않는 파일 형식입니다: ${file.name}`, 'error');
        continue;
      }

      if (sizeMB > MAX_FILE_SIZE_MB) {
        showNotification(`파일이 너무 큽니다 (최대 ${MAX_FILE_SIZE_MB}MB): ${file.name}`, 'error');
        continue;
      }

      validFiles.push(file);
    }

    setFiles(validFiles);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    if (files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
      }
    }

    try {
      if (isEditMode) {
        await apiClient.patch(`/posts/${id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        showNotification('게시글이 성공적으로 수정되었습니다.', 'success');
        navigate(`/posts/${id}`);
      } else {
        const response = await apiClient.post('/posts', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        showNotification('게시글이 성공적으로 작성되었습니다.', 'success');
        navigate(`/posts/${response.data.id}`);
      }
    } catch (error) {
      showNotification('작업 중 오류가 발생했습니다.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {isEditMode ? '게시글 수정' : '새 글 작성'}
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            label="제목"
            fullWidth
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            label="내용"
            fullWidth
            required
            multiline
            rows={10}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <Button variant="outlined" component="label">
            파일 첨부
            <input type="file" multiple hidden onChange={handleFileChange} />
          </Button>
          <Typography variant="body2" color="textSecondary">
            * 최대 20MB, 확장자: jpg, jpeg, png, pdf, docx 파일만 업로드 가능합니다.
          </Typography>
          {/* 선택된 파일 이름 표시 */}
          {Array.from(files).map(file => <Typography key={file.name}>{file.name}</Typography>)}
        </Stack>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 1 }}>
          <Button variant="outlined" onClick={() => navigate('/posts')}>
            취소
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : (isEditMode ? '수정하기' : '작성하기')}
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default PostFormPage;