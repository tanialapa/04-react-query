import SearchBar from "../SearchBar/SearchBar";
import { useState } from "react";
import { fetchMovies } from "../../services/movieService";
import MovieGrid from "../MovieGrid/MovieGrid";
import type { Movie } from "../../types/movie";
import toast, { Toaster } from "react-hot-toast";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Modal from "../MovieModal/MovieModal";
import ReactPaginate from "react-paginate";
import css from "./App.module.css";
import { useEffect } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";


export default function App() {
  
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data, isLoading, isError, isSuccess, isFetching } = useQuery({
    queryKey: ["movies", query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: query !== "",
    placeholderData: keepPreviousData,
  });
    
  const movies = data?.results ?? [];
  const totalPages = data?.total_pages ?? 0;

   const openModal = (movie: Movie) => {
     setSelectedMovie(movie);
     setIsModalOpen(true);
   };

   const closeModal = () => {
     setIsModalOpen(false);
     setSelectedMovie(null);
   };

  const handleSearch =  (newQuery: string) => {
    setQuery(newQuery);
    setPage(1);
  };
 useEffect(() => {
   if (isSuccess && data.results.length === 0) {
     toast("No movies found for your request!");
   }
 }, [isSuccess, data]);

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
      {totalPages > 1 && (
        <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => setPage(selected + 1)}
          forcePage={page - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}
      {isFetching && !isLoading && <Loader />}
    </>
  );
}
