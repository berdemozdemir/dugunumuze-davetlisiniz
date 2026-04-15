'use client';

import Image from 'next/image';
import { ImagePlus, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export type ImagePreviewWithActionsProps = {
  src: string;
  alt: string;
  onRemove: () => void;
  onReplace: () => void;
  disabled?: boolean;
  className?: string;
  /** Örn. `aspect-square`, `aspect-[4/3]` — varsayılan 16:9 */
  aspectClassName?: string;
  replaceLabel?: string;
  removeAriaLabel?: string;
  replaceAriaLabel?: string;
  unoptimized?: boolean;
};

export function ImagePreviewWithActions({
  src,
  alt,
  onRemove,
  onReplace,
  disabled = false,
  className,
  aspectClassName = 'aspect-video',
  replaceLabel = 'Değiştir',
  removeAriaLabel = 'Görseli kaldır',
  replaceAriaLabel = 'Görseli değiştir',
  unoptimized = true,
}: ImagePreviewWithActionsProps) {
  return (
    <div
      className={cn(
        'group bg-muted/30 relative w-full overflow-hidden rounded-xl border border-white/10 shadow-sm',
        aspectClassName,
        className,
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className={cn(
          'object-cover transition duration-300 ease-out',
          'sm:group-hover:opacity-55 sm:group-hover:brightness-[0.92]',
          'sm:group-focus-within:opacity-55 sm:group-focus-within:brightness-[0.92]',
        )}
        sizes="(max-width: 768px) 100vw, 672px"
        unoptimized={unoptimized}
      />
      <div
        className={cn(
          'pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-300',
          'sm:group-hover:bg-black/25 sm:group-focus-within:bg-black/25',
        )}
        aria-hidden
      />
      <div
        className={cn(
          'absolute top-3 right-3 flex items-center gap-2',
          'opacity-100',
          'sm:pointer-events-none sm:opacity-0',
          'sm:group-hover:pointer-events-auto sm:group-hover:opacity-100',
          'sm:group-focus-within:pointer-events-auto sm:group-focus-within:opacity-100',
        )}
      >
        <Button
          type="button"
          size="sm"
          variant="secondary"
          className="shadow-md backdrop-blur-sm"
          disabled={disabled}
          aria-label={replaceAriaLabel}
          onClick={onReplace}
        >
          <ImagePlus aria-hidden className="size-3.5" />
          {replaceLabel}
        </Button>
        <Button
          type="button"
          size="icon-sm"
          variant="destructive"
          className="shadow-md backdrop-blur-sm"
          disabled={disabled}
          aria-label={removeAriaLabel}
          onClick={onRemove}
        >
          <Trash2 aria-hidden className="size-4" />
        </Button>
      </div>
    </div>
  );
}
