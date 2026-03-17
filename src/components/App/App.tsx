import SearchBar from "../SearchBar/SearchBar";
import { useState } from "react";
import { fetchMovies } from "../../services/movieService";
import MovieGrid from "../MovieGrid/MovieGrid";
import type { Movie } from "../../types/movie";
import toast, { Toaster } from "react-hot-toast";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Modal from "../MovieModal/MovieModal";

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

   const openModal = (movie: Movie) => {
     setSelectedMovie(movie);
     setIsModalOpen(true);
   };

   const closeModal = () => {
     setIsModalOpen(false);
     setSelectedMovie(null);
   };

  const handleSearch = async (query: string) => {
    try {
      setMovies([]);
      setIsLoading(true);
      setIsError(false);

      const movies = await fetchMovies(query);

      if (movies.length === 0) {
        toast("No movies found for your request");
      }

      setMovies(movies);
    } catch (error) {
      console.log(error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Toaster />
      <SearchBar onSubmit={handleSearch} />
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {movies.length > 0 && <MovieGrid movies={movies} onSelect={openModal} />}
      {isModalOpen && selectedMovie && (
        <Modal movie={selectedMovie} onClose={closeModal} />
      )}
    </>
  );
}
