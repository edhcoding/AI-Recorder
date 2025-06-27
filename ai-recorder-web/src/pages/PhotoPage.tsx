import PageLayout from '@/components/PageLayout';
import { useRecorderContext, type RecorderData } from '@/contexts/RecorderContext';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function PhotoPage() {
  const [data, setData] = useState<RecorderData | null>(null);
  const { recorderId } = useParams();
  const { get } = useRecorderContext();

  useEffect(() => {
    if (typeof recorderId === 'string') {
      const document = get({ id: recorderId });
      if (document != null) {
        setData(document);
        return;
      } else {
        throw new Error('Cannot load data');
      }
    }
  }, [get, recorderId]);

  console.log(data?.photos);

  return (
    <PageLayout
      headerProps={{
        title: '사진 기록',
        showBackButton: true,
        showLogo: false,
        showTitle: true,
      }}
    >
      <div className="flex-1 overflow-y-scroll">
        <div className="grid grid-cols-3 gap-2">
          {data?.photos != null &&
            data.photos.map((photo, index) => {
              return (
                <img className="aspect-square object-cover w-full" key={index} src={photo} alt={`Photo ${index + 1}`} />
              );
            })}
        </div>
        {data?.photos?.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <span className="material-icons text-5xl! text-gray">photo_camera</span>
            <h3 className="text-2xl font-medium">사진이 없습니다</h3>
            <p className="text-center text-xl text-pretty">
              녹음 중 찍은 사진이 없습니다.
              <br />
              녹음과 함께 사진을 찍어 그 날의 기록을 남겨보세요.
            </p>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
