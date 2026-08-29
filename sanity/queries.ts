import { groq } from "next-sanity";

export const siteSettingsQuery = groq`*[_type == "siteSettings"][0]{
  name, shortName, roleLine, location, email, imdbUrl, linkedinUrl, seoDescription, bio
}`;

export const galleryQuery = groq`*[_type == "galleryImage"] | order(order asc){
  _id, alt, productionName, order, image
}`;

export const selectedCreditsQuery = groq`*[_type == "selectedCredit"] | order(order asc){
  _id, title, role, year, note, order
}`;

export const workVideosQuery = groq`*[_type == "workVideo"] | order(order asc){
  _id, title, url, provider, year, order
}`;
