interface ImageOptimizationOptions {
  width: number;
  height: number;
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png';
  blur?: boolean;
}

interface AssetOptimizationOptions {
  cacheControl?: string;
  compression?: boolean;
}

export const optimizeImage = (
  imageUrl: string,
  options: ImageOptimizationOptions
): string => {
  const cdnUrl = process.env.NEXT_PUBLIC_CDN_URL;
  if (!cdnUrl) return imageUrl;

  const params = new URLSearchParams({
    w: options.width.toString(),
    h: options.height.toString(),
    q: (options.quality || 75).toString(),
    fm: options.format || 'webp',
    blur: options.blur ? 'true' : 'false',
  });

  return `${cdnUrl}/${encodeURIComponent(imageUrl)}?${params.toString()}`;
};

export const getImageDimensions = async (url: string): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
    };
    img.onerror = reject;
    img.src = url;
  });
};

export const generateSrcSet = async (
  imageUrl: string,
  widths: number[] = [320, 640, 768, 1024, 1280, 1536]
): Promise<string> => {
  const dimensions = await getImageDimensions(imageUrl);
  const aspectRatio = dimensions.height / dimensions.width;

  return widths
    .filter(w => w <= dimensions.width)
    .map(w => {
      const h = Math.round(w * aspectRatio);
      const optimizedUrl = optimizeImage(imageUrl, {
        width: w,
        height: h,
        format: 'webp',
      });
      return `${optimizedUrl} ${w}w`;
    })
    .join(', ');
};

export const optimizeAsset = (
  assetUrl: string,
  options: AssetOptimizationOptions = {}
): string => {
  const cdnUrl = process.env.NEXT_PUBLIC_CDN_URL;
  if (!cdnUrl) return assetUrl;

  const params = new URLSearchParams();
  
  if (options.compression) {
    params.append('compress', 'true');
  }
  
  if (options.cacheControl) {
    params.append('cache', options.cacheControl);
  }

  const queryString = params.toString();
  return queryString ? `${cdnUrl}/${encodeURIComponent(assetUrl)}?${queryString}` : `${cdnUrl}/${encodeURIComponent(assetUrl)}`;
};

export const preloadCriticalAssets = (assets: string[]): void => {
  assets.forEach(asset => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = asset;
    
    if (asset.endsWith('.js')) {
      link.as = 'script';
    } else if (asset.endsWith('.css')) {
      link.as = 'style';
    } else if (/\.(jpg|jpeg|png|webp|gif)$/i.test(asset)) {
      link.as = 'image';
    } else if (/\.(woff|woff2|ttf|otf)$/i.test(asset)) {
      link.as = 'font';
      link.crossOrigin = 'anonymous';
    }
    
    document.head.appendChild(link);
  });
};

export const lazyLoadComponent = <T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallback: React.ReactNode = null
) => {
  return React.lazy(() => {
    return importFunc().then(module => ({
      default: module.default,
    }));
  });
}; 