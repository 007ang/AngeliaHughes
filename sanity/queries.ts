import { groq } from "next-sanity";

export const siteSettingsQuery = groq`*[_type == "siteSettings"][0]{
  name, shortName, roleLine, location, email, imdbUrl, linkedinUrl, seoDescription, bio,
  portrait
}`;

export const galleryQuery = groq`*[_type == "galleryImage"] | order(order asc){
  _id, alt, productionName, order, image
}`;

export const selectedCreditsQuery = groq`*[_type == "selectedCredit"] | order(order asc){
  _id, title, role, format, studio, episodes, year, order
}`;

export const postersQuery = groq`*[_type == "poster"] | order(order asc){
  _id, title, alt, order, image
}`;

export const workVideosQuery = groq`*[_type == "workVideo"] | order(order asc){
  _id, title, url, provider, year, order
}`;
