import {api, microserviceApi} from "./api";


export const getPopularMovies = async (page = 1) => {
  const res = await api.get(`/movies?page=${page}`);
  return res.data;
};

export const searchMovies = async (query: string, page = 1) => {
  const res = await api.get(`/movies/search?query=${query}&page=${page}`);
  return res.data;
};

export const getCategories = async () => {
  const res = await api.get(`/movies/categories`);
  return res.data;
};

export const getMovieById = async (id: string) => {
  const res = await api.get(`/movies/${id}`);
  return res.data;
};
export const getRatings = async (token: any) => {
  const res = await api.get(`/ratings`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
export const getRecommendedMovies =  async (userId: string, token: any) => {
   const res = await microserviceApi.get(`/recommendations/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
};
