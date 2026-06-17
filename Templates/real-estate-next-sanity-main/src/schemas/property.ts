import { defineField, defineType } from "sanity";

export default defineType({
  name: "property",
  title: "Property",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
    }),
    defineField({
      name: "mainImage",
      title: "Main image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "price",
      title: "Price",
      type: "number",
    }),
    defineField({
      name: "bedrooms",
      title: "Bedrooms",
      type: "number",
    }),
    defineField({
      name: "bathrooms",
      title: "Bathrooms",
      type: "number",
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "geopoint",
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [
        {
          type: "string",
        },
      ],
      options: {
        layout: "tags",
      },
    }),
  ],
  preview: {
    select: {
      title: "title",
      media: "mainImage",
    },
  },
  orderings: [
    {
      title: "Price, highest first",
      name: "priceDesc",
      by: [
        {
          field: "price",
          direction: "desc",
        },
        {
          field: "title",
          direction: "asc",
        },
      ],
    },
    {
      title: "Price, lowest first",
      name: "priceAsc",
      by: [
        {
          field: "price",
          direction: "asc",
        },
        {
          field: "title",
          direction: "asc",
        },
      ],
    },
  ],
});
