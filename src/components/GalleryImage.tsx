import React, { useState, useEffect } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { Image } from '../types/types';

const GalleryImage: React.FC = () => {
  const [images, setImages] = useState<Image[]>([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true); 

  const fetchImages = async (page: number, search: string) => {
    console.log(`Fetching images - Page: ${page}, Search: ${search}`);
    
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3100/images?page=${page}&search=${encodeURIComponent(search)}`
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch images: ${response.statusText}`);
      }
  
      const data: Image[] = await response.json();
      
      console.log('Fetched data:', data);
  
      if (page === 1) {
        setImages(data); 
      } else {
        setImages((prevImages) => [...prevImages, ...data]); 
      }
 
      if (data.length === 0) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    setPage(1);
    fetchImages(1, search); 
  }, [search]);

  useEffect(() => {
    if (page > 1 && hasMore) {
      fetchImages(page, search); 
    }
  }, [page]);

  const handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 100 && !loading && hasMore) {
      setPage((prevPage) => prevPage + 1); 
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore]);

  const handleLike = async (id: number) => {
    try {
      await fetch(`http://localhost:3100/images/${id}/likes`, {
        method: 'POST',
      });
      setImages((prevImages) =>
        prevImages.map((image) =>
          image.id === id
            ? {
                ...image,
                liked: !image.liked,
                likes_count: image.liked ? image.likes_count - 1 : image.likes_count + 1,
              }
            : image
        )
      );
    } catch (error) {
      console.error('Error liking/unliking image:', error);
    }
  };

  return (
    <div>
      <div className="search-container">
        <SearchIcon className="search-icon" />
        <input
          type="text"
          placeholder="You're looking for something?..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value); 
          }}
          className="search-input"
        />
      </div>

      {/* Gal imágenes */}
      <div className="image-gallery">
        {images.map((image, index) => (
          <div key={`${image.id}-${index}`} className="image-item">
            <span className="price-tag">${image.price}</span>
            <img src={image.main_attachment.small} alt={image.title} className="image" />
            <h3>{image.title}</h3>
            <p>{image.author}</p>

            <button
              className={image.liked ? 'unlike-button' : 'like-button'}
              onClick={() => handleLike(image.id)}
            >
              <i className={image.liked ? 'like-icon liked' : 'like-icon unliked'}></i>
              {image.liked ? 'Unlike' : 'Like'} ({image.likes_count})
            </button>
          </div>
        ))}
      </div>

      {loading && <p>Cargando más imágenes...</p>}
    </div>
  );
};

export default GalleryImage;
