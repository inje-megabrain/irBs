import React, { useEffect, useState } from "react";
import styles from "./LoginPage.module.css";
import axios from "axios";
import Cookies from "js-cookie";

const CookieAlert: React.FC = () => {
  const checkCookiePermission = () => {
    Cookies.set("test_cookie", "test", { secure: true, sameSite: "Lax" });
    const testCookie = Cookies.get("test_cookie");
    if (!testCookie && !localStorage.getItem("cookieAlertShown")) {
      alert(
        "쿠키 설정이 비활성화되어 있습니다. 웹사이트의 원활한 사용을 위해 브라우저에서 쿠키 설정을 활성화해주세요."
      );
      localStorage.setItem("cookieAlertShown", "true");
    } else {
      Cookies.remove("test_cookie");
    }
  };

  useEffect(() => {
    checkCookiePermission();
  }, []);

  return null;
};

const LoginPage: React.FC = () => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();

    if(userId == '')
    {
      alert("아이디를 입력해주세요.");
      return;
    }

    if(password == '')
    {
      alert("비밀번호를 입력해주세요.");
      return;
    }
    
    const loginData = new URLSearchParams();
    loginData.append("id", userId);
    loginData.append("password", password);
    loginData.append("s_cookie", "");

    try {
      const response = await axios.post("/login_proc.php", loginData, {
        headers: {
          "Content-Type": `application/x-www-form-urlencoded`,
          Accept: "application/json",
          "Access-Control-Allow-Origin": `/login_proc.php`,
          "Access-Control-Allow-Credentials": "true",
        },
      });
      if (response.status === 200) {
        console.log(response.data);
        if (response.data.status === "success") {
          alert(response.data.message);
          Cookies.set("id", userId, {
            secure: true,
            sameSite: "lax",
          });
          window.location.href = "/MainPage";
        } else {
          console.error("Login failed:", response.status);
          alert(response.data.message);
        }
      }
    } catch (error) {
      console.error("Network or server error:", error);
      alert("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <main className={styles.loginContainer}>
      <CookieAlert />
      <img
        src="img/icon/ui-logo.png"
        alt="인제대학교 로고"
        className={styles.logo}
      />

      <h1 className={styles.title}>
        인제대학교 <br /> 통합 버스 예약 시스템
      </h1>

      <form className={styles.loginForm}>
        <label htmlFor="userId" className={styles["visually-hidden"]}>
          아이디 (학번/사번)
        </label>
        <input
          type="id"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className={styles.inputField}
          placeholder="아이디 (학번/사번)"
        />

        <label htmlFor="password" className={styles["visually-hidden"]}>
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
            aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
            className={styles.iconButton}
          ></button>
        </div>

        <button className={styles.loginButton} onClick={handleLogin}>
          <span className={styles.loginButtonText}>로그인</span>
        </button>
      </form>

      <nav className={styles.helpLinks}>
        <span
          role="button"
          onClick={() => (window.location.href = "/passwordreset")}
          tabIndex={0}
        >
          비밀번호 찾기
        </span>
        <div className={styles.divider} aria-hidden="true" />
        <span
          role="button"
          onClick={() => (window.location.href = "/signup")}
          tabIndex={0}
        >
          회원가입
        </span>
      </nav>
    </main>
  );
};

export default LoginPage;
