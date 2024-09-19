import { useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.scss";
import GalleryImage from "./components/GalleryImage";

function App() {
	const [count, setCount] = useState(0);

	return (
		<div >
			<GalleryImage />
			
		</div>
	);
}

export default App;
