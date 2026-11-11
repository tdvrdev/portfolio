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
      defaultValue: 'Projecten, skills en ervaringen',
      required: true
    },
    {
      name: 'intro',
      type: 'textarea',
      defaultValue: 'Ik houd hier bij wat ik maak, welke skills ik gebruik en wat ik onderweg leer.',
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
