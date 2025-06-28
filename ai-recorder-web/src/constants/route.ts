export const ROUTES = {
  home: '/',
  recorder: '/recorder',
  recorderDetail: (recorderId: string = ':recorderId') => `/recorder/${recorderId}`,
  photo: (recorderId: string = ':recorderId') => `/recorder/${recorderId}/photo`,
  recorderList: '/recorder-list',
  other: '*',
} as const;
