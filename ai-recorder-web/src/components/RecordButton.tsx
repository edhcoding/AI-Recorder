import { cn } from '@/utils/cn';
import WaveAnimation from '@/components/WaveAnimation';

interface Props {
  recordState: 'recording' | 'paused' | null;
  onPress: () => void;
}

export default function RecordButton({ recordState, onPress }: Props) {
  return (
    <div className="absolute top-40 flex flex-col items-center justify-center size-40">
      <WaveAnimation recordState={recordState} />
      <button
        type="button"
        onClick={onPress}
        className={cn('bg-black size-40 rounded-full flex items-center justify-center cursor-pointer', {
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
  );
}
