import { config } from 'dotenv';
import postgres from 'postgres';

config({ path: '.env.local' });

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error('Missing DATABASE_URL (expected in .env.local)');
  process.exit(1);
}

const sql = postgres(databaseUrl, { prepare: false });

const templates = [
  {
    key: 'wedding',
    name: 'Düğün',
    defaultsJson: {
      sections: {
        hero: true,
        countdown: true,
        story: true,
        details: true,
        closing: true,
        musicPlayer: true,
      },
      heroImagePublicSrc: '/images/wedding/cover-section-bg-image.png',
      heroEyebrow: 'Sizi düğünümüze bekliyoruz',
      heroTagline: 'Evleniyoruz',
      storyImagePublicSrc: '/images/wedding/story-section-bg-image.jpeg',
      storyHeadline: 'Bir “Evet” ile Başladı',
      storySubline: 'Şimdi sıra sonsuza dek “evet” demeye geldi',
      createForm: {
        primaryNameLabel: 'Birinci isim',
        primaryNamePlaceholder: 'Elif',
        secondaryNameLabel: 'İkinci isim',
        secondaryNamePlaceholder: 'Erdem',
        secondaryNameOptionalLabelSuffix: '(opsiyonel)',
        dateTimeLabel: 'Düğün tarihi / saati',
        cityLabel: 'Şehir',
        cityPlaceholder: 'İstanbul',
        venueNameLabel: 'Mekân adı (opsiyonel)',
        venueNamePlaceholder: 'Düğün salonu / Otel',
        addressTextLabel: 'Adres',
        addressTextPlaceholder: 'Açık adres',
      },
    },
  },
  {
    key: 'kina',
    name: 'Kına',
    defaultsJson: {
      sections: {
        hero: true,
        countdown: true,
        story: true,
        details: true,
        closing: true,
        musicPlayer: true,
      },
      heroEyebrow: 'Kına gecemize davetlisiniz',
      heroTagline: 'Kına gecemiz',
      storyHeadline: 'Bu özel gecede',
      storySubline: 'Sevdiklerimizle bir arada olmak istiyoruz',
      createForm: {
        primaryNameLabel: 'Gelin adı',
        primaryNamePlaceholder: 'Elif',
        secondaryNameLabel: 'İkinci isim',
        secondaryNamePlaceholder: '',
        secondaryNameOptionalLabelSuffix: '(opsiyonel)',
        dateTimeLabel: 'Kına tarihi / saati',
        cityLabel: 'Şehir',
        cityPlaceholder: 'İstanbul',
        venueNameLabel: 'Mekân adı (opsiyonel)',
        venueNamePlaceholder: 'Kına mekânı',
        addressTextLabel: 'Adres',
        addressTextPlaceholder: 'Açık adres',
      },
    },
  },
  {
    key: 'birthday',
    name: 'Doğum günü',
    defaultsJson: {
      sections: {
        hero: true,
        countdown: true,
        story: true,
        details: true,
        closing: true,
        musicPlayer: true,
      },
      heroEyebrow: 'Doğum günü partime bekliyorum',
      heroTagline: 'Doğum günü',
      storyHeadline: 'Birlikte kutlayalım',
      storySubline: 'Bu günü sizinle daha da güzel yapmak istiyorum',
      createForm: {
        primaryNameLabel: 'Kimin doğum günü?',
        primaryNamePlaceholder: 'Elif',
        secondaryNameLabel: 'İkinci isim',
        secondaryNamePlaceholder: '',
        secondaryNameOptionalLabelSuffix: '(opsiyonel)',
        dateTimeLabel: 'Tarih / saat',
        cityLabel: 'Şehir',
        cityPlaceholder: 'İstanbul',
        venueNameLabel: 'Mekân adı (opsiyonel)',
        venueNamePlaceholder: 'Kafe / Ev',
        addressTextLabel: 'Adres',
        addressTextPlaceholder: 'Açık adres',
      },
    },
  },
  {
    key: 'babyshower',
    name: 'Baby shower',
    defaultsJson: {
      sections: {
        hero: true,
        countdown: true,
        story: true,
        details: true,
        closing: true,
        musicPlayer: true,
      },
      heroImagePublicSrc: '/images/baby-shower/cover-section-bg-image.jpeg',
      heroEyebrow: 'Baby shower davetiyesi',
      heroTagline: 'Bebeğimiz geliyor',
      storyImagePublicSrc: '/images/baby-shower/story-section-bg-image.jpg',
      storyHeadline: 'Minik mucizemize',
      storySubline: 'Hoş geldin demek için sizinle buluşuyoruz',
      createForm: {
        primaryNameLabel: 'Anne adı',
        primaryNamePlaceholder: 'Elif',
        secondaryNameLabel: 'İkinci isim',
        secondaryNamePlaceholder: '',
        secondaryNameOptionalLabelSuffix: '(opsiyonel)',
        dateTimeLabel: 'Tarih / saat',
        cityLabel: 'Şehir',
        cityPlaceholder: 'İstanbul',
        venueNameLabel: 'Mekân adı (opsiyonel)',
        venueNamePlaceholder: 'Kafe / Ev',
        addressTextLabel: 'Adres',
        addressTextPlaceholder: 'Açık adres',
      },
    },
  },
  {
    key: 'graduation',
    name: 'Mezuniyet',
    defaultsJson: {
      sections: {
        hero: true,
        countdown: true,
        story: true,
        details: true,
        closing: true,
        musicPlayer: true,
      },
      heroImagePublicSrc: '/images/graduation/cover-section-bg-image.jpg',
      heroEyebrow: 'Mezuniyetimize davetlisiniz',
      storyImagePublicSrc: '/images/graduation/story-section-bg-image.avif',
      heroTagline: 'Mezun oluyoruz',
      storyHeadline: 'Bir dönemin sonu',
      storySubline: 'Bu anı birlikte kutlamak için sizi bekliyoruz',
      createForm: {
        primaryNameLabel: 'Mezun adı',
        primaryNamePlaceholder: 'Elif',
        secondaryNameLabel: 'İkinci isim',
        secondaryNamePlaceholder: '',
        secondaryNameOptionalLabelSuffix: '(opsiyonel)',
        dateTimeLabel: 'Tarih / saat',
        cityLabel: 'Şehir',
        cityPlaceholder: 'İstanbul',
        venueNameLabel: 'Mekân adı (opsiyonel)',
        venueNamePlaceholder: 'Okul / Salon',
        addressTextLabel: 'Adres',
        addressTextPlaceholder: 'Açık adres',
      },
    },
  },
];

try {
  await sql.begin(async (tx) => {
    for (const t of templates) {
      await tx`
        insert into event_templates (key, name, defaults_json)
        values (${t.key}, ${t.name}, ${tx.json(t.defaultsJson)})
        on conflict (key) do update
        set
          name = excluded.name,
          defaults_json = event_templates.defaults_json || excluded.defaults_json
      `;
    }
  });

  console.log(`Upserted ${templates.length} event templates.`);
} finally {
  await sql.end({ timeout: 5 });
}

