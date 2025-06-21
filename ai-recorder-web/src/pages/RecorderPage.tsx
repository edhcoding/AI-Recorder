import PageLayout from '@/components/PageLayout';
import RecordButton from '@/components/RecordButton';
import RecordControls from '@/components/RecordControls';
import useRecorder from '@/hooks/useRecorder';

export default function RecorderPage() {
  const { recordState, time, audioUrl, onPressRecord, onPressSave } = useRecorder();

  return (
    <PageLayout headerProps={{ title: '녹음하기', showBackButton: true, showLogo: false }}>
      <div className="flex-1 flex flex-col justify-center items-center relative">
        <RecordButton recordState={recordState} onPress={onPressRecord} />
        <RecordControls
          recordState={recordState}
          time={time}
          audioUrl={audioUrl}
          onPressRecord={onPressRecord}
          onPressSave={onPressSave}
        />
      </div>
    </PageLayout>
  );
}
