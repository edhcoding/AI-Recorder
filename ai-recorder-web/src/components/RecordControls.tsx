import { cn } from '@/utils/cn';
import { formatTime } from '@/utils/formatTime';

interface Props {
  recordState: 'recording' | 'paused' | null;
  time: number;
  onPressRecord: () => void;
  onPressSave: () => void;
}

export default function RecordControls({ recordState, time, onPressRecord, onPressSave }: Props) {
  return (
    <div className="flex flex-col items-center relative w-full">
      <p
        className={cn('font-santokki text-2xl text-gray absolute top-0', {
          'text-black': recordState === 'recording',
        })}
      >
        {formatTime(time)}
      </p>
      {recordState === 'recording' ? (
        <div className="flex flex-col gap-3 absolute top-14">
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
        <div className="absolute top-14 space-y-3">
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
        <p className="absolute top-16 text-2xl text-center">
          녹음 버튼을 눌러 <br /> 녹음을 시작해주세요!!
        </p>
      )}
    </div>
  );
}
