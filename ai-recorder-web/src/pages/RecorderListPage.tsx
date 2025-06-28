import PageLayout from '@/components/PageLayout';
import { ROUTES } from '@/constants/route';
import { useRecorderContext } from '@/contexts/RecorderDataContext';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RecorderListPage() {
  const navigate = useNavigate();

  const { getAll } = useRecorderContext();
  const recordings = getAll();

  const hasReactNativeWebview = typeof window !== 'undefined' && window.ReactNativeWebView != null;

  const handleDelete = useCallback(
    ({ id }: { id: string }) => {
      if (hasReactNativeWebview)
        window.ReactNativeWebView?.postMessage(JSON.stringify({ type: 'delete-database', data: { id } }));
    },
    [hasReactNativeWebview],
  );

  return (
    <PageLayout headerProps={{ showBackButton: true, showLogo: false, showTitle: true, title: '녹음 리스트' }}>
      <div className="flex flex-col gap-3 overflow-y-scroll p-4 w-full">
        {recordings.map(({ id, text, createdAt }) => {
          const createdAtString = new Date(createdAt).toLocaleString();

          return (
            <div
              key={id}
              onClick={() => {
                navigate(`${ROUTES.recorderDetail(id)}`);
              }}
              className="h-24 bg-white flex flex-row items-center px-2 py-4 rounded-lg"
            >
              <div className="mr-5">
                <img src="/assets/images/record-disc.png" alt="logo" className="size-10 inline-block" />
              </div>
              <div className="flex-1 flex flex-col overflow-hidden">
                <p className="truncate text-black text-base font-medium">{text}</p>
                <p className="mt-2 text-black text-xs">{createdAtString}</p>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete({ id });
                }}
                className="border-black border-3 bg-primary text-white px-2 py-1 rounded-xl ml-2 flex items-center"
              >
                <span className="material-icons text-lg! text-white">delete</span>
              </button>
            </div>
          );
        })}
      </div>
      <button
        onClick={() => navigate(ROUTES.recorder)}
        className="bg-black py-2 px-5 rounded-3xl flex items-center bottom-8 right-4 fixed"
      >
        <span className="material-icons text-white text-2xl!">mic</span>
        <span className="text-white text-lg ml-1">녹음하기</span>
      </button>
    </PageLayout>
  );
}
