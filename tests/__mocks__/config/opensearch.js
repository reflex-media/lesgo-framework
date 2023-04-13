export default {
  default: 'aws',
  adapters: {
    aws: {
      region: 'ap-southeast-1',
      host: '//localhost',
      index: {
        name: 'lesgo',
        type: '_doc',
        numShards: 3,
        numReplicas: 1,
        mappings: {
          properties: {
            name: { type: 'text' },
            gender: { type: 'text' },
            profile: {
              type: 'nested',
              properties: {
                aboutMe: { type: 'text' },
                headline: { type: 'text' },
                favoriteMovies: {
                  type: 'nested',
                  properties: {
                    title: { type: 'text' },
                    director: { type: 'text' },
                    genre: { type: 'text' },
                  },
                },
              },
            },
            location: {
              type: 'nested',
              properties: {
                formattedAddress: { type: 'text' },
                city: { type: 'text' },
                state: { type: 'text' },
                country: { type: 'text' },
                lat: { type: 'float' },
                lng: { type: 'float' },
              },
            },
            createdAt: {
              type: 'date',
              format: 'strict_date_optional_time||epoch_second',
            },
            updatedAt: {
              type: 'date',
              format: 'strict_date_optional_time||epoch_second',
            },
          },
        },
      },
    },
  },
};
