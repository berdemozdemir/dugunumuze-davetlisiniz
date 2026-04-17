import { Button } from '@/components/ui/Button';

export type MusicTrackFileControlsProps = {
  hasTrack: boolean;
  previewUrl: string;
  isUploading: boolean;
  onOpenFilePicker: () => void;
  onRemoveTrack: () => void;
};

/** Yükleme yoksa tek buton; dosya varsa `<audio>` + değiştir / kaldır. */
export function MusicTrackFileControls({
  hasTrack,
  previewUrl,
  isUploading,
  onOpenFilePicker,
  onRemoveTrack,
}: MusicTrackFileControlsProps) {
  if (hasTrack) {
    return (
      <div className="grid gap-2">
        <audio
          className="w-full max-w-md"
          controls
          src={previewUrl}
          preload="metadata"
        />
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={isUploading}
            onClick={onOpenFilePicker}
          >
            Dosyayı değiştir
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={isUploading}
            onClick={onRemoveTrack}
          >
            Müziği kaldır
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Button
      type="button"
      variant="outline"
      disabled={isUploading}
      onClick={onOpenFilePicker}
    >
      Müzik yükle
    </Button>
  );
}
