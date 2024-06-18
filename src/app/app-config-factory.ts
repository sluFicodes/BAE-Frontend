import { AppInitService } from './services/app-init.service'; // Adjust path as necessary

export function appConfigFactory(appInitService: AppInitService): () => Promise<any> {
  return () => appInitService.init();
}