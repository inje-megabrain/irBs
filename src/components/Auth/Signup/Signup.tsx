import React, { useState } from "react";
import styles from "./Signup.module.css";
import axios from "axios";
import { log } from "console";

const Signup: React.FC = () => {
  const [idx, setIdx] = useState("");
  const [birth, setBirth] = useState("");
  const [phone, setPhone] = useState("");
  const [certCode, setcertCode] = useState("");
  const [card, setCard] = useState("");
  const [check, setCheck] = useState("");
  const [card_type, setCard_type] = useState("");
  const [isFirstCheck, setIsFirstCheck] = useState(false);
  const [isPhone, setIsPhone] = useState(false);
  const [isPhoneCert, setIsPhoneCert] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timeoutReached, setTimeoutReached] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");

  const handlefirstcheck = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();

    if (loading) {
      alert("인증 중입니다. 잠시만 기다려 주세요.");
      return;
    }

    setLoading(true);

    if(idx == '')
    {
      alert("학번/사번을 입력해주세요");
      setLoading(false);
      return 0;
    }

    if(birth == '')
    {
      alert("생년월일을 입력해주세요");
      setLoading(false);
      return 0;
    }

    const timeoutId = setTimeout(() => {
      alert("응답이 평소와 같지 않네요. 잠시만 기다려 주세요.");
    }, 300);

    const loginData = new URLSearchParams();
    loginData.append("idx", idx);
    loginData.append("birth", birth);
    loginData.append("check", check);


    try {
      const response = await axios.post(
        "/passport/select_proc.php",
        loginData,
        {
          headers: {
            "Content-Type": `application/x-www-form-urlencoded`,
            Accept: "application/json",
            "Access-Control-Allow-Origin": `/passport/select_proc.php`,
            "Access-Control-Allow-Credentials": "true",
          },
        }
      );

      // 타임아웃이 발생했다면 응답을 받지 않으므로 경고 메시지에서 탈출
      clearTimeout(timeoutId); // 타이머 취소

      // 응답이 오면 정상 응답 처리
      if (response.status === 200) {
        console.log(response.data);
        setIsFirstCheck(true);
        alert(response.data.message); // 정상 또는 실패 응답 메시지
      }
    } catch (error) {
      clearTimeout(timeoutId); // 타이머 취소
      console.error("Network or server error:", error);
      alert("네트워크 오류가 발생했습니다. 다시 시도해주세요."); // 네트워크 오류 메시지
    } finally {
      // 로딩 상태 해제
      setLoading(false);
    }
  };

  const handlephone = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();


    if (!isFirstCheck) {
      alert("학번과 생년월일을 먼저 인증해주세요.");
      return;
    }

    if(idx == '')
    {
      alert("학번/사번을 입력해주세요");
      setLoading(false);
      return 0;
    }

    if(birth == '')
    {
      alert("생년월일을 입력해주세요");
      setLoading(false);
      return 0;
    }

    if(phone == "") {
      alert("휴대폰번호를 입력해주세요");
      setLoading(false);
      return 0;
    }

    if (phone.length !== 11) {
      alert("휴대폰번호는 11자리여야 합니다. 다시 입력해주세요.");
      return;
    }

    if (loading) {
      alert("인증번호 전송 중 입니다. 잠시만 기다려 주세요.");
      return;
    }

    setLoading(true);

    const timeoutId = setTimeout(() => {
      alert("응답이 평소와 같지 않네요. 잠시만 기다려 주세요.");
    }, 300);

    const loginData = new URLSearchParams();
    loginData.append("idx", idx);
    loginData.append("phone", phone);

    try {
      const response = await axios.post(
        "/passport/cert_insert_proc.php",
        loginData,
        {
          headers: {
            "Content-Type": `application/x-www-form-urlencoded`,
            Accept: "application/json",
            "Access-Control-Allow-Origin": `/passport/cert_insert_proc.php`,
            "Access-Control-Allow-Credentials": "true",
          },
        }
      );

      clearTimeout(timeoutId);

      if (response.status === 200) {
        console.log(response.data);
        if (response.data.status === "success") {
          alert("인증번호가 전송되었습니다.");
          setIsPhone(true);
        } else {
          clearTimeout(timeoutId);
          console.error("Signup failed:", response.status);
          alert("정보가 일치하지 않습니다. 다시 확인해주세요.");
        }
      }
    } catch (error) {
      console.error("Network or server error:", error);
      alert("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      // 로딩 상태 해제
      setLoading(false);
    }
  };

  const handlephonecert = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();

    if (!isFirstCheck && !isPhone) {
      alert("핸드폰번호를 먼저 인증해주세요.");
      return;
    }

    if(idx == '')
    {
      alert("학번/사번을 입력해주세요");
      setLoading(false);
      return 0;
    }

    if(birth == '')
    {
      alert("생년월일을 입력해주세요");
      setLoading(false);
      return 0;
    }

    if(phone == "") {
      alert("휴대폰번호를 입력해주세요");
      setLoading(false);
      return 0;
    }

    if(certCode == "")
    {
      alert("인증번호를 입력해주세요");
      setLoading(false);
      return 0;
    }

    if (certCode.length !== 6) {
      alert("인증번호는 6자리여야 합니다. 다시 입력해주세요.");
      return;
    }

    if (loading) {
      alert("인증번호 확인 중 입니다. 잠시만 기다려 주세요.");
      return;
    }

    setLoading(true);

    const timeoutId = setTimeout(() => {
      alert("응답이 평소와 같지 않네요. 잠시만 기다려 주세요.");
    }, 300);

    const loginData = new URLSearchParams();
    loginData.append("idx", idx);
    loginData.append("certCode", certCode);
    loginData.append("phone", phone);

    try {
      const response = await axios.post(
        "/passport/cert_check_proc.php",
        loginData,
        {
          headers: {
            "Content-Type": `application/x-www-form-urlencoded`,
            Accept: "application/json",
            "Access-Control-Allow-Origin": `/passport/cert_check_proc.php`,
            "Access-Control-Allow-Credentials": "true",
          },
        }
      );

      clearTimeout(timeoutId);

      if (response.status === 200) {
        console.log(response.data);
        if (response.data.status === "success") {
          alert("인증되었습니다.");
          setIsPhoneCert(true);
        } else {
          clearTimeout(timeoutId);
          console.error("Phone Cert failed:", response.status);
          alert("인증번호가 일치하지 않습니다. 다시 확인해주세요.");
        }
      }
    } catch (error) {
      console.error("Network or server error:", error);
      alert("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      // 로딩 상태 해제
      setLoading(false);
    }
  };

  const handleSignup = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();

    if (!isFirstCheck && !isPhone && !isPhoneCert) {
      alert("학번, 생년월일, 핸드폰번호 인증을 모두 완료해주세요.");
      return;
    }

    if(idx == '')
    {
      alert("학번/사번을 입력해주세요");
      setLoading(false);
      return 0;
    }

    if(birth == '')
    {
      alert("생년월일을 입력해주세요");
      setLoading(false);
      return 0;
    }

    if(phone == "") {
      alert("휴대폰번호를 입력해주세요");
      setLoading(false);
      return 0;
    }

    if(certCode == "")
    {
      alert("인증번호를 입력해주세요");
      setLoading(false);
      return 0;
    }

    if(card == "")
    {
      alert("카드번호를 입력해주세요");
      setLoading(false);
      return 0;
    }

    if (loading) {
      alert("요청을 처리 중 입니다. 잠시만 기다려 주세요.");
      return;
    }

    setLoading(true);

    const timeoutId = setTimeout(() => {
      alert("응답이 평소와 같지 않네요. 잠시만 기다려 주세요.");
    }, 300);

    const loginData = new URLSearchParams();
    loginData.append("phone", phone);
    loginData.append("idx", idx);
    loginData.append("birth", birth);
    loginData.append("card", card);
    loginData.append("check", check);
    loginData.append("card_type", card_type);

    try {
      const response = await axios.post(
        "/passport/insert_proc.php",
        loginData,
        {
          headers: {
            "Content-Type": `application/x-www-form-urlencoded`,
            Accept: "application/json",
            "Access-Control-Allow-Origin": `/passport/insert_proc.php`,
            "Access-Control-Allow-Credentials": "true",
          },
        }
      );

      clearTimeout(timeoutId);

      if (response.status === 200) {
        console.log(response.data);
        if (response.data.status === "success") {
          alert(response.data.message);
          window.location.href = "/Login";
        } else {
          clearTimeout(timeoutId);
          console.error("Signup failed:", response.status);
          alert(response.data.message);
        }
      }
    } catch (error) {
      clearTimeout(timeoutId);
      console.error("Network or server error:", error);
      alert("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      // 로딩 상태 해제
      setLoading(false);
    }
  };

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>회원가입</h1>
      <form>
        <div className={styles.inputGroup}>
          <label htmlFor="studentId" className={styles["visually-hidden"]}>
            학번/사번
          </label>
          <input
            type="id"
            id="studentId"
            onChange={(e) => setIdx(e.target.value)}
            value={idx}
            className={styles.formInput}
            placeholder="학번/사번"
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="birthdate" className={styles["visually-hidden"]}>
            생년월일
          </label>
          <input
            type="number"
            id="birthdate"
            onChange={(e) => setBirth(e.target.value)}
            value={birth}
            className={styles.formInput2}
            placeholder="생년월일(주민번호 앞자리)"
          />
          <button
            type="submit"
            className={styles.verifyButton}
            onClick={handlefirstcheck}
            disabled={loading}
          >
            인증
          </button>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="phone" className={styles["visually-hidden"]}>
            핸드폰번호
          </label>
          <input
            type="tel"
            id="phone"
            onChange={(e) => setPhone(e.target.value)}
            value={phone}
            className={styles.formInput_phonenum}
            placeholder="핸드폰번호"
          />
          <button
            type="submit"
            className={styles.verifyButton3}
            onClick={handlephone}
            disabled={loading}
          >
            인증
          </button>
        </div>

        <div className={styles.inputGroup}>
          <label
            htmlFor="verificationCode"
            className={styles["visually-hidden"]}
          >
            인증번호
          </label>
          <input
            type="number"
            id="verificationCode"
            onChange={(e) => setcertCode(e.target.value)}
            value={certCode}
            className={styles.formInput}
            placeholder="인증번호"
          />
          <button
            type="submit"
            className={styles.verifyButton2}
            onClick={handlephonecert}
            disabled={loading}
          >
            인증
          </button>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="cardNumber" className={styles["visually-hidden"]}>
            카드번호
          </label>
          <input
            type="number"
            id="cardNumber"
            value={card}
            onChange={(e) => setCard(e.target.value)}
            className={styles.cardInput}
            placeholder="카드번호를 입력하세요 이즐(구 케시비) 또는 신한카드 후불교통카드 16자리"
          />
        </div>

        <button
          type="submit"
          className={styles.submitButton}
          onClick={handleSignup}
          disabled={loading}
        >
          <span>회원가입 완료</span>
        </button>
      </form>

      <div className={styles.loginPrompt}>
        <span
          role="button"
          onClick={() => (window.location.href = "/Login")}
          tabIndex={0}
        >
          <p className={styles.loginText}>아이디가 있나요?</p>
        </span>
      </div>
    </main>
  );
};

export default Signup;
