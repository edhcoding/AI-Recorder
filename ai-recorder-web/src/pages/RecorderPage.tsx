import PageLayout from '@/components/PageLayout';
import WaveAnimation from '@/components/WaveAnimation';
import useRecorder from '@/hooks/useRecorder';
import { cn } from '@/utils/cn';
import { formatTime } from '@/utils/formatTime';

export default function RecorderPage() {
  const { recordState, time, onPressRecord, onPressSave, onCamera } = useRecorder();

  return (
    <PageLayout
      headerProps={{
        title: '녹음하기',
        showBackButton: true,
        showLogo: false,
        showTitle: true,
        showCamera: true,
        onCamera,
      }}
    >
      <div className="flex-1 flex flex-col justify-center items-center">
        <div className="flex flex-col items-center justify-center size-40 relative mb-10">
          <WaveAnimation recordState={recordState} />
          <button
            type="button"
            onClick={onPressRecord}
            className={cn('bg-black w-40 min-h-40 rounded-full flex items-center justify-center cursor-pointer', {
              'bg-primary': recordState === 'recording',
            })}
          >
            <span
              className={cn('material-icons !text-6xl text-primary', {
                'text-white': recordState === 'recording',
              })}
            >
              {recordState === 'recording' ? 'mic' : recordState === 'paused' ? 'pause' : 'mic'}
            </span>
          </button>
        </div>
        <p
          className={cn('font-santokki text-2xl text-gray mb-5', {
            'text-black': recordState === 'recording',
          })}
        >
          {formatTime(time)}
        </p>
        {recordState === 'recording' ? (
          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={onPressRecord}
              className="flex items-center gap-1 bg-black text-white rounded-3xl px-5 py-3 cursor-pointer"
            >
              <span className="material-icons">pause</span>
              일시정지
            </button>
            <button
              type="button"
              onClick={onPressSave}
              className="flex items-center gap-1 bg-primary text-white rounded-3xl px-5 py-3 cursor-pointer"
            >
              <span className="material-icons">save</span>
              저장하기
            </button>
          </div>
        ) : recordState === 'paused' ? (
          <div className="space-y-3">
            <button
              type="button"
              onClick={onPressRecord}
              className="flex items-center gap-1 bg-black text-white rounded-3xl px-5 py-3 cursor-pointer"
            >
              <span className="material-icons">play_arrow</span>
              녹음재생
            </button>
            <button
              type="button"
              onClick={onPressSave}
              className="flex items-center gap-1 bg-primary text-white rounded-3xl px-5 py-3 cursor-pointer"
            >
              <span className="material-icons">save</span>
              저장하기
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-xl text-center">
              마이크 버튼을 눌러 <br /> 녹음을 시작하세요!! <br />
            </p>
            <span className="text-primary font-semibold">+) 사진 기능이 추가되었습니다 !!</span>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
