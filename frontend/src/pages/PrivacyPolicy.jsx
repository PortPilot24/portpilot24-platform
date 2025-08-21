import { Container, Typography, Box } from '@mui/material';

function PrivacyPolicy() {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        개인정보 처리방침
      </Typography>

      <Typography variant="body1" paragraph>
        PortPilot24(이하 “회사”)는 이용자의 개인정보를 소중히 여기며, 「개인정보 보호법」 등 관련 법령을 준수합니다.
        본 개인정보 처리방침은 회사가 어떤 정보를 수집하고, 어떻게 사용하며, 어떤 조치를 취하는지 설명합니다.
      </Typography>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          1. 수집하는 개인정보 항목
        </Typography>
        <Typography variant="body2" paragraph>
          회사는 회원가입, 서비스 이용, 고객상담 등을 위해 다음과 같은 개인정보를 수집할 수 있습니다.
        </Typography>
        <Typography variant="body2" component="ul" sx={{ pl: 3 }}>
          <li>필수항목: 이름, 이메일, 비밀번호, 로그인 ID</li>
          <li>선택항목: 전화번호, 주소, 프로필 정보</li>
          <li>자동 수집항목: IP 주소, 쿠키, 접속 로그, 기기 정보</li>
        </Typography>
      </Box>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          2. 개인정보의 수집 및 이용목적
        </Typography>
        <Typography variant="body2" component="ul" sx={{ pl: 3 }}>
          <li>회원 가입 및 관리</li>
          <li>서비스 제공 및 맞춤형 서비스 제공</li>
          <li>고객 상담 및 불만 처리</li>
          <li>서비스 개선 및 신규 서비스 개발</li>
          <li>법령 또는 이용약관 위반 행위 방지</li>
        </Typography>
      </Box>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          3. 개인정보의 보유 및 이용기간
        </Typography>
        <Typography variant="body2" paragraph>
          원칙적으로 개인정보는 수집·이용 목적이 달성되면 지체 없이 파기합니다.
          단, 관련 법령에 의해 일정 기간 보관해야 하는 경우는 예외로 합니다.
        </Typography>
        <Typography variant="body2" component="ul" sx={{ pl: 3 }}>
          <li>계약 또는 청약철회 기록: 5년</li>
          <li>대금결제 및 재화 공급 기록: 5년</li>
          <li>소비자 불만 및 분쟁처리 기록: 3년</li>
          <li>웹사이트 접속 기록: 3개월</li>
        </Typography>
      </Box>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          4. 개인정보 제3자 제공
        </Typography>
        <Typography variant="body2" paragraph>
          회사는 이용자의 동의 없이 개인정보를 외부에 제공하지 않습니다.
          다만 법령에 의해 요구되는 경우에는 예외로 합니다.
        </Typography>
      </Box>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          5. 개인정보 처리 위탁
        </Typography>
        <Typography variant="body2" paragraph>
          회사는 서비스 향상을 위해 외부 전문업체에 개인정보 처리를 위탁할 수 있으며, 위탁 시 관계 법령에 따라
          안전하게 관리됩니다.
        </Typography>
      </Box>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          6. 이용자의 권리와 행사 방법
        </Typography>
        <Typography variant="body2" paragraph>
          이용자는 언제든지 자신의 개인정보에 대해 열람, 정정, 삭제, 처리정지를 요청할 수 있습니다.
          관련 요청은 고객센터 또는 이메일을 통해 접수 가능합니다.
        </Typography>
      </Box>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          7. 개인정보 보호를 위한 기술적/관리적 대책
        </Typography>
        <Typography variant="body2" paragraph>
          회사는 개인정보가 분실, 도난, 유출, 위조, 변조, 훼손되지 않도록 다음과 같은 조치를 취하고 있습니다.
        </Typography>
        <Typography variant="body2" component="ul" sx={{ pl: 3 }}>
          <li>비밀번호 암호화 저장</li>
          <li>보안 프로그램 설치 및 주기적 점검</li>
          <li>개인정보 접근 권한 최소화</li>
        </Typography>
      </Box>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          8. 개인정보 보호책임자
        </Typography>
        <Typography variant="body2" paragraph>
          개인정보 보호 관련 문의사항은 아래 연락처로 문의하시기 바랍니다.
        </Typography>
        <Typography variant="body2">
          - 성명: 홍길동<br />
          - 직책: 개인정보 보호책임자<br />
          - 이메일: privacy@portpilot24.com<br />
          - 전화번호: 02-1234-5678
        </Typography>
      </Box>

      <Box sx={{ mt: 4 }}>
        <Typography variant="body2" color="text.secondary">
          본 개인정보 처리방침은 2025년 8월 21일부터 적용됩니다.
        </Typography>
      </Box>
    </Container>
  );
}

export default PrivacyPolicy;
