/** Filter chip (blog categories, decor colours): a 44 px pill, graphite when active. */
export const chipClass = (active: boolean): string =>
  `inline-flex min-h-[44px] flex-none items-center gap-1.5 rounded-full border px-4 text-[0.84rem] font-medium no-underline transition-colors duration-200 ${
    active ? 'border-brand-dark bg-brand-dark text-brand-light' : 'border-brand-line text-brand-dark hover:border-brand-dark'
  }`;
