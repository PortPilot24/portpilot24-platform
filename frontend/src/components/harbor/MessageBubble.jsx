import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Link
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Description as DocumentIcon,
  Link as LinkIcon,
  Gavel as LawIcon,
  PictureAsPdf as PdfIcon,
  Slideshow as PptIcon,
  InsertDriveFile as FileIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

const UserMessage = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'flex-start',
  gap: theme.spacing(1)
}));

const UserBubble = styled(Paper)(({ theme }) => ({
  backgroundColor: '#1976d2',
  color: 'white',
  padding: theme.spacing(1.5, 2),
  borderRadius: theme.spacing(2.5),
  borderBottomRightRadius: theme.spacing(0.5),
  maxWidth: '70%'
}));

const AssistantMessage = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: theme.spacing(1.5)
}));

const AssistantBubble = styled(Paper)(({ theme }) => ({
  backgroundColor: 'white',
  border: '1px solid #e8eaed',
  padding: theme.spacing(2),
  borderRadius: theme.spacing(2),
  borderTopLeftRadius: theme.spacing(0.5),
  maxWidth: '80%',
  flex: 1
}));

const SourceChip = styled(Chip)(({ theme }) => ({
  fontSize: '0.75rem',
  height: 28,
  backgroundColor: '#e3f2fd',
  color: '#1565c0',
  borderRadius: theme.spacing(1.5),
  '& .MuiChip-icon': {
    fontSize: 16
  }
}));

const SourceInfo = styled(Box)(({ theme }) => ({
  backgroundColor: '#f8f9fa',
  border: '1px solid #e9ecef',
  borderRadius: theme.spacing(1),
  padding: theme.spacing(1.5),
  marginTop: theme.spacing(1.5)
}));

const MessageBubble = ({ message }) => {
  const formatDate = (dateString) => {
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: ko
      });
    } catch (error) {
      return dateString;
    }
  };

  // 파일명에서 문서명 추출 및 포맷팅
  const formatDocumentName = (sourceFile) => {
    if (!sourceFile) return '알 수 없는 문서';
    
    // 파일 확장자 제거
    const nameWithoutExt = sourceFile.replace(/\.(pdf|pptx|docx|xlsx|hwp|txt)$/i, '');
    
    // 언더스코어를 공백으로 변경하고 읽기 좋게 포맷팅
    return nameWithoutExt.replace(/_/g, ' ');
  };

  // 파일 확장자에 따른 문서 유형 및 아이콘 결정
  const getDocumentTypeInfo = (sourceFile) => {
    if (!sourceFile) return { type: '문서', icon: FileIcon };
    
    const ext = sourceFile.split('.').pop()?.toLowerCase();
    
    switch (ext) {
      case 'pdf':
        return { type: 'PDF 문서', icon: PdfIcon };
      case 'pptx':
      case 'ppt':
        return { type: '프레젠테이션', icon: PptIcon };
      case 'docx':
      case 'doc':
        return { type: '워드 문서', icon: DocumentIcon };
      case 'hwp':
        return { type: '한글 문서', icon: DocumentIcon };
      default:
        return { type: '문서', icon: FileIcon };
    }
  };

  // 탐색된 문서 정보 추출 및 중복 제거
  const getExploredDocuments = () => {
    if (!message.toolCalls || message.toolCalls.length === 0) {
      return [];
    }

    // 중복 제거를 위한 Map 사용
    const documentsMap = new Map();
    
    message.toolCalls.forEach((toolCall, index) => {
      const sourceFile = toolCall.source_file;
      const documentName = formatDocumentName(sourceFile);
      const typeInfo = getDocumentTypeInfo(sourceFile);
      
      if (!documentsMap.has(sourceFile)) {
        documentsMap.set(sourceFile, {
          id: sourceFile,
          title: documentName,
          type: typeInfo.type,
          icon: typeInfo.icon,
          sourceFile: sourceFile,
          tool: toolCall.tool,
          occurrences: 1
        });
      } else {
        // 같은 문서가 여러 번 참조된 경우 카운트 증가
        documentsMap.get(sourceFile).occurrences += 1;
      }
    });

    return Array.from(documentsMap.values());
  };

  const exploredDocuments = getExploredDocuments();

  // 주요 출처 정보 (첫 번째 문서 기준)
  const primarySource = exploredDocuments.length > 0 ? exploredDocuments[0] : null;

  return (
    <Box>
      {/* 사용자 질문 */}
      <UserMessage>
        <UserBubble elevation={0}>
          <Typography variant="body1" sx={{ lineHeight: 1.5 }}>
            {message.query}
          </Typography>
        </UserBubble>
        <Avatar sx={{ 
          width: 32, 
          height: 32,
          backgroundColor: '#1976d2',
          fontSize: '0.9rem'
        }}>
          👤
        </Avatar>
      </UserMessage>

      {/* AI 응답 */}
      <AssistantMessage sx={{ mt: 2 }}>
        <Avatar sx={{ 
          width: 36, 
          height: 36,
          backgroundColor: '#f5f5f5',
          color: '#1976d2'
        }}>
          🛥️
        </Avatar>
        
        <Box sx={{ flex: 1 }}>
          <AssistantBubble elevation={0}>
            {/* 응답 헤더 */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#333' }}>
                Harbor AI Assistant
              </Typography>
              <Typography variant="caption" sx={{ color: '#999' }}>
                Specialized in maritime regulations
              </Typography>
            </Box>

            {/* 응답 내용 */}
            <Typography variant="body1" sx={{ 
              lineHeight: 1.6,
              color: '#333',
              whiteSpace: 'pre-wrap',
              mb: 2
            }}>
              {message.answer}
            </Typography>

            {/* 주요 출처 정보 */}
            {primarySource && (
              <SourceInfo>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <LawIcon sx={{ fontSize: 18, color: '#1976d2' }} />
                  <Typography variant="body2" sx={{ color: '#1976d2', fontWeight: 600 }}>
                    출처: {primarySource.title}
                  </Typography>
                  {primarySource.occurrences > 1 && (
                    <Chip 
                      label={`${primarySource.occurrences}회 참조`} 
                      size="small" 
                      sx={{ height: 20, fontSize: '0.7rem' }}
                    />
                  )}
                </Box>
              </SourceInfo>
            )}

            {/* 탐색된 문서 목록 */}
            {exploredDocuments.length > 0 && (
              <Accordion sx={{ 
                backgroundColor: 'transparent', 
                boxShadow: 'none',
                border: '1px solid #e9ecef',
                borderRadius: 1,
                mt: 2,
                '&:before': { display: 'none' }
              }}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{ 
                    minHeight: 48,
                    backgroundColor: '#f8f9fa',
                    borderRadius: '4px 4px 0 0',
                    '& .MuiAccordionSummary-content': { 
                      margin: '8px 0',
                      alignItems: 'center'
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <DocumentIcon sx={{ fontSize: 20, color: '#1976d2' }} />
                    <Typography variant="body2" sx={{ fontWeight: 500, color: '#333' }}>
                      참조된 문서 ({exploredDocuments.length}개)
                    </Typography>
                  </Box>
                </AccordionSummary>
                
                <AccordionDetails sx={{ pt: 2 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {exploredDocuments.map((doc) => {
                      const IconComponent = doc.icon;
                      return (
                        <Paper 
                          key={doc.id} 
                          sx={{ 
                            p: 2, 
                            backgroundColor: '#fdfdfd',
                            border: '1px solid #f0f0f0',
                            borderRadius: 1
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1 }}>
                            <Box sx={{ flex: 1 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                <IconComponent sx={{ fontSize: 18, color: '#1976d2' }} />
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#333' }}>
                                  {doc.title}
                                </Typography>
                              </Box>
                              <Typography variant="caption" sx={{ color: '#666', display: 'block' }}>
                                파일명: {doc.sourceFile}
                              </Typography>
                            </Box>
                            <SourceChip 
                              label={doc.type}
                              size="small"
                            />
                          </Box>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1.5 }}>
                            <Typography variant="caption" sx={{ color: '#666' }}>
                              검색 도구: {doc.tool}
                            </Typography>
                            
                            {doc.occurrences > 1 && (
                              <Typography variant="caption" sx={{ 
                                color: '#1976d2', 
                                fontWeight: 500,
                                backgroundColor: '#e3f2fd',
                                padding: '2px 8px',
                                borderRadius: '12px',
                                fontSize: '0.7rem'
                              }}>
                                {doc.occurrences}회 참조
                              </Typography>
                            )}
                          </Box>
                        </Paper>
                      );
                    })}
                  </Box>
                </AccordionDetails>
              </Accordion>
            )}
          </AssistantBubble>

          {/* 타임스탬프 */}
          <Typography variant="caption" sx={{ 
            color: '#999', 
            ml: 2, 
            mt: 0.5,
            display: 'block'
          }}>
            {formatDate(message.createdAt)}
          </Typography>
        </Box>
      </AssistantMessage>
    </Box>
  );
};

export default MessageBubble;
