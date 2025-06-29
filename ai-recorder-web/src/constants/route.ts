export const ROUTES = {
  home: '/',
  recorder: '/recorder',
  recorderDetail: (recorderId: string = ':recorderId') => `/recorder/${recorderId}`,
  photo: (recorderId: string = ':recorderId') => `/recorder/${recorderId}/photo`,
  recorderList: '/recorder-list',
  other: '*',
} as const;

export const pageTitleMap: Record<string, string> = {
  '/': 'home',
  '/recorder': 'recorder',
  '/recorderDetail': 'recorderDetail',
  '/photo': 'photo',
  '/recorder-list': 'recorder-list',
};
