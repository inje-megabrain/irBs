import React, { useState, useEffect } from 'react';
import styles from './MyPage.module.css';
import { UserStats } from './UserStats.tsx';
import { SectionHeader } from './SectionHeader.tsx';
import { RecentItem } from './RecentItem.tsx';
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

const MyPage: React.FC = () => {
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const value = await fetchValueFromExternalSite();
      setUserName(value); // value is now guaranteed to be string or null
    };

    fetchData();
  }, []);


  const recentItems = [
    { title: '최근 예약 내역', icon:  '/light-left-arrow.svg'},
    { title: '최근 패널티 내역', icon: '/light-left-arrow.svg' },
    { title: '최근 비매너 내역', icon: '/light-left-arrow.svg' }
  ];

  const inquiryItems = [
    { title: '문의하기', icon: '/light-left-arrow.svg' },
    { title: '최근 문의 내역', icon: '/light-left-arrow.svg' }
  ];

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <a href='/MainPage'>
            <img id="icon" src="https://cdn.builder.io/api/v1/image/assets/TEMP/c6f39fd7de10126956016a660e84671a37b66231dcc86d58ff090a6a35e1599c?placeholderIfAbsent=true" alt="뒤로가기 아이콘" />
          </a>
          <div className={styles.myHeader}>
            <h1>마이페이지</h1>
          </div>
        </div>
        <div className={styles.userProfile}>
          <div>
            <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/6596c95482616e0247ca02575e9d69257aa06be47f4bdd62637ebf1c9344ba88?placeholderIfAbsent=true" alt="프로필 이미지" className={styles.profileImage} />
            <span className={styles.userName}>{userName}님</span>
          </div>
        </div>
      </header>

      <section className={styles.mainContent}>
        <UserStats penaltyCount={1} mannerScore="측정불가" />
        
        <SectionHeader title="예약" icon="https://cdn.builder.io/api/v1/image/assets/TEMP/e93cc959cb72382063af44ef50d63c214975ce83016a1d9db492a7ef89ca62c8?placeholderIfAbsent=true" />
        <div className={styles.contentCard}>
          <div className={styles.recentList}>
            {recentItems.map((item, index) => (
              <RecentItem key={index} {...item} />
            ))}
          </div>
        </div>

        <SectionHeader title="문의" icon="https://cdn.builder.io/api/v1/image/assets/TEMP/e93cc959cb72382063af44ef50d63c214975ce83016a1d9db492a7ef89ca62c8?placeholderIfAbsent=true" />
        <div className={styles.contentCard}>
          <div className={styles.recentList}>
            {inquiryItems.map((item, index) => (
              <RecentItem key={index} {...item} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default MyPage;