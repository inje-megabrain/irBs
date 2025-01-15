import React from "react";
import styles from "./Onboarding2.module.css";

const OnboardingPage: React.FC = () => {
  const handleNext = () => {
    // Handle next button click
  };

  return (
    <main className={styles.onboardingWrapper}>
      <img
        loading="lazy"
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/5c5bac3f88aab697059b3aadf82d2b250f9a6772de9c41d201614c05d07bd294?placeholderIfAbsent=true"
        className={styles.heroImage}
        alt="Bus reservation system illustration"
      />
      <section className={styles.contentSection}>
        <h1 className={styles.title}>간단한 사이트 이용 방법: 예약</h1>
        <p className={styles.description}>
          서비스 개편을 통해 좌석 예약 페이지에 머물러
          <br />
          복수 예약이 가능하고, 빠른 예약을 통해
          <br />
          노선을 찾아 들어가지 않아도 됩니다.
        </p>
        <a href="/Onboarding3">
          <button
            className={styles.nextButton}
            onClick={handleNext}
            aria-label="다음 단계로 이동"
          >
            다음
          </button>
        </a>
      </section>
    </main>
  );
};

export default OnboardingPage;
