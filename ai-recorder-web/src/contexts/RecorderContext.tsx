import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';

export type RecorderData = {
  id: string;
  text: string;
  segments: { start: number; end: number; text: string }[];
  summary?: string;
  photos?: string[];
};

type RecorderDatabase = { [id: string]: RecorderData | undefined };

type RecorderContextType = {
  get: ({ id }: { id: string }) => RecorderData | undefined;
  create: (data: RecorderData) => void;
  update: ({ id, summary }: { id: string; summary?: string }) => void;
  getAll: () => RecorderData[];
};

const RecorderContext = createContext<RecorderContextType | undefined>(undefined);

const DUMMY_DATA: RecorderDatabase = {
  '1721464473516': {
    id: '1721464473516',
    text: '웹앱은 웹브라우저를 통해 접근할 수 있는 애플리케이션 소프트웨어로 인터넷 연결만 있으면 어디서나 사용할 수 있습니다. 설치 과정이 필요 없으며 사용자는 URL을 통해 쉽게 접근할 수 있습니다. 웹앱은 서버와 클라이언트 간의 상호작용을 통해 실시간으로 데이터가 업데이트되며 HTML, CSS, JavaScript 등의 웹기술을 사용하여 개발됩니다. 이를 통해 사용자들은 이메일 확인, 소셜네트워킹, 문서 편집, 쇼핑 등 다양한 작업을 웹브라우저 하나만으로 간편하게 처리할 수 있습니다.',
    segments: [
      {
        start: 0,
        end: 11,
        text: '웹앱은 웹브라우저를 통해 접근할 수 있는 애플리케이션 소프트웨어로 인터넷 연결만 있으면 어디서나 사용할 수 있습니다.',
      },
      {
        start: 11,
        end: 17,
        text: '설치 과정이 필요 없으며 사용자는 URL을 통해 쉽게 접근할 수 있습니다.',
      },
      {
        start: 17,
        end: 23,
        text: '웹앱은 서버와 클라이언트 간의 상호작용을 통해 실시간으로 데이터가 업데이트되며',
      },
      {
        start: 23,
        end: 28,
        text: 'HTML, CSS, JavaScript 등의 웹기술을 사용하여 개발됩니다.',
      },
      {
        start: 28,
        end: 34,
        text: '이를 통해 사용자들은 이메일 확인, 소셜네트워킹, 문서 편집, 쇼핑 등',
      },
      {
        start: 34,
        end: 39,
        text: '다양한 작업을 웹브라우저 하나만으로 간편하게 처리할 수 있습니다.',
      },
      {
        start: 39,
        end: 45,
        text: '웹앱은 인터넷만 있으면 설치 없이 웹브라우저로 바로 사용할 수 있는 편리한 애플리케이션입니다. 실시간으로 데이터가 업데이트되며, 다양한 작업을 간편하게 처리할 수 있습니다.',
      },
    ],
    summary:
      '웹앱은 인터넷만 있으면 설치 없이 웹브라우저로 바로 사용할 수 있는 편리한 애플리케이션입니다. 실시간으로 데이터가 업데이트되며, 다양한 작업을 간편하게 처리할 수 있습니다.',
    photos: [
      // 빨간색
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==',
      // 파란색
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
      // 초록색
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9Qz0ADAAJAAfQvOqIAAAAASUVORK5CYII=',
      // 노란색
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPj/n4EBAAYEAfQvOqIAAAAASUVORK5CYII=',
      // 보라색
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPj/n4EBAAYEAfQvOqIAAAAASUVORK5CYII=',
      // 주황색
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
      // 분홍색
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9Qz0ADAAJAAfQvOqIAAAAASUVORK5CYII=',
      // 청록색
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
      // 회색
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9Qz0ADAAJAAfQvOqIAAAAASUVORK5CYII=',
      // 갈색
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
      // 연두색
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9Qz0ADAAJAAfQvOqIAAAAASUVORK5CYII=',
      // 하늘색
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
      // 연보라색
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9Qz0ADAAJAAfQvOqIAAAAASUVORK5CYII=',
    ],
  },
};

// const DUMMY_DATA2: RecorderDatabase = {
//   '1721464473516': {
//     id: '1721464473516',
//     text: '웹앱은 웹브라우저를 통해 접근할 수 있는 애플리케이션 소프트웨어로 인터넷 연결만 있으면 어디서나 사용할 수 있습니다. 설치 과정이 필요 없으며 사용자는 URL을 통해 쉽게 접근할 수 있습니다. 웹앱은 서버와 클라이언트 간의 상호작용을 통해 실시간으로 데이터가 업데이트되며 HTML, CSS, JavaScript 등의 웹기술을 사용하여 개발됩니다. 이를 통해 사용자들은 이메일 확인, 소셜네트워킹, 문서 편집, 쇼핑 등 다양한 작업을 웹브라우저 하나만으로 간편하게 처리할 수 있습니다.',
//     segments: [
//       {
//         start: 0,
//         end: 11,
//         text: '웹앱은 웹브라우저를 통해 접근할 수 있는 애플리케이션 소프트웨어로 인터넷 연결만 있으면 어디서나 사용할 수 있습니다.',
//       },
//     ],
//     summary:
//       '웹앱은 인터넷만 있으면 설치 없이 웹브라우저로 바로 사용할 수 있는 편리한 애플리케이션입니다. 실시간으로 데이터가 업데이트되며, 다양한 작업을 간편하게 처리할 수 있습니다.',
//   },
// };

export const RecorderProvider = ({ children }: { children: ReactNode }) => {
  // const [recorderData, setRecorderData] = useState<RecorderDatabase>({});
  const [recorderData, setRecorderData] = useState<RecorderDatabase>(DUMMY_DATA);
  // const [recorderData, setRecorderData] = useState<RecorderDatabase>(DUMMY_DATA2);

  const get = useCallback(
    ({ id }: { id: string }) => {
      return recorderData[id];
    },
    [recorderData],
  );

  const getAll = useCallback(() => {
    return Object.values(recorderData) as RecorderData[];
  }, [recorderData]);

  const create = useCallback((data: RecorderData) => {
    setRecorderData((prev) => ({ ...prev, [data.id]: data }));
  }, []);

  const update = useCallback(({ id, summary }: { id: string; summary?: string }) => {
    setRecorderData((prev) => {
      const prevData = prev[id];
      if (prevData == null) return prev;

      return {
        ...prev,
        [id]: {
          ...prevData,
          ...(summary != null ? { summary } : {}),
        },
      };
    });
  }, []);

  return <RecorderContext.Provider value={{ get, getAll, create, update }}>{children}</RecorderContext.Provider>;
};

export const useRecorderContext = () => {
  const context = useContext(RecorderContext);

  if (context === undefined) throw new Error('useRecorderContext must be used within a RecorderProvider');

  return context;
};
