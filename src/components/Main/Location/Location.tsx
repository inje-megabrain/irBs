import { FC, useEffect, useState } from "react";
import styles from "./Location.module.css"; // CSS 확인
import { Ticket } from "./Ticket.tsx";
import { useSwipeable } from "react-swipeable";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import * as cheerio from "cheerio";
import React from "react";
import { Map, MapMarker } from "react-kakao-maps-sdk";

// 예약 정보를 가져오는 함수
async function fetchReservation(): Promise<Array<{
  index: number;
  routeName: string;
  departureTime: string;
  seatNumber: string;
  departuredate: string;
  cancel_num: string;
  route_num: string;
}> | null> {
  try {
    const response = await axios.get("/index.php");
    const html = response.data;
    const $ = cheerio.load(html);

    const reservationElements = $('ul[data-role="listview"] li'); // 예약 항목 모두 선택
    const reservations: Array<{
      index: number;
      routeName: string;
      departureTime: string;
      seatNumber: string;
      departuredate: string;
      cancel_num: string;
      route_num: string;
    }> = [];

    reservationElements.each((index, element) => {
      const dateText = $(element).find("h2").text().trim();
      const routeNameText = $(element).find("p").first().text().trim();
      const seatInfo = $(element).find("p").eq(1).text().trim();

      const routeNameMatch = routeNameText.match(/노선\s*:\s*([가-힣]+)/);
      if (!routeNameMatch) return;
      const routeName = routeNameMatch[1];

      const seatNumberMatch = seatInfo.match(/(\d+)번/);
      if (!seatNumberMatch) return;
      const seatNumber = seatNumberMatch[1];

      const dateTextMatch = dateText.match(/(\d{1,2})-(\d{1,2})/);
      if (!dateTextMatch) return;
      const [_, month, day] = dateTextMatch;

      const now = new Date();
      let year = now.getFullYear();
      if (Number(month) < now.getMonth() + 1) year += 1;

      const departuredate = `${year}.${String(month).padStart(2, "0")}.${String(
        day
      ).padStart(2, "0")}`;

      const timeTextMatch = dateText.match(/(\d{2}:\d{2})/);
      if (!timeTextMatch) return;
      const departureTime = timeTextMatch[1];

      const fnCancelCall = $(element)
        .find('a[onclick*="fnCancel"]')
        .attr("onclick");
      const cancelNumMatch = fnCancelCall?.match(/fnCancel\((\d+),/);
      const cancel_num = cancelNumMatch ? cancelNumMatch[1] : null;

      const fnlocation = $(element)
        .find("a")
        .filter((_, el) => $(el).attr("onclick")?.includes("fnLocation")) // "fnLocation" 포함 필터링
        .attr("onclick");
      const locationMatch = fnlocation.match(/fnLocation\((\d+)\)/); // 정규식 적용
      const route_num = locationMatch ? locationMatch[1] : null;

      if (!cancel_num) return;

      reservations.push({
        index,
        routeName,
        departureTime,
        seatNumber,
        departuredate,
        cancel_num,
        route_num,
      });
    });

    return reservations.length ? reservations : null;
  } catch (error) {
    console.error("Error fetching reservation:", error);
    return null;
  }
}

export const ReservationStatus: FC = () => {
  const [reservations, setReservations] = useState<Array<{
    routeName: string;
    departureTime: string;
    seatNumber: string;
    departuredate: string;
  }> | null>(null);
  const navigate = useNavigate();
  const [isSwipedDown, setIsSwipedDown] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [locationData, setLocationData] = useState<{
    new_lat: string | null;
    new_lng: string | null;
    new_time: string | null;
  }>({
    new_lat: null,
    new_lng: null,
    new_time: null,
  });

  const handleTicketClick = (reservation: {
    route_num: string;
    departuredate?: string;
    departureTime?: string;
  }) => {
    // 예약 날짜와 시간 값이 없는 경우 처리
    if (!reservation.departuredate || !reservation.departureTime) {
      alert("예약 날짜 또는 시간이 없습니다.");
      return;
    }

    // 예약 날짜와 시간 형식 검증 (예: "2024-11-25"와 "18:10")
    const dateParts = reservation.departuredate.split(".");
    const timeParts = reservation.departureTime.split(":");

    if (
      dateParts.length !== 3 ||
      timeParts.length !== 2 ||
      dateParts.some((part) => isNaN(parseInt(part, 10))) ||
      timeParts.some((part) => isNaN(parseInt(part, 10)))
    ) {
      alert("날짜 또는 시간 형식이 잘못되었습니다.");
      return;
    }

    // 예약된 날짜와 시간 변환
    const [year, month, day] = dateParts.map((str) => parseInt(str, 10));
    const [hours, minutes] = timeParts.map((str) => parseInt(str, 10));

    const departuredate = new Date(year, month - 1, day); // 예약 날짜 (00:00 기준)
    const departureTime = new Date(year, month - 1, day, hours, minutes); // 예약 날짜 및 시간

    // 현시간 구하기 (한국시간)
    const now = new Date();
    const nowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // 현재 날짜 (00:00 기준)

    // 날짜 차이 계산
    const dateDifference =
      (departuredate.getTime() - nowDate.getTime()) / (1000 * 60 * 60 * 24); // 일 단위

    if (dateDifference !== 0) {
      // 날짜가 다를 경우
      alert(`예약 날짜까지 ${Math.abs(dateDifference)}일 남았습니다.`);
      return;
    }

    // 시간 차이 계산
    const timeDifference =
      (departureTime.getTime() - now.getTime()) / (1000 * 60); // 분 단위

    if (timeDifference <= 40) {
      // 40분 이내로 다가오면 클릭 가능
      fetchLocationData({
        route_num: reservation.route_num,
        departureTime: reservation.departureTime,
      });
      setShowImage((prev) => !prev); // 상태 반전 (이미지 보이기)
    } else {
      // 40분 이상 남았다면 알림
      alert("예약시간까지 40분 이상 남았습니다.");
    }
  };

  const fetchLocationData = async ({
    route_num,
    departureTime,
  }: {
    route_num: string;
    departureTime: string;
  }): Promise<void> => {
    try {
      const targetUrl = `/location/view.php?lineCode=${route_num}`;
      const response = await axios.get(targetUrl);
      const html = response.data;

      const $ = cheerio.load(html);

      const matchingLink = $(`a:contains("${departureTime}")`).attr("href");
      if (!matchingLink) {
        console.error(
          "No matching link found for the provided departure time."
        );
        return;
      }

      const detailUrl = `${matchingLink}`;
      const detailResponse = await axios.get(detailUrl);
      const detailHtml = detailResponse.data;

      const detail$ = cheerio.load(detailHtml);
      const scriptText = detail$(
        'script:contains("new daum.maps.LatLng")'
      ).html();
      if (!scriptText) {
        console.error(
          "Could not find script containing map data on detail page."
        );
        return;
      }

      const latLngMatch = scriptText.match(
        /new daum\.maps\.LatLng\(\s*([-+]?\d*\.\d+),\s*([-+]?\d*\.\d+)\s*\)/
      );
      const titleMatch = scriptText.match(/title\s*:\s*'[^']*([\d]{2}:\d{2})/);

      const new_lat = latLngMatch ? latLngMatch[1] : null;
      const new_lng = latLngMatch ? latLngMatch[2] : null;
      const new_time = titleMatch ? titleMatch[1] : null;

      setLocationData({ new_lat, new_lng, new_time });
    } catch (error) {
      console.error("Error fetching location data:", error);
      setLocationData({ new_lat: null, new_lng: null, new_time: null });
    }
  };

  const TheaterLocation = () => {
    const { new_lat, new_lng, new_time } = locationData;

    return (
      <div>
        <Map
          center={{
            lat: new_lat ? parseFloat(new_lat) : 35.248694,
            lng: new_lng ? parseFloat(new_lng) : 128.902572,
          }}
          style={{
            width: "350px",
            height: "400px",
            borderRadius: "20px",
          }}
        >
          <MapMarker
            position={{
              lat: new_lat ? parseFloat(new_lat) : 35.248694,
              lng: new_lng ? parseFloat(new_lng) : 128.902572,
            }}
          >
            <div
              style={{
                color: "#71b3ff",
                fontSize: "14px",
                fontWeight: "500",
                textAlign: "center",
              }}
            >
              {new_time
                ? new_time + "시 기준 위치"
                : "위치가 존재하지 않습니다"}
            </div>
          </MapMarker>
        </Map>
      </div>
    );
  };

  const handlers = useSwipeable({
    onSwipedDown: () => {
      setIsSwipedDown(true);
      setTimeout(() => {
        navigate("/MainPage");
      }, 300); // 애니메이션 지속 시간과 동일하게 설정
    },
    preventScrollOnSwipe: true,
    trackMouse: true,
    delta: 2,
  });

  useEffect(() => {
    fetchReservation().then((data) => {
      setReservations(data);
    });

    if (isSwipedDown) {
      window.scrollTo(0, 0); // 페이지 맨 위로 스크롤
    }
  }, [isSwipedDown]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (reservations && reservations.length > 0) {
        const { route_num, departureTime } = reservations[0]; // 첫 번째 예약 정보
        fetchLocationData({ route_num, departureTime });
      }
    }, 10000); // 10초마다 실행

    return () => clearInterval(intervalId); // 컴포넌트 언마운트 시 interval 해제
  }, [reservations]);

  return (
    <main className={styles.container}>
      <header className={styles.scheduleHeader}>
        <a href="/MainPage">
          <img
            src="\img\icon\arrow-left.png"
            alt="arrow-left"
            className={styles.headerIcon}
          />
        </a>
        <h1 className={styles.title}>현재 버스 위치</h1>
      </header>
      {showImage && <TheaterLocation />}

      {reservations && reservations.length > 0 ? (
        reservations.map((reservation, index) => (
          <Ticket
            key={index}
            routeName={reservation.routeName}
            departureTime={reservation.departureTime}
            busNumber={reservation.busNumber}
            onClick={() => handleTicketClick(reservation)} // Ticket 클릭 시 이미지 보이기
          />
        ))
      ) : (
        <p>조회가능한 버스가 없습니다.</p>
      )}
    </main>
  );
};

export default ReservationStatus;
