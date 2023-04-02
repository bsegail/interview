import React, { FormEvent, useCallback, useEffect, useState } from "react";
import styles from "./Home.module.css";

const BASE_URL = "https://api.unsplash.com/";
const CLIENT = "MVa-IBEW9X8zxGbI5Q0l6iXAguy5TiZfCx57b7dBUyM";

const getPhotos = async (query: string, page: number) => {
  const response = await fetch(
    `${BASE_URL}/search/photos?query=${query}&page=${page}`,
    {
      headers: {
        Authorization: `Client-ID ${CLIENT}`,
      },
    }
  );
  return response.json();
};

const useUnsplash = () => {
  const [results, setResults] = useState<any>();

  const fetchPhotos = useCallback(
    async (query: string = "dogs", page: number = 1) => {
      const photos = await getPhotos(query, page);
      setResults(photos);
    },
    []
  );

  return {
    results,
    fetchPhotos,
  };
};

const Home: React.FC = () => {
  const [query, setQuery] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const { results, fetchPhotos } = useUnsplash();

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchPhotos(query, 1);
  };

  const handleNext = async () => {
    const newPage = results?.total_pages
      ? Math.min(page + 1, results.total_pages)
      : page + 1;
    setPage(newPage);
    fetchPhotos(query, newPage);
  };

  const handlePrevious = async () => {
    const newPage = Math.max(page - 1, 1);
    setPage(newPage);
    fetchPhotos(query, newPage);
  };

  return (
    <main className={styles.home}>
      <h1>Images</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type={"search"}
          onChange={(e) => setQuery(e.target.value)}
          value={query}
          placeholder={"Search photos"}
        />
        <button>Search</button>
      </form>
      <div className={styles.photos}>
        {results?.results?.map((photo: any) => (
          <div key={photo.id} className={styles.photo}>
            <img src={photo.urls.regular} alt={photo.alt_description} />
          </div>
        ))}
      </div>
      <div className={styles.pagination}>
        <button type={"button"} onClick={handlePrevious} disabled={page <= 1}>
          Previous
        </button>
        <button
          type={"button"}
          onClick={handleNext}
          disabled={results.totalPages ? page >= results.total_pages : false}
        >
          Next
        </button>
      </div>
    </main>
  );
};

export default Home;
