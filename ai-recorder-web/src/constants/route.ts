export const ROUTES = {
  home: '/',
  recorder: '/recorder',
  recorderDetail: (recorderId: string = ':recorderId') => `/recorder/${recorderId}`,
  other: '*',
} as const;
