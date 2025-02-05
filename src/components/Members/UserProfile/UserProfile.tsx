import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FormCard from './FormCard.tsx';
import * as cheerio from 'cheerio';
import styles from './UserProfile.module.css';
import IconButton from '@mui/material/IconButton';

const UserProfile: React.FC = () => {
  const [idx, setIdx] = useState<string>(''); // Ensure idx is always a string
  const [newpass, setnewpass] = useState('');
  const [pass, setpass] = useState('');
  const [phone, setphone] = useState(''); // phone 값을 관리하는 state 추가
  const [card, setcard] = useState('');
  const [phone2,setphone2] = useState<string>('');
  const [phone3,setphone3] = useState<string>('');
  const [userName, setUserName] = useState<string | null>(null);

  // Function to fetch user data from the server
  async function fetchUserData(): Promise<{
    idx: string | null;
    userName: string | null;
    phone: string | null; // phone 값을 포함
    phone2:string|null;
    phone3:string|null;
  }> {
    try {
      const response = await axios.get('/passport/list.php');
      const html = response.data;
      console.log(html)
      const $ = cheerio.load(html);

      // idx와 userName 추출
      const idx = $('#p_idx').attr('value') || null;
      const userName = $('#p_name').attr('value') || null;
      // phone1, phone2, phone3 추출 후 결합
      console.log('hasPhone2 value',$('#p_phone2').attr('value'))
      console.log('hasPhone2 value',$('#p_phone3').attr('value'))
      
      const phone2 = $('#p_phone2').attr('value') || null;
      const phone3 = $('#p_phone3').attr('value') || null;
      const phone = (phone2 || '') + (phone3 || '');

      console.log({phone2, phone3, phone });
      return { idx, userName, phone ,phone2,phone3};
    } catch (error) {
      console.error('Error fetching user data:', error);
      return { idx: null, userName: null, phone: null , phone2:null , phone3:null };
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const { idx, userName, phone,phone2,phone3 } = await fetchUserData();
      setIdx(idx || ''); // Ensure idx is set to a string, even if null is returned
      setUserName(userName || ''); // Set to empty string if null
      setphone(phone || ''); // phone 값을 state에 저장
      setphone2(phone2||'');
      setphone3(phone3||'');
    };

    fetchData();
  }, []);

  // 카드 번호 유효성 검사 함수
  const isCardValid = (card: string) => /^\d{16}$/.test(card);

  const cardInputs = {
    cardNumber: [
      {
        id: 'cardNumber',
        placeholder: '카드번호를 입력하세요.',
        type: 'text',
        value: card,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => setcard(e.target.value),
      },
    ],
  };

  const passwordInputs = {
    password: [
      {
        id: 'newPassword',
        placeholder: '변경하고 싶은 비밀번호를 입력하세요.',
        type: 'password',
        value: pass,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => setpass(e.target.value),
      },
      {
        id: 'confirmPassword',
        placeholder: '변경하고 싶은 비밀번호를 재입력하세요.',
        type: 'password',
        value: newpass,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => setnewpass(e.target.value),
      },
    ],
  };

  const handleCardNumberChange = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!card) 
    {
      alert('카드번호를 입력해주세요.');
      return;
    }
    
    if (!isCardValid(card)) {
      alert('카드 번호는 16자리 숫자여야 합니다.');
      return;
    }
    const resetData = new URLSearchParams();
    resetData.append('id',idx);
    resetData.append('card',card);
    resetData.append('phone','010'+phone); // phone 값을 추가
    resetData.append('card_type', 'd');
    

    console.log(resetData.toString());

    try {
      const response = await axios.post('/passport/update_proc.php', resetData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json',
        },
      });
      if (response.status === 200 && response.data.status === 'success') {
        alert('카드번호가 변경되었습니다.');
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('네트워크 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  const handlePasswordReset = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!newpass || !pass) {
      alert('변경할 비밀번호를 입력해주세요.');
      return;
    }

    if (newpass !== pass) {
      alert('비밀번호가 일치하지 않습니다. 다시 확인해 주세요.');
      return;
    }

    const resetData = new URLSearchParams();
    resetData.append('id', idx);
    resetData.append('pass', pass);

    try {
      const response = await axios.post('/passport/update_pass_proc.php', resetData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json',
        },
      });
      if (response.status === 200 && response.data.status === 'success') {
        alert('비밀번호가 변경되었습니다.');
        window.location.href = '/Login';
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('네트워크 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <main className={styles.profileContainer}>
      <header className={styles.headerSection}>
        <a href="/MyPage">
          <img
            src="/img/icon/big-arrow-left.svg"
            alt="Back"
            className={styles.backIcon}
          />
        </a>

        {/* <IconButton sx={{ textAlign: 'center' }}></IconButton> */}

        <a className={styles .myPageTitle}>내 정보 수정</a>
      </header>

      <FormCard
        title="카드번호 변경"
        inputs={cardInputs.cardNumber}
        buttonText="카드번호 변경"
        onSubmit={handleCardNumberChange}
      />

      <FormCard
        title="비밀번호 변경"
        inputs={passwordInputs.password}
        buttonText="비밀번호 변경"
        onSubmit={handlePasswordReset}
      />
      
      <a href="/UserDelection" className={styles.deactivateLink}>
        회원탈퇴를 찾으시나요?
      </a>
    </main>
  );
};

export default UserProfile;
