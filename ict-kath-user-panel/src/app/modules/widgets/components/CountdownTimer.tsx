import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../../../config";
import { useAuth } from "../../auth/core/Auth";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const CountdownTimer: React.FC = () => {
  const { auth, currentUser } = useAuth();
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [targetDate, setTargetDate] = useState<number | null>(null);
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [subject, setSubject] = useState("");

  // Check if countdown has already expired
  const isCountdownExpired = () => {
    const expiredKey = `countdown_expired_${targetDate}`;
    return localStorage.getItem(expiredKey) === 'true';
  };

  // ✅ Fetch target date
  useEffect(() => {
  const fetchSettings = async () => {
    try {
      const usersThisYearList = await axios.get(`${API_BASE_URL}api/enrollment/year/all`);
      const finalUsers = usersThisYearList.data.data;

      const findAvailableUser = await finalUsers.find((user:any) => user.id === auth.id);
      // If the logged-in user is NOT in the 2025 users list, do not show the countdown
      if (!findAvailableUser) {
        setVisible(false);
        return;
      }
      const response = await axios.get(`${API_BASE_URL}api/content/52`);
      const classString = response.data.data.text_en;
      const dateString = response.data.data.text_sn;
      const dateValue = new Date(dateString).getTime();

      setTargetDate(dateValue);
      setSubject(classString);

      // Unique key for this countdown date
      const expiredKey = `countdown_expired_${dateValue}`;

      // ✅ Check if this date is *different* from previous one
      const storedDate = localStorage.getItem("last_countdown_date");
      if (storedDate !== String(dateValue)) {
        // New countdown date found → reset visibility
        localStorage.removeItem(`countdown_expired_${storedDate}`);
        localStorage.setItem("last_countdown_date", String(dateValue));
        localStorage.removeItem(expiredKey);
        setVisible(true);
        setFadeOut(false);
      } else {
        // Same countdown → check if expired
        if (localStorage.getItem(expiredKey) === "true") {
          setVisible(false);
        }
      }
    } catch (error) {
      console.error("Error fetching exam date:", error);
    }
  };

  fetchSettings();
}, []);


  // ✅ Countdown logic
  useEffect(() => {
    if (!targetDate) return;

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance <= 0) {
        clearInterval(timer);
        // Mark countdown as expired in localStorage
        const expiredKey = `countdown_expired_${targetDate}`;
        localStorage.setItem(expiredKey, 'true');
        setFadeOut(true); // 👈 trigger fade-out animation
        setTimeout(() => setVisible(false), 800); // hide after animation
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  // Don't show countdown if user is not authenticated
  if (!auth || !currentUser || !visible || !targetDate) return null;

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString([], {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // 🎯 Circle progress for countdown values
  const getCircleProps = (value: number, max: number) => {
    const radius = 26;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (value / max) * circumference;
    return { radius, circumference, offset };
  };

  const circles = [
    { label: "Days", value: timeLeft.days, max: 365 },
    { label: "Hours", value: timeLeft.hours, max: 24 },
    { label: "Minutes", value: timeLeft.minutes, max: 60 },
    { label: "Seconds", value: timeLeft.seconds, max: 60 },
  ];

  return (
    <div
      style={{
        ...styles.wrapper,
        opacity: fadeOut ? 0 : 1,
        transition: "opacity 0.8s ease",
      }}
    >
      <div style={styles.container}>
        <button style={styles.closeButton} onClick={() => {
          // if (targetDate) {
          //   const expiredKey = `countdown_expired_${targetDate}`;
          //   localStorage.setItem(expiredKey, 'true');
          // }
          setVisible(false);
        }}>
          ×
        </button>

        <div style={styles.contentRow}>
          <div style={styles.leftSection}>
            <h2 style={styles.title}>{subject}</h2>
            <p style={styles.dateText}>
              {targetDate &&
                `${formatDate(targetDate)} at ${formatTime(targetDate)}`}
            </p>
          </div>

          <div style={styles.timerBox}>
            {circles.map((item, index) => {
              const { radius, circumference, offset } = getCircleProps(
                item.value,
                item.max
              );
              return (
                <div key={index} style={styles.circleBox}>
                  <svg width="70" height="70">
                    <circle
                      stroke="rgba(255,255,255,0.3)"
                      fill="transparent"
                      strokeWidth="6"
                      r={radius}
                      cx="35"
                      cy="35"
                    />
                    <circle
                      stroke="#e80e27"
                      fill="transparent"
                      strokeWidth="6"
                      strokeLinecap="round"
                      r={radius}
                      cx="35"
                      cy="35"
                      strokeDasharray={circumference}
                      strokeDashoffset={offset}
                      style={{
                        transition: "stroke-dashoffset 0.5s linear",
                        transform: "rotate(-90deg)",
                        transformOrigin: "50% 50%",
                      }}
                    />
                    <text
                      x="50%"
                      y="50%"
                      textAnchor="middle"
                      dy="0.3em"
                      fill="#e80e27"
                      fontSize="16"
                      fontWeight="bold"
                    >
                      {String(item.value).padStart(2, "0")}
                    </text>
                  </svg>
                  <span style={styles.timeLabel}>{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    position: "fixed",
    bottom: "15px",
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 999,
    maxWidth: "800px",
  },
  container: {
    background: "rgba(250, 84, 28, 0.4)",
    padding: "20px 30px",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
    color: "#663838",
    position: "relative",
    fontFamily: "Poppins, sans-serif",
    backdropFilter: "blur(8px)",
  },
  contentRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap"
  },
  leftSection: {
    textAlign: "left",
  },
  title: {
    fontWeight: "bolder",
    fontSize: "1.3rem",
    marginBottom: "5px",
    color: "#663838",
    textTransform: "capitalize",
  },
  dateText: {
    fontSize: "0.9rem",
    opacity: 0.9,
    fontWeight: "bold",
    color: "#e72a2a",
  },
  timerBox: {
    display: "flex",
    gap: "2px",
  },
  circleBox: {
    textAlign: "center",
  },
  timeLabel: {
    fontSize: "0.9rem",
    fontWeight: "bolder",
    color: "#e80e27",
    display: "block",
    marginTop: "6px",
    textTransform: "uppercase",
  },
  closeButton: {
    position: "absolute",
    top: "5px",
    right: "10px",
    background: "transparent",
    border: "none",
    color: "#fff",
    fontSize: "1.3rem",
    fontWeight: "bold",
    cursor: "pointer",
  },
};

export default CountdownTimer;
