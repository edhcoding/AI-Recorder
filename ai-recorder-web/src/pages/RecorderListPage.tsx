import PageLayout from '@/components/PageLayout';
import { ROUTES } from '@/constants/route';
import { useRecorderContext, type RecorderData } from '@/contexts/RecorderDataContext';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RecorderListPage() {
  const [recordings, setRecordings] = useState<RecorderData[]>([]);
  const navigate = useNavigate();

  const { getAll } = useRecorderContext();

  useEffect(() => {
    setRecordings(getAll());
  }, [getAll]);

  // const recordings = [
  //   { id: '1', text: '녹음', createdAt: Date.now() },
  //   { id: '2', text: '녹음2', createdAt: Date.now() },
  //   { id: '3', text: '녹음3', createdAt: Date.now() },
  //   { id: '4', text: '녹음4', createdAt: Date.now() },
  //   { id: '5', text: '녹음5', createdAt: Date.now() },
  //   { id: '6', text: '녹음6', createdAt: Date.now() },
  //   { id: '7', text: '녹음7', createdAt: Date.now() },
  //   { id: '8', text: '녹음8', createdAt: Date.now() },
  //   { id: '9', text: '녹음9', createdAt: Date.now() },
  //   { id: '10', text: '녹음10', createdAt: Date.now() },
  // ];

  return (
    <PageLayout headerProps={{ showBackButton: true, showLogo: false, showTitle: true, title: '녹음 리스트' }}>
      <div className="flex flex-col gap-3 overflow-y-scroll p-4 w-full">
        {recordings.map(({ id, text, createdAt }) => {
          const createdAtString = new Date(createdAt).toLocaleString();

          return (
            <div
              key={id}
              className="h-24 bg-white flex flex-row items-center px-4 py-6 rounded-lg"
              onClick={() => {
                navigate(`${ROUTES.recorderDetail(id)}`);
              }}
            >
              <div className="mr-6">
                <div className="size-11 rounded-full bg-primary items-center justify-center flex">
                  <span className="material-icons text-white text-2xl!">mic</span>
                </div>
              </div>
              <div className="flex-1 flex flex-col overflow-hidden">
                <p className="truncate text-black text-lg font-medium">{text}</p>
                <p className="mt-2 text-black text-sm">{createdAtString}</p>
              </div>
            </div>
          );
        })}
      </div>
      <button
        className="bg-black py-2 px-5 rounded-3xl flex items-center bottom-8 right-4 fixed"
        onClick={() => navigate(ROUTES.recorder)}
      >
        <span className="material-icons text-white text-2xl!">mic</span>
        <span className="text-white text-lg ml-1">녹음하기</span>
      </button>
    </PageLayout>
  );
}
