import styles from './UserProfile.module.css';
import React from "react";
import axios from "axios";
import Cookies from "js-cookie";

const UserDelection: React.FC = () => {
    const exitmember = async (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        event.preventDefault();

        const isConfirmed = window.confirm(
            `회원 탈퇴 전 확인사항을 확인하셨나요?`
        );

        // 사용자가 예약을 확인하지 않은 경우
        if (!isConfirmed) {
            alert("회원 탈퇴가 취소되었습니다.");
            return;
        }

        try {
            const response = await axios.post("/passport/member_exit_proc.php", {
                headers: {
                    "Content-Type": `application/x-www-form-urlencoded`,
                    Accept: "application/json",
                    "Access-Control-Allow-Origin": `/passport/member_exit_proc.php`,
                    "Access-Control-Allow-Credentials": "true",
                },
            });
            if (response.status === 200) {
                console.log(response.data);
                if (response.data.status === "success") {
                    alert(response.data.message);
                    window.location.href = "/Login";
                } else {
                    console.error("Exit failed:", response.status);
                    alert(response.data.message);
                }
            }
        } catch (error) {
            console.error("Network or server error:", error);
            alert("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
        }
    };

  return (
    <section className={styles.DelectionSection}>
      <header className={styles.DelectionHeader}>
        <button onClick={() => window.history.back()}>
          <img
            src="/img/icon/big-arrow-left.svg"
            alt="뒤로가기 아이콘"
            className={styles.headerIcon}
          />
        </button>
        <h1 className={styles.headerTitle}>회원탈퇴</h1>
      </header>
      <main className={styles.DelectionContent}>
        <article className={styles.contentSection}>
          <h3 className={styles.contentTitle}>회원 탈퇴 전 확인하세요</h3>
          <p className={styles.content}>
            회원탈퇴 시 정보는 영구히 삭제가 되며,<br />
            재가입이 불가합니다. 
          </p>
          <p className={styles.content}>
            이용불편은 게시판을 활용해 주세요.
          </p>
      </article>
      </main>
      <div className={styles.DelectionButtonWrapper}>
        <button type="button" className={styles.DelectionButton} onClick={exitmember}>탈퇴하기</button>
      </div>
    </section>
  );
};

export default UserDelection;
