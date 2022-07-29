import { transform } from '../lib/varlet-lowcode-schema-tree.es'

const a = {
  id: '7fcfb97bdc5a4af8aea31ebcbfb974b6',
  name: 'Page',
  slots: {
    default: {
      children: [
        {
          id: '559b5b314cb0436ab9666469286f26e0',
          name: 'NDataTable',
          props: {
            columns: [
              {
                title: 'No',
                key: 'no',
              },
              {
                title: 'No',
                key: 'title',
              },
              {
                title: 'Action',
                key: 'actions',
                render: {
                  type: 'Render',
                  renderId: 'e79cea82297147efa046ff06ec74b43a',
                  value: [
                    {
                      id: '854809f22d9d41eb95098edf8697f134',
                      name: 'NButton',
                      library: 'naive',
                      props: {
                        style: {
                          marginBottom: '10px',
                        },
                        type: 'primary',
                        onClick: {
                          type: 'Expression',
                          value: '() => { count.value++; }',
                        },
                      },
                      slots: {
                        default: {
                          children: [
                            {
                              id: 'cbdfb3e4edde49708e2cc7dac8b9ac3a',
                              name: 'Text',
                              textContent: {
                                type: 'Expression',
                                value: "$renderArgs['e79cea82297147efa046ff06ec74b43a'][0].title",
                              },
                            },
                          ],
                        },
                      },
                    },
                    {
                      id: '94c839a0e0e54378a306c1cabd4367ab',
                      name: 'NDataTable',
                      library: 'naive',
                      props: {
                        columns: [
                          {
                            title: 'No',
                            key: 'no',
                          },
                          {
                            title: 'Title',
                            key: 'title',
                          },
                          {
                            title: 'Action',
                            key: 'actions',
                            render: {
                              type: 'Render',
                              renderId: '958ad407065a4ca1a8185775f06ccff5',
                              value: [
                                {
                                  id: 'c99a87862533492ca608ad39f4345694',
                                  name: 'Card',
                                  library: 'Varlet',
                                  slots: {
                                    title: {
                                      children: [
                                        {
                                          id: 'ed65ac14a0654083b19f3bc1fd9efb1f',
                                          name: 'Text',
                                          textContent: {
                                            type: 'Expression',
                                            value: "$renderArgs['e79cea82297147efa046ff06ec74b43a'][0].title",
                                          },
                                        },
                                      ],
                                    },
                                    subtitle: {
                                      children: [
                                        {
                                          id: '697f11d5ca034b15889352cb79a1b8c5',
                                          name: 'Countdown',
                                          library: 'Varlet',
                                          props: {
                                            time: 30000,
                                          },
                                          slots: {
                                            default: {
                                              children: [
                                                {
                                                  id: 'b985e9f9bd324dd5b56969e01a300155',
                                                  name: 'Button',
                                                  library: 'Varlet',
                                                  props: {
                                                    type: 'success',
                                                  },
                                                  slots: {
                                                    default: {
                                                      children: [
                                                        {
                                                          id: 'cfceb79f5dcf44b9805bdf18606ffbd8',
                                                          name: 'Text',
                                                          textContent: {
                                                            type: 'Expression',
                                                            value:
                                                              "$slotProps['697f11d5ca034b15889352cb79a1b8c5'].seconds",
                                                          },
                                                        },
                                                      ],
                                                    },
                                                  },
                                                },
                                              ],
                                            },
                                          },
                                        },
                                      ],
                                    },
                                  },
                                },
                              ],
                            },
                          },
                        ],
                        data: [
                          {
                            no: 100,
                            title: '套一下',
                          },
                          {
                            no: 200,
                            title: '套两下',
                          },
                          {
                            no: 300,
                            title: '套三下',
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    },
  },
}

console.log(transform(a))
