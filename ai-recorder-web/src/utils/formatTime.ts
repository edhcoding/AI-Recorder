// 시간 포맷팅 함수
export const formatTime = (seconds: number) => {
  const roundedSeconds = Math.round(seconds);
  const mins = Math.floor(roundedSeconds / 60);
  const secs = roundedSeconds % 60;

  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};
