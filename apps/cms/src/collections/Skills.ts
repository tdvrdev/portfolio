import type { CollectionConfig } from 'payload'

import { isLoggedIn } from '../access/isLoggedIn'

export const Skills: CollectionConfig = {
  slug: 'skills',
  access: {
    create: isLoggedIn,
    delete: isLoggedIn,
    read: () => true,
    update: isLoggedIn
  },
  admin: {
    defaultColumns: ['name', 'area', 'level', 'highlight'],
    group: 'Portfolio',
    useAsTitle: 'name'
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true
    },
    {
      name: 'area',
      type: 'select',
      defaultValue: 'Frontend',
      options: [
        { label: 'Allround', value: 'Allround' },
        { label: 'Frontend', value: 'Frontend' },
        { label: 'Styling', value: 'Styling' },
        { label: 'Backend', value: 'Backend' },
        { label: 'Databases', value: 'Databases' },
        { label: 'Testing', value: 'Testing' },
        { label: 'CMS', value: 'CMS' },
        { label: 'Motion', value: 'Motion' },
        { label: 'Tooling', value: 'Tooling' }
      ],
      required: true
    },
    {
      name: 'level',
      type: 'number',
      defaultValue: 75,
      max: 100,
      min: 0,
      required: true
    },
    {
      name: 'highlight',
      type: 'checkbox',
      defaultValue: false
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 10
    }
  ],
  timestamps: true
}
