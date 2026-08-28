import { groq } from "next-sanity";

export const siteSettingsQuery = groq`*[_type == "siteSettings"][0]{
  name, shortName, roleLine, location, email, imdbUrl, linkedinUrl, seoDescription
}`;

export const galleryQuery = groq`*[_type == "galleryImage"] | order(order asc){
  _id, alt, productionName, order, image
}`;

export const departmentsQuery = groq`*[_type == "department"] | order(order asc){
  _id, label, count, order
}`;

export const upcomingQuery = groq`*[_type == "upcoming"] | order(order asc){
  _id, title, format, episodes, roles, status, order
}`;
