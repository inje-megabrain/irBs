import React, { useEffect, useState } from 'react';
import styles from './LoginPage.module.css';
import axios from 'axios';
import Cookies from 'js-cookie';

const CookieAlert: React.FC = () => {
  const checkCookiePermission = () => {
      Cookies.set('test_cookie', 'test', { secure: true, sameSite: 'Lax' });
      const testCookie = Cookies.get('test_cookie');
      if (!testCookie && !localStorage.getItem('cookieAlertShown')) {
          alert('쿠키 설정이 비활성화되어 있습니다. 웹사이트의 원활한 사용을 위해 브라우저에서 쿠키 설정을 활성화해주세요.');
          localStorage.setItem('cookieAlertShown', 'true');
      } else {
          Cookies.remove('test_cookie');
      }
  };

  useEffect(() => {
      checkCookiePermission();
  }, []);

  return null;
};

const LoginPage: React.FC = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    
    const loginData = new URLSearchParams();
    loginData.append('id', userId);
    loginData.append('password', password);
    loginData.append('s_cookie', '');

    try {
      const response = await axios.post('https://bus.inje.ac.kr/login_proc.php', loginData, {
        headers: {
          "Content-Type": `application/x-www-form-urlencoded`,
          "Accept": "application/json",
          "Access-Control-Allow-Origin": `/login_proc.php`,
          'Access-Control-Allow-Credentials':"true",
      }, 
      });
      if (response.status === 200) {
        console.log(response.data);
        if (response.data.status === 'success') {
          alert(response.data.message);
          Cookies.set("id", userId, {secure: true, sameSite: 'Lax' });
          window.location.href = '/MainPage';
        } else {
          console.error("Login failed:", response.status);
          alert(response.data.message);
        }
      }
    } catch (error) {
      console.error("Network or server error:", error);
      alert('네트워크 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <main className={styles.loginContainer}>
      <CookieAlert />
      <img 
        src="https://www.inje.ac.kr/kor/assets/images/sub/ui-logo.png" 
        alt="인제대학교 로고" 
        className={styles.logo}
      />
      
      <h1 className={styles.title}>
        인제대학교 <br/> 통합 버스 예약 시스템
      </h1>

      <form className={styles.loginForm}>
        <label htmlFor="userId" className={styles['visually-hidden']}>
          아이디 (학번/사번)
        </label>
        <input
          type="number"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className={styles.inputField}
          placeholder="아이디 (학번/사번)"
        />

      
          <label htmlFor="password" className={styles['visually-hidden']}>
            비밀번호
          </label>
          <div className={styles.inputWrapper}>
            <input
              type="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호"
              className={styles.inputField}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
              className={styles.iconButton}
            >
            </button>
          </div>


        <button className={styles.loginButton} onClick={handleLogin}>
          
          <img 
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/27ab334dd17dc9de946c30c832cb0a06db7c8dbea05cb2dacbcfc926384075b5?placeholderIfAbsent=true" 
            alt="" 
            className={styles.loginButtonBg} 
          />
          <span className={styles.loginButtonText}>로그인</span>
        </button>
      </form>

      <nav className={styles.helpLinks}>
        <a href="/passwordreset">비밀번호 찾기</a>
        <div className={styles.divider} aria-hidden="true" />
        <a href="/signup">회원가입</a>
      </nav>
      
      <p className={styles.newUserText}><a href='/Onboarding'>처음이신가요?</a></p>
    </main>
  );
};

export default LoginPage;