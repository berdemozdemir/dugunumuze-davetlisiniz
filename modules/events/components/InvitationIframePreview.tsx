import { paths } from '@/lib/paths';

type Props = {
  slug: string;
  heightPx?: number;
  /** URL cache-buster (iframe refresh) */
  version?: string | number;
};

export function InvitationIframePreview({
  slug,
  heightPx = 760,
  version,
}: Props) {
  const v =
    version === undefined ? '' : `&v=${encodeURIComponent(String(version))}`;
  return (
    <div className="w-full max-w-[420px] rounded-[2.2rem] border border-white/10 bg-black/40 p-3 shadow-sm">
      <div className="rounded-[1.9rem] border border-white/10 bg-black">
        <iframe
          title="Davetiye önizlemesi"
          className="w-full rounded-[1.9rem]"
          style={{ height: `${heightPx}px` }}
          src={`${paths.invitation.preview(slug)}${v}`}
        />
      </div>
    </div>
  );
}
