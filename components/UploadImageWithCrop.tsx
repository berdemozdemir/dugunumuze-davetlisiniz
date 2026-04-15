'use client';

import React, { FC, forwardRef, useRef, useState } from 'react';
import ReactCrop, {
  centerCrop,
  convertToPixelCrop,
  Crop,
  makeAspectCrop,
} from 'react-image-crop';
import Image from 'next/image';
import 'react-image-crop/dist/ReactCrop.css';
import { toast } from 'sonner';

import { Upload } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { cn, getImageSrc } from '@/lib/utils';

function setCanvasPreview({
  image,
  canvas,
  crop,
}: {
  image: HTMLImageElement;
  canvas: HTMLCanvasElement;
  crop: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}): void {
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('No 2d context found');
  }

  const pixelRatio = window.devicePixelRatio;
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  canvas.width = Math.floor(crop.width * scaleX * pixelRatio);
  canvas.height = Math.floor(crop.height * scaleY * pixelRatio);

  ctx.scale(pixelRatio, pixelRatio);
  ctx.imageSmoothingQuality = 'high';
  ctx.save();

  const cropX = crop.x * scaleX;
  const cropY = crop.y * scaleY;

  ctx.translate(-cropX, -cropY);

  ctx.drawImage(
    image,
    0,
    0,
    image.naturalWidth,
    image.naturalHeight,
    0,
    0,
    image.naturalWidth,
    image.naturalHeight,
  );

  ctx.restore();
}

type UploadImageWithCropProps = Omit<
  React.ComponentProps<'input'>,
  'type' | 'multiple' | 'onChange'
> & {
  onImageCropped: (file: File) => void;
  cropType: 'square' | 'circle';
  aspectRatio?: number;
  minWidth: number;
  minHeight: number;
};

export const UploadImageWithCrop = forwardRef<
  HTMLInputElement,
  UploadImageWithCropProps
>(({ onImageCropped, cropType, minHeight, minWidth, aspectRatio, className, ...props }, ref) => {
  const [imageSrc, setImageSrc] = useState<string | undefined>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <label
        className={cn(
          'flex min-h-[104px] cursor-pointer flex-col items-center justify-center gap-2.5 rounded-xl border-2 border-dashed border-neutral-500/50 bg-neutral-950/35 px-5 py-6 text-center text-sm text-neutral-400 shadow-inner transition-colors hover:border-neutral-400/60 hover:bg-neutral-900/45',
          props.disabled && 'pointer-events-none cursor-not-allowed opacity-45',
          className,
        )}
      >
        <input
          {...props}
          ref={ref}
          type="file"
          className="sr-only"
          accept={props.accept ?? 'image/*'}
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;

            try {
              const src = await getImageSrc(file);
              setImageSrc(src);
              setIsDialogOpen(true);
            } catch {
              toast.error('Görsel okunamadı.');
            } finally {
              e.target.value = '';
            }
          }}
        />
        <Upload className="size-9 shrink-0 stroke-[1.35] text-neutral-300 opacity-90" aria-hidden />
        <span className="max-w-60 text-pretty leading-snug text-neutral-400">
          Görsel seçin — kırpma penceresi açılır
        </span>
      </label>

      {imageSrc && (
        <ImageCropModal
          imageSrc={imageSrc}
          cropType={cropType}
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onImageCropped={(croppedImage) => {
            onImageCropped(croppedImage);
            setImageSrc(undefined);
          }}
          aspectRatio={aspectRatio}
          minWidth={minWidth}
          minHeight={minHeight}
        />
      )}
    </>
  );
});

UploadImageWithCrop.displayName = 'UploadImageWithCrop';

type ImageCropModal = {
  isOpen: boolean;
  onOpenChange: (state: boolean) => void;
  imageSrc: string;
  onImageCropped: (file: File) => void;
  cropType: UploadImageWithCropProps['cropType'];
  aspectRatio?: UploadImageWithCropProps['aspectRatio'];
  minWidth: UploadImageWithCropProps['minWidth'];
  minHeight: UploadImageWithCropProps['minHeight'];
};

const ImageCropModal: FC<ImageCropModal> = ({
  isOpen,
  onOpenChange,
  imageSrc,
  onImageCropped,
  cropType,
  aspectRatio,
  minWidth,
  minHeight,
}) => {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const [crop, setCrop] = useState<Crop>();

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;

    const cropWidthInPercent = (minWidth / width) * 100;

    const initialCrop = makeAspectCrop(
      { unit: '%', width: cropWidthInPercent },
      aspectRatio ?? 1,
      width,
      height,
    );

    const centeredCrop = centerCrop(initialCrop, width, height);

    setCrop(centeredCrop);
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div
        className="absolute inset-0 bg-black/70"
        onClick={() => onOpenChange(false)}
      />

      <div className="relative z-10 w-[min(980px,92vw)] rounded-xl border border-white/10 bg-background p-4 shadow-2xl">
        <div className="mb-3">
          <p className="text-sm font-semibold">Crop Image</p>
        </div>

        <div className="flex flex-col items-center">
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => {
              setCrop(percentCrop);
            }}
            circularCrop={cropType === 'circle'}
            keepSelection
            aspect={cropType === 'circle' ? 1 : aspectRatio}
            minWidth={minWidth}
            minHeight={minHeight}
          >
            <Image
              ref={imgRef}
              src={imageSrc}
              width={1000}
              height={1000}
              alt="upload"
              style={{ maxHeight: '70vh' }}
              onLoad={onImageLoad}
            />
          </ReactCrop>
        </div>

        {crop ? (
          <canvas
            ref={previewCanvasRef}
            className="mt-4"
            style={{
              display: 'none',
              border: '1px solid black',
              objectFit: 'contain',
              width: 150,
              height: 150,
            }}
          />
        ) : null}

        <div className="mt-4 flex items-center justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>

          <Button
            variant="secondary"
            onClick={() => {
              try {
                if (imgRef.current && previewCanvasRef.current && crop) {
                  setCanvasPreview({
                    image: imgRef.current,
                    canvas: previewCanvasRef.current,
                    crop: convertToPixelCrop(
                      crop,
                      imgRef.current.width,
                      imgRef.current.height,
                    ),
                  });

                  previewCanvasRef.current.toBlob(
                    (blob) => {
                      if (!blob) {
                        toast.error(
                          'Görsel işlenemedi. Lütfen tekrar deneyin.',
                        );
                        return;
                      }

                      onImageCropped(
                        new File([blob], 'cropped-image.webp', {
                          type: 'image/webp',
                        }),
                      );
                    },
                    'image/webp',
                    0.92,
                  );
                } else {
                  toast.error(
                    'Görsel işlenemedi. Lütfen crop alanını seçtiğinizden emin olun.',
                  );
                }
              } catch {
                toast.error('Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.');
              }

              onOpenChange(false);
            }}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

