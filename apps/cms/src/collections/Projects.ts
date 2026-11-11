import type { CollectionConfig } from 'payload'

import { isLoggedIn } from '../access/isLoggedIn'

export const Projects: CollectionConfig = {
  slug: 'projects',
  access: {
    create: isLoggedIn,
    delete: isLoggedIn,
    read: () => true,
    update: isLoggedIn
  },
  admin: {
    defaultColumns: ['title', 'status', 'year', 'featured'],
    group: 'Portfolio',
    useAsTitle: 'title'
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true
    },
    {
      name: 'summary',
      type: 'textarea',
      required: true
    },
    {
      name: 'role',
      type: 'text',
      required: true
    },
    {
      name: 'year',
      type: 'number',
      defaultValue: new Date().getFullYear(),
      required: true
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'concept',
      options: [
        { label: 'Live', value: 'live' },
        { label: 'Prototype', value: 'prototype' },
        { label: 'Concept', value: 'concept' }
      ],
      required: true
    },
    {
      name: 'accent',
      type: 'select',
      defaultValue: 'red',
      options: [
        { label: 'Red', value: 'red' },
        { label: 'Cyan', value: 'cyan' },
        { label: 'Yellow', value: 'yellow' },
        { label: 'White', value: 'white' }
      ],
      required: true
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 10
    },
    {
      name: 'cover',
      type: 'relationship',
      relationTo: 'media'
    },
    {
      name: 'tags',
      type: 'array',
      label: 'Keywords',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true
        }
      ]
    },
    {
      name: 'stack',
      type: 'array',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true
        }
      ]
    },
    {
      name: 'links',
      type: 'array',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true
        },
        {
          name: 'url',
          type: 'text',
          required: true
        }
      ]
    },
    {
      name: 'body',
      type: 'richText'
    }
  ],
  timestamps: true
}
