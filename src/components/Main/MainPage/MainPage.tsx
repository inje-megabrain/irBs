import React, { useEffect, useState } from 'react';
import { RouteCard } from './RouteCard.tsx';
import styles from './MainPage.module.css';
import axios from 'axios';
import * as cheerio from 'cheerio';

async function fetchValueFromExternalSite(): Promise<string | null> {
  try {
    const response = await axios.get('/passport/list.php');
    const html = response.data;
    const $ = cheerio.load(html);
    const value = $('#p_name').attr('value');

    return value || null; // Ensure the return type is string or null
  } catch (error) {
    console.error('Error fetching value:', error);
    return null;
  }
}

const routeData = [
  { destination: '동래', time: '16:20', seats: '(44/33석)' },
  { destination: '울산', time: '18:10', seats: '(44/41석)' }
];

export const MainPage: React.FC = () => {
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const value = await fetchValueFromExternalSite();
      setUserName(value); // value is now guaranteed to be string or null
    };

    fetchData();
  }, []);

  return (
    <main className={styles.page}>
      <header className={styles.notificationBar}>
        <div className={styles.notificationContent}>
          <img 
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/3ef9aedfc9b62a5ef5418720705177a18d6ad3a44771951bd8bc03bb620b248e?placeholderIfAbsent=true" 
            alt="Warning icon" 
            className={styles.notificationIcon} 
          />
          <p className={styles.notificationText}>
            경고: 패널티 1회(2024.10.15 장유 08:20)
          </p>
        </div>
        <a href='/MyPage'>
          <img 
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/000f5f913f98483ee512f05f509b6c27a28917768973c443b3543c86a04612d4?placeholderIfAbsent=true" 
            alt="Settings" 
            className={styles.settingsIcon} 
          />
        </a>
      </header>

      <section className={styles.weatherCard}>
        <div className={styles.weatherInfo}>
          <p className={styles.weatherStatus}>
            금일 캠퍼스 날씨는 맑음입니다.
          </p>
          <h1 className={styles.greeting}>
            안녕하세요. {userName}님
          </h1>
        </div>
        <img 
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/e4e208546ef4b7480e5ab6a347461c87993eeabd950ffebecb7912371e49e91a?placeholderIfAbsent=true" 
          alt="Weather" 
          className={styles.weatherIcon} 
        />
      </section>

      <button className={styles.bookingButton}>
        <a href='./BusSchedule'>
        <span className={styles.bookingText}>예약하기</span>
        <img 
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/406181a727603b6744c65a734692215707f5036ec231fe2445b98845343e8c94?placeholderIfAbsent=true" 
          alt="예약하기 버튼" 
          className={styles.bookingIcon} 
        />
        </a>
      </button>

      <section className={styles.quickBooking}>
        <h2 className={styles.quickBookingTitle}>빠른 예약하기</h2>
        <div className={styles.quickBookingContent}>
          {routeData.map((route, index) => (
            <RouteCard
              key={index}
              destination={route.destination}
              time={route.time}
              seats={route.seats}
            />
          ))}
        </div>
      </section>

      <section className={styles.noticeSection}>
        <h2 className={styles.noticeTitle}>공지사항</h2>
        {/* ----------------------------------------------------------------- */}
        {/* 목차 */}
        <ul className={styles.noticeList}>
          <a className={styles.noUnderline} href="https://www.inje.ac.kr/kor/campus-life/welfare-0101.asp">
            <li>📅2024년도 2학기 통학버스 운행안내</li>
          </a>

          <a className={styles.noUnderline} href="https://www.inje.ac.kr/kor/campus-life/welfare-0102-1.asp">
            <li>🕒통학버스 운행 시간표</li>
          </a>

          <a className={styles.noUnderline} href="https://www.inje.ac.kr/kor/campus-life/welfare-0103.asp">  
            <li>📍통합버스 승차장소 안내</li>
          </a>

          <a className={styles.noUnderline} href="https://www.inje.ac.kr/kor/campus-life/welfare-0104.asp">  
            <li>🔔시간예약제 관련 안내</li>
          </a>

        </ul>
        {/* ----------------------------------------------------------------- */}
        
        <hr className={styles.noticeDivider} />
        <div className={styles.noticeFooter}>
          <span className={styles.noticeText}>전체공지 보기</span>
          <img 
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/39d3da592bbe83d18c101160fb790b68b8b3c44297531c445b233d2f5354dec7?placeholderIfAbsent=true" 
            alt="" 
            className={styles.noticeIcon} 
          />
        </div>
      </section>
      <a href='/FAQ'>
        <button className={styles.supportText}>
          문제가 있으신가요?
        </button>
      </a>

      <section className={styles.recentBooking}>
        <img 
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/fe829013-c35b-4444-ab77-aaf9850d8c8d?placeholderIfAbsent=true" 
          alt="" 
          className={styles.recentBookingIcon} 
        />
        <div className={styles.recentBookingContent}>
          <h2 className={styles.recentBookingTitle}>
            최근 예약 현황이 존재합니다
          </h2>
          <p className={styles.recentBookingDetails}>
            2024.01.01 07:50 인제대행
          </p>
        </div>
      </section>
    </main>
  );
};

export default MainPage;