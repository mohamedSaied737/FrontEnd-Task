export const sliceLongString = {
  methods: {
    sliceLongString(string) {
      if (string && string.length > 20) {
        return string.charAt(0).toUpperCase() + `${string.slice(0, 16)}...`;
      } else {
        return string.charAt(0).toUpperCase() + string.slice(1);
      }
    },
  },
};
