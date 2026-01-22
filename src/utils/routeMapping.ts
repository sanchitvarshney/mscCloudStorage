import { ViewType } from '../types';

export const routeToViewMap: Record<string, ViewType> = {
  'home': 'home',
  'my-drive': 'myDrive',
  'shared-drives': 'sharedDrives',
  'shared-with-me': 'sharedWithMe',
  'starred': 'starred',
  'spam': 'spam',
  'trash': 'trash',
};

export const viewToRouteMap: Record<ViewType, string> = {
  'home': 'home',
  'myDrive': 'my-drive',
  'sharedDrives': 'shared-drives',
  'sharedWithMe': 'shared-with-me',
  'starred': 'starred',
  'spam': 'spam',
  'trash': 'trash',
};

export const getViewFromRoute = (route: string): ViewType => {
  return routeToViewMap[route] || 'home';
};

export const getRouteFromView = (view: ViewType): string => {
  return viewToRouteMap[view] || 'home';
};
