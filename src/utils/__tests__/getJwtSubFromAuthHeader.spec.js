import getJwtSubFromAuthHeader from '../getJwtSubFromAuthHeader';

const authorizationHeader =
  'eyJraWQiOiIzSHc3YmRuUHBIMnJSZWhjT3k5NFRLZm5ybzU0Y1RFUW1lcGtVYWc2bW1vPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJmMmI1MzQ5ZC1mNWUzLTQ0ZjUtOWMwOC1hZTZiMDFlOTU0MzQiLCJhdWQiOiI0aHM0a2ZpNTAwZWtkajJhZTdiOWExazU4byIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiZXZlbnRfaWQiOiJlNzdiZGZmYy0wYjFjLTQzMzMtYWUxZS1lM2QwNjZkNzAyZGMiLCJ0b2tlbl91c2UiOiJpZCIsImF1dGhfdGltZSI6MTYxNTYxMTc3NywiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLmFwLXNvdXRoZWFzdC0xLmFtYXpvbmF3cy5jb21cL2FwLXNvdXRoZWFzdC0xXzR3QjFuSmNvSyIsImNvZ25pdG86dXNlcm5hbWUiOiJmMmI1MzQ5ZC1mNWUzLTQ0ZjUtOWMwOC1hZTZiMDFlOTU0MzQiLCJleHAiOjE2MTU2MTUzNzcsImlhdCI6MTYxNTYxMTc3NywiZW1haWwiOiJzdWZpeWFuK3Rlc3RAaW5jdWJlOC5zZyJ9.hbNYnVt6_fhX5KJEfn6Fi9cOZkQAldHGitVBWXSd0_YcWDU_BJ1OVu_VFEKzIvaRLR_zy2eW3dIJ27pn1_6U0sS8MZMsvtz0SKQP4M1hTEnhb5TOSIcOs9Y6ZPy1e1ShIqQmq2j_K1JFzEZH7u3eOmCTmFcs8X5vUk8O1sT2KqBP5UCBVB_4rCVEjbRGdyynqEKcdKkd7Nk6v9onpxRbG3FOg6vlsKSlfZ6RIz3jbjO4ZkCJiYAgrI7bsh2VGwE8pZq80GuQy9pocLkTcZiAFcni50-yvePQX8tkXhPzbp7DibAI6nU87Ol6TW4ZmB-0BZ56Nfeowoe7tT-7hvGkGA';

describe('test Utils/getJwtSubFromAuthHeader util', () => {
  it('should get sub from Authorization header', () => {
    expect(getJwtSubFromAuthHeader(authorizationHeader)).toBe(
      'f2b5349d-f5e3-44f5-9c08-ae6b01e95434'
    );
  });

  it('should get sub as null from missing or empty header', () => {
    expect(getJwtSubFromAuthHeader()).toBe(null);
  });

  it('should get sub as null from invalid Authorization header', () => {
    expect(getJwtSubFromAuthHeader('some-invalid-token')).toBe(null);
  });
});
