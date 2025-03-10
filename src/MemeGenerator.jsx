import React, { useState, useEffect } from "react";
import axios from "axios";
import html2canvas from "html2canvas";
import "./Meme.css";

const MemeGenerator = () => {
  const [meme, setMeme] = useState(null);
  const [topText, setTopText] = useState("");
  const [bottomText, setBottomText] = useState("");

  useEffect(() => {
    fetchMeme();
  }, []);

  const fetchMeme = async () => {
    try {
      const response = await axios.get("https://api.imgflip.com/get_memes");
      const memes = response.data.data.memes;
      const selectedMeme = memes[Math.floor(Math.random() * memes.length)];

      // Fetch the image as a blob and convert it to a data URL
      const imgResponse = await fetch(selectedMeme.url);
      const blob = await imgResponse.blob();
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        setMeme({ ...selectedMeme, localUrl: reader.result });
      };
    } catch (error) {
      console.error("Error fetching meme:", error);
    }
  };

  const downloadMeme = () => {
    const memeElement = document.getElementById("meme-container");
    html2canvas(memeElement).then((canvas) => {
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = "meme.png";
      link.click();
    });
  };

  return (
    <div className="meme-generator">
      <button onClick={fetchMeme}>Get New Meme</button>
      {meme && (
        <div id="meme-container" className="meme-container">
          <img src={meme?.localUrl} alt="Meme" className="meme-image" />
          <h2 className="meme-text top">{topText}</h2>
          <h2 className="meme-text bottom">{bottomText}</h2>
        </div>
      )}
      <input
        type="text"
        placeholder="Top text"
        value={topText}
        onChange={(e) => setTopText(e.target.value)}
      />
      <input
        type="text"
        placeholder="Bottom text"
        value={bottomText}
        onChange={(e) => setBottomText(e.target.value)}
      />
      <button onClick={downloadMeme}>Download Meme</button>
    </div>
  );
};

export default MemeGenerator;
