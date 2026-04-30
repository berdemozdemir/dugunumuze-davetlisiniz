import Image from 'next/image';
import type { InvitationDefaults } from '@/modules/templates/types';

type TemplateListItem = {
  id: string;
  key: string;
  name: string;
  defaultsJson?: unknown;
};

function isInvitationDefaults(v: unknown): v is InvitationDefaults {
  return Boolean(v) && typeof v === 'object';
}

function resolvePreviewSrc(t: TemplateListItem): string | undefined {
  if (!isInvitationDefaults(t.defaultsJson)) return undefined;

  const hero = t.defaultsJson.heroImagePublicSrc?.trim();
  if (hero) return hero;

  const closingFirst = t.defaultsJson.closingPhotoUris?.[0]?.trim();
  if (closingFirst) return closingFirst;

  const story = t.defaultsJson.storyImagePublicSrc?.trim();
  if (story) return story;

  return undefined;
}

type TemplatePickerProps = {
  templates: TemplateListItem[];
  selectedKey: string;
  onSelect: (templateKey: string) => void;
};

export function TemplatePicker({
  templates,
  selectedKey,
  onSelect,
}: TemplatePickerProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {templates.map((t) => {
        const active = selectedKey === t.key;
        const previewSrc = resolvePreviewSrc(t);

        return (
          <div
            key={t.id}
            onClick={() => onSelect(t.key)}
            className={[
              'border-border/60 bg-card group relative cursor-pointer overflow-hidden rounded-xl border text-left shadow-sm transition',
              'hover:border-border hover:bg-muted/40 hover:shadow-md',
              'focus-visible:ring-primary focus-visible:ring-2 focus-visible:outline-none',
              active ? 'ring-primary ring-2' : 'ring-2 ring-transparent',
            ].join(' ')}
          >
            <div className="bg-muted relative aspect-16/10 w-full overflow-hidden">
              {previewSrc ? (
                <Image
                  src={previewSrc}
                  alt={`${t.name} — önizleme`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  priority={false}
                />
              ) : (
                <div className="from-muted to-muted/30 absolute inset-0 bg-linear-to-br" />
              )}

              <div className="absolute inset-0 bg-linear-to-t from-black/50 via-black/10 to-transparent opacity-90" />

              {active && (
                <div className="bg-primary/90 text-primary-foreground absolute top-3 left-3 rounded-full px-2.5 py-1 text-xs font-medium shadow-sm">
                  Seçili
                </div>
              )}
            </div>

            <div className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="truncate text-sm font-semibold">{t.name}</div>

                <p className="text-muted-foreground mt-0.5 text-xs">Seç</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
