/**
 * 加载任意资源
 * @param url
 */
export async function loadAnyAsset(url: string) {
  try {
    await fetch(url, { method: "GET" });
  } catch (error) {}

  return;
}

export type ProgressCallback = (percent: number) => void;
export type EndCallback = () => void;
export interface LoaderType {
  manifestUrl: string;
  onProgress: (callback: ProgressCallback) => void;
  onEnd: (callback: EndCallback) => void;
}

export class Loader implements LoaderType {
  private progressCallback?: ProgressCallback;
  private endCallback?: () => void;

  
  constructor(public manifestUrl = "./manifest.json") {
    (async () => {
      const response = await fetch(manifestUrl);
      const result = await response.json();
      const list: string[] = Object.values(result.files);

      for (let i = 1; i <= list.length; i++) {
        await loadAnyAsset(list[i]);
        this.progressCallback?.(Math.ceil((i * 100) / list.length));
      }
      this.endCallback?.();
    })();
  }

  /**
   * 注册过程
   * @param callback 
   */
  onProgress(callback: ProgressCallback) {
    this.progressCallback = callback;
  }

  /**
   * 注册加载结果
   * @param callback 
   */
  onEnd(callback: EndCallback) {
    this.endCallback = callback;
  }
}
