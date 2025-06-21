import { useState } from 'react';
import PageLayout from '@/components/PageLayout';
import { cn } from '@/utils/cn';

export default function RecorderPage() {
  const [recordState, setRecordState] = useState<'recording' | 'paused' | null>(null);

  return (
    <PageLayout headerProps={{ title: '녹음하기', showBackButton: true, showLogo: false }}>
      <div className="flex-1 flex flex-col justify-center items-center relative">
        <div className="absolute top-40 flex flex-col items-center justify-center size-40">
          {/* 파동 애니메이션 */}
          {recordState === 'recording' && (
            <>
              <span
                className="
                  absolute top-0 left-0 w-full h-full rounded-full border-4 border-primary opacity-50 pointer-events-none
                  animate-wave
                "
              />
              <span
                className="
                  absolute top-0 left-0 w-full h-full rounded-full border-4 border-primary opacity-50 pointer-events-none animate-wave-delay-750
                "
              />
            </>
          )}
          <button
            type="button"
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

          {/* 얘시 동작 시험 버튼 */}
          <div className="absolute bottom-[-300px] flex flex-col gap-2 font-extrabold">
            <button type="button" onClick={() => setRecordState('recording')}>
              recording
            </button>
            <button type="button" onClick={() => setRecordState('paused')}>
              paused
            </button>
            <button type="button" onClick={() => setRecordState(null)}>
              null
            </button>
          </div>
        </div>
        <div className="flex flex-col items-center relative w-full">
          <p
            className={cn('font-santokki text-2xl text-gray absolute top-0', {
              'text-black': recordState === 'recording',
            })}
          >
            00:00
          </p>
          {recordState === 'recording' ? (
            <div className="flex flex-col gap-3 absolute top-14">
              <button type="button" className="flex items-center gap-1 bg-black text-white rounded-3xl px-5 py-3">
                <span className="material-icons">pause</span>
                일시정지
              </button>
              <button type="button" className="flex items-center gap-1 bg-primary text-white rounded-3xl px-5 py-3">
                <span className="material-icons">save</span>
                저장하기
              </button>
            </div>
          ) : recordState === 'paused' ? (
            <button
              type="button"
              className="flex items-center gap-1 bg-primary text-white rounded-3xl px-5 py-3 absolute top-14"
            >
              <span className="material-icons">save</span>
              저장하기
            </button>
          ) : (
            <p className="absolute top-14 text-xl">녹음을 시작해주세요!!</p>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
