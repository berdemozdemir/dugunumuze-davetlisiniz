import slugify from 'slugify';

export const SlugHelper = {
  generate: (str: string) =>
    slugify(str, {
      replacement: '-',
      remove: undefined,
      lower: true,
      strict: true,
      trim: true,
    }),

  generateUnique: (str: string, suffix: string) => {
    if (suffix.length > 8) suffix = suffix.slice(0, 8);

    suffix = suffix.replace(/-/g, '');

    return `${SlugHelper.generate(str)}-${suffix}`;
  },
};
