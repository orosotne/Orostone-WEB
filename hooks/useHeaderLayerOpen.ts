import { useSyncExternalStore } from 'react';
import { headerLayerOpenNow, subscribeHeaderLayer } from '../lib/headerLayer';

/** The header's menu drawer or search results are open (lib/headerLayer.ts). False without a DOM. */
export function useHeaderLayerOpen(): boolean {
  return useSyncExternalStore(subscribeHeaderLayer, headerLayerOpenNow, () => false);
}
