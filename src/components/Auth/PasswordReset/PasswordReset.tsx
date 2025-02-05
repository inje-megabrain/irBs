import React, { useState } from "react";
import axios from "axios";
import { Input } from "./Input.tsx";
import styles from "./PasswordReset.module.css";

const PasswordReset: React.FC = () => {
  const [idx, setIdx] = useState("");
  const [name, setName] = useState("");

  const handleReset = async (event: React.FormEvent) => {
    event.preventDefault();

    const ResetData = new URLSearchParams();
    ResetData.append("id", idx);
    ResetData.append("name", name);

    if(idx == '')
    {
      alert("아이디를 입력해주세요")
      return 0;
    }

    if(name == '')
    {
      alert("이름을 입력해주세요")
      return 0;
    }

    try {
      const response = await axios.post("/findPassProc.php", ResetData, {
        headers: {
          "Content-Type": `application/x-www-form-urlencoded`,
          Accept: "application/json",
          "Access-Control-Allow-Origin": `/findPassProc.php`,
          "Access-Control-Allow-Credentials": "true",
        },
      });
      if (response.status === 200) {
        console.log(response.data);
        if (response.data.status === "success") {
          alert(response.data.message);
          window.location.href = "/Login";
        } else {
          console.error("Reset failed:", response.status);
          alert(response.data.message);
        }
      }
    } catch (error) {
      console.error("Network or server error:", error);
      alert("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>비밀번호 찾기</h1>
      <form>
        <Input
          type="text"
          className={styles.inputField}
          value={idx}
          label="아이디 (학번/사번)"
          onChange={(e) => setIdx(e.target.value)}
          id="idx"
          spacing="large"
        />
        <br></br>
        <Input
          value={name}
          className={styles.inputField}
          onChange={(e) => setName(e.target.value)}
          id="name"
          type="text"
          label="이름"
        />
        <button
          type="submit"
          className={styles.submitButton}
          onClick={handleReset}
        >
          비밀번호 변경
        </button>
      </form>
      <span
        role="button"
        onClick={() => (window.location.href = "/Login")}
        tabIndex={0}
      >
        <footer className={styles.footer}>
          <p className={styles.footerText}>로그인 화면으로 돌아갈까요?</p>
        </footer>
      </span>
    </main>
  );
};

export default PasswordReset;
