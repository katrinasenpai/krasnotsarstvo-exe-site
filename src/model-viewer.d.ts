import type { ModelViewerElement } from '@google/model-viewer';
import type { DetailedHTMLProps, HTMLAttributes } from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': DetailedHTMLProps<HTMLAttributes<ModelViewerElement>, ModelViewerElement> & {
        src?: string;
        poster?: string;
        alt?: string;
        ar?: string;
        'ar-modes'?: string;
        'ar-scale'?: string;
        'ar-placement'?: string;
        'ios-src'?: string;
        'quick-look-browsers'?: string;
        'camera-controls'?: string;
        'camera-orbit'?: string;
        'camera-target'?: string;
        'field-of-view'?: string;
        'shadow-intensity'?: string;
        'environment-image'?: string;
        exposure?: string;
        loading?: string;
        'interaction-prompt'?: string;
        'touch-action'?: string;
      };
    }
  }
}

export {};
