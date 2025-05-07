"use client"; // For Next.js App Router
import { useEffect, useState } from "react";
import Image from 'next/image';

// Define the structure of repository data
interface Repo {
  id: number;
  html_url: string;
  full_name: string;
  name: string;
  description: string | null;
}

const ProjectsBanner = () => {
  const [repos, setRepos] = useState<Repo[]>([]); // Initialize state with Repo[]
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [startX, setStartX] = useState<number>(0);

  // Fetch GitHub data from your API
  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const response = await fetch("/api/github");
        if (!response.ok) throw new Error("Network response was not ok");
        const data: Repo[] = await response.json(); // Cast the response data to Repo[]
        setRepos(data);
      } catch (error) {
        console.error("Error fetching repositories:", error);
      }
    };
    fetchRepos();
  }, []);

  // Update carousel
  const updateCarousel = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % repos.length);
  };

  // Auto-rotate the carousel
  useEffect(() => {
    const interval = setInterval(updateCarousel, 5000); // Rotate every 5 seconds
    return () => clearInterval(interval); // Cleanup on unmount
  }, [repos]);

  // Handle drag functionality
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setStartX(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const moveX = e.clientX - startX;
    if (moveX > 50) {
      setCurrentIndex((prev) => (prev - 1 + repos.length) % repos.length);
      setIsDragging(false);
    } else if (moveX < -50) {
      setCurrentIndex((prev) => (prev + 1) % repos.length);
      setIsDragging(false);
    }
  };

  if (!repos.length) return <div>Loading...</div>;

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-900">
      <div className="containerCard grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 max-w-screen-xl p-4">
        <h1 className="text-3xl font-bold text-center lg:text-left mb-6 text-gray-800 dark:text-gray-200">
          Our Projects
        </h1>

        <div
          className="carousel relative w-72 h-96 overflow-hidden"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={() => setIsDragging(false)}
        >
          {repos.map((repo, index) => {
            const position =
              index === currentIndex
                ? "active"
                : index === (currentIndex - 1 + repos.length) % repos.length
                ? "previous"
                : index === (currentIndex + 1) % repos.length
                ? "next"
                : "";

            return (
              <div
                key={repo.id}
                className={`card absolute w-56 h-80 rounded-xl shadow-lg transition-transform duration-500 opacity-0 ${
                  position === "active"
                    ? "opacity-100 scale-110 translate-z-[300px]"
                    : position === "previous"
                    ? "opacity-70 -translate-x-20 -rotate-y-30 scale-90"
                    : position === "next"
                    ? "opacity-70 translate-x-20 rotate-y-30 scale-90"
                    : "hidden"
                }`}
              >
                <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                  <Image
                    src={`https://opengraph.githubassets.com/${repo.id}/${repo.full_name}`}
                    alt={repo.name}
                    className="w-full h-full object-cover rounded-xl"
                    width={500}
                    height={300}
                  />
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProjectsBanner;
