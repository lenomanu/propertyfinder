/** Web3Forms public access key (safe for client-side use). Override via env if needed. */
export const WEB3FORMS_ACCESS_KEY =
  process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY?.trim() ||
  "b697e12d-b142-4176-a422-244ac6dfb4c1";

/** Site key for Web3Forms zero-config hCaptcha on free plans. */
export const WEB3FORMS_HCAPTCHA_SITEKEY = "50b2fe65-b00b-4b9e-ad62-3ba471098be2";