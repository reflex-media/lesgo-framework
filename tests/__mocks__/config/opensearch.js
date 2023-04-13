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
            uid: { type: 'keyword' },
            name: { type: 'text' },
            gender: { type: 'keyword' },
            profile: {
              properties: {
                aboutMe: { type: 'text' },
                headline: { type: 'text' },
              },
            },
            location: {
              properties: {
                formattedAddress: { type: 'text' },
                city: { type: 'keyword' },
                state: { type: 'keyword' },
                country: { type: 'keyword' },
                lat: { type: 'float' },
                lng: { type: 'float' },
              },
            },
            favoriteMovies: {
              type: 'nested',
              properties: {
                title: { type: 'text' },
                director: { type: 'text' },
                genre: { type: 'keyword' },
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
