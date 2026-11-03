import type { GlobalConfig } from 'payload'

import { isLoggedIn } from '../access/isLoggedIn'

export const Profile: GlobalConfig = {
  slug: 'profile',
  access: {
    read: () => true,
    update: isLoggedIn
  },
  admin: {
    group: 'Portfolio'
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      defaultValue: 'tdvr.dev',
      required: true
    },
    {
      name: 'title',
      type: 'text',
      defaultValue: 'Creative Svelte Developer',
      required: true
    },
    {
      name: 'intro',
      type: 'textarea',
      defaultValue:
        'Ik bouw snelle, expressieve webinterfaces met scherpe interacties, sterke contentstructuur en een visuele stijl die blijft hangen.',
      required: true
    },
    {
      name: 'location',
      type: 'text',
      defaultValue: 'Nederland'
    },
    {
      name: 'availability',
      type: 'text',
      defaultValue: 'Beschikbaar voor stages, freelance en creatieve webprojecten'
    },
    {
      name: 'email',
      type: 'email',
      defaultValue: 'hello@example.dev'
    },
    {
      name: 'socials',
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
    }
  ]
}
