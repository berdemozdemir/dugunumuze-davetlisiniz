import { paths } from '@/lib/paths';

type Props = {
  slug: string;
  heightPx?: number;
};

export function InvitationIframePreview({ slug, heightPx = 760 }: Props) {
  return (
    <div className="w-full max-w-[420px] rounded-[2.2rem] border border-white/10 bg-black/40 p-3 shadow-sm">
      <div className="rounded-[1.9rem] border border-white/10 bg-black">
        <iframe
          title="Invitation preview"
          className="w-full rounded-[1.9rem]"
          style={{ height: `${heightPx}px` }}
          src={`${paths.invitation(slug)}?preview=1`}
        />
      </div>
    </div>
  );
}
