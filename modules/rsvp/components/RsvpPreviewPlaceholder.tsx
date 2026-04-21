import { Button } from '@/components/ui/Button';

export function RsvpPreviewPlaceholder() {
  return (
    <section className="bg-deep/40 border-y border-white/5 py-16">
      <div className="mx-auto max-w-lg px-6 text-center">
        <h2 className="text-gold font-serif text-2xl tracking-wide md:text-3xl">
          Rezervasyon
        </h2>

        <p className="text-cream/60 mt-3 text-sm">
          Önizleme modunda rezervasyon gönderilmez. Yayına alındığında
          misafirleriniz bu bölümden kayıt bırakabilir.
        </p>

        <div className="mt-8">
          <Button
            type="button"
            size="lg"
            className="rounded-full px-8"
            disabled
          >
            Rezervasyon yap
          </Button>
        </div>
      </div>
    </section>
  );
}
