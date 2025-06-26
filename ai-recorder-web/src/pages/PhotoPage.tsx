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
      </div>
    </PageLayout>
  );
}
