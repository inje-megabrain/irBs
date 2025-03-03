import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as cheerio from 'cheerio';
import styles from './NotificationList.module.css';

interface NotificationItem {
  id: number;
  title: string;
  description: string;
  onclick?: string;
  isExpanded: boolean;
}

const NotificationList = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      console.log("데이터 요청 시작...");
      const response = await axios.get("/notice/list.php");
      console.log("서버 응답 데이터:", response.data);

      const html = response.data;
      const $ = cheerio.load(html);
      const extractedNotifications: NotificationItem[] = [];

      $("div[data-role='collapsible']").each((index, element) => {
        const title = $(element).find("h3").text().trim();
        const description = $(element).find("p").text().trim();
        const onclick = $(element).find("h3").attr("onclick") || null;

        console.log(`추출된 데이터 (${index}):`, { title, description, onclick });

        extractedNotifications.push({
          id: index,
          title,
          description,
          onclick,
          isExpanded: false, // 초기 상태는 닫힌 상태로 설정
        });
        
      });

      console.log("최종 공지사항 데이터:", extractedNotifications);
      setNotifications(extractedNotifications);
    } catch (err) {
      console.error("데이터 크롤링 중 오류:", err);
      setError("공지사항 데이터를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleClick = (id: number) => {
    setNotifications(
      notifications.map(item =>
        item.id === id ? { ...item, isExpanded: !item.isExpanded } : item
      )
    );
  };

  // description 내 URL을 링크로 변환하는 함수
  /* const addDownloadLinkToDescription = (description: string) => {
    const downloadText = "첨부파일 다운로드";
    const regex = /첨부파일 다운로드/;

    if (regex.test(description)) {
      // description 내에 첨부파일 다운로드 텍스트가 있을 경우 링크 추가
      const fileLink = "/path/to/file.pdf"; // 실제 파일 링크
      return description.replace(regex, `<a href="${fileLink}" target="_blank" rel="noopener noreferrer" class="${styles.downloadButton}">${downloadText}</a>`);
    }
    
    return description;
  }; */
  

  /* useEffect(() => {
    window.fnCheckCnt = (id) => {
      console.log(`fnCheckCnt(${id}) 실행됨!`);
      const addDownloadLink = (onclick: string | null) => {
        if (onclick) {
          return `<a href="#" onclick="fnCheckCnt(353)" class="${styles.downloadButton}"></a>`;
        }
        return "";
      };
    };
  }, []); */

  const extractFileId = (onclick: string | null) => {
    if (!onclick) return null;
    const match = onclick.match(/\d+/); // 숫자만 추출
    return match ? match[0] : null;
  };

  const handleDownload = (fileId: string) => {
    const fileUrl = `https://bus.inje.ac.kr/inc/download.php?fileName=${fileId}`;
    console.log(fileId);
    window.open(fileUrl, "_blank");
  };
  

  return (
    <div className={styles.container}>
      {/* 헤더 */}
      <div className={styles.header}>
        <a href="/MainPage" className={styles.icon}>
          <img loading="lazy" src="img/icon/arrow-left.png" alt="뒤로가기" />
        </a>
        <div className={styles.title}>전체 공지사항</div>
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className={styles.error}>
          {error}
          <button onClick={fetchNotifications}>다시 시도</button>
        </div>
      )}

      {/* 공지사항 목록 */}
      <div className={styles.list}>
        {isLoading ? (
          <div className={styles.loading}>데이터를 불러오는 중입니다...</div>
        ) : notifications.length > 0 ? (
          notifications.map((notification) => (
            <div key={notification.id} className={styles.notificationBox}>
              <button
                className={styles.dropdownButton}
                onClick={() => handleClick(notification.id)}
              >
                {notification.title}
              </button>
              <div
                className={styles.description}
                style={{ display: notification.isExpanded ? 'block' : 'none' }}
                >
                  <div>
                  {notification.description}
                  </div>
                  <div
                    className={styles.downloadButton}
                    onClick={() => {
                      const fileId = extractFileId(notification.onclick);
                      if (fileId) {
                        handleDownload(fileId);
                      } else {
                        console.error("파일 ID를 찾을 수 없습니다.");
                      }
                    }}
                  >
                    첨부파일 다운로드
                  </div>

              </div>
            </div>
          ))
        ) : (
          <div className={styles.empty}>공지사항이 없습니다.</div>
        )}
      </div>
    </div>
  );
};

export default NotificationList;