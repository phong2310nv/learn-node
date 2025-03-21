import { FETCH_BLOGS, FETCH_BLOG } from "../actions/types";

const mapKeys = (obj = {}, objKey = "") => {
  return Object.fromEntries(
    Object.entries(obj).map(([_, value]) => [value[objKey], value])
  );
};
export default function (state = {}, action) {
  switch (action.type) {
    case FETCH_BLOG:
      const blog = action.payload;
      return { ...state, [blog._id]: blog };
    case FETCH_BLOGS:
      console.log('hehe');
      
      return { ...state, ...mapKeys(action.payload, "_id") };
    default:
      return state;
  }
}
