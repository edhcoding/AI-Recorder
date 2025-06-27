import Modal from '@/components/Modal';
import PageLayout from '@/components/PageLayout';
import { useRecorderContext, type RecorderData } from '@/contexts/RecorderContext';
import { useModal } from '@/hooks/useModal';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function PhotoPage() {
  const [data, setData] = useState<RecorderData | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const { recorderId } = useParams();
  const { get } = useRecorderContext();
  const { isModalOpen, openModal, closeModal } = useModal();

  const onClickPhoto = useCallback(
    (photo: string) => {
      openModal();
      setSelectedPhoto(photo);
    },
    [openModal],
  );

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
                <img
                  className="aspect-square object-cover w-full"
                  key={index}
                  src={photo}
                  alt={`Photo ${index + 1}`}
                  onClick={() => onClickPhoto(photo)}
                />
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
        {isModalOpen && selectedPhoto != null && (
          <Modal>
            <div className="relative">
              <div className="fixed top-0 left-0 size-full bg-black/40" onClick={closeModal} />
              <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col justify-center items-center w-sm h-sm bg-bg rounded-lg p-3">
                <button type="button" onClick={closeModal} className="absolute top-0 right-0">
                  <span className="material-icons font-bold! text-2xl!">close</span>
                </button>
                <img src={selectedPhoto} alt="선택한 사진" className="aspect-square object-cover w-full" />
              </div>
            </div>
          </Modal>
        )}
      </div>
    </PageLayout>
  );
}
