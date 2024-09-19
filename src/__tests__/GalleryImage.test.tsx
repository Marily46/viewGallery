import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import GalleryImage from '../components/GalleryImage';
import '@testing-library/jest-dom';
import 'whatwg-fetch';

// Mock imágenes
const mockImages = [
  {
    id: 1,
    title: "Grey beach",
    author: "Mary Robinette",
    price: 43,
    likes_count: 1,
    liked: false,
    main_attachment: {
      small: "https://picsum.photos/id/100/300",
    },
    links: [
      {
        rel: "avatar",
        uri: "http://lorempixel.com/250/250/",
        methods: "GET",
      },
      {
        rel: "like",
        uri: "http://localhost:3100/images/1/likes",
        methods: "POST",
      },
    ],
  },
  {
    id: 2,
    title: "A castle",
    author: "Aliette de Bodard",
    price: 55,
    likes_count: 2,
    liked: true,
    main_attachment: {
      small: "https://picsum.photos/id/200/300",
    },
    links: [
      {
        rel: "avatar",
        uri: "http://lorempixel.com/250/250/",
        methods: "GET",
      },
      {
        rel: "like",
        uri: "http://localhost:3100/images/2/likes",
        methods: "POST",
      },
    ],
  },
];

beforeEach(() => {
  jest.spyOn(global, 'fetch').mockImplementation((input) => {

    const url = typeof input === 'string' ? input : input.toString();

    let filteredData;
    if (url.includes("search")) {
      filteredData = mockImages.filter((img) => img.title.includes("Grey"));
    } else {
      filteredData = mockImages;
    }

    return Promise.resolve(
      new Response(JSON.stringify(filteredData), {
        status: 200,
        headers: { 'Content-type': 'application/json' },
      })
    );
  });
});


afterEach(() => {
  jest.restoreAllMocks();
});

describe("GalleryImage Component Tests", () => {
  test("renders image gallery with mock data", async () => {
    render(<GalleryImage />);

    expect(screen.getByPlaceholderText("You're looking for something?...")).toBeInTheDocument();

    const images = await screen.findAllByRole("img");
    expect(images).toHaveLength(2); 
  });

  test("loads more images on scroll", async () => {
    render(<GalleryImage />);

    fireEvent.scroll(window, { target: { scrollY: 1000 } });

    const images = await screen.findAllByRole("img");
    expect(images).toHaveLength(2); 
  });

  test("filters images based on search input", async () => {
    render(<GalleryImage />);

    const searchInput = screen.getByPlaceholderText("You're looking for something?...");

    fireEvent.change(searchInput, { target: { value: "Grey" } });

    const filteredImages = await screen.findAllByRole("img");
    expect(filteredImages).toHaveLength(1); 
  });

  test("like/unlike button toggles correctly", async () => {
    render(<GalleryImage />);

    const likeButton = await screen.findByText("Like (1)");
    fireEvent.click(likeButton); 

    await waitFor(() => expect(screen.getByText("Unlike (2)")).toBeInTheDocument());
  });

  test("displays author avatar correctly", async () => {
    render(<GalleryImage />);

    const authorAvatar = await screen.findByAltText("Author avatar");
    expect(authorAvatar).toHaveAttribute("src", "http://lorempixel.com/250/250/");
  });
});
