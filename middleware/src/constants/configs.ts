export class Config {
  // static readonly PRODUCTION: boolean = Extensions.parseBoolean(process.env.PRODUCTION);
  static readonly PORT = process.env.PORT || 3001;
  static readonly CACHE_MAXAGE = 36000; // cache 10 hours
  static readonly CMS_ENDPOINT =process.env.CMS_ENDPOINT || "http://localhost:1337";
  static readonly CMS_TOKEN =process.env.CMS_TOKEN;
  static readonly GOOGLE_API_ENDPOINT =process.env.GOOGLE_API_ENDPOINT || "https://www.googleapis.com";
  static readonly YOUTUBE_KEY = process.env.YOUTUBE_KEY
  static readonly DICTIONARY_API_ENDPOINT =process.env.DICTIONARY_API_ENDPOINT;
  static readonly TRANSLATE_GOOGLE_API_ENDPOINT =process.env.TRANSLATE_GOOGLE_API_ENDPOINT;
}